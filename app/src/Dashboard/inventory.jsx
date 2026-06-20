// src/components/inventory.jsx
import React, { useEffect, useState } from "react";

const fallbackProducts = [
  { id: 1, name: "Black Hoodie", sku: "HD-BLK-001", category: "Hoodies", stock: 12 },
  { id: 2, name: "White Shirt", sku: "SH-WHT-002", category: "Shirts", stock: 28 },
  { id: 3, name: "Cargo Pants", sku: "PT-CRG-003", category: "Pants", stock: 7 },
  { id: 4, name: "Cap", sku: "CP-BLK-004", category: "Accessories", stock: 18 },
  { id: 5, name: "Socks Pack", sku: "SK-WHT-005", category: "Accessories", stock: 35 },
];

export default function Inventory() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const mapped = json.map((p) => ({
          id: p.ProductID ?? p.id,
          name: p.ProductName ?? p.name,
          sku: p.SKU ?? p.sku ?? '',
          category: p.Category ?? p.category ?? 'Uncategorized',
          stock: Number(p.StockQuantity ?? p.stock ?? 0),
        }));
        setProducts(mapped);
      } catch (err) {
        // keep fallback
      }
    }

    load();

    const handler = () => { load(); };
    window.addEventListener('productsUpdated', handler);

    return () => {
      mounted = false;
      window.removeEventListener('productsUpdated', handler);
    };
  }, []);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          Stock
        </p>
        <h1 className="text-3xl font-bold text-neutral-900">Inventory</h1>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-2xl font-bold text-neutral-900">All products</h2>
        </div>

        <div className="divide-y divide-neutral-100">
          {products.map((product) => {
            const percent = Math.min(100, product.stock);
            const isLow = product.stock < 15;

            return (
              <div
                key={product.id}
                className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_120px_140px_100px] sm:items-center"
              >
                <div>
                  <div className="font-medium text-neutral-900">
                    {product.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {product.sku}
                  </div>
                </div>

                <span className="w-fit rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  {product.category}
                </span>

                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${
                      isLow ? "bg-red-500" : "bg-[#546B41]"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div
                  className={`text-left font-medium tabular-nums sm:text-right ${
                    isLow ? "text-red-600" : "text-neutral-700"
                  }`}
                >
                  {product.stock} units
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}