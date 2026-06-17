import React, { useEffect, useMemo, useState } from "react";

const categoryImageMap = {
  Shoes: "/Shoes.jpg",
  Hoodies: "/Hoodie.jpg",
  Shirts: "/Shirt.jpg",
  Caps: "/Caps.jpg",
};

export default function Items() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("/Shoes.jpg");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error("Unable to load product data.");
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(categoriesData);
        setProducts(productsData);

        if (categoriesData.length > 0) {
          setActiveImage(
            categoryImageMap[categoriesData[0].CategoryName] || "/Shoes.jpg"
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const categoryId = product.CategoryID;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(product);
      return acc;
    }, {});
  }, [products]);

  const handleScroll = (id) => {
    document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryHover = (categoryName) => {
    setActiveImage(categoryImageMap[categoryName] || "/Shoes.jpg");
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="w-full bg-white p-2">
      <div className="flex w-full h-24 border-b">
        {categories.map((cat) => (
          <div
            key={cat.CategoryID}
            onClick={() => handleScroll(cat.CategoryID)}
            onMouseEnter={() => handleCategoryHover(cat.CategoryName)}
            className="flex-1 flex items-center justify-center cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-black hover:text-white"
          >
            {cat.CategoryName}
          </div>
        ))}
      </div>

      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={activeImage}
          alt="preview"
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <h2 className="absolute bottom-4 left-6 text-white text-2xl font-bold">Preview</h2>
      </div>

      <div className="text-center">
        {categories.map((cat) => {
          const categoryProducts = productsByCategory[cat.CategoryID] || [];
          return (
            <div key={cat.CategoryID} id={`category-${cat.CategoryID}`} className="p-10">
              <h1 className="text-3xl font-bold mb-6 italic">{cat.CategoryName}</h1>
              <div className="flex flex-wrap justify-center gap-6">
                {categoryProducts.length > 0 ? (
                  categoryProducts.map((item) => <ProductCard key={item.ProductID} item={item} />)
                ) : (
                  <div className="text-gray-500">No products available.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* PRODUCT CARD */
function ProductCard({ item }) {
  return (
    <div className="mt-3 bg-white shadow-md rounded-xl p-4 w-60 hover:scale-105 transition">
      <img
        src={item.ImageURL || "/Shoes.jpg"}
        alt={item.ProductName}
        className="w-full h-40 object-cover rounded-lg"
      />

      <h3 className="mt-2 font-semibold">{item.ProductName}</h3>

      <p className="text-sm text-gray-500">Stock: {item.StockQuantity}</p>
      <p className="text-sm text-black font-semibold mt-2">₱ {Number(item.Price).toFixed(2)}</p>

      <div className="flex items-center justify-between mt-3">
        <button className="px-2 bg-gray-200 rounded cursor-pointer">-</button>
        <span>1</span>
        <button className="px-2 bg-gray-200 rounded cursor-pointer">+</button>
      </div>

      <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
        Add To Cart
      </button>
    </div>
  );
}