import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import Inventory from "./Dashboard/inventory.jsx";
import Sales from "./Dashboard/sales.jsx";
import Products from "./Dashboard/products.jsx";
import DashboardHome from "./Dashboard/dashboardHome.jsx";

function App() {
  const RequireAuth = ({ children }) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) return <Navigate to="/" replace />;

    return children;
  };

  const RequireRole = ({ allowedRoles, children }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (
        !user ||
        !allowedRoles.includes(user.role.toLowerCase())
      ) {
        return <Navigate to="/Dashboard/sales" replace />;
      }

      return children;
    } catch {
      return <Navigate to="/" replace />;
    }
  };

  return (
    <BrowserRouter>
      <section className="relative min-h-screen w-full bg-white">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/Dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          >
            <Route
              index
              element={
                <RequireRole allowedRoles={["admin"]}>
                  <DashboardHome />
                </RequireRole>
              }
            />

            <Route
              path="dashboardHome"
              element={
                <RequireRole allowedRoles={["admin"]}>
                  <DashboardHome />
                </RequireRole>
              }
            />

            <Route path="inventory" element={<Inventory />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
          </Route>
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;