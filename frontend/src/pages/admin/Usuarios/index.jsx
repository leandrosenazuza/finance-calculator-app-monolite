import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/admin/Sidebar";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [type, setType] = useState("comum");
  const [tabela, setTabela] = useState("");
  const [tabelasDisponiveis, setTabelasDisponiveis] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [editTabela, setEditTabela] = useState("");

  useEffect(() => {
    buscarUsuarios();
    buscarTabelas();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  const buscarTabelas = async () => {
    try {
      const res = await axios.get("/api/tabelas");
      setTabelasDisponiveis(res.data);
    } catch (err) {
      console.error("Erro ao buscar tabelas:", err);
    }
  };

  const gerarLogin = (nomeCompleto) => {
    const partes = nomeCompleto.trim().toLowerCase().split(" ");
    return `${partes[0]}.${partes[partes.length - 1]}`;
  };

  const handleCriar = async () => {
    if (!nome || !senha || !type || !tabela) {
      setMensagem("⚠️ Preencha todos os campos.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }
    const login = gerarLogin(nome);
    try {
      await axios.post("/api/users", {
        name: nome,
        username: login,
        password: senha,
        type,
        tabela
      });
      setMensagem("✅ Usuário criado com sucesso!");
      setNome("");
      setSenha("");
      setType("comum");
      setTabela("");
      setShowForm(false);
      buscarUsuarios();
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      setMensagem("❌ Erro ao criar usuário.");
      setTimeout(() => setMensagem(""), 3000);
    }
  };

  const iniciarEdicao = (usuario) => {
    setUsuarioEditando(usuario);
    setEditTabela(usuario.tabela || "");
    setShowForm(false);
  };

  const cancelarEdicao = () => {
    setUsuarioEditando(null);
    setEditTabela("");
  };

  const handleAtualizar = async () => {
    if (!editTabela) {
      setMensagem("⚠️ Selecione uma tabela.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }
    
    try {
      await axios.put(`/api/users/${usuarioEditando.id}`, {
        tabela: editTabela
      });
      setMensagem("✅ Tabela atualizada com sucesso!");
      cancelarEdicao();
      buscarUsuarios();
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar tabela:", err);
      setMensagem("❌ Erro ao atualizar tabela.");
      setTimeout(() => setMensagem(""), 3000);
    }
  };

  const excluirUsuario = async (id) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        buscarUsuarios();
      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
      }
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
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32
        }}>
          <div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
              color: "#1e293b"
            }}>
              Gerenciar Usuários
            </h1>
            <p style={{
              color: "#64748b",
              margin: 0,
              fontSize: "16px"
            }}>
              Crie e gerencie usuários do sistema
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "12px 24px",
              background: showForm
                ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
            }}
          >
            {showForm ? "✕ Cancelar" : "+ Novo Usuário"}
          </button>
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

        {showForm && (
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: 32,
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
            border: "1px solid #e2e8f0"
          }}>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "0 0 24px 0",
              color: "#1e293b"
            }}>
              Criar Novo Usuário
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569"
                }}>
                  Nome Completo
                </label>
                <input
                  placeholder="Digite o nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "15px",
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
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569"
                }}>
                  Senha
                </label>
                <input
                  placeholder="Digite a senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "15px",
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
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569"
                }}>
                  Tipo de Usuário
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
                  <option value="comum">Usuário Comum</option>
                  <option value="admin">Administrador</option>
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
                  Tabela
                </label>
                <select
                  value={tabela}
                  onChange={(e) => setTabela(e.target.value)}
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
                  <option value="">Selecione uma Tabela</option>
                  {tabelasDisponiveis.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleCriar}
              style={{
                marginTop: 24,
                padding: "14px 28px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
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
              ✨ Criar Usuário
            </button>
          </div>
        )}

        {usuarioEditando && (
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: 32,
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24
            }}>
              <div>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: "0 0 4px 0",
                  color: "#1e293b"
                }}>
                  Alterar Tabela do Usuário
                </h2>
                <p style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0
                }}>
                  {usuarioEditando.name} ({usuarioEditando.username})
                </p>
              </div>
              <button
                onClick={cancelarEdicao}
                style={{
                  padding: "8px 16px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
              >
                ✕ Cancelar
              </button>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569"
                }}>
                  Tabela Atual
                </label>
                <input
                  value={usuarioEditando.tabela || "Nenhuma tabela atribuída"}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "15px",
                    background: "#f8fafc",
                    color: "#64748b"
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569"
                }}>
                  Nova Tabela
                </label>
                <select
                  value={editTabela}
                  onChange={(e) => setEditTabela(e.target.value)}
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
                  <option value="">Selecione uma Tabela</option>
                  {tabelasDisponiveis.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAtualizar}
              style={{
                marginTop: 24,
                padding: "14px 28px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(16,185,129,0.3)"
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
              💾 Atualizar Tabela
            </button>
          </div>
        )}

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
                <th style={{
                  textAlign: "center",
                  padding: "16px",
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr
                  key={u.id}
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
                  <td style={{
                    padding: "16px",
                    borderBottom: "1px solid #f1f5f9",
                    textAlign: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}>
                      <button
                        onClick={() => iniciarEdicao(u)}
                        style={{
                          background: "rgba(102,126,234,0.1)",
                          color: "#667eea",
                          border: "1px solid rgba(102,126,234,0.2)",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#667eea";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(102,126,234,0.1)";
                          e.currentTarget.style.color = "#667eea";
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => excluirUsuario(u.id)}
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && (
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#94a3b8"
            }}>
              <p style={{ fontSize: "18px", margin: 0 }}>
                Nenhum usuário cadastrado ainda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
