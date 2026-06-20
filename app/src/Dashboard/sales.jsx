// src/components/pos.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Wallet,
} from "lucide-react";

const fallbackProducts = [
  { id: "1", name: "Black Hoodie", sku: "HD-BLK-001", category: "Hoodies", stock: 12, price: 899 },
  { id: "2", name: "White Shirt", sku: "SH-WHT-002", category: "Shirts", stock: 28, price: 349 },
  { id: "3", name: "Cargo Pants", sku: "PT-CRG-003", category: "Pants", stock: 7, price: 1199 },
  { id: "4", name: "Cap", sku: "CP-BLK-004", category: "Accessories", stock: 18, price: 299 },
  { id: "5", name: "Socks Pack", sku: "SK-WHT-005", category: "Accessories", stock: 35, price: 149 },
];

const paymentMethods = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export default function POSPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState([
    { product: fallbackProducts[0], qty: 1 },
    { product: fallbackProducts[3], qty: 2 },
  ]);
  const [payment, setPayment] = useState("card");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const mapped = json.map((p) => ({
          id: String(p.ProductID ?? p.id),
          name: p.ProductName ?? p.name,
          sku: p.SKU ?? p.sku ?? '',
          category: p.Category ?? p.category ?? 'Uncategorized',
          stock: Number(p.StockQuantity ?? p.stock ?? 0),
          price: Number(p.Price ?? p.price ?? 0),
          image: (() => {
            const raw = p.ImageURL ?? p.imageUrl ?? p.image ?? null;
            if (!raw) return null;
            if (String(raw).startsWith('http') || String(raw).startsWith('/')) return raw;
            return `/${raw}`;
          })(),
        }));
        setProducts(mapped);
      } catch (err) {
        // fallback to defaults
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((currentCart) => {
      const found = currentCart.find(
        (line) => line.product.id === product.id
      );

      if (found) {
        return currentCart.map((line) =>
          line.product.id === product.id
            ? { ...line, qty: line.qty + 1 }
            : line
        );
      }

      return [...currentCart, { product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((line) =>
          line.product.id === id
            ? { ...line, qty: line.qty + delta }
            : line
        )
        .filter((line) => line.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((line) => line.product.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0
  );

  const total = subtotal;

  const handleCharge = async () => {
    if (cart.length === 0) return;
    const items = cart.map((line) => ({ productId: line.product.id, quantity: line.qty }));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        const json = await res.json();
        // refresh products from backend to reflect updated stock
        try {
          const pRes = await fetch('/api/products');
            if (pRes.ok) {
            const pJson = await pRes.json();
            const mapped = pJson.map((p) => ({
              id: String(p.ProductID ?? p.id),
              name: p.ProductName ?? p.name,
              sku: p.SKU ?? p.sku ?? '',
              category: p.Category ?? p.category ?? 'Uncategorized',
              stock: Number(p.StockQuantity ?? p.stock ?? 0),
              price: Number(p.Price ?? p.price ?? 0),
              image: p.ImageURL ?? p.imageUrl ?? p.image ?? null,
            }));
            setProducts(mapped);
            window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { receiptNumber: json.receiptNumber, totalAmount: json.totalAmount ?? json.totalAmount ?? 0, itemsCount: items.length } }));
          }
        } catch (err) {
          // ignore
        }

        // clear cart
        setCart([]);

        // show receipt number
        alert(`Sale complete — receipt: ${json.receiptNumber || json.saleId}`);
      } else {
        const errText = await res.text();
        // if unauthorized, fallback to local stock update
        if (res.status === 401 || res.status === 403) {
          // apply local product stock decrement so UI reflects change
          const updated = products.map((p) => {
            const line = cart.find((c) => String(c.product.id) === String(p.id));
            if (line) {
              return { ...p, stock: Math.max(0, p.stock - line.qty) };
            }
            return p;
          });
          setProducts(updated);
          window.dispatchEvent(new CustomEvent('productsUpdated', { detail: {} }));
          setCart([]);
          alert('Sale recorded locally (no auth). Stock updated in UI.');
        } else {
          alert(`Failed to record sale: ${errText}`);
        }
      }
    } catch (err) {
      // network error — fallback local update
      const updated = products.map((p) => {
        const line = cart.find((c) => String(c.product.id) === String(p.id));
        if (line) {
          return { ...p, stock: Math.max(0, p.stock - line.qty) };
        }
        return p;
      });
      setProducts(updated);
      setCart([]);
      alert('Offline: sale applied locally.');
    }
  };

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_400px] lg:p-8">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Checkout
          </p>
          <h1 className="text-3xl font-bold text-neutral-900 py-4">New sale</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#546B41] focus:ring-2 focus:ring-[#546B41]/20"
          />
        </div>

        <div className="flex flex-wrap gap-2 py-4">
          {categories.map((item) => {
            const isActive = category === item;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-wider transition ${
                  isActive
                    ? "border-[#546B41] bg-[#546B41] text-white"
                    : "border-neutral-200 text-neutral-500 hover:border-[#546B41]/40 hover:text-neutral-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group rounded-xl border border-neutral-200 bg-white p-4 text-left transition hover:border-[#546B41] hover:shadow-md"
            >
                  <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-neutral-100 text-3xl font-bold text-[#546B41]/40 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      product.name.charAt(0)
                    )}
                  </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-neutral-900">
                    {product.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {product.sku}
                  </div>
                </div>

                <span className="text-lg font-bold text-neutral-900">
                  ₱{product.price}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
                  {product.category}
                </span>

                <span
                  className={
                    product.stock < 15 ? "text-red-600" : "text-neutral-500"
                  }
                >
                  {product.stock} in stock
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="sticky top-6 self-start rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="flex max-h-[calc(100vh-3rem)] flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              Order details
            </h2>

            <span className="rounded-full bg-[#546B41]/10 px-2.5 py-1 text-xs font-medium text-[#546B41]">
              checkout
            </span>
          </div>

          <div className="-mx-1 flex-1 overflow-y-auto px-1">
            {cart.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                Tap a product to start an order.
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((line) => (
                  <div
                    key={line.product.id}
                    className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-lg font-bold text-[#546B41]">
                      {line.product.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900">
                        {line.product.name}
                      </div>

                      <div className="text-xs text-neutral-500">
                        ₱{line.product.price} each
                      </div>

                      <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white">
                        <button
                          onClick={() => changeQty(line.product.id, -1)}
                          className="p-1.5 text-neutral-500 hover:text-[#546B41]"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="w-6 text-center text-sm tabular-nums">
                          {line.qty}
                        </span>

                        <button
                          onClick={() => changeQty(line.product.id, 1)}
                          className="p-1.5 text-neutral-500 hover:text-[#546B41]"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium tabular-nums text-neutral-900">
                        ₱{line.product.price * line.qty}
                      </div>

                      <button
                        onClick={() => removeFromCart(line.product.id)}
                        className="mt-2 text-neutral-400 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100" />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="tabular-nums">₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-neutral-500">
              {/* <span>Tax (8%)</span>
              <span className="tabular-nums">₱{tax.toFixed(2)}</span> */}
            </div>

            <div className="flex justify-between pt-1 text-2xl font-bold text-neutral-900">
              <span>Total</span>
              <span className="tabular-nums">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const isActive = payment === method.id;

              return (
                <button
                  key={method.id}
                  onClick={() => setPayment(method.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition ${
                    isActive
                      ? "border-[#546B41] bg-[#546B41]/5 text-[#546B41]"
                      : "border-neutral-200 text-neutral-500 hover:border-[#546B41]/40"
                  }`}
                >
                  <method.icon className="h-4 w-4" />
                  {method.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            className="h-12 rounded-lg bg-[#546B41] text-base font-medium text-white transition hover:bg-[#455734] disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Charge ₱{total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}