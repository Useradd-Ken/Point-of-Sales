import React from "react";

export const Footer = () => {
  return (
    <footer
      className="relative w-full py-8 text-white"
      style={{
        backgroundImage: "url('/footer.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        
        <h1 className="text-4xl font-bold tracking-wide">
          Ken Rod Thrift Shop
        </h1>

        <p className="mt-3 text-gray-300">
          Affordable style. Clean streetwear. Real thrift finds.
        </p>

        {/* links */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          
          <a
            href="mailto:kenrdwork@gmail.com"
            className="hover:text-blue-400 transition"
          >
            kenrdwork@gmail.com
          </a>

          <a
            href="https://github.com"
            target="_blank"
            className="hover:text-blue-400 transition"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </a>
        </div>

        {/* bottom text */}
        <p className="mt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Ken Rod. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;