import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login.jsx";
import Dashboard from "./Dashboard/dashboard.jsx";

// 1. Create or import your Dashboard component wrapper
// function DashboardPlaceholder() {
//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-neutral-100 text-[#546B41] font-semibold">
//       Dashboard Component Loaded Successfully!
//     </div>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      <section className="relative bg-white justify-center items-center w-full h-screen">
        <Routes>
          {/* Default Route shows the Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Redirection Route matches your navigate("/Dashboard") call */}
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;