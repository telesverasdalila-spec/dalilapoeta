"use client";
import React, { useState, use, useMemo, useEffect } from "react";
import Link from "next/link";

// Tipos de status do catálogo
type StatusCatalogo = "disponivel" | "esgotado" | "fora_do_catalogo" | null;

interface Poema {
  titulo: string;
  texto: string;
  citacao?: string;
}

interface Parte {
  titulo: string;
  subtitulo?: string;
  poemas: Poema[];
  citacao?: string;
}

interface Epigrafe {
  texto: string;
  autor: string;
}

interface SobreVestigios {
  dedicatoria: string[];
  epigrafes: Epigrafe[];
}

interface Livro {
  titulo: string;
  subtitulo: string;
  genero: string;
  ano: number;
  capa: string;
  sobre?: string | SobreVestigios; // Pode ser texto (padrão) ou objeto estruturado (Vestígios)
  orelha?: string;
  autorOrelha?: string;
  dados: { label: string; valor: string }[];
  trechos?: { titulo: string; texto: string; origem?: string; subtitulo?: string; citacao?: string; artista?: string; obra_arte?: string; imagem_arte?: string; imagem_mes?: string }[];
  partes?: Parte[]; // Estrutura para livros com partes/poemas (ex: Vestígios)
  status_catalogo?: string;
}

// Importação dinâmica dos dados de cada livro
import dadosAJanelaDosDias from "./a-janela-dos-dias/dados.json";
import dadosAVidaCronica from "./a-vida-cronica/dados.json";
import dadosPassageira from "./passageira-antologia-pessoal-1982-2024/dados.json";
import dadosAMulherAntiga from "./a-mulher-antiga/dados.json";
import dadosAPalavraparte from "./a-palavraparte---pequenas-prosas-em-poemas/dados.json";
import dadosAnotacoesDeLeituras from "./anotacoes-de-leituras/dados.json";
import dadosApontamentos from "./apontamentos---album-de-viagens/dados.json";
import dadosAsArtesDoOficio from "./as-artes-do-oficio---um-olhar-sobre-o-abc/dados.json";
import dadosCidadeAssassinada from "./cidade-assassinada---tributo-a-celso-daniel/dados.json";
import dadosElementoFuria from "./elemento-furia/dados.json";
import dadosEstranasFormasDeVida from "./estranhas-formas-de-vida/dados.json";
import dadosForasteiros from "./forasteiros---registros-nordestinos/dados.json";
import dadosIara from "./iara/dados.json";
import dadosInsulas from "./insulas/dados.json";
import dadosInventarioPrecoce from "./inventario-precoce/dados.json";
import dadosLicoesDeTempo from "./licoes-de-tempo/dados.json";
import dadosMadeira from "./madeira---do-vinho-a-saudade/dados.json";
import dadosMeiaVidaInteira from "./meia-vida-inteira/dados.json";
import dadosOpcoesParaMorrerNoEspaco from "./opcoes-para-morrer-no-espaco/dados.json";
import dadosPecados from "./pecados/dados.json";
import dadosPoesiaDoIntervalo from "./poesia-do-intervalo/dados.json";
import dadosPoeticasDasCircunstancias from "./poeticas-das-circunstancias/dados.json";
import dadosRetratosFalhados from "./retratos-falhados/dados.json";
import dadosSe from "./se/dados.json";
import dadosSolidoesDaMemoria from "./solidoes-da-memoria/dados.json";
import dadosSoliloquios from "./soliloquios/dados.json";
import dadosSonhoDeHaPouco from "./sonho-de-ha-pouco/dados.json";
import dadosTempoEmFuria from "./tempo-em-furia/dados.json";
import dadosCaixaPoeticas from "./caixa-poeticas/dados.json";
import dadosMarielleDalila from "./marielle-dalila/dados.json";
import dadosVestigios from "./vestigios/dados.json";
import dados70Anos from "./70-anos-poemas-leitores/dados.json";
import dadosPontos from "./pontos/dados.json";
import dadosFugaEUrgencias from "./fuga-e-urgencias/dados.json";
import dadosDiuturnos from "./diuturnos/dados.json";
import dadosAlpharrabio12Anos from "./alpharrabio-12-anos/dados.json";
import dadosMinudencias from "./minudencias/dados.json";

