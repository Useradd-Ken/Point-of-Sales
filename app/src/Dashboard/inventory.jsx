import React, { useEffect, useState } from "react";

const fallbackProducts = [
  { id: 1, name: "Black Hoodie", sku: "HD-BLK-001", category: "Hoodies", stock: 12 },
  { id: 2, name: "White Shirt", sku: "SH-WHT-002", category: "Shirts", stock: 28 },
];

export default function Inventory() {
  const [products, setProducts] = useState(fallbackProducts);
  const [modalType, setModalType] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
 const [addForm, setAddForm] = useState({
  name: "",
  price: "",
  quantity: "",
  image: null,
});
  const [updateForm, setUpdateForm] = useState({ price: "", quantity: "" });
  const [removeId, setRemoveId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setAddForm({
  name: "",
  price: "",
  quantity: "",
  image: null,
});
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

  const { name, price, quantity, image } = addForm;
  // Debugging: Log form values before submission
  console.log(addForm); 
  const formData = new FormData();
 
  formData.append('productName', name);
  formData.append('price', price);
  formData.append('stockQuantity', quantity);

  if (image) {
    formData.append('image', image);
  }

  // Debugging: Log formData entries to verify correct data is being appended
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error);
      return;
    }

    await loadProducts();

    closeModal();
  } catch (err) {
    setError('Unable to add product');
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openModal('add')}
            className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
          >
            Add Product
          </button>
          <button
            onClick={() => openModal('update')}
            className="cursor-pointer rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
          >
            Update Stock
          </button>
          <button
            onClick={() => openModal('remove')}
            className="cursor-pointer  rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-[#546B41] hover:text-white"
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
      {/* MODAL */}
{modalType && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    onClick={closeModal}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-[#546B41]">
            {modalType === "add" && "Add Product"}
            {modalType === "update" && "Update Product"}
            {modalType === "remove" && "Remove Product"}
          </h2>

          <p className="text-sm text-neutral-500">
            {modalType === "add" && "Create a new inventory item"}
            {modalType === "update" && "Update stock and pricing"}
            {modalType === "remove" && "Delete a product permanently"}
          </p>
        </div>

        <button
          onClick={closeModal}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ADD PRODUCT */}
        {modalType === "add" && (
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Name
              </label>

              <input
                type="text"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-neutral-300 p-3 focus:border-[#546B41] focus:outline-none"
                placeholder="Black Hoodie"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={addForm.price}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 p-3 focus:border-[#546B41] focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Quantity
                </label>

                <input
                  type="number"
                  value={addForm.quantity}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 p-3 focus:border-[#546B41] focus:outline-none"
                  placeholder="10"
                />
              </div>
            </div>
 <div>
  <label className="mb-1 block text-sm font-medium">
    Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setAddForm({
        ...addForm,
        image: e.target.files[0],
      })
    }
    className="w-full rounded-xl border border-neutral-300 p-3"
  />
</div>

            {addForm.image && (
  <img
    src={URL.createObjectURL(addForm.image)}
    alt="Preview"
    className="h-48 w-full rounded-xl object-cover"
  />
)}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#546B41] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        )}

        {/* UPDATE PRODUCT */}
        {modalType === "update" && (
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Product
              </label>

              <select
                value={selectedProductId || ""}
                onChange={(e) => {
                  const product = products.find(
                    (p) => String(p.id) === String(e.target.value)
                  );

                  setSelectedProductId(e.target.value);

                  if (product) {
                    setUpdateForm({
                      price: product.price?.toString() || "",
                      quantity: product.stock?.toString() || "",
                    });
                  }
                }}
                className="w-full rounded-xl border border-neutral-300 p-3"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Price
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={updateForm.price}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Stock
                </label>

                <input
                  type="number"
                  value={updateForm.quantity}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 p-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#546B41] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        )}

        {/* REMOVE PRODUCT */}
        {modalType === "remove" && (
          <form onSubmit={handleRemoveProduct} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Select Product
              </label>

              <select
                value={removeId || ""}
                onChange={(e) => setRemoveId(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-3"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-700">Warning</p>

              <p className="mt-1 text-sm text-red-600">
                This action permanently removes the product and cannot be
                undone.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Removing..." : "Remove Product"}
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}