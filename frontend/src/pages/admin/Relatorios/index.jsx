import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../../../components/admin/Sidebar";

export default function Relatorios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTabela, setFiltroTabela] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  const exportarExcel = () => {
    const dados = filtrarUsuarios();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dados);
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio_usuarios.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Usuários", 14, 16);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total: ${filtrarUsuarios().length} usuário(s)`, 14, 24);
    
    const tableData = filtrarUsuarios().map(u => [
      u.name,
      u.username,
      u.type === "admin" ? "Administrador" : "Comum",
      u.tabela || "-"
    ]);
    
    doc.autoTable({
      head: [["Nome", "Usuário", "Tipo", "Tabela"]],
      body: tableData,
      startY: 30,
      styles: {
        head: { fillColor: [102, 126, 234], textColor: 255, fontStyle: "bold" },
        alternateRow: { fillColor: [245, 247, 250] }
      },
      headStyles: { fillColor: [102, 126, 234] }
    });
    doc.save("relatorio_usuarios.pdf");
  };

  const filtrarUsuarios = () => {
    return usuarios.filter(u => {
      return (
        (filtroTipo === "" || u.type === filtroTipo) &&
        (filtroTabela === "" || u.tabela === filtroTabela)
      );
    });
  };

  const tabelasUnicas = [...new Set(usuarios.map(u => u.tabela).filter(Boolean))];
  const usuariosFiltrados = filtrarUsuarios();

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      background: "#f5f7fa"
    }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "40px", overflowY: "auto", marginLeft: "280px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
            color: "#1e293b"
          }}>
            Relatórios
          </h1>
          <p style={{
            color: "#64748b",
            margin: 0,
            fontSize: "16px"
          }}>
            Visualize e exporte relatórios de usuários do sistema
          </p>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: 32,
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "14px",
                fontWeight: "600",
                color: "#475569"
              }}>
                Filtrar por Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "15px",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Todos os Tipos</option>
                <option value="admin">Administrador</option>
                <option value="comum">Usuário Comum</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: "14px",
                fontWeight: "600",
                color: "#475569"
              }}>
                Filtrar por Tabela
              </label>
              <select
                value={filtroTabela}
                onChange={(e) => setFiltroTabela(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "15px",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="">Todas as Tabelas</option>
                {tabelasUnicas.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}>
            <button
              onClick={exportarExcel}
              style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.3)";
              }}
            >
              <span>📊</span>
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={exportarPDF}
              style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(239,68,68,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.3)";
              }}
            >
              <span>📄</span>
              <span>Exportar PDF</span>
            </button>
            <div style={{
              padding: "14px 24px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "16px",
              fontWeight: "600",
              color: "#475569"
            }}>
              <span>📈</span>
              <span>{usuariosFiltrados.length} resultado(s)</span>
            </div>
          </div>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0",
          overflowX: "auto"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0
          }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: "left",
                  padding: "16px",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Nome
                </th>
                <th style={{
                  textAlign: "left",
                  padding: "16px",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Usuário
                </th>
                <th style={{
                  textAlign: "left",
                  padding: "16px",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Tipo
                </th>
                <th style={{
                  textAlign: "left",
                  padding: "16px",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Tabela
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, i) => (
                <tr
                  key={i}
                  style={{
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{
                    padding: "16px",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "15px",
                    color: "#1e293b"
                  }}>
                    {u.name}
                  </td>
                  <td style={{
                    padding: "16px",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "15px",
                    color: "#64748b",
                    fontFamily: "monospace"
                  }}>
                    {u.username}
                  </td>
                  <td style={{
                    padding: "16px",
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: u.type === "admin"
                        ? "rgba(102,126,234,0.1)"
                        : "rgba(16,185,129,0.1)",
                      color: u.type === "admin"
                        ? "#667eea"
                        : "#10b981"
                    }}>
                      {u.type === "admin" ? "👑 Admin" : "👤 Comum"}
                    </span>
                  </td>
                  <td style={{
                    padding: "16px",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "15px",
                    color: "#64748b"
                  }}>
                    {u.tabela || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuariosFiltrados.length === 0 && (
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#94a3b8"
            }}>
              <p style={{ fontSize: "18px", margin: 0 }}>
                Nenhum resultado encontrado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
