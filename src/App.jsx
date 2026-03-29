import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import RedeAlertaHomepage from "./pages/RedeAlertaHomepage";
import CreateCasePage from "./pages/CreateCasePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import AdminTipsPage from "./pages/AdminTipsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedeAlertaHomepage />} />
        <Route path="/cadastrar" element={<CreateCasePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/caso/:id" element={<CaseDetailPage />} />
        <Route path="/admin/informacoes" element={<AdminTipsPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}