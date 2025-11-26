import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usuarios: 0,
    tabelas: 0,
    admins: 0,
    comuns: 0
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const [usuariosRes, tabelasRes] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/tabelas")
      ]);

      const usuarios = usuariosRes.data;
      setStats({
        usuarios: usuarios.length,
        tabelas: tabelasRes.data.length,
        admins: usuarios.filter(u => u.type === "admin").length,
        comuns: usuarios.filter(u => u.type === "comum").length
      });
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
    }
  };

  const cards = [
    {
      title: "Total de Usuários",
      value: stats.usuarios,
      icon: "👥",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      onClick: () => navigate("/admin/usuarios")
    },
    {
      title: "Tabelas Disponíveis",
      value: stats.tabelas,
      icon: "📁",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      onClick: () => navigate("/admin/tabelas")
    },
    {
      title: "Administradores",
      value: stats.admins,
      icon: "👑",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      onClick: () => navigate("/admin/usuarios")
    },
    {
      title: "Usuários Comuns",
      value: stats.comuns,
      icon: "👤",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      onClick: () => navigate("/admin/usuarios")
    }
  ];

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      background: "#f5f7fa"
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        padding: "40px",
        overflowY: "auto",
        marginLeft: "280px"
      }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Bem-vindo ao Painel Administrativo
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: "18px",
            margin: 0
          }}>
            Gerencie usuários, tabelas e visualize relatórios do sistema
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 24,
          marginBottom: 40
        }}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "28px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                border: "1px solid #e2e8f0"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  background: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  {card.icon}
                </div>
              </div>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#64748b",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: "32px",
                fontWeight: "bold",
                margin: 0,
                background: card.color,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0"
        }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            color: "#1e293b"
          }}>
            Ações Rápidas
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16
          }}>
            <button
              onClick={() => navigate("/admin/usuarios")}
              style={{
                padding: "16px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(102,126,234,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102,126,234,0.3)";
              }}
            >
              👤 Gerenciar Usuários
            </button>
            <button
              onClick={() => navigate("/admin/tabelas")}
              style={{
                padding: "16px 24px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(245,87,108,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(245,87,108,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(245,87,108,0.3)";
              }}
            >
              📁 Upload de Tabelas
            </button>
            <button
              onClick={() => navigate("/admin/relatorios")}
              style={{
                padding: "16px 24px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(79,172,254,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(79,172,254,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,172,254,0.3)";
              }}
            >
              📈 Ver Relatórios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}