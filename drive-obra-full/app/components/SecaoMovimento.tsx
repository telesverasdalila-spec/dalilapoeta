"use client";
import { useState, Fragment } from "react";
import Link from "next/link";
import ReguaTempo from "../components/ReguaTempo";              // ✅ fica igual
import { extrairAnoBase, calcularDecadas } from "../lib/tempo";  // ✅ CORRIGIDO
import { getTagStyle } from "../lib/tags";           // ✅ CORRIGIDO

// ✅ CORRETO (sai de components/, entra em data/)
import dadosPalestras from "../data/movimento/Palestras.json";
import dadosLeituras from "../data/movimento/LeiturasPoeticas.json";
import dadosSaraus from "../data/movimento/SarausRecitais.json";
import dadosCongressos from "../data/movimento/CongressosSeminariosSimposios.json";
import dadosConferencias from "../data/movimento/ConferenciasMesas.json";
import dadosOficinas from "../data/movimento/OficinasWorkshops.json";
import dadosInstitucionais from "../data/movimento/Institucionais.json";
import dadosAtividadesCulturais from "../data/movimento/EncontrosAtividadesCulturais.json";
import dadosCuradoria from "../data/movimento/CuradoriaConsultoria.json";
import dadosProgramas from "../data/movimento/ProgramasEntrevistas.json";
import dadosAtivismos from "../data/movimento/ativismo.json";
import dadosPremios from "../data/vida/premios.json";

/* ============================================================
   TIPOS
   ============================================================ */

interface EventoNovo {
  id: string;
  titulo_evento: string;
  data: string;
  data_fim?: string;
  local: string;
  cidade: string | null;
  estado: string | null;
  pais: string;
  categoria_principal: string;
  tags: string[];
  participantes?: string[];
  slug_texto?: string;
  texto_original: string;
}

interface ArquivoCategoria {
  categoria: string;
  total_registros: number;
  descricao: string;
  tags_comuns: string[];
  registros: EventoNovo[];
}

type TabMovimento = "ativismo" | "alpharrabio" | "nucleo" | "abeces" | "livrespaco" | "emmovimento";

/* ============================================================
   DADOS E CONFIGURAÇÕES
   ============================================================ */

// ✅ FUSÃO: Palestras (sem texto em Ensaios) + Oficinas & Workshops
// Filtra palestras que NÃO têm texto completo em Ensaios
const palestrasSemTexto = ((dadosPalestras as ArquivoCategoria)?.registros ?? []).filter(
  (r) => !r.slug_texto
);

const dadosOficinasFiltrado = dadosOficinas as ArquivoCategoria;

// ✅ Remove duplicatas por ID (mesmo registro pode estar em ambos os arquivos)
const todosRegistros = [...palestrasSemTexto, ...dadosOficinasFiltrado.registros];
const registrosUnicosMap = new Map<string, EventoNovo>();
for (const reg of todosRegistros) {
  if (!registrosUnicosMap.has(reg.id)) {
    registrosUnicosMap.set(reg.id, reg);
  }
}
const registrosFusionados = Array.from(registrosUnicosMap.values());

const dadosPalestrasOficinasFusion: ArquivoCategoria = {
  categoria: "palestras_oficinas",
  total_registros: registrosFusionados.length,
  descricao: "Palestras, debates, oficinas literárias e workshops",
  tags_comuns: ["palestra", "oficina", "workshop"],
  registros: registrosFusionados,
};

const dadosPorSubAba: Record<string, ArquivoCategoria> = {
  palestras_oficinas: dadosPalestrasOficinasFusion,
  saraus: dadosSaraus as ArquivoCategoria,
  congressos: dadosCongressos as ArquivoCategoria,
  conferencias: dadosConferencias as ArquivoCategoria,
  institucionais: dadosInstitucionais as ArquivoCategoria,
  atividades_culturais: dadosAtividadesCulturais as ArquivoCategoria,
  programas: dadosProgramas as ArquivoCategoria,
  curadoria: dadosCuradoria as ArquivoCategoria,
  leituras: dadosLeituras as ArquivoCategoria,
};

