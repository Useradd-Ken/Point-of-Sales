import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";

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
  const [recentSales, setRecentSales] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSales() {
      try {
        const res = await fetch("/api/sales");

        if (!res.ok) return;

        const json = await res.json();

        if (!mounted) return;

        const mapped = (Array.isArray(json) ? json : []).map((sale) => {
          const timeStamp =
            sale.TransactionDate ??
            sale.CreatedAt ??
            null;

          return {
            id:
              sale.ReceiptNumber ??
              sale.SaleID ??
              sale.SaleId ??
              sale.id,

            customer:
              sale.CustomerName ??
              "Guest",

            items: Number(
              sale.ItemCount ?? 0
            ),

            time: timeStamp
              ? new Date(
                  timeStamp
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",

            status: "Paid",

            total: Number(
              sale.TotalAmount ??
                sale.total ??
                0
            ),
          };
        });

        setRecentSales(mapped);

        if (
          mapped.length > 0 &&
          !selected
        ) {
          setSelected(mapped[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const handler = (e) => {
      const receipt =
        e?.detail?.receiptNumber;

      if (receipt) {
        const newSale = {
          id: receipt,
          customer: "Guest",
          items:
            e?.detail?.itemsCount || 0,
          time:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          status: "Paid",
          total: Number(
            e?.detail?.totalAmount || 0
          ),
        };

        setRecentSales((prev) => [
          newSale,
          ...prev,
        ]);

        setSelected(receipt);
      }

      loadSales();
    };

    loadSales();

    window.addEventListener(
      "productsUpdated",
      handler
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "productsUpdated",
        handler
      );
    };
  }, []);

  const current =
    recentSales.find(
      (sale) => sale.id === selected
    ) || recentSales[0];

  return (
    <div className="grid gap-4 p-4 md:gap-6 md:p-6 lg:grid-cols-[1fr_420px] lg:p-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Orders
            </p>

            <h1 className="text-3xl font-bold text-neutral-900">
              Completed Orders
            </h1>
          </div>

          <Link
            to="../sales"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-[#546B41]/40 hover:text-[#546B41]"
          >
            Start New Sale
          </Link>
        </div>

        <div className="grid gap-3">
          {recentSales.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
              No completed orders found.
            </div>
          )}

          {recentSales.map((order) => {
            const isSelected =
              selected === order.id;

            return (
              <button
                key={order.id}
                onClick={() =>
                  setSelected(order.id)
                }
                className={`flex flex-col items-start gap-3 rounded-xl border bg-white p-4 text-left transition sm:flex-row sm:items-center ${
                  isSelected
                    ? "border-neutral-200 ring-2 ring-[#546B41]/40"
                    : "border-neutral-200 hover:border-[#546B41]/40"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
                  <Receipt className="h-4 w-4 text-[#546B41]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="break-all font-medium text-neutral-900">
                      {order.id}
                    </span>

                    <span className="text-sm text-neutral-500">
                      · {order.customer}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500">
                    {order.items} items ·{" "}
                    {order.time}
                  </div>
                </div>

                <div className="w-full text-left sm:w-auto sm:text-right">
                  <div className="text-xl font-bold tabular-nums text-neutral-900">
                    ₱{order.total}
                  </div>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <ArrowRight className="hidden h-4 w-4 text-neutral-400 sm:block" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm lg:sticky lg:top-6 lg:self-start">
        <div className="border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">
              {current?.id || "No Orders"}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                current
                  ? getStatusClass(
                      current.status
                    )
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {current?.status ||
                "No Status"}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-4 md:p-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Cashier
            </p>

            <p className="font-medium text-neutral-900">
              {current?.customer ||
                "No Customer"}
            </p>
          </div>

          <div className="border-t border-neutral-100" />

          <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Items
              </p>

              <p className="text-2xl font-bold text-neutral-900">
                {current?.items ?? 0}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Total
              </p>

              <p className="text-2xl font-bold text-neutral-900">
                ₱
                {current?.total ?? 0}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

       <button
  onClick={() => setShowReceipt(true)}
  className="cursor-pointer w-full rounded-lg bg-[#546B41] px-4 py-3 text-base font-medium text-white transition hover:bg-[#546B41]/80"
>
  Print Receipt
</button>
        </div>
      </div>{showReceipt && current && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setShowReceipt(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl bg-white shadow-xl"
    >
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-[#546B41]">
          Receipt
        </h2>

        <p className="text-sm text-neutral-500">
          Transaction Summary
        </p>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex justify-between">
          <span className="text-neutral-500">
            Receipt No.
          </span>

          <span className="font-medium">
            {current.id}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">
            Cashier
          </span>

          <span className="font-medium">
            {current.customer}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">
            Time
          </span>

          <span className="font-medium">
            {current.time}
          </span>
        </div>

        <div className="border-transparent pt-4">
          <div className="flex justify-between">
            <span>Total Items</span>

            <span className="font-bold">
              {current.items}
            </span>
          </div>

          <div className="mt-3 flex justify-between text-xl">
            <span>Total Amount</span>

            <span className="font-bold text-[#546B41]">
              ₱{current.total}
            </span>
          </div>
        </div>

        <div className="border-[#546B41]/40 pt-4">
          <div className="flex justify-between">
            <span>Status</span>

            <span
              className={`rounded-full px-3 py-3 text-xs font-medium ${getStatusClass(
                current.status
              )}`}
            >
              {current.status}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="cursor-pointer w-full rounded-lg bg-[#546B41] py-3 font-medium text-white hover:bg-[#455734]"
        >
          Print Now
        </button>

        <button
          onClick={() => setShowReceipt(false)}
          className="cursor-pointer w-full rounded-lg border border-neutral-200 py-3 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}