// Agregador central - reúne todos os livros num único objeto
const livros: Record<string, Livro> = {
  "a-janela-dos-dias": dadosAJanelaDosDias,
  "a-vida-cronica": dadosAVidaCronica,
  "passageira-antologia-pessoal-1982-2024": dadosPassageira,
  "a-mulher-antiga": dadosAMulherAntiga,
  "a-palavraparte---pequenas-prosas-em-poemas": dadosAPalavraparte,
  "anotacoes-de-leituras": dadosAnotacoesDeLeituras,
  "apontamentos---album-de-viagens": dadosApontamentos,
  "as-artes-do-oficio---um-olhar-sobre-o-abc": dadosAsArtesDoOficio,
  "cidade-assassinada---tributo-a-celso-daniel": dadosCidadeAssassinada,
  "elemento-furia": dadosElementoFuria,
  "estranhas-formas-de-vida": dadosEstranasFormasDeVida,
  "forasteiros---registros-nordestinos": dadosForasteiros,
  "iara": dadosIara,
  "insulas": dadosInsulas,
  "inventario-precoce": dadosInventarioPrecoce,
  "licoes-de-tempo": dadosLicoesDeTempo,
  "madeira---do-vinho-a-saudade": dadosMadeira,
  "meia-vida-inteira": dadosMeiaVidaInteira,
  "opcoes-para-morrer-no-espaco": dadosOpcoesParaMorrerNoEspaco,
  "pecados": dadosPecados,
  "poesia-do-intervalo": dadosPoesiaDoIntervalo,
  "poeticas-das-circunstancias": dadosPoeticasDasCircunstancias,
  "retratos-falhados": dadosRetratosFalhados,
  "se": dadosSe,
  "solidoes-da-memoria": dadosSolidoesDaMemoria,
  "soliloquios": dadosSoliloquios,
  "sonho-de-ha-pouco": dadosSonhoDeHaPouco,
  "tempo-em-furia": dadosTempoEmFuria,
  "caixa-poeticas": dadosCaixaPoeticas,
  "marielle-dalila": dadosMarielleDalila,
  "vestigios": dadosVestigios,
  "70-anos-poemas-leitores": dados70Anos,
  "pontos": dadosPontos,
  "fuga-e-urgencias": dadosFugaEUrgencias,
  "diuturnos": dadosDiuturnos,
  "alpharrabio-12-anos": dadosAlpharrabio12Anos,
  "minudencias": dadosMinudencias
};

