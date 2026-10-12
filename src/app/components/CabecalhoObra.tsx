"use client";
import ReguaTempo from "./ReguaTempo";

interface CabecalhoObraProps {
  tabAtiva: string;
  mudarTab: (tab: string) => void;
  subTabAtiva: string;
  mudarSubTab: (subTab: string) => void;
  anos: string[];
}

export default function CabecalhoObra({ tabAtiva, mudarTab, subTabAtiva, mudarSubTab, anos }: CabecalhoObraProps) {
  let titulo = "Obras Publicadas";
  let subtitulo = "Relação das obras da autora, desde a primeira publicação";
  let subtabs = [{ id: "poesia", label: "Poesia" }, { id: "prosa", label: "Prosa" }];

  if (tabAtiva === "coletaneas") {
    titulo = "Coletâneas & Antologias";
    subtitulo = "Poesias publicadas em coletâneas e antologias no Brasil e no exterior";
    subtabs = [{ id: "brasil", label: "Brasil" }, { id: "portugal", label: "Portugal" }, { id: "outros", label: "Outros Países" }];
  } else if (tabAtiva === "colaboracoes") {
    titulo = "Colaborações Literárias";
    subtitulo = "Colaboração com artistas em Apresentações, Prefácios & Orelhas em livros, adaptação de obras para o teatro";
    subtabs = [{ id: "apresentacoes", label: "Apresentações" }, { id: "prefacios", label: "Prefácio & Orelhas" }, { id: "adaptacoes", label: "Adaptação de obras" }];
  } else if (tabAtiva === "escritos") {
    titulo = "Escritos & Leituras";
    subtitulo = "Ensaios, crônicas, entrevistas e traduções da autora, em texto integral para leitura";
    subtabs = [{ id: "ensaios", label: "Ensaios" }, { id: "cronicas", label: "Crônicas" }, { id: "entrevistas", label: "Entrevistas" }, { id: "traducoes", label: "Traduções" }];
  } else if (tabAtiva === "resenhas") {
    titulo = "Críticas & Resenhas";
    subtitulo = "Críticas, resenhas, artigos e verbetes sobre dtv em jornais, revistas literárias e publicações universitárias";
    subtabs = [{ id: "fortuna", label: "Fortuna Crítica" }, { id: "leituras", label: "Leituras Críticas" }, { id: "estudos", label: "Estudos Críticos" }, { id: "verbetes", label: "Verbetes" }];
  }

  return (
    <div className="header-vida">
      <h1 id="titulo-pagina">{titulo}</h1>
      <div className="header-subtitle" id="subtitulo-pagina">{subtitulo}</div>

      <div className="tabs-principal">
        {/* Task 110: ordem pedida pela autora — 3 abas empilhadas primeiro,
            depois as 2 de palavra simples (no celular quebram em 2 fileiras
            centralizadas: empilhadas acima, simples embaixo).
            Task 113 v4: todas em 2 linhas (ritmo visual uniforme, esquema da
            autora) — "Coletâneas & Antologias" e "Resenhas & Críticas" agora
            empilhadas como as irmãs.
            ⚠️ As chaves internas (obras/escritos/colaboracoes/coletaneas/resenhas)
            NÃO mudam — títulos e conteúdo das seções dependem delas. */}
        <button className={"tab-btn " + (tabAtiva === "obras" ? "ativa" : "")} onClick={() => mudarTab("obras")}>Obras<br/>Publicadas</button>
        <button className={"tab-btn " + (tabAtiva === "escritos" ? "ativa" : "")} onClick={() => mudarTab("escritos")}>Escritos &<br/>Leituras</button>
        <button className={"tab-btn " + (tabAtiva === "colaboracoes" ? "ativa" : "")} onClick={() => mudarTab("colaboracoes")}>Colaborações<br/>Literárias</button>
        <button className={"tab-btn " + (tabAtiva === "coletaneas" ? "ativa" : "")} onClick={() => mudarTab("coletaneas")}>Coletâneas &<br/>Antologias</button>
        <button className={"tab-btn " + (tabAtiva === "resenhas" ? "ativa" : "")} onClick={() => mudarTab("resenhas")}>Resenhas &<br/>Críticas</button>
      </div>

      <div className="tabs-sub visivel" style={{ display: "flex" }}>
        {subtabs.map((sub) => (
          <button key={sub.id} className={"tab-sub-btn " + (subTabAtiva === sub.id ? "ativa" : "")} onClick={() => mudarSubTab(sub.id)}>
            {sub.label}
          </button>
        ))}
      </div>

      <ReguaTempo modo="decadas" decadas={anos} ordemScroll="decrescente" />
    </div>
  );
}