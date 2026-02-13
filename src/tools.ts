/**
 * Binance Global MCP — 23 Tool Definitions
 */

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  annotations: {
    title: string;
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
  };
}

export const TOOLS: MCPToolDefinition[] = [
  // ========== Market Data (11) ==========
  {
    name: 'bn_ping',
    description: 'Test connectivity to Binance API. Returns empty object if successful. Use to verify API is reachable.',
    inputSchema: {
      type: 'object',
      properties: {
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Ping',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_server_time',
    description: 'Get Binance server time (millisecond timestamp). Use to check connectivity and sync timestamps for signed requests.',
    inputSchema: {
      type: 'object',
      properties: {
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Server Time',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_exchange_info',
    description: 'Get exchange information including trading rules, symbol list, filters (PRICE_FILTER, LOT_SIZE, MIN_NOTIONAL), and rate limits. Optionally filter by symbol.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Single symbol to query, e.g. BTCUSDT' },
        symbols: { type: 'string', description: 'Multiple symbols as JSON array string, e.g. ["BTCUSDT","ETHUSDT"]' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Exchange Info',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_order_book',
    description: 'Get order book (bids and asks) for a symbol. Weight varies by limit: 5 (1-100), 25 (101-500), 50 (501-1000), 250 (1001-5000).',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT, ETHUSDT' },
        limit: { type: 'integer', description: 'Order book depth. Default: 100. Valid: 1-5000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get Order Book',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_recent_trades',
    description: 'Get recent trades for a symbol. Returns up to 1000 most recent trades with price, quantity, and time.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        limit: { type: 'integer', description: 'Number of trades. Default: 500, Max: 1000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get Recent Trades',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_aggregate_trades',
    description: 'Get compressed/aggregate trades for a symbol. Trades that fill at the same time, price, and side are aggregated into a single entry.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        fromId: { type: 'integer', description: 'Aggregate trade ID to fetch from (inclusive)' },
        startTime: { type: 'integer', description: 'Start time in milliseconds (inclusive)' },
        endTime: { type: 'integer', description: 'End time in milliseconds (inclusive)' },
        limit: { type: 'integer', description: 'Number of results. Default: 500, Max: 1000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get Aggregate Trades',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_klines',
    description: 'Get candlestick/kline data (OHLCV) for a symbol. Returns arrays of [openTime, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBase, takerBuyQuote].',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        interval: { type: 'string', description: 'Kline interval: 1s, 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M' },
        startTime: { type: 'integer', description: 'Start time in milliseconds' },
        endTime: { type: 'integer', description: 'End time in milliseconds' },
        limit: { type: 'integer', description: 'Number of klines. Default: 500, Max: 1000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol', 'interval'],
    },
    annotations: {
      title: 'Get Klines/Candlesticks',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_avg_price',
    description: 'Get current average price for a symbol. Returns the weighted average price over the last 5 minutes.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get Average Price',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_ticker_24hr',
    description: 'Get 24-hour price change statistics. Weight: 2 (single symbol), 80 (all symbols). Includes price change, volume, high/low, and trade count.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol (optional — omit for all symbols, higher weight)' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get 24hr Ticker',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_ticker_price',
    description: 'Get latest price for a symbol or all symbols. Lightweight endpoint for quick price checks.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol (optional — omit for all symbols)' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Price Ticker',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'bn_book_ticker',
    description: 'Get best bid/ask price and quantity for a symbol or all symbols. Useful for spread analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol (optional — omit for all symbols)' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Book Ticker',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },

  // ========== Trading (7) ==========
  {
    name: 'bn_new_order',
    description: 'Place a new order. WARNING: This uses REAL MONEY on Binance Global. Supports LIMIT, MARKET, STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, LIMIT_MAKER order types. Use bn_test_order first to validate.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        side: { type: 'string', description: 'Order side: BUY or SELL' },
        type: { type: 'string', description: 'Order type: LIMIT, MARKET, STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, LIMIT_MAKER' },
        timeInForce: { type: 'string', description: 'Time in force: GTC (Good Till Canceled), IOC (Immediate Or Cancel), FOK (Fill Or Kill). Required for LIMIT orders.' },
        quantity: { type: 'string', description: 'Order quantity (decimal string)' },
        quoteOrderQty: { type: 'string', description: 'Quote order quantity for MARKET orders (spend exact quote amount)' },
        price: { type: 'string', description: 'Order price (decimal string). Required for LIMIT orders.' },
        stopPrice: { type: 'string', description: 'Stop/trigger price for STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT' },
        newClientOrderId: { type: 'string', description: 'Unique client order ID for tracking' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
      },
      required: ['symbol', 'side', 'type'],
    },
    annotations: {
      title: 'Place New Order',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_test_order',
    description: 'Test new order creation (dry run). Validates all parameters without actually placing the order. No funds are used. Always test before placing real orders.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        side: { type: 'string', description: 'Order side: BUY or SELL' },
        type: { type: 'string', description: 'Order type: LIMIT, MARKET, STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, TAKE_PROFIT_LIMIT, LIMIT_MAKER' },
        timeInForce: { type: 'string', description: 'Time in force: GTC, IOC, FOK. Required for LIMIT orders.' },
        quantity: { type: 'string', description: 'Order quantity (decimal string)' },
        quoteOrderQty: { type: 'string', description: 'Quote order quantity for MARKET orders' },
        price: { type: 'string', description: 'Order price (decimal string). Required for LIMIT.' },
        stopPrice: { type: 'string', description: 'Stop price for stop orders' },
        newClientOrderId: { type: 'string', description: 'Unique client order ID' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
      },
      required: ['symbol', 'side', 'type'],
    },
    annotations: {
      title: 'Test Order (Dry Run)',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_query_order',
    description: 'Query a specific order by orderId or origClientOrderId. Returns order status, filled quantity, and execution details.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        orderId: { type: 'integer', description: 'Order ID (either orderId or origClientOrderId required)' },
        origClientOrderId: { type: 'string', description: 'Client order ID (either orderId or origClientOrderId required)' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Query Order',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_cancel_order',
    description: 'Cancel an active order by orderId or origClientOrderId.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        orderId: { type: 'integer', description: 'Order ID to cancel (either orderId or origClientOrderId required)' },
        origClientOrderId: { type: 'string', description: 'Client order ID to cancel' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Cancel Order',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_cancel_all_orders',
    description: 'Cancel all open orders for a symbol. WARNING: This cancels ALL pending orders at once. Cannot be undone.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Cancel All Orders',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_open_orders',
    description: 'Get all open orders for a symbol or all symbols. Weight: 3 (with symbol), 40 (without symbol).',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol (optional — omit for all symbols, higher weight)' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Open Orders',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_all_orders',
    description: 'Get all orders (active, canceled, filled) for a symbol. Supports time range and pagination via orderId.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        orderId: { type: 'integer', description: 'Order ID to fetch from (pagination)' },
        startTime: { type: 'integer', description: 'Start time in milliseconds' },
        endTime: { type: 'integer', description: 'End time in milliseconds' },
        limit: { type: 'integer', description: 'Number of results. Default: 500, Max: 1000' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get All Orders',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  // ========== Account (2) ==========
  {
    name: 'bn_account_info',
    description: 'Get account information including balances, commission rates, and trading permissions. Returns all asset balances (free + locked).',
    inputSchema: {
      type: 'object',
      properties: {
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Get Account Info',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_my_trades',
    description: 'Get trade execution history for a specific symbol. Returns price, quantity, commission, and whether you were buyer/maker.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Trading pair symbol, e.g. BTCUSDT' },
        orderId: { type: 'integer', description: 'Filter by order ID' },
        startTime: { type: 'integer', description: 'Start time in milliseconds' },
        endTime: { type: 'integer', description: 'End time in milliseconds' },
        fromId: { type: 'integer', description: 'Trade ID to fetch from' },
        limit: { type: 'integer', description: 'Number of results. Default: 500, Max: 1000' },
        recvWindow: { type: 'integer', description: 'Request validity window in ms. Default: 5000, Max: 60000' },
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
      required: ['symbol'],
    },
    annotations: {
      title: 'Get My Trades',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  // ========== User Data Stream (3) ==========
  {
    name: 'bn_create_listen_key',
    description: 'Create a listen key for user data stream (WebSocket). The key is valid for 60 minutes. Use keepalive to extend. Connects to wss://stream.binance.com:9443/ws/<listenKey>.',
    inputSchema: {
      type: 'object',
      properties: {
        _fields: { type: 'string', description: 'Comma-separated list of fields to include in response' },
      },
    },
    annotations: {
      title: 'Create Listen Key',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_keepalive_listen_key',
    description: 'Keepalive a listen key to extend its validity by 60 minutes. Should be called periodically to prevent expiration.',
    inputSchema: {
      type: 'object',
      properties: {
        listenKey: { type: 'string', description: 'Listen key to keep alive' },
      },
      required: ['listenKey'],
    },
    annotations: {
      title: 'Keepalive Listen Key',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: 'bn_close_listen_key',
    description: 'Close/invalidate a listen key. The associated user data stream will be terminated.',
    inputSchema: {
      type: 'object',
      properties: {
        listenKey: { type: 'string', description: 'Listen key to close' },
      },
      required: ['listenKey'],
    },
    annotations: {
      title: 'Close Listen Key',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
];
