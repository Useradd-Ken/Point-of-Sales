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
  const [modalType, setModalType] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [addForm, setAddForm] = useState({ name: "", price: "", quantity: "", image: "" });
  const [updateForm, setUpdateForm] = useState({ price: "", quantity: "" });
  const [removeId, setRemoveId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) return;
      const json = await res.json();
      const mapped = json.map((p) => ({
        id: p.ProductID ?? p.id,
        name: p.ProductName ?? p.name,
        sku: p.SKU ?? p.sku ?? '',
        category: p.Category ?? p.category ?? 'Uncategorized',
        stock: Number(p.StockQuantity ?? p.stock ?? 0),
        price: Number(p.Price ?? p.price ?? 0),
        image: p.ImageURL ?? p.imageUrl ?? p.image ?? '',
      }));
      setProducts(mapped);
    } catch (err) {
      // keep fallback
    }
  };

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!mounted) return;
      await loadProducts();
    }

    init();

    const handler = () => { loadProducts(); };
    window.addEventListener('productsUpdated', handler);

    return () => {
      mounted = false;
      window.removeEventListener('productsUpdated', handler);
    };
  }, []);

  const openModal = (type) => {
    setError("");
    setModalType(type);

    if (type === 'add') {
      setAddForm({ name: "", price: "", quantity: "", image: "" });
      setSelectedProductId(null);
      setRemoveId(null);
    }

    if (type === 'update') {
      const firstProduct = products[0];
      setSelectedProductId(firstProduct?.id ?? null);
      setUpdateForm({
        price: firstProduct?.price?.toString() ?? "",
        quantity: firstProduct?.stock?.toString() ?? "",
      });
      setRemoveId(null);
    }

    if (type === 'remove') {
      setRemoveId(products[0]?.id ?? null);
      setSelectedProductId(null);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setError("");
  };

  const selectedProduct = products.find((product) => String(product.id) === String(selectedProductId));

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");

    const { name, price, quantity, image } = addForm;
    if (!name || !price || !quantity) {
      setError('Product name, price, and quantity are required.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: name,
          price: parseFloat(price),
          stockQuantity: parseInt(quantity, 10),
          imageUrl: image || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Unable to add product.');
        return;
      }

      await loadProducts();
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { type: 'product-added' } }));
      closeModal();
    } catch (err) {
      setError('Unable to add product.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct) {
      setError('Please select a product to update.');
      return;
    }

    const price = parseFloat(updateForm.price);
    const quantity = parseInt(updateForm.quantity, 10);

    if (Number.isNaN(price) || Number.isNaN(quantity)) {
      setError('Price and quantity must be valid numbers.');
      return;
    }

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          price,
          stockQuantity: quantity,
          imageUrl: selectedProduct.image || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Unable to update product.');
        return;
      }

      await loadProducts();
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { type: 'product-updated' } }));
      closeModal();
    } catch (err) {
      setError('Unable to update product.');
    }
  };

  const handleRemoveProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!removeId) {
      setError('Please select a product to remove.');
      return;
    }

    try {
      const res = await fetch(`/api/products/${removeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Unable to remove product.');
        return;
      }

      await loadProducts();
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { type: 'product-removed' } }));
      closeModal();
    } catch (err) {
      setError('Unable to remove product.');
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
        <p className="text-xs uppercase tracking-widest text-[#1F2937]">
          Stock
        </p>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="py-4 text-3xl font-bold text-[#546B41]">Inventory</h1>
        <div className="text-red-500">
  Current Modal: {modalType}
</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openModal('add')}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
          >
            Add Product
          </button>
          <button
            onClick={() => openModal('update')}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
          >
            Update Stock
          </button>
          <button
            onClick={() => openModal('remove')}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
          >
            Remove Product
          </button>
        </div>
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