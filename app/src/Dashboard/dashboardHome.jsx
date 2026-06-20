// src/Dashboard/dashboardHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Boxes,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";

// Component state will populate products, recent sales and totals from the backend

const getBadgeClass = (status) => {
  if (status === "Paid") {
    return "bg-[#546B41]/10 text-[#546B41]";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
};

export default function DashboardHome() {
  const [products, setProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [totals, setTotals] = useState({
    products: 0,
    inventory: 0,
    transactionsToday: 0,
    revenueToday: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const pRes = await fetch('/api/products');
        if (pRes.ok) {
          const pJson = await pRes.json();
          if (!mounted) return;
          const mapped = pJson.map((p) => ({
            id: p.ProductID ?? p.id,
            name: p.ProductName ?? p.name,
            stock: Number(p.StockQuantity ?? p.stock ?? 0),
            price: Number(p.Price ?? p.price ?? 0),
          }));
          setProducts(mapped);

          // Total products should be the count of unique ProductIDs
          const productCount = new Set(mapped.map((m) => m.id)).size;
          // Inventory is the sum of StockQuantity across product IDs
          const inventory = mapped.reduce((s, it) => s + (Number(it.stock) || 0), 0);
          setTotals((t) => ({ ...t, products: productCount, inventory }));
        }

        // Try to fetch sales list if available. Many backends only expose POST; handle gracefully.
        const sRes = await fetch('/api/sales');
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (!mounted) return;
          const mappedSales = (Array.isArray(sJson) ? sJson : []).map((s) => {
            const timeStamp = s.TransactionDate ?? s.CreatedAt ?? null;
            return {
              id: s.SaleID ?? s.id ?? s.ReceiptNumber ?? `S-${Math.random().toString(36).slice(2,8)}`,
              customer: s.CustomerName ?? s.customer ?? 'Guest',
              items: Number(s.ItemCount ?? s.items ?? 0),
              timeStamp,
              time: timeStamp ? new Date(timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
              status: 'Paid',
              total: Number(s.TotalAmount ?? s.total ?? 0),
            };
          });

          const displayedSales = mappedSales
            .slice()
            .sort((a, b) => {
              if (!b.timeStamp) return -1;
              if (!a.timeStamp) return 1;
              return new Date(b.timeStamp) - new Date(a.timeStamp);
            })
            .slice(0, 5);
          setRecentSales(displayedSales);

          const today = new Date();
          const transactionsToday = mappedSales.filter((sale) => {
            if (!sale.timeStamp) return false;
            const date = new Date(sale.timeStamp);
            return (
              date.getFullYear() === today.getFullYear() &&
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate()
            );
          }).length;

          const revenueToday = mappedSales.reduce((sum, sale) => {
            const saleDate = sale.timeStamp ? new Date(sale.timeStamp) : null;
            if (
              saleDate &&
              saleDate.getFullYear() === today.getFullYear() &&
              saleDate.getMonth() === today.getMonth() &&
              saleDate.getDate() === today.getDate()
            ) {
              return sum + (Number(sale.total) || 0);
            }
            return sum;
          }, 0);

          setTotals((t) => ({ ...t, transactionsToday, revenueToday }));
        }
      } catch (err) {
        // silent fallback to defaults
      }
    }

    load();

    const handler = (e) => {
      const d = e?.detail || {};
      // If event includes receiptNumber, add to recent sales and update totals
      if (d.receiptNumber) {
        const newSale = {
          id: d.receiptNumber,
          customer: d.customer || 'Guest',
          items: d.itemsCount || 0,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Paid',
          total: Number(d.totalAmount || 0),
        };
        setRecentSales((s) => [newSale, ...s]);
        setTotals((t) => ({ ...t, transactionsToday: (t.transactionsToday || 0) + 1, revenueToday: (t.revenueToday || 0) + Number(d.totalAmount || 0) }));
      }

      // Always reload products/totals from server when event occurs
      load();
    };

    window.addEventListener('productsUpdated', handler);

    return () => {
      mounted = false;
      window.removeEventListener('productsUpdated', handler);
    };
  }, []);

  const stats = [
    { label: 'Total products', value: totals.products, icon: Package, hint: 'Hoodie Products' },
    { label: 'Inventory on hand', value: totals.inventory, icon: Boxes, hint: 'Stocks available' },
    { label: 'Transactions today', value: totals.transactionsToday, icon: Receipt, hint: '+0% vs yesterday' },
    { label: 'Revenue today', value: `₱${(totals.revenueToday || 0).toLocaleString()}`, icon: TrendingUp, hint: 'Paid only' },
  ];

  const lowStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 py-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Overview
          </p>
          <h1 className="text-4xl font-bold text-[#546B41]">
            Good day!
          </h1>
          <p className="text-sm text-neutral-500">
            Here's what's moving today at the counter.
          </p>
        </div>

        <Link
          to="../sales"
          className="inline-flex items-center gap-2 rounded-lg bg-[#546B41] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#455734] mb-8"
        >
          <Plus className="h-4 w-4" />
          New sale
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-[#546B41]" />
            </div>

            <div className="mt-3 text-4xl font-bold text-neutral-900">
              {stat.value}
            </div>

            <div className="mt-1 text-xs text-neutral-500">{stat.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 py-8">
        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <h2 className="text-2xl font-bold text-neutral-900">
              Recent sales activity
            </h2>

            <Link
              to="../products"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center gap-4 px-6 py-3.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 font-medium text-neutral-700">
                  {sale.customer.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">
                      {sale.id}
                    </span>
                    <span className="text-sm text-neutral-500">
                      · {sale.customer}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500">
                    {sale.items} items · {sale.time}
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getBadgeClass(
                    sale.status
                  )}`}
                >
                  {sale.status}
                </span>

                <div className="w-20 text-right font-medium text-neutral-900">
                  ₱{sale.total}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-2xl font-bold text-neutral-900">
              Inventory levels
            </h2>
          </div>

          <div className="space-y-4 p-6">
            {lowStock.map((product) => {
              const percent = Math.min(100, product.stock);
              const isLow = product.stock < 15;

              return (
                <div key={product.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm py-2">
                    <span className="truncate pr-2 font-medium text-neutral-900">
                      {product.name}
                    </span>
                    <span
                      className={
                        isLow
                          ? "font-medium text-red-600"
                          : "text-neutral-500"
                      }
                    >
                      {product.stock} left
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${
                        isLow ? "bg-red-500" : "bg-[#546B41]"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}