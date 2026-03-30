import { BrowserRouter, Routes, Route } from "react-router-dom";
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

        {/* 🔒 ROTAS INTERNAS */}
        <Route path="/colaborador" element={<AdminDashboardPage />} />
        <Route path="/colaborador/login" element={<AdminLoginPage />} />
        <Route path="/colaborador/informacoes" element={<AdminTipsPage />} />

        {/* 🌐 PÚBLICO */}
        <Route path="/caso/:id" element={<CaseDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}