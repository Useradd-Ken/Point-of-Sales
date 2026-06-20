import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";
import Inventory from "./Dashboard/inventory.jsx";
import Sales from "./Dashboard/sales.jsx";
import Products from "./Dashboard/products.jsx";
import Orders from "./Dashboard/orders.jsx";
import DashboardHome from "./Dashboard/dashboardHome.jsx";

function App() {
  return (
    <BrowserRouter>
      <section className="relative bg-white w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/Dashboard" element={<Dashboard />}>
            {/* <Route index element={<h1>hello</h1>} /> */}
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