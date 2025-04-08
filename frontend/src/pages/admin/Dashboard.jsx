import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        background: "#1e3c72",
        color: "#fff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{ marginBottom: 30, fontSize: 24 }}>Admin</h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <Link to="/admin/usuarios" style={linkStyle}>👤 Usuários</Link>
            <Link to="/admin/tabelas" style={linkStyle}>📁 Tabelas</Link>
            <Link to="/admin/relatorios" style={linkStyle}>📊 Relatórios</Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          style={{
            marginTop: 30,
            padding: "10px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          🚪 Sair
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 40 }}>
        <h1 style={{ fontSize: 32, marginBottom: 10 }}>Bem-vindo ao Painel Administrativo</h1>
        <p style={{ color: "#555" }}>
          Use o menu à esquerda para navegar pelas funcionalidades do sistema.
        </p>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: 18,
  padding: "8px 12px",
  borderRadius: 4,
  transition: "background 0.3s",
  background: "#2a5298"
};