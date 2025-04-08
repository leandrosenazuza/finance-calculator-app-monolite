import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [type, setType] = useState("comum");
  const [tabela, setTabela] = useState("");
  const [tabelasDisponiveis, setTabelasDisponiveis] = useState([]);
  const [mensagem, setMensagem] = useState("");

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
      alert("Preencha todos os campos.");
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
      setMensagem("Usuário criado com sucesso!");
      setNome("");
      setSenha("");
      setType("comum");
      setTabela("");
      buscarUsuarios();
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      alert("Erro ao criar usuário.");
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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
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

      <div style={{ flex: 1, padding: 40 }}>
        <h2>Gerenciar Usuários</h2>

        <div style={{ marginBottom: 30, marginTop: 20 }}>
          <input placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
          <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={inputStyle} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
            <option value="comum">Usuário Comum</option>
            <option value="admin">Administrador</option>
          </select>
          <select value={tabela} onChange={(e) => setTabela(e.target.value)} style={inputStyle}>
            <option value="">Selecione uma Tabela</option>
            {tabelasDisponiveis.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={handleCriar} style={buttonStyle}>Criar Usuário</button>
          {mensagem && <p style={{ color: "green", marginTop: 10 }}>{mensagem}</p>}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Usuário</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Tabela</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.type}</td>
                <td style={tdStyle}>{u.tabela}</td>
                <td style={tdStyle}>
                  <button onClick={() => excluirUsuario(u.id)} style={{ background: "red", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4 }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  background: "#2a5298"
};

const inputStyle = {
  marginRight: 10,
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
  marginBottom: 10
};

const buttonStyle = {
  padding: "8px 16px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer"
};

const thStyle = {
  textAlign: "left",
  padding: 8,
  borderBottom: "1px solid #ccc"
};

const tdStyle = {
  padding: 8,
  borderBottom: "1px solid #eee"
};