const subAtivismoLabels: Record<string, string> = {
  palestras_oficinas: "Palestras & Oficinas",
  saraus: "Saraus & Recitais",
  congressos: "Congressos & Seminários",
  conferencias: "Conferências & Mesas",
  institucionais: "Encontros & Reuniões",
  atividades_culturais: "Atividades Culturais",
  programas: "Programas & Entrevistas",
  curadoria: "Curadoria & Consultoria",
  leituras: "Leituras Poéticas",
};

const ordemSubAbas = [
  "palestras_oficinas",
  "saraus",
  "congressos",
  "conferencias",
  "institucionais",
  "atividades_culturais",
  "programas",
  "curadoria",
  "leituras",
];

const textos: Record<Exclude<TabMovimento, "ativismo">, React.ReactNode[]> = {
  alpharrabio: [
    <div className="trecho" key="al1"><p>Fundado em 1992 por Dalila Teles Veras e por Valdecirio Teles Veras, o Alpharrabio é, por definição, <em>"muito mais que um sebo"</em>. Localizado no Grande ABC (SP), o espaço consolidou-se como uma referência cultural fundamental na região, unindo livraria, sebo, editora, café e um vibrante centro cultural.</p></div>,
    <div className="trecho" key="al2"><p>Nossa proposta vai além do comércio de livros; somos uma casa dedicada a manter as obras em circulação entre novos leitores e a difundir a arte e a cultura em suas múltiplas formas.</p></div>,
    <div className="trecho" key="al3"><p>Para aqueles que nos visitam — os <strong>"Alphas"</strong> —, o Alpharrabio é um território livre do espírito, um local de acolhimento e pertencimento onde a mágica do pensamento crítico se faz presente.</p></div>,
    <div className="trecho" key="al4"><p>Através da Alpharrabio Edições, mantemos um catálogo editorial que prestigia autores e obras que refletem a produção intelectual e literária contemporânea, abrangendo poesia, contos, crônicas e história. Somos um ponto de encontro para a união de ideias, funcionando como um organismo vivo que incentiva, edita e agrupa os agentes culturais da nossa região.</p></div>
  ],
  nucleo: [
    <div className="trecho" key="nu1"><p style={{ fontSize: '1.4rem', marginBottom: '15px' }}><strong>Núcleo ABC's: Articulação e Difusão Cultural</strong></p></div>,
    <div className="trecho" key="nu2"><p>O Núcleo ABC's é um dos pilares fundamentais da minha trajetória de mobilização cultural. Ele nasceu da convicção de que a cultura precisa de espaços de convergência para pulsar e, desde então, atua como o motor de articulação que conecta diferentes frentes do meu trabalho, como o Alpharrabio, o Boletim Abecês e a Revista LIVRESPAÇO.</p></div>,
    <div className="trecho" key="nu3"><p>Mais do que um projeto isolado, o Núcleo é um <strong>território de pensamento crítico e convivência</strong>. Sua missão é fomentar a produção intelectual e artística na região do Grande ABC, servindo como um polo onde as ideias não apenas circulam, mas <em>"fermentam" em solo fértil</em>.</p></div>,
    <div className="trecho" key="nu4"><p>É através desta iniciativa que busco agrupar e incentivar os agentes culturais, acreditando fielmente que, como disse João Cabral, <strong>"um galo sozinho não tece a manhã"</strong>.</p></div>,
    <div className="trecho" key="nu5"><p>Neste espaço, o compartilhamento e o envolvimento coletivo são as matérias-primas para a criação de "manhãs novas" na arte e no pensamento. O Núcleo ABC's é, portanto, a minha aposta na força do coletivo e na permanência da cultura como um território livre do espírito.</p></div>
  ],
  abeces: [
    <div className="trecho" key="ab1"><p style={{ fontSize: '1.4rem', marginBottom: '15px' }}><strong>Boletim Abecês: A Memória em Movimento</strong></p></div>,
    <div className="trecho" key="ab2"><p>O <strong>Boletim Abecês</strong> é um registro impresso do pulsar constante da nossa região. Concebido como um libreto de comunicação e celebração, ele nasceu da necessidade de documentar e dar voz às atividades, encontros e reflexões que florescem no <strong>Alpharrabio</strong> e em seu entorno.</p></div>,
    <div className="trecho" key="ab3"><p>Ao longo desses anos, o Boletim tem funcionando como uma <em>crônica viva</em> da nossa resistência cultural no Grande ABC. Através de suas páginas, o "ABC" deixa de ser apenas uma sigla geográfica para se tornar um território de letras e ideias, onde cada edição é um convite para que o leitor acompanhe a fermentação do pensamento crítico que tanto prezamos.</p></div>,
    <div className="trecho" key="ab4"><p>Este projeto é a materialização do meu compromisso com a memória cultural local. Se o Alpharrabio é o ponto de encontro, o <strong>Boletim Abecês</strong> é a mensagem que viaja, permitindo que os "gritos" de tantos galos se unam para, juntos, tecermos as manhãs da nossa arte e da nossa história. É um fragmento do nosso <strong>trabalho livre do espírito</strong>, feito para ser lido, guardado e compartilhado.</p></div>
  ],
  emmovimento: [
    <div className="trecho" key="em1"><p style={{ fontSize: '1.4rem', marginBottom: '5px' }}><strong>Em Movimento</strong> <em style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>Vários | 21 x 30 cm, 32 pp.</em></p></div>,
    <div className="trecho" key="em2"><p>Publicação dos Escritores em Movimento, um grupo de autores do ABC que desde setembro de 1997 reúne-se mensalmente na Livraria Alpharrabio.</p></div>,
    <div className="trecho" key="em3"><p>Alguns dos temas abordados: <em>O ABC Pensa o ABC, Uma Guerra com Testemunhas, Um Laboratório para a Inteligência Regional, A Leitura do Texto Literário no Ensino Básico: Prazer ou Obrigação?, Patrono, Patrocínio ou Parcerias... Revigorar a Produção Cultural da Região?, Memória e Arte, Cultura em Movimento, Relato de uma experiência, Resgate, A Cultura no Cotidiano Escolar, O Paradoxo do Migrante, A Quem Interessa?</em></p></div>,
    <div className="trecho" key="em4"><p>Assinados por mais de uma dezena de intelectuais atuantes, como Luiz Roberto Alves, Luis Alberto de Abreu, Antonio Possidonio Sampaio e Alexandre Takara.</p></div>,
    <div className="trecho" key="em5"><p style={{ marginTop: '20px' }}><strong>Colaboradores:</strong> Ademir Medici, Alexandre Takara, Antonio Possidonio Sampaio, Aristides Theodoro, Cláudio Feldman, Dalila Teles Veras, Inhadjara S. Yamamura, Irineu Volpato, Jurema Barreto de Souza, Iracema mendes Regis, Luís Allberto de Abreu, Luiz Roberto Alves, Maria de Lourdes Ruegger Silva, Marília Magalhães B. Pedrosa, Roberto Barbosa, Theresinha Malta e Valdecirio Teles Veras.</p></div>,
    <div className="trecho" key="em6"><p><strong>Desenhos:</strong> Mariano Amaral Netto e Perkins.<br /><strong>Editora:</strong> Dalila Teles Veras</p></div>
  ],
  livrespaco: [
    <div className="trecho" key="li1"><p>Mais do que uma publicação literária, a Livrespaço foi um sopro de <strong>resistência e descentralização cultural</strong> que marcou a história da literatura brasileira entre 1983 e 1994. Idealizada e capitaneada por Dalila Teles Veras na região do Grande ABC, a revista nasceu como um manifesto vivo contra o monopólio cultural do eixo Rio-São Paulo e o engessamento da crítica universitária tradicional.</p></div>,
    <div className="trecho" key="li2"><p>Sob o lema de que o Brasil é feito de muitas vozes e de que <em>"na poesia, ninguém substitui ninguém, acrescenta"</em>, a Livrespaço abriu suas páginas para o novo, o independente e a pluralidade de vozes que a grande imprensa insistia em ignorar.</p></div>,
    <div className="trecho" key="li3"><p>Esse trabalho incansável de mapeamento, edição e fomento à poesia viva e marginal foi reconhecido nacionalmente em 1993, quando o projeto foi agraciado com o prestigiado <strong>Prêmio APCA</strong> (Associação Paulista de Críticos de Arte) na categoria de Melhor Realização Cultural.</p></div>
  ]
};

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */

