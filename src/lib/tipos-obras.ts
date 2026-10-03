// Tipos do schema unificado das fichas de obra
// Fontes: fichas do deploy Vercel (3 livros) + schema da usuária
//         (Pecados — trechos ilustrados; Vestígios — sobre estruturado + partes;
//          À Janela dos Dias — antologia com origem por trecho; Diuturnos — imagem_mes)
// Reconstruído a partir do projeto canônico da usuária (Drive, app/obra/[id]/page.tsx).

export interface DadoEdicao {
  label: string;
  valor: string;
}

export interface TrechoObra {
  titulo: string;
  /** Subtítulo do trecho (ex.: "Da insaciável cobiça" em Pecados) */
  subtitulo?: string;
  /** Livro de origem do poema (ex.: antologia À Janela dos Dias: "Lições de Tempo (1983)") */
  origem?: string;
  /** Epígrafe do poema (citação + fonte na última linha), multilinha */
  citacao?: string;
  /** Texto do poema/trecho, multilinha. **negrito** é renderizado como <strong> */
  texto: string;
  /** Nome do artista plástico da ilustração (tratativa diferenciada, ex.: Pecados) */
  artista?: string;
  /** Título da obra de arte */
  obra_arte?: string;
  /** Caminho da imagem da arte em /public */
  imagem_arte?: string;
  /** Imagem do mês (ex.: Diuturnos — livro de meses) */
  imagem_mes?: string;
}

/** Epígrafe estruturada da seção Sobre (ex.: Vestígios — Machado de Assis, Byron...) */
export interface EpigrafeSobre {
  texto: string;
  autor: string;
}

/** Sobre estruturado (ex.: Vestígios) — dedicatória + epígrafes de abertura */
export interface SobreEstruturado {
  /** Linhas da dedicatória (renderizadas alinhadas à direita, em itálico) */
  dedicatoria?: string[];
  /** Epígrafes de abertura da obra (renderizadas em escada dourada) */
  epigrafes?: EpigrafeSobre[];
}

/** Parte do livro (ex.: "A rotina da perda" em Vestígios) — agrupamento de poemas */
export interface ParteObra {
  titulo: string;
  /** Subtítulo da parte (opcional) */
  subtitulo?: string;
  /** Epígrafe da parte (ex.: "Mas de tudo fica um pouco" — Drummond) */
  citacao?: string;
  /** Poemas da parte */
  poemas: TrechoObra[];
}

export type StatusCatalogo = "disponivel" | "esgotado" | "fora_do_catalogo";

export interface FichaObra {
  /** Slug explícito, igual ao gerado a partir do título na listagem */
  slug?: string;
  titulo: string;
  subtitulo?: string;
  /** Gênero exibido em small caps (Poesia, Prosa, Caixa Artística...) */
  genero: string;
  ano: number | string;
  /** Caminho da capa em /public */
  capa?: string;
  /** "esgotado"/"fora_do_catalogo" => sem aba Adquira; ausente/"disponivel" => com aba */
  status_catalogo?: StatusCatalogo;
  /** Texto do Sobre (só quando existir no site legado):
   *  - string: parágrafos corridos (ex.: Pecados)
   *  - SobreEstruturado: dedicatória + epígrafes (ex.: Vestígios) */
  sobre?: string | SobreEstruturado;
  /** Texto da orelha (blockquote vinho, ex.: À Janela dos Dias/Tarso de Melo) */
  orelha?: string;
  autor_orelha?: string;
  /** Dados da edição — OBRIGATÓRIOS em toda ficha */
  dados: DadoEdicao[];
  /** Trechos soltos (ex.: Pecados — poemas ilustrados; À Janela dos Dias — antologia) */
  trechos?: TrechoObra[];
  /** Partes com poemas agrupados (ex.: Vestígios — 3 partes, 21 poemas) */
  partes?: ParteObra[];
  /** Configuração opcional da aba Adquira (padrão: loja Alpharrabio) */
  adquira?: {
    texto?: string;
    rotulo_botao?: string;
    url_loja?: string;
  };
}

/** URL padrão da loja (usada na aba Adquira) */
export const URL_LOJA_PADRAO = "https://www.alpharrabio.com.br";

/** Texto plano do Sobre (para meta description) — funciona nos dois formatos */
export function sobreTexto(ficha: FichaObra): string | null {
  const sobre = ficha.sobre;
  if (!sobre) return null;
  if (typeof sobre === "string") return sobre.trim() || null;
  const pedacos: string[] = [];
  if (sobre.dedicatoria?.length) pedacos.push(sobre.dedicatoria.join(" "));
  if (sobre.epigrafes?.length) pedacos.push(...sobre.epigrafes.map((e) => e.texto));
  const texto = pedacos.join(" ").replace(/\s+/g, " ").trim();
  return texto || null;
}
