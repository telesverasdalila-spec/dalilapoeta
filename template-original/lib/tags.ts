// app/lib/tags.ts

// 1. 🔴 VERMELHO → Tags de pandemia/virtual
export const TAGS_PANDEMIA = [
  "atividades_virtuais_pandemia",
  "virtual"
];

// 2. 🔵 AZUL → Tags de subcategoria (identificação da linha)
export const TAGS_SUBCATEGORIA = [
  "palestra",
  "sarau",
  "recital",
  "congresso",
  "seminario",
  "simposio",
  "mesa_de_abertura",
  "mesa_de_encerramento",
  "mesa_de_debates",
  "roda_de_conversa",
  "oficina",
  "workshop",
  "encontro",
  "reuniao",
  "laive",
  "live",
  "programa",
  "entrevista",
  "curadoria",
  "consultoria",
  "leitura_poetica"
];

// 3. 🟡 DOURADO → Tags de enriquecimento (todas as outras)
export const TAGS_ENRIQUECIMENTO = [
  // Pessoas
  "cora_coralina",
  "oswald_de_andrade",
  "manuel_bandeira",
  "fernando_pessoa",
  "saramago",
  "claudio_willer",
  "donizete_galvao",
  "antonio_pina",
  "maria_valeria_rezende",
  "flavio_florence",
  "carlos_heitor_cony",
  "jose_marti",
  "juca_pato",
  "edson_bueno_de_camargo",
  "antonio_possidonio_sampaio",
  "olga_savari",
  "olga_de_favari",
  "claudinei_vieira",
  "paulo_dantas",
  "euridice_figueiredo",
  "joaquim_celso_freire",
  "melissa_suarez",
  "miriam_gimenez",
  "celina_lerner",
  "adelia_nicolete",
  "violante_saramago_matos",
  // Instituições
  "ufabc",
  "abc",
  "sesc",
  "casa_das_rosas",
  "alpharrabio",
  "ube",
  "unesco",
  "uscs",
  "umesp",
  "puc_sp",
  "universidade_da_madeira",
  "ccsp",
  "museu_de_santo_andre",
  "casa_mario_de_andrade",
  "museu_da_literatura",
  "casa_da_palavra",
  "biblioteca_monteiro_lobato",
  "instituto_coracao_de_jesus",
  "fundacao_santo_andre",
  "fainam",
  "consorcio_abc",
  "forum_permanente",
  "proec",
  "cec",
  "iplures",
  "mulherio_das_letras",
  "mulherio_raiz",
  "coopacesso",
  "desconcertos_editora",
  "patua",
  "loope",
  // Temas
  "poesia",
  "cultura",
  "memoria",
  "identidade",
  "resistencia",
  "diaspora",
  "portugueses",
  "madeira",
  "livrespaço",
  "literatura_brasileira",
  "literatura_abc",
  "literatura_independente",
  "modernismo",
  "antropofagia",
  "imprensa_alternativa",
  "resistencia_cultural",
  "gestao_de_cidades",
  "producao_cultural",
  "gestao_cultural",
  "economia_criativa",
  "direitos_do_escritor",
  "sindicatos",
  "leitura",
  "livro",
  "educacao",
  "saude",
  "esportes",
  "cidadania",
  "diversidade_cultural",
  "cultura_participativa",
  "extensao_universitaria",
  "divulgacao_cientifica",
  "critica_literaria",
  "profissao_escritor",
  "cronica",
  "genero_literario",
  "processo_de_criacao",
  "oficio",
  "feira_de_poesia",
  "desvairada",
  "perversas",
  "sabados_perversos",
  "sarau_das_ideias",
  "lapada_poetica",
  "tantas_letras",
  "primeiras_vozes",
  "plaquete",
  "ato_politico",
  "democracia",
  "intercambio",
  "portugal",
  "exposicao",
  "fliaguas",
  "arquivo_historico_cultural",
  "concerto",
  "homenagem",
  "lancamento",
  "depoimento",
  "discurso",
  "audiencia_publica",
  "politicas_culturais",
  "map",
  "diadema",
  "santo_andre",
  "invencao_da_cidade",
  "cidade",
  "25_anos_livrespaço",
  "semana_de_arte_moderna",
  "100_anos",
  "pagu",
  "80_anos",
  "cotidiano",
  "youtube",
  "canal_cloe",
  "agenda_tarsila",
  "sobre_viver",
  "aluisio_de_azevedo",
  "basho",
  "haikai",
  "joao_cabral",
  "tarso_de_melo",
  "arnaldo_antunes",
  "elena_ferrante",
  "viviane_mose",
  "clarice_lispector",
  "virginia_woolf",
  "padre_antonio_vieira",
  "giles_deleuze",
  // Eventos / Projetos
  "7_anos_7_cidades",
  "plataforma_abc",
  "palavrapontocom",
  "janela_cultural",
  "abcdmaior",
  "viacuba",
  "serafim_ponte_grande",
  "retalhos_imortais_do_serafim",
  "poesia_96",
  "especial_50_edicoes",
  "quinta_poetica",
  "catedra_celso_daniel",
  "cidade_futuro",
  "laboratorio_da_paixao",
  "mostra_visual",
  "alquimia_da_palavra",
  "universidade_aberta",
  "ler_e_falar_poesia",
  "projeto_poeta_leitor",
  "varal_de_poesia",
  "mulheres_com_palavra",
  "tome_prosa_tome_poesia",
  "revistaria",
  "sesc_ipiranga",
  "um_poema_para",
  "mundo_livro",
  "retratos_falhados",
  "solidões_da_memoria",
  "tempo_em_furia",
  "coisas_e_nao_coisas",
  "folheto",
  "via_em_7_minutos",
  "nao",
  "bicha",
  "em_contramao",
  "dias_distantes",
  "a_palavraparte",
  "a_mulher_antiga",
  "foice_na_carne",
  "jornada_de_literatura",
  "seminarios_poeticos",
  "conexao",
  "copex",
  "seppi",
  "siec",
  "felisa",
  "imersao_poetica",
  "espaco_153",
  "memoria_do_teatro"
];

