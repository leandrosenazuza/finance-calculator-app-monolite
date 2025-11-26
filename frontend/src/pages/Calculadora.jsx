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
      width: "100%",
      height: "100vh",
      background: "linear-gradient(to bottom, #1e3c72, #2a5298)",
      color: "#fff",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10,
        flexShrink: 0
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
          marginRight: "20px"
        }}>
          Sair
        </button>
      </div>

      <div style={{
        flex: 1,
        maxWidth: tela === "resultado" ? "95%" : 500,
        width: "100%",
        margin: "0 auto",
        background: "#ffffff22",
        padding: tela === "resultado" ? "20px" : 25,
        borderRadius: 20,
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 0
      }}>
        <h3 style={{ textAlign: "center", marginBottom: 15, flexShrink: 0 }}>Calculadora Financeira</h3>

        {tela === "calculadora" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            minHeight: 0
          }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 15 }}>
              <button
                onClick={() => setSelectedTipo("visa_master")}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontWeight: "bold",
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
              textAlign: "center"
            }}>
              Valor: <strong>R$ {valorFormatado}</strong>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginBottom: 20
            }}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "←"].map((char, idx) => (
                <button key={idx} onClick={() => {
                  if (char === "←") return removeDigit();
                  if (char === ",") return;
                  addDigit(char);
                }} style={{
                  padding: "12px 0",
                  fontSize: "1.2rem",
                  background: "#fff",
                  color: "#333",
                  fontWeight: "bold",
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
                cursor: "pointer"
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
                cursor: "pointer"
              }}>
                Calcular
              </button>
            </div>
          </div>
        )}

        {tela === "resultado" && resultado && (
          <div style={{
            animation: "fadeIn 0.5s ease-in-out",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden"
          }}>
            <h3 style={{ 
              textAlign: "center", 
              marginBottom: 25,
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}>
              Resultado do Cálculo
            </h3>

            {/* Valor Principal */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "20px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "8px" }}>
                Valor a receber
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>

            {/* Cards de Débito e Crédito */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "25px"
            }}>
              <div style={{
                background: "rgba(255,255,255,0.15)",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "6px" }}>
                  Débito
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#4ade80" }}>
                  {Number(resultado.debito).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.15)",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "6px" }}>
                  Crédito à vista
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#60a5fa" }}>
                  {Number(resultado.creditoAVista).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            </div>

            {/* Título das Parcelas */}
            <div style={{
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: "2px solid rgba(255,255,255,0.3)"
            }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: "1.2rem",
                fontWeight: "600"
              }}>
                Opções de Parcelamento
              </h4>
            </div>

            {/* Grid de Parcelas */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "10px",
              flex: 1,
              overflowY: "auto",
              padding: "5px 8px",
              marginBottom: "20px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) rgba(255,255,255,0.1)",
              minHeight: 0
            }}>
              {resultado.parcelas.map((p, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "14px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.2s ease",
                  cursor: "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "70px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  <div style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#fbbf24",
                    marginBottom: "6px",
                    opacity: 0.9
                  }}>
                    {p.qtd} parcelas
                  </div>
                  <div style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}>
                    {Number(p.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de Ação */}
            <div style={{ display: "flex", gap: 10, marginTop: "auto", flexShrink: 0 }}>
              <button onClick={voltar} style={{
                flex: 1,
                padding: "12px 0",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "1rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              >
                Voltar
              </button>
              <button onClick={() => window.print()} style={{
                flex: 1,
                padding: "12px 0",
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "#fff",
                borderRadius: "10px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(40,167,69,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(40,167,69,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(40,167,69,0.3)";
              }}
              >
                Imprimir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
