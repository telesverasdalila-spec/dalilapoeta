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
  } else if (tabAtiva === "ensaios") {
    titulo = "Ensaios & Crônicas";
    subtitulo = "Crônicas, artigos e ensaios breves publicados em obras coletivas e revistas literárias e nas plataformas virtuais utilizadas pela autora";
    subtabs = [{ id: "ensaios", label: "Ensaios" }, { id: "cronicas", label: "Crônicas" }];
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
        <button className={"tab-btn " + (tabAtiva === "obras" ? "ativa" : "")} onClick={() => mudarTab("obras")}>Obras<br/>Publicadas</button>
        <button className={"tab-btn " + (tabAtiva === "coletaneas" ? "ativa" : "")} onClick={() => mudarTab("coletaneas")}>Coletâneas</button>
        <button className={"tab-btn " + (tabAtiva === "colaboracoes" ? "ativa" : "")} onClick={() => mudarTab("colaboracoes")}>Colaborações</button>
        <button className={"tab-btn " + (tabAtiva === "ensaios" ? "ativa" : "")} onClick={() => mudarTab("ensaios")}>Ensaios &<br/>Crônicas</button>
        <button className={"tab-btn " + (tabAtiva === "resenhas" ? "ativa" : "")} onClick={() => mudarTab("resenhas")}>Resenhas</button>
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