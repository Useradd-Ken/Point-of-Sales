import React from "react";
import Nav from "./nav.jsx";

export const Home = () => {
  return (
    <section
      className="h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/home.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <Nav />

      {/* CENTER CONTENT */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl italic font-light mb-6 p-6">
          Welcome to Ken Rod Thrift Shop
        </h1>

        <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition cursor-pointer">
          Browse
        </button>
      </div>
    </section>
  );
};

export default Home;