/**
 * Obtém o estilo (cor de fundo, texto e borda) para uma tag
 * @param tag - O nome da tag (sem o #)
 * @returns Objeto com as cores
 */
export function getTagStyle(tag: string): { bg: string; text: string; border: string } {
  // 1. 🔴 VERMELHO → Tags de pandemia/virtual
  if (TAGS_PANDEMIA.includes(tag)) {
    return { bg: "#fde8e8", text: "#C0392B", border: "#f5c6c6" };
  }
  
  // 2. 🔵 AZUL → Tags de subcategoria (identificação da linha)
  if (TAGS_SUBCATEGORIA.includes(tag)) {
    return { bg: "#e8f0fe", text: "#2980B9", border: "#c5d8f0" };
  }
  
  // 3. 🟡 DOURADO → Tags de enriquecimento (todas as outras)
  return { bg: "#fdf6e3", text: "#D4AF37", border: "#f0e4c5" };
}

/**
 * Verifica se uma tag é de subcategoria (AZUL)
 */
export function isSubcategoriaTag(tag: string): boolean {
  return TAGS_SUBCATEGORIA.includes(tag);
}

/**
 * Verifica se uma tag é de pandemia (VERMELHA)
 */
export function isPandemiaTag(tag: string): boolean {
  return TAGS_PANDEMIA.includes(tag);
}

/**
 * Verifica se uma tag é de enriquecimento (DOURADA)
 */
export function isEnriquecimentoTag(tag: string): boolean {
  return !TAGS_PANDEMIA.includes(tag) && !TAGS_SUBCATEGORIA.includes(tag);
}
