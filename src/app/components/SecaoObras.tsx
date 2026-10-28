"use client";
import { useState } from "react";
import Link from "next/link";
import CabecalhoObra from './CabecalhoObra';
import { extrairAnoBase, calcularDecadas } from "../lib/tempo";

// Fatia 4 — Vitrine da Obra: dados vindos das fichas do painel (src/app/data/obra/*.json).
import vitrinePoesiaJson from "../data/obra/vitrine-poesia.json";
import vitrineProsaJson from "../data/obra/vitrine-prosa.json";
import vitrineMimoJson from "../data/obra/vitrine-mimo.json";
import coletaneasJson from "../data/obra/coletaneas.json";
import colaboracoesJson from "../data/obra/colaboracoes.json";
import ensaiosJson from "../data/obra/ensaios.json";
import cronicasJson from "../data/obra/cronicas.json";
import entrevistasJson from "../data/obra/entrevistas.json";
import traducoesJson from "../data/obra/traducoes.json";
import verbetesJson from "../data/obra/verbetes.json";
import fortunaCriticaJson from "../data/obra/fortuna-critica.json";
import leiturasCriticasJson from "../data/obra/leituras-criticas.json";
import estudosCriticosJson from "../data/obra/estudos-criticos.json";

type TabObra = "obras" | "coletaneas" | "colaboracoes" | "escritos" | "resenhas";
interface Livro { ano: number | string; titulo: string; descricao: string; tipo: string; pais?: string; slug?: string; ficha?: string; }
// Task 114: ficha = id real da pasta src/app/obra/[id]/ — corrige links "Conheça a obra"
// cujo apelido gerado do título não bate com o crachá completo da ficha (ex.: A Palavraparte).

// Task 107: ano de "Lições de Tempo" conforme capa enviada pela autora (1983, era 1982 no template).
const dadosPoesia: Livro[] = (vitrinePoesiaJson as { itens: Livro[] }).itens;

const dadosProsa: Livro[] = (vitrineProsaJson as { itens: Livro[] }).itens;

// Task 117 — Coleção Mimo: pequenas peças confeccionadas fora do catálogo
// (concursos, comemorações, celebrações com eventos únicos e tiragem limitada),
// pela editora Alpharrabio, sob as mãos de Luzia Maninha Teles Veras e
// Dalila Teles Veras. ponto(s) migrou da gaveta Poesia a pedido da autora.
const dadosMimo: Livro[] = (vitrineMimoJson as { itens: Livro[] }).itens;

const coletaneasBrasil: Livro[] = (coletaneasJson as { itens: Livro[] }).itens.filter((c) => c.pais === "Brasil");

const coletaneasPortugal: Livro[] = (coletaneasJson as { itens: Livro[] }).itens.filter((c) => c.pais === "Portugal");

const coletaneasOutros: Livro[] = (coletaneasJson as { itens: Livro[] }).itens.filter((c) => c.pais === "Outros países");

const dadosColaboracoes: Livro[] = (colaboracoesJson as { itens: Livro[] }).itens;

const dadosEnsaios: Livro[] = (ensaiosJson as { itens: Livro[] }).itens;

const dadosCronicas: Livro[] = (cronicasJson as { itens: Livro[] }).itens;

const dadosEntrevistas: Livro[] = (entrevistasJson as { itens: Livro[] }).itens;

const dadosTraducoes: Livro[] = (traducoesJson as { itens: Livro[] }).itens;

const dadosVerbetes: Livro[] = (verbetesJson as { itens: Livro[] }).itens;

const dadosFortunaCritica: Livro[] = (fortunaCriticaJson as { itens: Livro[] }).itens;

// Task 87 — Leituras Críticas (textos integrais por livro, raspados do legado)
// (resgatado do histórico do GitHub, commit d9ce5bc, após regressão dos pacotes)
const dadosLeiturasCriticas: Livro[] = (leiturasCriticasJson as { itens: Livro[] }).itens;

