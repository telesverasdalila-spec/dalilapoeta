/**
 * Funções compartilhadas para a "régua do tempo" (o menu de décadas
 * clicável que aparece no topo das seções). Antes, cada seção
 * (Obras, Movimento, Prêmios...) tinha sua própria cópia dessa lógica.
 * Centralizar aqui evita que uma correção feita num lugar seja
 * esquecida nos outros.
 */

/** Extrai o ano numérico de um campo que pode ser number ou string
 *  (ex: "1999-2004" -> 1999). Usado pra ordenar e agrupar por década. */
export function extrairAnoBase(ano: number | string): number {
  if (typeof ano === "number") return ano;
  const match = ano.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Calcula as décadas a partir de uma lista de anos.
 * @param anos - Lista de anos (ex: [1982, 1996, 2003, 2024])
 * @param ordem - "crescente" (mais antigo → mais recente) ou "decrescente" (mais recente → mais antigo)
 * @returns Lista de décadas formatadas (ex: ["1980-1989", "1990-1999", ...])
 *
 * ⚠️ CORREÇÃO: sempre usa `d + 9` para o fim da década.
 *   Antes usava `anoMax` na última década, gerando rótulos como
 *   "2020-2026" que nunca combinavam com o cálculo do scroll
 *   handler (que sempre usava `d + 9` → "2020-2029").
 */
export function calcularDecadas(anos: number[], ordem: "crescente" | "decrescente" = "crescente"): string[] {
  const anosValidos = anos.filter((a) => a > 0);
  if (anosValidos.length === 0) return [];

  const anoMin = Math.min(...anosValidos);
  const anoMax = Math.max(...anosValidos);
  const decadaMin = Math.floor(anoMin / 10) * 10;
  const decadaMax = Math.floor(anoMax / 10) * 10;

  const decadas: string[] = [];
  for (let d = decadaMin; d <= decadaMax; d += 10) {
    const fim = d + 9;
    decadas.push(`${d}-${fim}`);
  }

  // Se for decrescente, inverte a ordem
  if (ordem === "decrescente") {
    return decadas.reverse();
  }
  return decadas;
}

/** Rola a página suavemente até a seção da década/ano informado,
 *  descontando a altura do cabeçalho fixo (".header-vida") pra o
 *  título não ficar escondido atrás dele. */
export function scrollParaSecao(idDoDestino: string) {
  const menu = document.querySelector(".header-vida") as HTMLElement | null;
  const alvo = document.getElementById(idDoDestino);
  if (menu && alvo) {
    const posicaoExata = alvo.getBoundingClientRect().top + window.scrollY - menu.offsetHeight - 20;
    window.scrollTo({ top: posicaoExata, behavior: "smooth" });
  }
}
