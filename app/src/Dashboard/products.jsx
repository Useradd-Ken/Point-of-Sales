// src/components/orders.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Receipt } from "lucide-react";

const initialOpenOrders = [
  {
    id: "ORD-2001",
    customer: "Walk-in Customer",
    items: 3,
    opened: "Opened 12 min ago",
    total: 1247,
  },
];

const initialRecentSales = [
  { id: "ORD-1001", customer: "Maya", items: 3, time: "10:24 AM", status: "Paid", total: 899 },
  { id: "ORD-1002", customer: "Jay", items: 1, time: "10:41 AM", status: "Pending", total: 349 },
  { id: "ORD-1003", customer: "Lena", items: 4, time: "11:03 AM", status: "Cancelled", total: 1200 },
];

const getStatusClass = (status) => {
  if (status === "Paid") {
    return "bg-[#546B41]/10 text-[#546B41]";
  }

  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
};

export default function OrdersPage() {
  const [tab, setTab] = useState("open");
  const [openOrders] = useState(initialOpenOrders);
  const [recentSales, setRecentSales] = useState(initialRecentSales);
  const [selected, setSelected] = useState(initialOpenOrders[0].id);

  useEffect(() => {
    let mounted = true;

    async function loadSales() {
      try {
        const res = await fetch('/api/sales');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const mapped = (Array.isArray(json) ? json : []).map((s) => {
          const timeStamp = s.TransactionDate ?? s.CreatedAt ?? null;
          return {
            id: s.ReceiptNumber ?? s.SaleID ?? s.SaleId ?? s.id,
            customer: s.CustomerName ?? 'Guest',
            items: Number(s.ItemCount ?? s.ItemCount ?? 0),
            time: timeStamp ? new Date(timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            status: 'Paid',
            total: Number(s.TotalAmount ?? s.TotalAmount ?? s.total ?? 0),
          };
        });
        setRecentSales(mapped);
      } catch (err) {
        // ignore
      }
    }

    const handler = (e) => {
      const receipt = e?.detail?.receiptNumber;
      if (receipt) {
        const newSale = { id: receipt, customer: 'Guest', items: e?.detail?.itemsCount || 0, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), status: 'Paid', total: Number(e?.detail?.totalAmount || 0) };
        setRecentSales((s) => [newSale, ...s]);
        setTab('completed');
        setSelected(receipt);
      }
      loadSales();
    };

    loadSales();
    window.addEventListener('productsUpdated', handler);
    return () => { mounted = false; window.removeEventListener('productsUpdated', handler); };
  }, []);

  const list = tab === "open" ? openOrders : recentSales;

  const current = list.find((order) => order.id === selected) || list[0];

  const isCurrentOpen = tab === "open";

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_420px] lg:p-8">
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Orders
            </p>
            <h1 className="text-3xl font-bold text-neutral-900">
              Select an order
            </h1>
          </div>

          <Link
            to="../sales"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-[#546B41]/40 hover:text-[#546B41]"
          >
            Start new sale
          </Link>
        </div>

        <div className="inline-flex rounded-full border border-neutral-200 bg-white p-2">
          {["open", "completed"].map((item) => {
            const isActive = tab === item;

            return (
              <button
                key={item}
                onClick={() => {
                  setTab(item);
                  setSelected(
                    item === "open" ? openOrders[0].id : recentSales[0].id
                  );
                }}
                className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
                  isActive
                    ? "bg-[#546B41] text-white"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 py-4">
          {list.map((order) => {
            const isOpen = "opened" in order;
            const meta = isOpen ? order.opened : order.time;
            const isSelected = selected === order.id;

            return (
              <button
                key={order.id}
                onClick={() => setSelected(order.id)}
                className={`flex items-center gap-4 rounded-xl border bg-white p-4 text-left transition ${
                  isSelected
                    ? "border-[#546B41] ring-2 ring-[#546B41]/20"
                    : "border-neutral-200 hover:border-[#546B41]/40"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 ">
                  {isOpen ? (
                    <Clock className="h-4 w-4 text-[#546B41]" />
                  ) : (
                    <Receipt className="h-4 w-4 text-[#546B41]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900">
                      {order.id}
                    </span>
                    <span className="text-sm text-neutral-500">
                      · {order.customer}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500">
                    {order.items} items · {meta}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold tabular-nums text-neutral-900">
                    ₱{order.total}
                  </div>

                  {!isOpen && (
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  )}
                </div>

                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky top-6 self-start rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              {current.id}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isCurrentOpen
                  ? "bg-[#546B41]/10 text-[#546B41]"
                  : getStatusClass(current.status)
              }`}
            >
              {isCurrentOpen ? "Open" : current.status}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Customer
            </p>
            <p className="font-medium text-neutral-900">{current.customer}</p>
          </div>

          <div className="border-t border-neutral-100" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Items
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                {current.items}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Total
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                ₱{current.total}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          <div className="flex flex-col gap-2">
            <Link
              to="../sales"
              className="w-full rounded-lg bg-[#546B41] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#455734]"
            >
              Resume at checkout
            </Link>

            <button className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-[#546B41]/40 hover:text-[#546B41]">
              Print receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}