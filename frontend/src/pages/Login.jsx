import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    localStorage.removeItem("user");

    if (!username || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    console.log("Tentando logar:", username);

    try {
      const res = await axios.post("/api/login", { username, password });
      console.log("Login bem-sucedido:", res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data); // ✅ atualiza App.jsx

      if (res.data.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/calculadora");
      }
    } catch (err) {
      console.log("Erro no login:", err);
      setError("Login inválido.");
    }
  };

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(to bottom, #1e3c72, #2a5298)",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        style={{ background: "#ffffff22", padding: 40, borderRadius: 12, textAlign: "center" }}
      >
        <h1 style={{ color: "#fff", marginBottom: 20 }}>Login</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "none", marginBottom: 10, width: 200 }}
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "none", marginBottom: 10, width: 200 }}
        /><br />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, background: "#007bff", color: "#fff", border: "none" }}>
          Entrar
        </button>
        {error && <p style={{ color: "yellow", marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
}
