import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import RedeAlertaHomepage from "./pages/RedeAlertaHomepage";
import CreateCasePage from "./pages/CreateCasePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import AdminTipsPage from "./pages/AdminTipsPage";
import PublicGuidePage from "./pages/PublicGuidePage";
import AdminNewsPage from "./pages/AdminNewsPage";
import AdminNewsEditorPage from "./pages/AdminNewsEditorPage";
import NewsDetailPage from "./pages/NewsDetailPage";

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
        <Route path="/colaborador/noticias" element={<AdminNewsPage />} />
        <Route path="/colaborador/noticias/nova" element={<AdminNewsEditorPage />} />
        <Route path="/colaborador/noticias/:id/editar" element={<AdminNewsEditorPage />} />
        {/* 🌐 PÚBLICO */}
        <Route path="/caso/:id" element={<CaseDetailPage />} />
        <Route path="/guia" element={<PublicGuidePage />} />
        <Route path="/informacoes/:slug" element={<NewsDetailPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}