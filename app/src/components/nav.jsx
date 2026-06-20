import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  Boxes,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  {
    title: "Dashboard",
    url: "/Dashboard/dashboardHome",
    icon: LayoutDashboard,
  },
  {
    title: "POS",
    url: "/Dashboard/sales",
    icon: ShoppingCart,
  },
  {
    title: "Orders",
    url: "/Dashboard/products",

    icon: ClipboardList,
  },
  {
    title: "Inventory",
    url: "/Dashboard/inventory",
    icon: Boxes,
  },
];

const cashierNav = [
	{
	  title: "POS",
	  url: "/Dashboard/sales",
	  icon: ShoppingCart,
	},
	{
	  title: "Orders",
	  url: "/Dashboard/products",
	  icon: ClipboardList,
	},
	{
	  title: "Inventory",
	  url: "/Dashboard/inventory",
	  icon: Boxes,
	},
  ];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  let userRole = "admin";

  try {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.role) {
      userRole = savedUser.role.toLowerCase();
    }
  } catch (e) {
    console.error("Failed to parse user role", e);
  }

  const nav = userRole === "admin" ? adminNav : cashierNav;

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
	<>
	<button
  onClick={() => setMobileOpen(true)}
  className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow md:hidden"
>
  <Menu className="h-5 w-5" />
</button>
    <aside
	className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-neutral-200 bg-white px-4 py-6 transition-transform duration-300 md:relative md:translate-x-0 ${
	  mobileOpen ? "translate-x-0" : "-translate-x-full"
	}`}
  >
	<button
  onClick={() => setMobileOpen(false)}
  className="mb-4 md:hidden"
>
  ✕
</button>
      {/* Header */}
      <div className="mb-8 px-2 py-4">
        <Link to="/Dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#546B41] text-lg font-bold text-white">
            H
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-neutral-900">
              HoodStock
            </h2>
            <p className="text-xs font-medium capitalize text-neutral-400">
              POS System • {userRole}
            </p>
          </div>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2">
        {nav.map((item) => {
          const isActive =
            pathname.toLowerCase() === item.url.toLowerCase();

          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#546B41]/10 text-[#546B41]"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <item.icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-[#546B41]" : "text-neutral-400"
                }`}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-100 pt-4 px-2">
        <Link
          to="/"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
	</>
  );
}