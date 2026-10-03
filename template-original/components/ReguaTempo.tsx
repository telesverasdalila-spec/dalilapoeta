"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { scrollParaSecao } from "./lib/tempo";

interface ReguaTempoDecadasProps {
  modo: "decadas";
  decadas: string[];
  idPrefix?: string;
  desativarScroll?: boolean;
  ordemScroll?: "crescente" | "decrescente";
  decadaInicial?: string;
  sempreVisivel?: boolean;
}

interface ReguaTempoMarcoProps {
  modo: "marco";
  ano: number;
  rotulo?: string;
}

type ReguaTempoProps = ReguaTempoDecadasProps | ReguaTempoMarcoProps;

export default function ReguaTempo(props: ReguaTempoProps) {
  if (props.modo === "marco") {
    return (
      <div className="regua-tempo">
        <div className="regua-anos">
          <span className="btn-decada ativa" style={{ cursor: "default" }}>
            {props.rotulo ?? "Desde"} {props.ano}
          </span>
        </div>
      </div>
    );
  }

  const { decadas = [], idPrefix = "c-", desativarScroll = false, ordemScroll = "crescente", decadaInicial, sempreVisivel = false } = props;

  // Se não tem décadas E não é "sempre visível", esconde totalmente
  if (decadas.length === 0 && !sempreVisivel) return null;

  // Se não tem décadas MAS é "sempre visível", mostra a régua vazia
  if (decadas.length === 0 && sempreVisivel) {
    return (
      <div className="regua-tempo">
        <div className="regua-anos"></div>
      </div>
    );
  }

  return (
    <ReguaDecadas
      decadas={decadas}
      idPrefix={idPrefix}
      desativarScroll={desativarScroll}
      ordemScroll={ordemScroll}
      decadaInicial={decadaInicial}
    />
  );
}

function ReguaDecadas({
  decadas,
  idPrefix,
  desativarScroll = false,
  ordemScroll = "crescente",
  decadaInicial,
}: {
  decadas: string[];
  idPrefix: string;
  desativarScroll?: boolean;
  ordemScroll?: "crescente" | "decrescente";
  decadaInicial?: string;
}) {
  const [decadaAtiva, setDecadaAtiva] = useState<string>("");
  const decadasRef = useRef(decadas);
  decadasRef.current = decadas;

  // Estado inicial
  useEffect(() => {
    if (decadaInicial && decadas.includes(decadaInicial)) {
      setDecadaAtiva(decadaInicial);
      return;
    }
    if (decadas.length > 0) {
      setDecadaAtiva(decadas[decadas.length - 1]);
    }
  }, [decadaInicial, decadas]);

  useEffect(() => {
    if (desativarScroll) return;

    const acharDecadaAtiva = () => {
      const atuais = decadasRef.current;
      if (atuais.length === 0) return;

      const secaoExemplo = document.querySelector(`[id^="${idPrefix}"]`);
      const header = secaoExemplo?.closest('.header-vida')
                    || document.querySelector('.header-vida')
                    || document.querySelector('.header-obra');
      const limite = header ? header.getBoundingClientRect().bottom + 10 : 200;

      const todasSecoes = document.querySelectorAll(`[id^="${idPrefix}"]`);

      let melhorDecada = "";
      let melhorDistancia = Infinity;

      for (const secao of todasSecoes) {
        const id = (secao as HTMLElement).id;
        const ano = parseInt(id.replace(idPrefix, ""));
        if (isNaN(ano)) continue;

        const decada = Math.floor(ano / 10) * 10;
        const rotuloDecada = `${decada}-${decada + 9}`;
        if (!atuais.includes(rotuloDecada)) continue;

        const topo = (secao as HTMLElement).getBoundingClientRect().top;

        if (topo <= limite + 50) {
          const distancia = Math.abs(topo - limite);
          if (distancia < melhorDistancia) {
            melhorDistancia = distancia;
            melhorDecada = rotuloDecada;
          }
        }
      }

      if (melhorDecada) {
        setDecadaAtiva(melhorDecada);
      }
    };

    acharDecadaAtiva();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          acharDecadaAtiva();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [desativarScroll, idPrefix]);

  useEffect(() => {
    if (!decadaAtiva) return;
    const base = decadaAtiva.split("-")[0];
    const botaoAtivo = document.getElementById(`btn-decada-${base}`);
    const reguaPai = botaoAtivo?.closest(".regua-anos") as HTMLElement | null;
    if (botaoAtivo && reguaPai) {
      const scrollPara = botaoAtivo.offsetLeft - reguaPai.offsetWidth / 2 + botaoAtivo.offsetWidth / 2;
      reguaPai.scrollTo({ left: scrollPara, behavior: "smooth" });
    }
  }, [decadaAtiva]);

  const irParaDecada = useCallback((decada: string) => {
    const anoInicio = parseInt(decada.split("-")[0]);
    const anoFim = anoInicio + 9;

    let alvo = document.getElementById(`${idPrefix}${anoInicio}`);

    if (!alvo) {
      const todasSecoes = document.querySelectorAll(`[id^="${idPrefix}"]`);
      for (const secao of todasSecoes) {
        const anoSecao = parseInt((secao as HTMLElement).id.replace(idPrefix, ""));
        if (!isNaN(anoSecao) && anoSecao >= anoInicio && anoSecao <= anoFim) {
          alvo = secao as HTMLElement;
          break;
        }
      }
    }

    if (alvo) {
      const header = (alvo.closest('.header-vida')
                    || document.querySelector('.header-vida')
                    || document.querySelector('.header-obra')) as HTMLElement | null;
      const posicao = alvo.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 20;
      window.scrollTo({ top: posicao, behavior: "smooth" });
    }

    setDecadaAtiva(decada);
  }, [idPrefix]);

  if (decadas.length === 0) return null;

  return (
    <div className="regua-tempo">
      <div className="regua-anos">
        {decadas.map((decada) => (
          <button
            key={decada}
            id={`btn-decada-${decada.split("-")[0]}`}
            className={"btn-decada " + (decadaAtiva === decada ? "ativa" : "")}
            onClick={() => irParaDecada(decada)}
          >
            {decada}
          </button>
        ))}
      </div>
    </div>
  );
}
