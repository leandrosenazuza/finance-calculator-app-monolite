import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Calculadora from "./pages/Calculadora";
import Dashboard from "./pages/admin/Dashboard";
import GerenciarUsuarios from "./pages/admin/Usuarios";
import UploadTabelas from "./pages/admin/Tabelas";
import Relatorios from "./pages/admin/Relatorios";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      localStorage.clear();
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Rotas para admin */}
        <Route path="/admin" element={user?.type === "admin" ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/usuarios" element={user?.type === "admin" ? <GerenciarUsuarios /> : <Navigate to="/login" />} />
        <Route path="/admin/tabelas" element={user?.type === "admin" ? <UploadTabelas /> : <Navigate to="/login" />} />
        <Route path="/admin/relatorios" element={user?.type === "admin" ? <Relatorios /> : <Navigate to="/login" />} />

        {/* Rota para usuários comuns */}
        <Route path="/calculadora" element={user?.type === "comum" ? <Calculadora /> : <Navigate to="/login" />} />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
