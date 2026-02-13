/**
 * Shared MCP Server — used by both Node.js (index.ts) and CF Worker (worker.ts)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { BinanceClient } from './binance-client.js';
import { TOOLS } from './tools.js';

export interface BinanceMcpConfig {
  apiKey: string;
  secretKey: string;
}

export function handleToolCall(
  toolName: string,
  args: Record<string, unknown>,
  client: BinanceClient
) {
  // Strip _fields param (Smithery quality — not a Binance API param)
  const { _fields, ...params } = args;

  switch (toolName) {
    // ========== Market Data (11) ==========
    case 'bn_ping':
      return client.ping();
    case 'bn_server_time':
      return client.getServerTimePublic();
    case 'bn_exchange_info':
      return client.getExchangeInfo(
        Object.keys(params).length ? (params as { symbol?: string; symbols?: string }) : undefined
      );
    case 'bn_order_book':
      return client.getOrderBook(params as { symbol: string; limit?: number });
    case 'bn_recent_trades':
      return client.getRecentTrades(params as { symbol: string; limit?: number });
    case 'bn_aggregate_trades':
      return client.getAggregateTrades(params);
    case 'bn_klines':
      return client.getKlines(params);
    case 'bn_avg_price':
      return client.getAvgPrice(params as { symbol: string });
    case 'bn_ticker_24hr':
      return client.getTicker24hr(
        Object.keys(params).length ? (params as { symbol?: string }) : undefined
      );
    case 'bn_ticker_price':
      return client.getTickerPrice(
        Object.keys(params).length ? (params as { symbol?: string }) : undefined
      );
    case 'bn_book_ticker':
      return client.getBookTicker(
        Object.keys(params).length ? (params as { symbol?: string }) : undefined
      );

    // ========== Trading (7) ==========
    case 'bn_new_order':
      return client.newOrder(params);
    case 'bn_test_order':
      return client.testOrder(params);
    case 'bn_query_order':
      return client.queryOrder(params);
    case 'bn_cancel_order':
      return client.cancelOrder(params);
    case 'bn_cancel_all_orders':
      return client.cancelAllOrders(params);
    case 'bn_open_orders':
      return client.getOpenOrders(Object.keys(params).length ? params : undefined);
    case 'bn_all_orders':
      return client.getAllOrders(params);

    // ========== Account (2) ==========
    case 'bn_account_info':
      return client.getAccountInfo(Object.keys(params).length ? params : undefined);
    case 'bn_my_trades':
      return client.getMyTrades(params);

    // ========== User Data Stream (3) ==========
    case 'bn_create_listen_key':
      return client.createListenKey();
    case 'bn_keepalive_listen_key':
      return client.keepaliveListenKey(params.listenKey as string);
    case 'bn_close_listen_key':
      return client.closeListenKey(params.listenKey as string);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

export function createServer(config?: BinanceMcpConfig) {
  const server = new McpServer({
    name: 'binance-mcp',
    version: '1.0.0',
  });

  let client: BinanceClient | null = null;

  // Register all 23 tools with annotations
  for (const tool of TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema as any,
        annotations: tool.annotations,
      },
      async (args: Record<string, unknown>) => {
        const apiKey =
          config?.apiKey ||
          (args as Record<string, unknown>).BINANCE_API_KEY as string;
        const secretKey =
          config?.secretKey ||
          (args as Record<string, unknown>).BINANCE_SECRET_KEY as string;

        // Public endpoints don't need API keys
        const publicTools = [
          'bn_ping', 'bn_server_time', 'bn_exchange_info',
          'bn_order_book', 'bn_recent_trades', 'bn_aggregate_trades',
          'bn_klines', 'bn_avg_price', 'bn_ticker_24hr', 'bn_ticker_price',
          'bn_book_ticker',
        ];

        if (!publicTools.includes(tool.name) && (!apiKey || !secretKey)) {
          return {
            content: [{ type: 'text' as const, text: 'Error: BINANCE_API_KEY and BINANCE_SECRET_KEY are required for this operation. Set them as environment variables or pass via config.' }],
            isError: true,
          };
        }

        if (!client || config?.apiKey !== apiKey) {
          client = new BinanceClient({
            apiKey: apiKey || '',
            secretKey: secretKey || '',
          });
        }

        try {
          const result = await handleToolCall(tool.name, args, client);
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            isError: false,
          };
        } catch (error) {
          return {
            content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true,
          };
        }
      }
    );
  }

  // Register prompts
  server.prompt(
    'market-data-analysis',
    'Guide for fetching and analyzing Binance market data',
    async () => {
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              'You are a Binance market data analyst. Help me fetch and analyze crypto market data from the world\'s largest exchange.',
              '',
              'Available market tools (11 — all public, no API key needed):',
              '1. **Connectivity** — bn_ping to test API reachability',
              '2. **Server time** — bn_server_time for timestamp sync',
              '3. **Exchange info** — bn_exchange_info for trading rules and filters',
              '4. **Price check** — bn_ticker_price for current price (single or all symbols)',
              '5. **Average price** — bn_avg_price for 5-minute weighted average',
              '6. **24hr stats** — bn_ticker_24hr for price change, volume, high/low',
              '7. **Candlesticks** — bn_klines for OHLCV data (1s to 1M intervals)',
              '8. **Order book** — bn_order_book for bid/ask depth (up to 5000 levels)',
              '9. **Recent trades** — bn_recent_trades for latest executed trades',
              '10. **Aggregate trades** — bn_aggregate_trades for compressed trade data',
              '11. **Book ticker** — bn_book_ticker for best bid/ask',
              '',
              'Tips:',
              '- Symbol format: BTCUSDT, ETHUSDT, BNBBTC (uppercase, no separator)',
              '- Kline intervals: 1s, 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M',
              '- All market data endpoints are public (no API key needed)',
              '- Use bn_exchange_info to check available symbols and trading rules',
            ].join('\n'),
          },
        }],
      };
    },
  );

  server.prompt(
    'trading-guide',
    'Guide for placing and managing orders on Binance',
    async () => {
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              'You are a Binance trading assistant. Help me manage orders safely on the world\'s largest crypto exchange.',
              '',
              'WARNING: Trading operations use REAL MONEY. Always use bn_test_order first!',
              '',
              'Available trading tools:',
              '1. **Test order** — bn_test_order (DRY RUN — validates without executing)',
              '2. **Place order** — bn_new_order (LIMIT, MARKET, STOP_LOSS_LIMIT, etc.)',
              '3. **Check order** — bn_query_order by orderId or clientOrderId',
              '4. **Cancel order** — bn_cancel_order (single) or bn_cancel_all_orders (all for symbol)',
              '5. **Open orders** — bn_open_orders to see pending orders',
              '6. **All orders** — bn_all_orders for full history',
              '7. **Account** — bn_account_info for balances and permissions',
              '8. **Trade history** — bn_my_trades for executed trades',
              '',
              'Order types:',
              '- LIMIT: price + quantity + timeInForce (GTC/IOC/FOK)',
              '- MARKET: quantity OR quoteOrderQty',
              '- STOP_LOSS_LIMIT: price + quantity + stopPrice + timeInForce',
              '- TAKE_PROFIT_LIMIT: price + quantity + stopPrice + timeInForce',
              '',
              'Best practices:',
              '1. Always bn_test_order first to validate parameters',
              '2. Check bn_account_info for sufficient balance',
              '3. Check bn_exchange_info for symbol filters (min notional, lot size)',
              '4. Verify order with bn_query_order after placement',
              '5. Use newClientOrderId for order tracking',
            ].join('\n'),
          },
        }],
      };
    },
  );

  // Register resources
  server.resource(
    'server-info',
    'binance://server-info',
    {
      description: 'Connection status and available tools for this Binance MCP server',
      mimeType: 'application/json',
    },
    async () => {
      return {
        contents: [{
          uri: 'binance://server-info',
          mimeType: 'application/json',
          text: JSON.stringify({
            name: 'binance-mcp',
            version: '1.0.0',
            connected: !!config,
            tools_available: TOOLS.length,
            tool_categories: {
              market_data: 11,
              trading: 7,
              account: 2,
              user_data_stream: 3,
            },
            base_url: 'https://api.binance.com',
            testnet_url: 'https://testnet.binance.vision',
          }, null, 2),
        }],
      };
    },
  );

  // Override tools/list handler to return raw JSON Schema with property descriptions.
  (server as any).server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: TOOLS.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    })),
  }));

  return server;
}
