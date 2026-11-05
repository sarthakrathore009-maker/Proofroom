import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { BrandVault } from "./pages/BrandVault";
import { NewContentReview } from "./pages/NewContentReview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brand-vault" element={<BrandVault />} />
        <Route path="/new-review" element={<NewContentReview />} />
        <Route path="/reviews" element={<NewContentReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;