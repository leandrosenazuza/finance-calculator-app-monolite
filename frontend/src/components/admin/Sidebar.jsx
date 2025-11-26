import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/usuarios", label: "Usuários", icon: "👤" },
    { path: "/admin/tabelas", label: "Tabelas", icon: "📁" },
    { path: "/admin/relatorios", label: "Relatórios", icon: "📈" },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      width: 280,
      background: "linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)",
      color: "#fff",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      overflowY: "auto"
    }}>
      <div>
        <div style={{
          marginBottom: 40,
          paddingBottom: 20,
          borderBottom: "2px solid rgba(255,255,255,0.2)"
        }}>
          <h1 style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Admin Panel
          </h1>
          <p style={{
            margin: "8px 0 0 0",
            fontSize: "14px",
            opacity: 0.8,
            color: "#e0e7ff"
          }}>
            Sistema de Gestão
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "16px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  background: active
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backdropFilter: active ? "blur(10px)" : "none",
                  transform: active ? "translateX(4px)" : "none",
                  boxShadow: active
                    ? "0 4px 12px rgba(0,0,0,0.15)"
                    : "none"
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontWeight: active ? "600" : "400" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
        style={{
          marginTop: "auto",
          marginBottom: "60px",
          padding: "14px 18px",
          backgroundColor: "rgba(255,77,79,0.9)",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(255,77,79,0.3)",
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,77,79,1)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(255,77,79,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,77,79,0.9)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,77,79,0.3)";
        }}
      >
        <span>🚪</span>
        <span>Sair</span>
      </button>
    </div>
  );
}

