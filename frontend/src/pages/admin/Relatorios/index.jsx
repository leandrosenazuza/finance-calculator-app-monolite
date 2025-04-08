
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Relatorios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTabela, setFiltroTabela] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    const res = await axios.get("/api/users");
    setUsuarios(res.data);
  };

  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filtrarUsuarios());
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio_usuarios.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Usuários", 14, 16);
    const tableData = filtrarUsuarios().map(u => [u.name, u.username, u.type, u.tabela]);
    doc.autoTable({
      head: [["Nome", "Usuário", "Tipo", "Tabela"]],
      body: tableData,
      startY: 20
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

  const tabelasUnicas = [...new Set(usuarios.map(u => u.tabela))];

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
        <h2>Relatórios</h2>

        <div style={{ margin: "20px 0", display: "flex", gap: 20 }}>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={inputStyle}>
            <option value="">Todos os Tipos</option>
            <option value="admin">Administrador</option>
            <option value="comum">Usuário Comum</option>
          </select>

          <select value={filtroTabela} onChange={(e) => setFiltroTabela(e.target.value)} style={inputStyle}>
            <option value="">Todas as Tabelas</option>
            {tabelasUnicas.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

          <button onClick={exportarExcel} style={buttonStyle}>📊 Exportar Excel</button>
          <button onClick={exportarPDF} style={{ ...buttonStyle, background: "#28a745" }}>📄 Exportar PDF</button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Usuário</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Tabela</th>
            </tr>
          </thead>
          <tbody>
            {filtrarUsuarios().map((u, i) => (
              <tr key={i}>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.type}</td>
                <td style={tdStyle}>{u.tabela}</td>
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
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc"
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
