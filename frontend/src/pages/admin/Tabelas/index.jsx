
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UploadTabelas() {
  const [arquivo, setArquivo] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const handleUpload = async () => {
    if (!arquivo) {
      setMensagem("Selecione um arquivo .json");
      return;
    }

    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem(res.data.message);
      setArquivo(null);
    } catch (err) {
      setMensagem("Erro ao fazer upload.");
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
        <h2>Upload de Tabelas</h2>
        <p style={{ marginBottom: 10 }}>Envie arquivos .json para a pasta <strong>tables-taxes</strong>.</p>

        <input
          type="file"
          accept=".json"
          onChange={(e) => setArquivo(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />
        <br />
        <button onClick={handleUpload} style={buttonStyle}>Enviar Tabela</button>

        {mensagem && <p style={{ marginTop: 15 }}>{mensagem}</p>}
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

const buttonStyle = {
  padding: "8px 16px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer"
};
