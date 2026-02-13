# @node2flow/binance-mcp

[![npm version](https://img.shields.io/npm/v/@node2flow/binance-mcp.svg)](https://www.npmjs.com/package/@node2flow/binance-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for **Binance Global** — the world's largest cryptocurrency exchange. 23 tools for market data, trading, orders, and account management via the Model Context Protocol.

## Quick Start

### Claude Desktop / Cursor

Add to your MCP config:

```json
{
  "mcpServers": {
    "binance": {
      "command": "npx",
      "args": ["-y", "@node2flow/binance-mcp"],
      "env": {
        "BINANCE_API_KEY": "your-api-key",
        "BINANCE_SECRET_KEY": "your-secret-key"
      }
    }
  }
}
```

> **Note:** API keys are optional. 11 market data tools work without authentication.

### HTTP Mode

```bash
BINANCE_API_KEY=xxx BINANCE_SECRET_KEY=xxx npx @node2flow/binance-mcp --http
```

MCP endpoint: `http://localhost:3000/mcp`

### Cloudflare Worker

Available at: `https://binance-mcp-community.node2flow.net/mcp`

```
POST https://binance-mcp-community.node2flow.net/mcp?BINANCE_API_KEY=xxx&BINANCE_SECRET_KEY=xxx
```

---

## Tools (23)

### Market Data (11) — Public, No API Key Required

| Tool | Description |
|------|-------------|
| `bn_ping` | Test API connectivity |
| `bn_server_time` | Get server time (ms timestamp) |
| `bn_exchange_info` | Trading rules, symbols, filters |
| `bn_order_book` | Order book depth (bids/asks) |
| `bn_recent_trades` | Recent trades (up to 1000) |
| `bn_aggregate_trades` | Compressed/aggregated trades |
| `bn_klines` | Candlestick/OHLCV data |
| `bn_avg_price` | Current 5-min average price |
| `bn_ticker_24hr` | 24hr price change statistics |
| `bn_ticker_price` | Latest price (single or all) |
| `bn_book_ticker` | Best bid/ask price & quantity |

### Trading (7) — Requires API Key

| Tool | Description | Risk |
|------|-------------|------|
| `bn_test_order` | Test order (dry run, no funds used) | Safe |
| `bn_new_order` | Place real order | **Real money** |
| `bn_query_order` | Query order status | Read-only |
| `bn_open_orders` | List open orders | Read-only |
| `bn_all_orders` | All order history | Read-only |
| `bn_cancel_order` | Cancel single order | Destructive |
| `bn_cancel_all_orders` | Cancel ALL open orders | **Destructive** |

### Account (2) — Requires API Key

| Tool | Description |
|------|-------------|
| `bn_account_info` | Balances, commissions, permissions |
| `bn_my_trades` | Trade execution history |

### User Data Stream (3) — Requires API Key

| Tool | Description |
|------|-------------|
| `bn_create_listen_key` | Create WebSocket listen key |
| `bn_keepalive_listen_key` | Extend listen key (every 60min) |
| `bn_close_listen_key` | Close/invalidate listen key |

---

## Test Orders (Safe Trading)

Binance provides a test order endpoint that validates all parameters without executing:

```
bn_test_order → validates symbol, quantity, price, filters
bn_new_order  → actually places the order (REAL MONEY)
```

**Always use `bn_test_order` first** to verify your order parameters are valid before placing a real order with `bn_new_order`.

---

## API Key Setup

1. Go to [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Create a new API key
3. Enable permissions:
   - **Enable Reading** — Required for account/order queries
   - **Enable Spot Trading** — Required for placing/canceling orders
4. Recommended: Set IP whitelist for security

---

## Security Best Practices

- **Never share** your API key or secret key
- **Use IP whitelist** on Binance to restrict API access
- **Disable withdrawal** permission unless absolutely needed
- **Use test orders** (`bn_test_order`) before real trades
- **Start with small amounts** when testing real orders
- **Monitor open orders** regularly with `bn_open_orders`

---

## Rate Limits

Binance enforces the following rate limits:

| Type | Limit |
|------|-------|
| Request weight | 6,000 per minute |
| Orders | 50 per second |
| Orders | 160,000 per day |

Rate limit headers are included in API responses:
- `X-MBX-USED-WEIGHT-1M` — Current weight used
- `X-MBX-ORDER-COUNT-10S` — Orders in 10 seconds
- `X-MBX-ORDER-COUNT-1D` — Orders in 1 day

---

## Symbol Format

Symbols are uppercase with no separator:
- `BTCUSDT` — Bitcoin / Tether
- `ETHUSDT` — Ethereum / Tether
- `BNBBTC` — BNB / Bitcoin
- `SOLUSDT` — Solana / Tether

Use `bn_exchange_info` to get the full list of available symbols.

---

## Testnet

Binance provides a testnet for development:
- API: `https://testnet.binance.vision/api`
- Create testnet keys at: https://testnet.binance.vision/

> Note: This MCP server connects to the **production** API by default.

---

## License

MIT
