import React, { useState } from "react";

const categories = [
  { name: "Shoes", id: "shoes", img: "/Shoes.jpg" },
  { name: "Hoodies", id: "hoodies", img: "/Hoodie.jpg" },
  { name: "Shirt", id: "shirts", img: "/Shirt.jpg" },
  { name: "Caps", id: "caps", img: "/Caps.jpg" },
];

const products = {
  shoes: [
    { id: 1, title: "Nike Retro", img: "/Shoes.jpg", stock: 12 },
    { id: 2, title: "Adidas Run", img: "/Shoes.jpg", stock: 8 },
    { id: 3, title: "Street Kicks", img: "/Shoes.jpg", stock: 5 },
    { id: 4, title: "Classic Leather", img: "/Shoes.jpg", stock: 10 },
    { id: 5, title: "Urban Flex", img: "/Shoes.jpg", stock: 6 },
  ],
  hoodies: [
    { id: 1, title: "Black Hoodie", img: "/Hoodie.jpg", stock: 9 },
    { id: 2, title: "Oversized Hoodie", img: "/Hoodie.jpg", stock: 4 },
    { id: 3, title: "Winter Hoodie", img: "/Hoodie.jpg", stock: 7 },
    { id: 4, title: "Street Hoodie", img: "/Hoodie.jpg", stock: 3 },
    { id: 5, title: "Zip Hoodie", img: "/Hoodie.jpg", stock: 11 },
  ],
  shirts: [
    { id: 1, title: "Plain White Tee", img: "/Shirt.jpg", stock: 15 },
    { id: 2, title: "Graphic Tee", img: "/Shirt.jpg", stock: 6 },
    { id: 3, title: "Oversized Tee", img: "/Shirt.jpg", stock: 9 },
    { id: 4, title: "Vintage Shirt", img: "/Shirt.jpg", stock: 4 },
    { id: 5, title: "Minimal Tee", img: "/Shirt.jpg", stock: 8 },
  ],
  caps: [
    { id: 1, title: "Snapback", img: "/Caps.jpg", stock: 10 },
    { id: 2, title: "Baseball Cap", img: "/Caps.jpg", stock: 7 },
    { id: 3, title: "Dad Hat", img: "/Caps.jpg", stock: 5 },
    { id: 4, title: "Street Cap", img: "/Caps.jpg", stock: 6 },
    { id: 5, title: "Vintage Cap", img: "/Caps.jpg", stock: 3 },
  ],
};

export default function Items() {
  const [activeImage, setActiveImage] = useState(categories[0].img);

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white p-2">

      {/* CATEGORY BAR */}
      <div className="flex w-full h-24 border-b">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleScroll(cat.id)}
            onMouseEnter={() => setActiveImage(cat.img)}
            className="flex-1 flex items-center justify-center cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-black hover:text-white"
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* PREVIEW IMAGE */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={activeImage}
          alt="preview"
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <h2 className="absolute bottom-4 left-6 text-white text-2xl font-bold">
          Preview
        </h2>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="text-center">

        {/* SHOES */}
        <div id="shoes" className="p-10">
          <h1 className="text-3xl font-bold mb-6 italic">Shoes</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {products.shoes.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* HOODIES */}
        <div id="hoodies" className="p-10">
          <h1 className="text-3xl font-bold mb-6 italic">Hoodies</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {products.hoodies.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* SHIRTS */}
        <div id="shirts" className="p-10">
          <h1 className="text-3xl font-bold mb-6 italic">Shirts</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {products.shirts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* CAPS */}
        <div id="caps" className="p-10">
          <h1 className="text-3xl font-bold mb-6 italic">Caps</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {products.caps.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* PRODUCT CARD */
function ProductCard({ item }) {
  return (
    <div className="mt-3 bg-white shadow-md rounded-xl p-4 w-60 hover:scale-105 transition">
      <img
        src={item.img}
        className="w-full h-40 object-cover rounded-lg"
      />

      <h3 className="mt-2 font-semibold">{item.title}</h3>

      <p className="text-sm text-gray-500">Stock: {item.stock}</p>

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