// Task 87 — Estudos Críticos (textos acadêmicos/literários integrais)
const dadosEstudosCriticos: Livro[] = (estudosCriticosJson as { itens: Livro[] }).itens;

export default function SecaoObras() {
  const [tabAtiva, setTabAtiva] = useState<TabObra>("obras");
  const [subTabAtiva, setSubTabAtiva] = useState<string>("poesia");

  const handleMudarTab = (novaTab: string) => {
    setTabAtiva(novaTab as TabObra);
    if (novaTab === "obras") setSubTabAtiva("poesia");
    else if (novaTab === "coletaneas") setSubTabAtiva("brasil");
    else if (novaTab === "colaboracoes") setSubTabAtiva("apresentacoes");
    else if (novaTab === "escritos") setSubTabAtiva("ensaios");
    else if (novaTab === "resenhas") setSubTabAtiva("fortuna");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const handleMudarSubTab = (novaSubTab: string) => {
    setSubTabAtiva(novaSubTab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  let obrasAtuais: Livro[] = [];
  if (tabAtiva === "obras") {
    obrasAtuais = subTabAtiva === "poesia" ? dadosPoesia : subTabAtiva === "mimo" ? dadosMimo : dadosProsa;
  } else if (tabAtiva === "coletaneas") {
    if (subTabAtiva === "brasil") obrasAtuais = coletaneasBrasil;
    else if (subTabAtiva === "portugal") obrasAtuais = coletaneasPortugal;
    else if (subTabAtiva === "outros") obrasAtuais = coletaneasOutros;
  } else if (tabAtiva === "escritos") {
    if (subTabAtiva === "ensaios") obrasAtuais = dadosEnsaios;
    else if (subTabAtiva === "cronicas") obrasAtuais = dadosCronicas;
    else if (subTabAtiva === "entrevistas") obrasAtuais = dadosEntrevistas;
    else if (subTabAtiva === "traducoes") obrasAtuais = dadosTraducoes;
  } else if (tabAtiva === "resenhas") {
    if (subTabAtiva === "fortuna") obrasAtuais = dadosFortunaCritica;
    else if (subTabAtiva === "verbetes") obrasAtuais = dadosVerbetes;
    else if (subTabAtiva === "leituras") obrasAtuais = dadosLeiturasCriticas;
    else if (subTabAtiva === "estudos") obrasAtuais = dadosEstudosCriticos;
  } else if (tabAtiva === "colaboracoes") {
    if (subTabAtiva === "apresentacoes") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Apresentação" || c.tipo === "Ensaio" || c.tipo === "Resenha");
    else if (subTabAtiva === "prefacios") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Prefácio" || c.tipo === "Orelha" || c.tipo === "Posfácio");
    else if (subTabAtiva === "adaptacoes") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Adaptação");
  }

  const decadasFixos = calcularDecadas(obrasAtuais.map(l => extrairAnoBase(l.ano)), "crescente");

  const obrasOrdenadas = [...obrasAtuais].sort((a, b) => {
    const anoA = extrairAnoBase(a.ano);
    const anoB = extrairAnoBase(b.ano);
    return anoB - anoA;
  });

  const obrasAgrupadas: { decada: number; anoVisivel: number | string; livros: Livro[] }[] = [];
  obrasOrdenadas.forEach((obra) => {
    const anoBase = extrairAnoBase(obra.ano);
    const decada = anoBase === 0 ? 0 : Math.floor(anoBase / 10) * 10;
    if (obrasAgrupadas.length === 0 || obrasAgrupadas[obrasAgrupadas.length - 1].decada !== decada) {
      obrasAgrupadas.push({ decada, anoVisivel: obra.ano, livros: [obra] });
    } else {
      obrasAgrupadas[obrasAgrupadas.length - 1].livros.push(obra);
    }
  });

  return (
    <div className="header-obra">
      <div style={{maxWidth: "850px", margin: "0 auto", position: "relative"}}>
        <CabecalhoObra 
          tabAtiva={tabAtiva} mudarTab={handleMudarTab} 
          subTabAtiva={subTabAtiva} mudarSubTab={handleMudarSubTab}
          anos={decadasFixos}
        />

        {/* Task 87 — Leituras e Estudos Críticos: lista simples (sem décadas),
            na ordem do índice do legado, com link para o texto integral */}
        {tabAtiva === "resenhas" && (subTabAtiva === "leituras" || subTabAtiva === "estudos") && obrasAtuais.length > 0 ? (
          <div className="estrada estrada-obra">
            {obrasAtuais.map((obra) => (
              <div className="trecho" key={obra.titulo}>
                <p>
                  <strong>{obra.titulo}</strong>
                  <span style={{ display: "block", fontSize: "1rem", color: "#2b2b2b", marginTop: "5px", fontFamily: "'Inter', sans-serif" }}>
                    {obra.descricao} <span className="tipo-publicacao">{obra.tipo}</span>
                  </span>
                </p>
                {obra.slug && (
                <Link
                  href={`/texto/${obra.slug}`}
                  style={{ display: 'inline-block', marginTop: '10px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '500', color: '#7a3b5a', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s ease', paddingBottom: '1px' }}
                  onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#7a3b5a'}
                  onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                >
                  Leia o texto →
                </Link>
                )}
              </div>
            ))}
          </div>
        ) : (tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "escritos" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? (
          <div className="estrada estrada-obra">
            {obrasAgrupadas.map((grupo, gIndex) => (
              <div key={grupo.decada}>
                <div 
                  id={`c-${grupo.decada}`} 
                  className="separador-genero" 
                  style={{ marginTop: gIndex === 0 ? '0' : '30px' }}
                >
                  {grupo.decada === 0 ? "Data não informada" : grupo.anoVisivel}
                </div>
                {grupo.livros.map((obra) => (
                  <div className="trecho" key={obra.titulo + obra.ano}>
                    <p>
                      <strong>{obra.titulo}</strong> 
                      <span style={{ display: "block", fontSize: "1rem", color: "#2b2b2b", marginTop: "5px", fontFamily: "'Inter', sans-serif" }}>
                        {obra.descricao} <span className="tipo-publicacao">{obra.tipo}</span>
                      </span>
                    </p>
                    {tabAtiva === "obras" && (
                      <Link 
                        href={`/obra/${obra.ficha || obra.titulo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s–—()]+/g, '-')}`}
                        style={{ display: 'inline-block', marginTop: '10px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '500', color: '#7a3b5a', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s ease', paddingBottom: '1px' }}
                        onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#7a3b5a'}
                        onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                      >
                        Conheça a obra →
                      </Link>
                    )}
                    {tabAtiva === "escritos" && obra.slug && (
                      <Link 
                        href={`/texto/${obra.slug}`}
                        style={{ display: 'inline-block', marginTop: '10px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '500', color: '#7a3b5a', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s ease', paddingBottom: '1px' }}
                        onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#7a3b5a'}
                        onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                      >
                        Leia o texto →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="estrada estrada-obra">
            <div className="trecho" style={{ marginTop: "60px", textAlign: "center" }}>
              <p style={{ fontStyle: 'italic', color: "#333", fontSize: "1.1rem" }}>📝 Conteúdo em processo de curadoria e atualização.</p>
              <p style={{ fontStyle: 'italic', color: "#333", fontSize: "0.95rem", marginTop: "10px" }}>
                {tabAtiva === "escritos" && subTabAtiva !== "cronicas" && "Em breve, mais ensaios e traduções em texto integral."}
                {tabAtiva === "resenhas" && (subTabAtiva === "leituras" || subTabAtiva === "estudos") && "Em breve, leituras e estudos críticos sobre a obra da autora."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}