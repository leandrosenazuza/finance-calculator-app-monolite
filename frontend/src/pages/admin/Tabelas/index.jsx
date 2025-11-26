import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/admin/Sidebar";

export default function UploadTabelas() {
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tabelas, setTabelas] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    buscarTabelas();
  }, []);

  const buscarTabelas = async () => {
    try {
      const res = await axios.get("/api/tabelas");
      setTabelas(res.data);
    } catch (err) {
      console.error("Erro ao buscar tabelas:", err);
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      setMensagem("⚠️ Selecione um arquivo .json");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem("✅ " + res.data.message);
      setArquivo(null);
      buscarTabelas();
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      setMensagem("❌ Erro ao fazer upload.");
      setTimeout(() => setMensagem(""), 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      setArquivo(file);
    } else {
      setMensagem("⚠️ Por favor, selecione apenas arquivos .json");
      setTimeout(() => setMensagem(""), 3000);
    }
  };

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
            Upload de Tabelas
          </h1>
          <p style={{
            color: "#64748b",
            margin: 0,
            fontSize: "16px"
          }}>
            Envie arquivos JSON para a pasta <strong>tables-taxes</strong>
          </p>
        </div>

        {mensagem && (
          <div style={{
            padding: "12px 20px",
            borderRadius: "12px",
            marginBottom: 24,
            background: mensagem.includes("✅")
              ? "rgba(16,185,129,0.1)"
              : mensagem.includes("❌")
              ? "rgba(239,68,68,0.1)"
              : "rgba(251,191,36,0.1)",
            color: mensagem.includes("✅")
              ? "#10b981"
              : mensagem.includes("❌")
              ? "#ef4444"
              : "#f59e0b",
            border: `1px solid ${
              mensagem.includes("✅")
                ? "rgba(16,185,129,0.3)"
                : mensagem.includes("❌")
                ? "rgba(239,68,68,0.3)"
                : "rgba(251,191,36,0.3)"
            }`
          }}>
            {mensagem}
          </div>
        )}

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: 32,
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0"
        }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? "#667eea" : "#cbd5e1"}`,
              borderRadius: "16px",
              padding: "60px 40px",
              textAlign: "center",
              background: isDragging
                ? "rgba(102,126,234,0.05)"
                : "#f8fafc",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onClick={() => document.getElementById("file-input").click()}
          >
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>
              📁
            </div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 8px 0"
            }}>
              {arquivo ? arquivo.name : "Arraste e solte um arquivo JSON aqui"}
            </h3>
            <p style={{
              color: "#64748b",
              margin: "0 0 24px 0",
              fontSize: "14px"
            }}>
              ou clique para selecionar
            </p>
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={(e) => setArquivo(e.target.files[0])}
              style={{ display: "none" }}
            />
            {arquivo && (
              <div style={{
                marginTop: "20px",
                padding: "12px 20px",
                background: "rgba(102,126,234,0.1)",
                borderRadius: "10px",
                display: "inline-block"
              }}>
                <span style={{
                  color: "#667eea",
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  📄 {arquivo.name}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!arquivo}
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "16px",
              background: arquivo
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#cbd5e1",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: arquivo ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxShadow: arquivo
                ? "0 4px 12px rgba(102,126,234,0.3)"
                : "none"
            }}
            onMouseEnter={(e) => {
              if (arquivo) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(102,126,234,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (arquivo) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102,126,234,0.3)";
              }
            }}
          >
            🚀 Enviar Tabela
          </button>
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
            margin: "0 0 24px 0",
            color: "#1e293b"
          }}>
            Tabelas Disponíveis ({tabelas.length})
          </h2>
          {tabelas.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16
            }}>
              {tabelas.map((tabela, index) => (
                <div
                  key={index}
                  style={{
                    padding: "20px",
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    fontSize: "32px",
                    marginBottom: "12px"
                  }}>
                    📄
                  </div>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    wordBreak: "break-word"
                  }}>
                    {tabela}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#94a3b8"
            }}>
              <p style={{ fontSize: "18px", margin: 0 }}>
                Nenhuma tabela cadastrada ainda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
