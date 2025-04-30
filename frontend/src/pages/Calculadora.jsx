import { useState, useEffect } from "react";
import axios from "axios";

export default function Calculadora() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [valor, setValor] = useState("");
  const [valorFormatado, setValorFormatado] = useState("0,00");
  const [tabela, setTabela] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState("visa_master");
  const [tela, setTela] = useState("calculadora");

  useEffect(() => {
    if (user?.tabela) {
      axios.get(`http://localhost:3001/tables-taxes/${user.tabela}`)
        .then(res => setTabela(res.data))
        .catch(() => alert("Erro ao carregar a tabela"));
    }

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        addDigit(e.key);
      } else if (e.key === "Backspace") {
        removeDigit();
      } else if (e.key === "Enter") {
        calcular();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [valor]);

  const formatar = (val) => {
    const num = parseFloat(val);
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const addDigit = (digit) => {
    const novoValor = valor + digit;
    setValor(novoValor);
    setValorFormatado(formatar(novoValor));
  };

  const removeDigit = () => {
    const novoValor = valor.slice(0, -1);
    setValor(novoValor);
    setValorFormatado(formatar(novoValor || "0"));
  };

  const handleClear = () => {
    setValor("");
    setValorFormatado("0,00");
    setResultado(null);
  };

  const calcular = () => {
    if (!tabela || !valor) return;

    const entrada = parseFloat(valor);  // Valor base
    const tipo = tabela[selectedTipo];

    if (!tipo) return alert("Tipo não encontrado na tabela");

    // Correção: Agora os valores de débito e crédito à vista são divididos pelo coeficiente
    const valorDebito = (entrada / tipo.debito).toFixed(2);  // Dividido pelo coeficiente
    const valorCreditoAVista = (entrada / tipo.credito_a_vista).toFixed(2);  // Dividido pelo coeficiente

    // Cálculos das parcelas
    const parcelas = Object.entries(tipo.coeficientes).map(([qtd, coef]) => ({
      qtd,
      valor: (entrada / coef / qtd).toFixed(2)  // Dividido pelo coeficiente e pela quantidade de parcelas
    }));

    setResultado({ debito: valorDebito, creditoAVista: valorCreditoAVista, parcelas });
    setTela("resultado");  // Muda para a tela de resultado após o cálculo
  };

  const voltar = () => {
    setResultado(null);
    setTela("calculadora");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #1e3c72, #2a5298)",
      color: "#fff",
      padding: "30px 15px",
      fontFamily: "Arial, sans-serif",
      fontSize: "2.75em"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10
      }}>
        <h2 style={{ margin: 0 }}>Olá, {user?.name}</h2>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} style={{
          background: "#ff4d4d",
          border: "none",
          padding: "8px 16px",
          borderRadius: 8,
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "1em"
        }}>
          Sair
        </button>
      </div>

      <div style={{
        maxWidth: "100vw",
        margin: "0 auto",
        background: "#ffffff22",
        padding: 20,
        borderRadius: 20
      }}>
        <h3 style={{ textAlign: "center", marginBottom: 15 }}>Calculadora Financeira</h3>

        {tela === "calculadora" && (
          <>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 15 }}>
              <button
                onClick={() => setSelectedTipo("visa_master")}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontWeight: "bold",
                  fontSize: "1em",
                  background: selectedTipo === "visa_master" ? "#007bff" : "#ffffff44",
                  color: "#fff",
                  border: `2px solid ${selectedTipo === "visa_master" ? "#007bff" : "#fff"}`,
                  borderRadius: 10,
                  cursor: "pointer"
                }}
              >
                Visa / Master
              </button>
              <button
                onClick={() => setSelectedTipo("elo")}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontWeight: "bold",
                  fontSize: "1em",
                  background: selectedTipo === "elo" ? "#28a745" : "#ffffff44",
                  color: "#fff",
                  border: `2px solid ${selectedTipo === "elo" ? "#28a745" : "#fff"}`,
                  borderRadius: 10,
                  cursor: "pointer"
                }}
              >
                Elo
              </button>
            </div>

            <div style={{
              fontSize: "1.4rem",
              marginBottom: 20,
              textAlign: "center",
              fontSize: "1em"
            }}>
              Valor: <strong>R$ {valorFormatado}</strong>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginBottom: 20,
          
            }}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "←"].map((char, idx) => (
                <button key={idx} onClick={() => {
                  if (char === "←") return removeDigit();
                  if (char === ",") return;
                  addDigit(char);
                }} style={{
                  padding: "12px 0",
                  fontSize: "0.75rem",
                  background: "#fff",
                  color: "#333",
                  fontWeight: "bold",
                      fontSize: "2em",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer"
                }}>
                  {char}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 15 }}>
              <button onClick={handleClear} style={{
                flex: 1,
                padding: "12px 0",
                background: "#ffa500",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                    fontSize: "1.75em"
              }}>
                Limpar
              </button>
              <button onClick={calcular} style={{
                flex: 1,
                padding: "12px 0",
                background: "#17a2b8",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                    fontSize: "1.75em"
              }}>
                Calcular
              </button>
            </div>
          </>
        )}

        {tela === "resultado" && resultado && (
          <div style={{
            animation: "fadeIn 0.5s ease-in-out"
          }}>
            <h4>Resultado</h4>
            <p><strong>Valor a receber:</strong> {Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p><strong>Débito:</strong> {Number(resultado.debito).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p><strong>Crédito à vista:</strong> {Number(resultado.creditoAVista).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <h5 style={{ marginTop: 10 }}>Parcelas:</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Quantidade</th>
      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Valor</th>
    </tr>
  </thead>
  <tbody>
    {resultado.parcelas.map((p, i) => (
      <tr key={i}>
        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.qtd}x</td>
        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
          {Number(p.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={voltar} style={{
                flex: 1,
                padding: "10px 0",
                fontSize: "2em",
                background: "#6c757d",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer"
              }}>Voltar</button>
              <button onClick={() => window.print()} style={{
                flex: 1,
                padding: "10px 0",
                background: "#28a745",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.75em"
              }}>Imprimir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
