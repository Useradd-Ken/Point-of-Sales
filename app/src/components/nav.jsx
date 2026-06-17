import { Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%]">
      <nav className="flex items-center justify-between bg-white rounded-2xl px-8 py-4 shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-1">
  <img
    src="/Company Logo.png"
    alt="Company Logo"
    className="h-8 w-auto flex-shrink-0"  
  />
    <h1 className="flex text-md font-bold text-black italic">Ken Rod</h1>
    <span className="text-black italic">| Thrift Shop</span>
    </div>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-wider">
          <li>
            <a href="#new-arrivals" className="hover:text-gray-500 transition">
              New Arrivals
            </a>
          </li>

          
          <li>
            <a href="#shop" className="hover:text-gray-500 transition">
             Shoes
            </a>
          </li>

          <li>
            <a href="#shop" className="hover:text-gray-500 transition">
              Hoodie
            </a>
          </li>

          <li>
            <a href="#men" className="hover:text-gray-500 transition">
             Shirt
            </a>
          </li>

          <li>
            <a href="#women" className="hover:text-gray-500 transition">
              Caps
            </a>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button className="hover:scale-110 transition cursor-pointer">
            <Search size={20} />
          </button>

          <button className="cursor-pointer relative hover:scale-110 transition">
            <ShoppingBag size={22} />

            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white cursor-pointer">
              2
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}