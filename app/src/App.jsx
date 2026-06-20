import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import Inventory from "./Dashboard/inventory.jsx";
import Sales from "./Dashboard/sales.jsx";
import Products from "./Dashboard/products.jsx";
import Orders from "./Dashboard/orders.jsx";
import DashboardHome from "./Dashboard/dashboardHome.jsx";

function App() {
  const RequireAuth = ({ children }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return <Navigate to="/" replace />;
    return children;
  };
  return (
    <BrowserRouter>
      <section className="relative bg-white w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/Dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}>
            <Route index element={<DashboardHome />} />
            <Route path="DashboardHome" element={<DashboardHome />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="products" element={<Products />} /> 
            <Route path="sales" element={<Sales />} />
             <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;