// Fluxo contínuo dos meses do Diuturnos — pedido da usuária: em vez de abas
// de mês, os 12 meses na mesma página, com título do mês em dourado, linha
// fina dourada separando os meses e as imagens alternando esquerda/direita
// (movimento menos esquemático e mais poético no texto).
function DiuturnosFluxo({ trechos }: { trechos: { titulo: string; texto: string; imagem_mes?: string }[] }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {trechos.map((t, i) => {
        const imagemADireita = i % 2 === 1;
        return (
          <div key={i}>
            {/* Título do Mês — dourado (mesmo dourado de Pecados e do diário das crônicas) */}
            <h2 style={{
              fontFamily: "Georgia",
              fontSize: "2rem",
              fontWeight: "400",
              letterSpacing: "5px",
              color: "#8b6914",
              margin: "0 0 25px 0",
              textTransform: "uppercase",
              textAlign: "center"
            }}>
              {t.titulo}
            </h2>

            {/* Mês: imagem alterna ESQUERDA (mês ímpar) / DIREITA (mês par) */}
            <div style={{
              display: "flex",
              gap: "35px",
              alignItems: "flex-start",
              flexDirection: imagemADireita ? "row-reverse" : "row",
              flexWrap: "wrap"
            }}>
              {/* Imagem do Mês */}
              <div style={{ flex: "0 0 280px" }}>
                <div style={{
                  backgroundColor: "#faf8f3",
                  padding: "20px",
                  border: "1px solid #e8e0d0"
                }}>
                  <img
                    src={t.imagem_mes}
                    alt={t.titulo}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "350px",
                      display: "block"
                    }}
                  />
                </div>
              </div>

              {/* Poema do Mês */}
              <div style={{ flex: "1", minWidth: "280px" }}>
                <p style={{
                  fontSize: "1.05rem",
                  lineHeight: "1.85",
                  fontFamily: "Georgia",
                  color: "#333",
                  margin: "0",
                  textAlign: "left"
                }}>
                  {t.texto.split(/(\*\*[^*]+\*\*)/g).map((parte, j) => {
                    if (parte.startsWith("**") && parte.endsWith("**")) {
                      return (
                        <span key={j} style={{ fontWeight: "700", color: "#1a1a1a" }}>
                          {parte.slice(2, -2)}
                        </span>
                      );
                    }
                    return parte;
                  })}
                </p>
              </div>
            </div>

            {/* Linha fina dourada separando os meses (não depois do último) */}
            {i < trechos.length - 1 && (
              <div style={{
                marginTop: "45px",
                marginBottom: "45px",
                height: "1px",
                background: "linear-gradient(to right, transparent, #d4af37, transparent)"
              }}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ConteudoObra({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [abaAtiva, setAbaAtiva] = useState<string>("");
  const [trechoAtivo, setTrechoAtivo] = useState(0);
  // Estado para livros com estrutura de partes/poemas (ex: Vestígios)
  const [parteAtiva, setParteAtiva] = useState(0);

  const livro = livros[id];

  // ============================================================
  // LÓGICA CONDICIONAL DAS TABS
  // ============================================================
  
  // Calcula quais tabs devem ser exibidas baseado no conteúdo disponível
  const tabsDisponiveis = useMemo(() => {
    const tabs: { id: string; label: string }[] = [];

    // Tab "Sobre" - só se tiver texto sobre OU orelha
    if (livro?.sobre || livro?.orelha) {
      tabs.push({ id: "sobre", label: "Sobre" });
    }

    // Tab "Trechos" - só se tiver array de trechos com pelo menos 1 item
    if (livro?.trechos && livro.trechos.length > 0) {
      tabs.push({ id: "trechos", label: "Trechos" });
    }

    // Tab "Poemas" - para livros com estrutura de partes/poemas (ex: Vestígios)
    if (livro?.partes && livro.partes.length > 0) {
      tabs.push({ id: "poemas", label: "Poemas" });
    }

    // Tab "Dados da Edição" - SEMPRE presente (obrigatório)
    tabs.push({ id: "dados", label: "Dados da Edição" });

    // Tab "Adquira" - SOMENTE se status_catalogo for "disponivel"
    if (livro?.status_catalogo === "disponivel") {
      tabs.push({ id: "adquira", label: "Adquira" });
    }

    return tabs;
  }, [livro]);

  // Dados da edição com status automático (se aplicável)
  const dadosComStatus = useMemo(() => {
    if (!livro?.dados) return [];

    const dados = [...livro.dados];

    // Se tem status e NÃO é "disponivel", adiciona informação nos dados
    if (livro.status_catalogo && livro.status_catalogo !== "disponivel") {
      const statusTexto = livro.status_catalogo === "esgotado" 
        ? "Esgotada" 
        : "Fora do Catálogo";
      
      dados.push({ label: "Edição", valor: statusTexto });
    }

    return dados;
  }, [livro]);

  // Define a aba inicial como a primeira disponível
  useEffect(() => {
    if (tabsDisponiveis.length > 0 && !abaAtiva) {
      setAbaAtiva(tabsDisponiveis[0].id);
    }
  }, [tabsDisponiveis, abaAtiva]);

  if (livro) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
        
        <div style={{ 
          width: "100%", 
          height: "80px", 
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat", 
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Obras</p>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px 60px", fontFamily: "Georgia", color: "#333" }}>
          
          <Link href="/?eixo=obra" style={{ fontSize: "0.9rem", color: "#7a3b5a", textDecoration: "none", fontWeight: "500", display: "inline-block", marginBottom: "25px" }}>
            ← Voltar para Obras Publicadas
          </Link>

          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            <div style={{ flex: "0 0 375px", maxWidth: "100%" }}>
              <div style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.15)", backgroundColor: "#f5f5f5" }}>
                <img 
                  src={livro.capa} 
                  alt={`Capa do livro ${livro.titulo}`} 
                  style={{ width: "100%", height: "auto", aspectRatio: "2/3", objectFit: "cover", display: "block" }} 
                />
              </div>
            </div>

            <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
              
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2.2rem", lineHeight: "1.1", margin: "0 0 10px 0", color: "#1a1a1a", fontStyle: "italic" }}>
                  {livro.titulo}
                </h1>
                {livro.subtitulo && (
                  <p style={{ fontSize: "1rem", color: "#666", marginBottom: "30px" }}>{livro.subtitulo}</p>
                )}
              </div>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "2px", color: "#999", textTransform: "uppercase", marginBottom: "30px" }}>{livro.genero}</p>

              {/* TABS DINÂMICAS - só renderiza as disponíveis */}
              {tabsDisponiveis.length > 1 && (
                <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e0e0e0", marginBottom: "0px", overflowX: "auto", scrollbarWidth: "none" }}>
                  {tabsDisponiveis.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => { setAbaAtiva(tab.id); setTrechoAtivo(0); }}
                      style={{ 
                        background: "none", border: "none", fontFamily: "'Inter', sans-serif", 
                        fontSize: "0.8rem", fontWeight: "500", 
                        color: abaAtiva === tab.id ? "#7a3b5a" : "#999", 
                        padding: "10px 15px", cursor: "pointer", 
                        borderBottom: abaAtiva === tab.id ? "2px solid #7a3b5a" : "2px solid transparent", 
                        whiteSpace: "nowrap"
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "40px", borderTop: tabsDisponiveis.length > 1 ? "1px solid #e0e0e0" : "none", paddingTop: "30px" }}>
                
                {/* TAB SOBRE - condicional */}
                {abaAtiva === "sobre" && (livro.sobre || livro.orelha) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {/* Citação especial para o livro Pecados */}
                    {id === "pecados" && (
                      <div style={{ 
                        marginBottom: "25px"
                      }}>
                        <p style={{ 
                          fontSize: "0.95rem", 
                          lineHeight: "1.6", 
                          fontFamily: "Georgia",
                          fontStyle: "italic", 
                          color: "#8b6914",
                          margin: "0",
                          textAlign: "left",
                          borderLeft: "1px solid #d4af37",
                          paddingLeft: "15px",
                          maxWidth: "500px"
                        }}>
                          "o único modo de evitar um pecado é cometê-lo e livrar-se dele"
                          <br />
                          <span style={{ fontSize: "0.85rem", color: "#a07d18" }}>
                            (máxima atribuída aos gnósticos)
                          </span>
                        </p>
                      </div>
                    )}
                    
                    {/* Formato ESCADA DOURADA para Vestígios - Dedicatória + Epígrafes (layout como código Kimi) */}
                    {id === "vestigios" && livro.sobre && typeof livro.sobre !== 'string' && (
                      <div className="sobre-container">
                        {/* Dedicatória alinhada à direita */}
                        <div className="dedication">
                          {(livro.sobre as SobreVestigios).dedicatoria[0]}<br />
                          {(livro.sobre as SobreVestigios).dedicatoria[1]}
                        </div>

                        {/* Escada de citações: diagonal descendente esquerda → direita */}
                        <div className="staircase">
                          {(livro.sobre as SobreVestigios).epigrafes.map((ep, i) => (
                            <div key={i} className="quote-block" style={{
                              marginLeft: i === 0 ? '0' : i === 1 ? '18%' : i === 2 ? '38%' : 'auto',
                              '--i': i
                            } as React.CSSProperties}>
                              <div className="quote-body">
                                {ep.texto.split('\n').map((linha, j) => (
                                  <React.Fragment key={j}>
                                    {linha}
                                    {j < ep.texto.split('\n').length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </div>
                              <div className="quote-author">— {ep.autor}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formato PADRÃO para livros com sobre estruturado (dedicatoria + epígrafes) - ex: Solilóquios */}
                    {id !== "vestigios" && livro.sobre && typeof livro.sobre !== 'string' && (
                      <div className="sobre-container" style={{ padding: '30px 0' }}>
                        {/* Dedicatória */}
                        {(livro.sobre as SobreVestigios).dedicatoria && (
                          <div style={{ 
                            textAlign: 'right', 
                            fontStyle: 'italic', 
                            fontSize: '1.1rem', 
                            color: '#555',
                            marginBottom: '25px',
                            fontFamily: "'Georgia', serif"
                          }}>
                            {(livro.sobre as SobreVestigios).dedicatoria.map((linha, i) => (
                              <React.Fragment key={i}>
                                {linha}{i < (livro.sobre as SobreVestigios).dedicatoria.length - 1 ? <br /> : null}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                        {/* Epígrafe(s) */}
                        {(livro.sobre as SobreVestigios).epigrafes && (livro.sobre as SobreVestigios).epigrafes.map((ep, i) => (
                          <div key={i} style={{ 
                            borderLeft: '3px solid #d4af37', 
                            paddingLeft: '20px', 
                            marginBottom: i < (livro.sobre as SobreVestigios).epigrafes.length - 1 ? '20px' : '0',
                            fontStyle: 'italic'
                          }}>
                            <p style={{ 
                              fontSize: '1.05rem', 
                              lineHeight: '1.8', 
                              color: '#444',
                              margin: 0,
                              fontFamily: "'Georgia', serif"
                            }}>
                              {ep.texto.split('\n').map((linha, j) => (
                                <React.Fragment key={j}>
                                  {linha}{j < ep.texto.split('\n').length - 1 ? <br /> : null}
                                </React.Fragment>
                              ))}
                            </p>
                            <p style={{ 
                              textAlign: 'right', 
                              fontSize: '0.9rem', 
                              color: '#888',
                              marginTop: '8px',
                              margin: '8px 0 0 0'
                            }}>
                              — {ep.autor}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sobre padrão para outros livros (texto simples) */}
                    {id !== "vestigios" && livro.sobre && typeof livro.sobre === 'string' && (
                      <p style={{ fontSize: "1.2rem", lineHeight: "1.8", textAlign: "justify", whiteSpace: "pre-wrap" }}>{livro.sobre}</p>
                    )}
                    {livro.orelha && (
                      <div style={{ fontSize: "1.2rem", lineHeight: "1.8", textAlign: "justify", fontStyle: "italic", color: "#555", borderLeft: "3px solid #7a3b5a", paddingLeft: "20px" }}>
                        <p style={{ marginBottom: "10px", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#7a3b5a", fontWeight: "600", textTransform: "uppercase" }}>
                          Orelha {livro.autorOrelha ? `— ${livro.autorOrelha}` : ""}
                        </p>
                        {livro.orelha}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB TRECHOS - condicional */}
                {abaAtiva === "trechos" && livro.trechos && livro.trechos.length > 0 && (
                  livro.trechos.some((t) => t.imagem_mes) ? (
                    /* Livro de meses (Diuturnos): os 12 meses na MESMA página,
                       sem abas de mês — fluxo contínuo, títulos dourados, linha
                       fina entre os meses e imagens alternando esquerda/direita */
                    <DiuturnosFluxo trechos={livro.trechos} />
                  ) : (
                  <div>
                    <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #ebebeb", marginBottom: "25px", overflowX: "auto", scrollbarWidth: "none" }}>
                      {livro.trechos.map((t, i: number) => (
                        <button 
                          key={i}
                          onClick={() => setTrechoAtivo(i)}
                          style={{ 
                            background: "none", border: "none", fontFamily: "'Inter', sans-serif", 
                            fontSize: "0.8rem", fontWeight: "500", 
                            color: trechoAtivo === i ? "#7a3b5a" : "#ccc", 
                            padding: "8px 12px", cursor: "pointer", 
                            borderBottom: trechoAtivo === i ? "2px solid #7a3b5a" : "2px solid transparent", 
                            whiteSpace: "nowrap"
                          }}
                        >
                          {t.titulo}
                        </button>
                      ))}
                    </div>
                    
                    {/* Indicação de origem (para antologias como A Janela dos Dias) */}
                    {livro.trechos[trechoAtivo].origem && (
                      <div style={{ 
                        backgroundColor: "#f8f4f0", 
                        borderLeft: "3px solid #d4af37", 
                        padding: "10px 15px", 
                        marginBottom: "20px",
                        borderRadius: "0 4px 4px 0"
                      }}>
                        <span style={{ 
                          fontFamily: "'Inter', sans-serif", 
                          fontSize: "0.75rem", 
                          color: "#7a3b5a", 
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "1px"
                        }}>
                          📖 Retirado do livro:
                        </span>
                        <span style={{ 
                          fontFamily: "Georgia", 
                          fontSize: "1rem", 
                          color: "#333",
                          fontStyle: "italic",
                          marginLeft: "8px"
                        }}>
                          {livro.trechos[trechoAtivo].origem}
                        </span>
                      </div>
                    )}
                    
                    {/* === LAYOUTS DOS TRECHOS === */}
                    

                    {/* Layout Pecados - Estilo página de livro refinado */}
                    {livro.trechos[trechoAtivo].artista && !livro.trechos[trechoAtivo].imagem_mes && (
                      <div style={{ 
                        maxWidth: "700px", 
                        margin: "0 auto",
                        textAlign: "center"
                      }}>
                        {/* Título do Pecado */}
                        <h2 style={{ 
                          fontFamily: "Georgia", 
                          fontSize: "2rem", 
                          fontWeight: "400",
                          letterSpacing: "5px",
                          color: "#1a1a1a",
                          margin: "0 0 8px 0",
                          textTransform: "uppercase"
                        }}>
                          {livro.trechos[trechoAtivo].titulo}
                        </h2>
                        
                        {/* Subtítulo - estilo dourado elegante */}
                        {livro.trechos[trechoAtivo].subtitulo && (
                          <p style={{ 
                            fontFamily: "Georgia", 
                            fontSize: "1.25rem", 
                            fontWeight: "600",
                            fontStyle: "italic",
                            color: "#8b6914",
                            margin: "0 0 25px 0",
                            letterSpacing: "1px"
                          }}>
                            {livro.trechos[trechoAtivo].subtitulo}
                          </p>
                        )}
                        
                        {/* Moldura da Imagem - Fundo dourado suave */}
                        <div style={{ 
                          backgroundColor: "#faf8f3",
                          padding: "35px 25px",
                          border: "1px solid #e8e0d0",
                          marginBottom: "25px"
                        }}>
                          {/* Imagem do Artista */}
                          {livro.trechos[trechoAtivo].imagem_arte && (
                            <img
                              src={livro.trechos[trechoAtivo].imagem_arte}
                              alt={`Desenho de ${livro.trechos[trechoAtivo].artista}`}
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                maxHeight: "320px",
                                display: "block",
                                margin: "0 auto 15px auto"
                              }}
                            />
                          )}
                          
                          {/* Crédito do Artista - dentro do quadro */}
                          <p style={{ 
                            fontFamily: "Georgia", 
                            fontSize: "0.9rem", 
                            fontStyle: "italic",
                            color: "#666",
                            margin: "10px 0 0 0"
                          }}>
                            desenho de {livro.trechos[trechoAtivo].artista}
                          </p>
                        </div>
                        
                        {/* Área do Poema + Citação - Layout em duas colunas */}
                        <div style={{ display: "flex", gap: "35px", alignItems: "flex-start" }}>
                          {/* Coluna da Citação - Esquerda (dourada) */}
                          {livro.trechos[trechoAtivo].citacao && (
                            <div style={{ 
                              flex: "0 0 220px",
                              paddingTop: "5px"
                            }}>
                              <p style={{ 
                                fontSize: "0.9rem", 
                                lineHeight: "1.6", 
                                fontFamily: "Georgia",
                                fontStyle: "italic", 
                                color: "#8b6914",
                                margin: "0",
                                textAlign: "left",
                                borderLeft: "1px solid #d4af37",
                                paddingLeft: "15px"
                              }}>
                                {livro.trechos[trechoAtivo].citacao}
                              </p>
                            </div>
                          )}
                          
                          {/* Coluna do Poema - Direita */}
                          <div style={{ flex: "1" }}>
                            <p style={{ 
                              fontSize: "1.05rem", 
                              lineHeight: "1.85", 
                              fontFamily: "Georgia",
                              fontStyle: "italic", 
                              whiteSpace: "pre-wrap", 
                              color: "#333",
                              margin: "0",
                              textAlign: "left"
                            }}>
                              {livro.trechos[trechoAtivo].texto}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Layout Padrão - centralizado com suporte a citações */}
                    {!livro.trechos[trechoAtivo].imagem_mes && !livro.trechos[trechoAtivo].artista && (
                      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
                        {/* TÍTULO DO POEMA - com ênfase visual */}
                        <h3 style={{ 
                          fontFamily: "Georgia", 
                          fontSize: "2rem", 
                          fontWeight: "400",
                          letterSpacing: "4px",
                          color: "#1a1a1a",
                          margin: "0 0 20px 0", 
                          textTransform: "uppercase",
                          textAlign: "center"
                        }}>
                          {livro.trechos[trechoAtivo].titulo}
                        </h3>
                        
                        {/* CITAÇÃO/EPÍGRAFE - se existir, centralizada em dourado */}
                        {livro.trechos[trechoAtivo].citacao && (
                          <div style={{ marginBottom: "25px" }}>
                            <p style={{ 
                              fontSize: "0.95rem", 
                              lineHeight: "1.6", 
                              fontFamily: "Georgia",
                              fontStyle: "italic", 
                              color: "#8b6914",
                              margin: "0",
                              textAlign: "center",
                              borderLeft: "1px solid #d4af37",
                              borderRight: "1px solid #d4af37",
                              paddingLeft: "20px",
                              paddingRight: "20px",
                              display: "inline-block",
                              width: "100%"
                            }}>
                              {livro.trechos[trechoAtivo].citacao}
                            </p>
                          </div>
                        )}
                        
                        {/* POEMA - centralizado */}
                        <p style={{ 
                          fontSize: "1.1rem", 
                          lineHeight: "1.9", 
                          fontFamily: "Georgia",
                          fontStyle: "italic", 
                          whiteSpace: "pre-wrap", 
                          color: "#333",
                          margin: "0",
                          textAlign: "left"
                        }}>
                          {livro.trechos[trechoAtivo].texto}
                        </p>
                      </div>
                    )}
                  </div>
                  )
                )}

                {/* ============================================================ */}
                {/* TAB POEMAS - Para livros com estrutura de partes/poemas */}
                {/* ESTRUTURA IGUAL AO SITE ORIGINAL/LEGADO                   */}
                {/* ============================================================ */}
                {abaAtiva === "poemas" && livro.partes && livro.partes.length > 0 && (
                  <div>
                    {/* === MAIN TABS: AS PARTES DO LIVRO === */}
                    <div style={{ 
                      display: "flex", 
                      gap: "0", 
                      borderBottom: "2px solid #d4af37", 
                      marginBottom: "30px", 
                      overflowX: "auto",
                      scrollbarWidth: "none"
                    }}>
                      {livro.partes.map((parte, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setParteAtiva(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            fontFamily: "Georgia",
                            fontSize: "1rem",
                            fontWeight: parteAtiva === idx ? "700" : "400",
                            fontStyle: "italic",
                            color: parteAtiva === idx ? "#1a1a1a" : "#8b6914",
                            padding: "12px 20px",
                            cursor: "pointer",
                            borderBottom: parteAtiva === idx ? "3px solid #1a1a1a" : "3px solid transparent",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                            letterSpacing: "1px"
                          }}
                        >
                          {parte.titulo}
                        </button>
                      ))}
                    </div>

                    {/* === CONTEÚDO DA PARTE ATIVA === */}
                    <div style={{ 
                      maxWidth: "700px", 
                      margin: "0 auto"
                    }}>
                      {/* SUBTÍTULO DA PARTE ATIVA */}
                      {livro.partes[parteAtiva].subtitulo && (
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#999",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          marginBottom: "20px",
                          textAlign: "center"
                        }}>
                          {livro.partes[parteAtiva].subtitulo}
                        </p>
                      )}

                      {/* CITAÇÃO/EPÍGRAFE DA PARTE (se existir no JSON) - sem moldura */}
                      {livro.partes[parteAtiva].citacao && (
                        <div style={{ 
                          marginBottom: "35px",
                          marginTop: "15px",
                          textAlign: "center"
                        }}>
                          <p style={{ 
                            fontSize: "0.95rem", 
                            lineHeight: "1.4", 
                            fontFamily: "Georgia",
                            fontStyle: "italic", 
                            color: "#8b6914",
                            margin: "0 auto",
                            maxWidth: "550px",
                            whiteSpace: "pre-wrap"
                          }}>
                            {livro.partes[parteAtiva].citacao}
                          </p>
                        </div>
                      )}

                      {/* === LISTA DE POEMAS DA PARTE (sem subtabs, igual ao original) === */}
                      {livro.partes[parteAtiva].poemas.map((poema, poemaIdx: number) => (
                        <div key={poemaIdx} style={{ marginBottom: "50px" }}>
                          
                          {/* Layout com citação do poema à direita (se existir) */}
                          {poema.citacao ? (
                            <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
                              {/* Coluna do Poema - Esquerda (principal) */}
                              <div style={{ flex: "1" }}>
                                <p style={{ 
                                  fontSize: "1.05rem", 
                                  lineHeight: "1.9", 
                                  fontFamily: "Georgia",
                                  color: "#333",
                                  margin: "0",
                                  textAlign: "left",
                                  whiteSpace: "pre-wrap"
                                }}>
                                  {poema.texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => {
                                    if (parte.startsWith('**') && parte.endsWith('**')) {
                                      return (
                                        <span key={i} style={{ fontWeight: "700", color: "#1a1a1a" }}>
                                          {parte.slice(2, -2)}
                                        </span>
                                      );
                                    }
                                    return parte;
                                  })}
                                </p>
                              </div>
                              
                              {/* Coluna da Citação - Direita (como no site original) */}
                              <div style={{ 
                                flex: "0 0 200px",
                                paddingTop: "5px"
                              }}>
                                <p style={{ 
                                  fontSize: "0.8rem", 
                                  lineHeight: "1.5", 
                                  fontFamily: "Georgia",
                                  fontStyle: "italic", 
                                  color: "#8b6914",
                                  margin: "0",
                                  textAlign: "left"
                                }}>
                                  {poema.citacao}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Poema sem citação - largura total */
                            <p style={{ 
                              fontSize: "1.05rem", 
                              lineHeight: "1.9", 
                              fontFamily: "Georgia",
                              color: "#333",
                              margin: "0",
                              textAlign: "left",
                              whiteSpace: "pre-wrap"
                            }}>
                              {poema.texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => {
                                if (parte.startsWith('**') && parte.endsWith('**')) {
                                  return (
                                    <span key={i} style={{ fontWeight: "700", color: "#1a1a1a" }}>
                                      {parte.slice(2, -2)}
                                    </span>
                                  );
                                }
                                return parte;
                              })}
                            </p>
                          )}

                          {/* Separador entre poemas (só se não for o último) */}
                          {poemaIdx < (livro.partes?.[parteAtiva]?.poemas?.length ?? 0) - 1 && (
                            <div style={{ 
                              marginTop: "45px", 
                              height: "1px", 
                              background: "linear-gradient(to right, transparent, #e8e0d0, transparent)" 
                            }}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB DADOS - SEMPRE presente */}
                {abaAtiva === "dados" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    {dadosComStatus.map((d, i: number) => (
                      <div key={i} style={{ 
                        backgroundColor: "#fdfcf8", 
                        padding: "15px", 
                        border: "1px solid #ebebeb"
                      }}>
                        <span style={{ 
                          fontFamily: "'Inter', sans-serif", 
                          fontSize: "0.75rem", 
                          fontWeight: "600", 
                          color: "#999", 
                          textTransform: "uppercase", 
                          display: "block", 
                          marginBottom: "5px" 
                        }}>{d.label}</span>
                        <span style={{ 
                          fontSize: "1rem", 
                          color: "#333"
                        }}>{d.valor}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB ADQUIRA - SOMENTE se disponível */}
                {abaAtiva === "adquira" && livro.status_catalogo === "disponivel" && (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>Para adquirir seu exemplar, visite a nossa loja virtual:</p>
                    <a 
                      href="https://www.alpharrabio.com.br" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ backgroundColor: "#1a1a1a", color: "white", padding: "15px 30px", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", letterSpacing: "1px", borderRadius: "4px" }}
                    >
                      IR PARA A LOJA ALPHARRABIO
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
      <div style={{ 
        width: "100%", 
        height: "120px", 
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat", 
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Obras</p>
      </div>
      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "100px 20px", textAlign: "center", fontFamily: "Georgia, serif" }}>
        <Link href="/?eixo=obra" style={{ fontSize: "1rem", color: "#d4af37", textDecoration: "none", marginBottom: "40px", display: "inline-block" }}>← Voltar para Obras Publicadas</Link>
        <h1 style={{ fontSize: "2rem", color: "#999", marginBottom: "20px" }}>Página em construção</h1>
        <p style={{ fontSize: "1.1rem", color: "#bbb" }}>Estamos preparando a ficha técnica completa desta obra com muito carinho. Em breve ela estará disponível por aqui.</p>
      </div>
    </div>
  );
}
