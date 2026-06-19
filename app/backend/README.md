# POS Backend

This backend provides a simple REST API for the POS frontend to:
- fetch categories
- fetch products
- record sales and update stock

## Setup

1. Copy `.env.example` to `.env`.
2. Update database settings.
3. Install dependencies:

```bash
cd app/backend
npm install
```

4. Start the server:

```bash
npm run dev
```

## API endpoints

<!-- - `GET /api/health` -->
<!-- - `GET /api/categories` -->
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products/sale`
- `POST /api/sales`

## Sale payload

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```