function formatarData(data: string): string {
  if (!data || data === "0000-00-00") return "";
  const partes = data.split("-");
  if (partes.length === 3) {
    const ano = partes[0];
    const mes = parseInt(partes[1]);
    const dia = parseInt(partes[2]);
    if (mes === 0 && dia === 0) return ano;
    if (dia === 0) {
      const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      return `${meses[mes - 1]} de ${ano}`;
    }
    return `${dia}/${mes}/${ano}`;
  }
  return data;
}

interface AnoGrupo { ano: number; eventos: EventoNovo[] }
interface DecadaGrupo { decada: number; anos: AnoGrupo[] }

function agruparPorDecada(registros: EventoNovo[]): DecadaGrupo[] {
  const ordenados = [...registros].sort((a, b) => extrairAnoBase(b.data) - extrairAnoBase(a.data));
  const resultado: DecadaGrupo[] = [];

  for (const evento of ordenados) {
    const anoBase = extrairAnoBase(evento.data);
    if (anoBase === 0) continue;
    const decada = Math.floor(anoBase / 10) * 10;

    let grupoDecada = resultado[resultado.length - 1];
    if (!grupoDecada || grupoDecada.decada !== decada) {
      grupoDecada = { decada, anos: [] };
      resultado.push(grupoDecada);
    }

    let grupoAno = grupoDecada.anos[grupoDecada.anos.length - 1];
    if (!grupoAno || grupoAno.ano !== anoBase) {
      grupoAno = { ano: anoBase, eventos: [evento] };
      grupoDecada.anos.push(grupoAno);
    } else {
      grupoAno.eventos.push(evento);
    }
  }

  return resultado;
}

