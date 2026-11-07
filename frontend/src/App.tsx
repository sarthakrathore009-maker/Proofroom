import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { BrandVault } from "./pages/BrandVault";
import { NewContentReview } from "./pages/NewContentReview";
import { ReviewWorkspace } from "./pages/ReviewWorkspace";
import { ApprovalPassport } from "./pages/ApprovalPassport";
import { ForgotPassword } from "./pages/ForgotPassword";
import { UserProfile } from "./pages/UserProfile";
import { AccessDenied, NotFound } from "./pages/SystemStates";
import { UIStates } from "./pages/UIStates";
import { ProductTour } from "./components/ProductTour";

function App() {
  return (
    <BrowserRouter>
      <ProductTour />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/403" element={<AccessDenied />} />
        <Route path="/ui-states" element={<UIStates />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brand-vault" element={<BrandVault />} />
        <Route path="/new-review" element={<NewContentReview />} />
        <Route path="/reviews" element={<NewContentReview />} />
        <Route path="/workspace" element={<ReviewWorkspace />} />
        <Route path="/approval" element={<ApprovalPassport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
