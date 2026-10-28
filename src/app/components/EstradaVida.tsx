// CronoBiografia — agora lida da ficha editável no painel (Sala de Costura).
// Fonte dos dados: src/app/data/vida/cronobiografia.json
// (mesmo shape que o Keystatic grava: array > object > conditional {discriminant, value}).
// Visual idêntico ao original hardcoded: container-vida > estrada > secao-decada >
// trecho (p + spans.institucional) e trecho-citacao (span.ano + p).
// Textos podem conter tags simples (<strong>, <em>) migradas do original.
import dadosCronobiografia from "../data/vida/cronobiografia.json";

type Peca = { discriminant: string; value: Record<string, unknown> };

function html(texto: string) {
  return { __html: texto };
}

function paragrafos(value: Record<string, unknown>) {
  const bruto = String(value.texto ?? "");
  return bruto.split(/\n\n+/).filter((t) => t.trim().length > 0);
}

function Peca({ peca }: { peca: Peca }) {
  const { discriminant, value } = peca;

  if (discriminant === "citacao") {
    return (
      <div className="trecho-citacao">
        <span className="ano">{String(value.ano ?? "")}</span>
        {paragrafos(value).map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={html(p)} />
        ))}
      </div>
    );
  }

  if (discriminant === "institucional") {
    return (
      <div className="trecho">
        <span
          className="institucional"
          dangerouslySetInnerHTML={html(String(value.texto ?? ""))}
        />
      </div>
    );
  }

  // narrativo: parágrafos + letreiros institucionais anexos (podem ser 0)
  const insts = Array.isArray(value.institucionais)
    ? (value.institucionais as unknown[]).map((t) => String(t))
    : [];
  return (
    <div className="trecho">
      {paragrafos(value).map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={html(p)} />
      ))}
      {insts.map((t, i) => (
        <span key={i} className="institucional" dangerouslySetInnerHTML={html(t)} />
      ))}
    </div>
  );
}

export default function EstradaVida() {
  return (
    <div className="container-vida">
      <div className="estrada">
        {dadosCronobiografia.decadas.map((decada) => (
          <div id={`c-${decada.dezena}`} className="secao-decada" key={decada.dezena}>
            {decada.pecas.map((peca, i) => (
              <Peca peca={peca as Peca} key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