/* ============================================================
   SUB-COMPONENTES
   ============================================================ */

function TagsEvento({ tags }: { tags: string[] }) {
  return (
    <span className="tags-container">
      {tags.map((tag) => {
        const style = getTagStyle(tag);
        return (
          <span key={tag} className="tag" style={{
            display: "inline-block",
            background: style.bg,
            color: style.text,
            padding: "2px 10px",
            borderRadius: "12px",
            border: `1px solid ${style.border}`,
            fontFamily: "'Inter', sans-serif",
            fontWeight: "500",
            fontSize: "0.6rem"
          }}>
            #{tag}
          </span>
        );
      })}
    </span>
  );
}

function EventoCard({ evento }: { evento: EventoNovo }) {
  return (
    <div className="trecho" key={evento.id}>
      <p>
        <span className="titulo-evento">{evento.titulo_evento}</span>

        {evento.local && (
          <span className="local-info">
            {evento.local}
            {evento.cidade && ` — ${evento.cidade}`}
            {evento.estado && `/${evento.estado}`}
            {evento.pais && evento.pais !== "Brasil" && ` — ${evento.pais}`}
          </span>
        )}

        {evento.data && evento.data !== "0000-00-00" && (
          <span className="data-info">
            📅 {formatarData(evento.data)}
            {evento.data_fim && ` a ${formatarData(evento.data_fim)}`}
          </span>
        )}

        {evento.tags.length > 0 && <TagsEvento tags={evento.tags} />}

        {evento.texto_original && (
          <span className="texto-original">{evento.texto_original}</span>
        )}

        {evento.slug_texto && (
          <Link
            href={`/palestras/${evento.slug_texto}`}
            style={{
              display: "inline-block",
              marginTop: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              fontWeight: "600",
              color: "#7a3b5a",
              textDecoration: "none",
              borderBottom: "1px solid #7a3b5a",
              letterSpacing: "1px",
              textTransform: "uppercase" as const
            }}
          >
            Leia o texto &rarr;
          </Link>
        )}
      </p>
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function SecaoMovimento() {
  const [tabAtiva, setTabAtiva] = useState<TabMovimento>("ativismo");
  const [subAtivismo, setSubAtivismo] = useState<string>("palestras_oficinas");

  // Dados da sub-aba ativa (só relevantes quando tabAtiva === "ativismo")
  const registros = dadosPorSubAba[subAtivismo]?.registros || [];
  const anos = registros.map((e) => extrairAnoBase(e.data)).filter((a) => a > 0);
  const decadasFixas = calcularDecadas(anos, "crescente");
  const ultimaDecada = decadasFixas.length > 0 ? decadasFixas[decadasFixas.length - 1] : "";
  const eventosPorDecada = agruparPorDecada(registros);

  return (
    <div className={tabAtiva === "ativismo" ? "ativismo-ativo" : ""} style={{ maxWidth: "850px", margin: "0 auto", position: "relative" }}>
      {/* ========== HEADER ========== */}
      <div className="header-vida">
        <h1 id="titulo-pagina">Projetos Culturais</h1>
        <div className="header-subtitle" id="subtitulo-pagina">Projetos, Ativismo e Iniciativas</div>

        {/* Tabs principais */}
        <div className="tabs-principal">
          <button className={"tab-btn " + (tabAtiva === "ativismo" ? "ativa" : "")} onClick={() => setTabAtiva("ativismo")}>Ativismo<br />Cultural</button>
          <button className={"tab-btn " + (tabAtiva === "alpharrabio" ? "ativa" : "")} onClick={() => setTabAtiva("alpharrabio")}>Alpharrabio</button>
          <button className={"tab-btn " + (tabAtiva === "nucleo" ? "ativa" : "")} onClick={() => setTabAtiva("nucleo")}>Núcleo<br />ABC's</button>
          <button className={"tab-btn " + (tabAtiva === "abeces" ? "ativa" : "")} onClick={() => setTabAtiva("abeces")}>Boletim<br />Abecês</button>
          <button className={"tab-btn " + (tabAtiva === "livrespaco" ? "ativa" : "")} onClick={() => setTabAtiva("livrespaco")}>Revista<br />Livrespaço</button>
          <button className={"tab-btn " + (tabAtiva === "emmovimento" ? "ativa" : "")} onClick={() => setTabAtiva("emmovimento")}>Em<br />Movimento</button>
        </div>

        {/* Sub-tabs (só no Ativismo) */}
        {tabAtiva === "ativismo" && (
          <div className="tabs-sub visivel" style={{ display: "flex", flexWrap: "wrap", rowGap: "2px", paddingTop: "4px", paddingBottom: "4px", borderBottom: "1px solid #ebebeb" }}>
            {ordemSubAbas.map((sub) => (
              <button
                key={sub}
                className={"tab-sub-btn " + (subAtivismo === sub ? "ativa" : "")}
                onClick={() => setSubAtivismo(sub)}
              >
                {subAtivismoLabels[sub]}
              </button>
            ))}
          </div>
        )}

        {/* Régua do tempo — padronizada em TODAS as tabs */}
        <ReguaTempo 
          modo="decadas" 
          decadas={tabAtiva === "ativismo" ? decadasFixas : []} 
          decadaInicial={tabAtiva === "ativismo" ? ultimaDecada : ""}
          sempreVisivel
        />
      </div>

      {/* ========== CONTEÚDO ========== */}
      <div className="estrada">
        {tabAtiva === "ativismo" ? (
          eventosPorDecada.length > 0 ? (
            eventosPorDecada.map((grupoDecada, dIndex) => (
              <div key={grupoDecada.decada}>
                <div 
                  id={`c-${grupoDecada.decada}`} 
                  className="separador-genero" 
                  style={{ marginTop: dIndex === 0 ? "0" : "30px" }}
                >
                  {grupoDecada.decada}-{grupoDecada.decada + 9}
                </div>

                {grupoDecada.anos.map((grupoAno) => (
                  <Fragment key={grupoAno.ano}>
                    <div 
                      className="separador-genero" 
                      style={{ 
                        marginTop: "20px", 
                        fontSize: "0.65rem", 
                        color: "#ccc",
                        letterSpacing: "2px",
                        borderBottom: "none",
                        marginBottom: "5px"
                      }}
                    >
                      {grupoAno.ano}
                    </div>

                    {grupoAno.eventos.map((evento) => (
                      <EventoCard key={evento.id} evento={evento} />
                    ))}
                  </Fragment>
                ))}
              </div>
            ))
          ) : (
            <div className="trecho" style={{ marginTop: "60px", textAlign: "center" }}>
              <p style={{ fontStyle: "italic", color: "#999", fontSize: "1.1rem" }}>📝 Nenhum registro encontrado para esta categoria.</p>
            </div>
          )
        ) : (
          textos[tabAtiva].map((texto, index) => (
            <Fragment key={index}>{texto}</Fragment>
          ))
        )}
      </div>
    </div>
  );
}