import { config, fields, singleton } from '@keystatic/core';

// Task 106: molde compartilhado das gavetas do Ativismo Cultural (Eixo Movimento).
// Função devolve um molde FRESCO por ficha (não reaproveita instâncias).
// Espelha o formato ArquivoCategoria lido por SecaoMovimento.tsx — chaves fiéis.
const esquemaAtivismo = () => ({
  categoria: fields.text({ label: 'Categoria interna (não mexer)' }),
  total_registros: fields.integer({ label: 'Total de registros (informativo — não mexer)' }),
  descricao: fields.text({ label: 'Descrição da categoria (informativa)' }),
  tags_comuns: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags comuns da categoria (informativo)', itemLabel: (props: any) => String(props.value) || 'Tag' }),
  registros: fields.array(
    fields.object({
      id: fields.text({ label: 'ID único (não repetir — não mexer)' }),
      numero_ordem: fields.integer({ label: 'Número de ordem (não mexer)' }),
      titulo_evento: fields.text({ label: 'Título do evento' }),
      data: fields.text({ label: 'Data (AAAA-MM-DD; 0000-00-00 = sem data)' }),
      data_fim: fields.text({ label: 'Data final (opcional — AAAA-MM-DD)' }),
      local: fields.text({ label: 'Local' }),
      cidade: fields.text({ label: 'Cidade (opcional)' }),
      estado: fields.text({ label: 'Estado (opcional — sigla, ex.: SP)' }),
      pais: fields.text({ label: 'País (ex.: Brasil)' }),
      categoria_principal: fields.text({ label: 'Categoria principal (não mexer)' }),
      tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags do evento (ex.: sarau, palestra, oficina)', itemLabel: (props: any) => String(props.value) || 'Tag' }),
      slug_texto: fields.text({ label: 'Slug do texto em Ensaios — gera o link "Leia o texto" (não mexer sem orientação)' }),
      texto_original: fields.text({ label: 'Texto original do registro', multiline: true }),
    }),
    {
      label: 'Registros (eventos)',
      // Rótulo de cada registro: título + ano (quando a data tem ano válido)
      itemLabel: (props) => {
        const titulo = String(props.fields.titulo_evento.value || '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const data = String(props.fields.data.value || '');
        const ano = /^\d{4}/.test(data) && !data.startsWith('0000') ? ` (${data.slice(0, 4)})` : '';
        return `${titulo || 'Registro'}${ano}`;
      },
    }
  ),
});

// Task 107: molde das gavetas da Vitrine da Obra (Fatia 4) — espelha o formato
// Livro lido por SecaoObras.tsx: {ano, titulo, descricao, tipo, slug?, ficha?}.
// `ano` é TEXTO porque existem intervalos ("1999-2004") e peças sem data —
// o site extrai o ano base sozinho para a régua de décadas.
function rotuloPeca(props: any) {
  const titulo = String(props.fields.titulo.value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const ano = String(props.fields.ano.value || '').trim();
  return `${titulo || 'Peça'}${ano ? ` (${ano})` : ''}`;
}
const esquemaVitrine = (tipos: { label: string; value: string }[]) => () => ({
  itens: fields.array(
    fields.object({
      ano: fields.text({ label: 'Ano (ex.: 2024; intervalo 1999-2004; vazio = sem data)' }),
      titulo: fields.text({ label: 'Título' }),
      descricao: fields.text({ label: 'Descrição (editora, organização, prêmio…)' }),
      tipo: fields.select({ label: 'Tipo da peça', options: tipos, defaultValue: tipos[0].value }),
      ficha: fields.text({ label: 'Ficha — id da página do livro (opcional)', description: 'Só para livros com página própria; ex.: tempo-em-furia. Alimenta o link "Conheça a obra".' }),
      slug: fields.text({ label: 'Slug do texto integral (opcional)', description: 'Ex.: saramago-e-a-poetica-do-humano. Alimenta o link "Leia o texto".' }),
    }),
    { label: 'Peças', itemLabel: (props) => rotuloPeca(props) }
  ),
});
// Coletâneas: molde próprio com seletor de País (define a aba da home).
const esquemaColetaneas = () => ({
  itens: fields.array(
    fields.object({
      ano: fields.text({ label: 'Ano (ex.: 2024; vazio = sem data)' }),
      titulo: fields.text({ label: 'Título' }),
      descricao: fields.text({ label: 'Descrição (editora, organização, cidade…)' }),
      tipo: fields.select({ label: 'Tipo da peça', options: [{ label: 'Coletânea', value: 'Coletânea' }, { label: 'Revista', value: 'Revista' }], defaultValue: 'Coletânea' }),
      pais: fields.select({ label: 'País (define a aba da home)', options: [{ label: 'Brasil', value: 'Brasil' }, { label: 'Portugal', value: 'Portugal' }, { label: 'Outros países', value: 'Outros países' }], defaultValue: 'Brasil' }),
    }),
    { label: 'Peças', itemLabel: (props) => rotuloPeca(props) }
  ),
});

// Gerado sob medida a partir das 37 fichas reais (regra: só as chaves existentes,
// ordem fiel -> diff mínimo ao salvar). Não editar à mão.
export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'dalila/dalilapoeta',
  },
  ui: {
    // Task 104: menu espelhado nos 3 Eixos do site (o painel só aceita um nível
    // de grupos, então o eixo entra como prefixo: "Obra · Poesia" etc.).
    // As chaves NÃO mudaram — só os nomes dos grupos e a ordem.
    navigation: {
      // ─── EIXO VIDA ───
      'Eixo Vida': ['cronobiografia', 'premios', 'imprensa'],
      // ─── EIXO OBRA — OBRAS PUBLICADAS ───
      'Obra · Poesia': ['passageiraAntologiaPessoal19822024', 'aMulherAntiga', 'aPalavrapartePequenasProsasEmPoemas', 'cidadeAssassinadaTributoACelsoDaniel', 'elementoFuria', 'estranhasFormasDeVida', 'forasteirosRegistrosNordestinos', 'iara', 'insulas', 'inventarioPrecoce', 'licoesDeTempo', 'madeiraDoVinhoASaudade', 'opcoesParaMorrerNoEspaco', 'poesiaDoIntervalo', 'poeticasDasCircunstancias', 'retratosFalhados', 'se', 'solidoesDaMemoria', 'soliloquios', 'sonhoDeHaPouco', 'tempoEmFuria', 'marielleDalila', 'vestigios', 'fugaEUrgencias', 'diuturnos'],
      'Obra · Poesia — Antologia': ['aJanelaDosDias'],
      'Obra · Prosa': ['aVidaCronica', 'alpharrabio12Anos', 'anotacoesDeLeituras', 'asArtesDoOficioUmOlharSobreOAbc', 'minudencias'],
      'Obra · Coleção Mimo': ['pontos'],
      'Obra · Antologia Coletiva': ['caixaPoeticas'],
      'Obra · Caixa Artística': ['pecados'],
      'Obra · Homenagens': ['meiaVidaInteira', 'setentaAnosPoemasLeitores'],
      // ─── EIXO OBRA — VITRINE DA HOME (Fatia 4) ───
      'Obra · Vitrine — Prateleiras': ['vitrinePoesia', 'vitrineProsa', 'vitrineMimo', 'coletaneas', 'colaboracoes'],
      'Obra · Vitrine — Escritos': ['ensaios', 'cronicas', 'entrevistas', 'traducoes'],
      'Obra · Vitrine — Resenhas': ['fortunaCritica', 'verbetes', 'leiturasCriticas', 'estudosCriticos'],
      // ─── EIXO OBRA — ESCRITOS E LEITURAS ───
      'Escritos · Crônicas / Viagem': ['apontamentosAlbumDeViagens'],
      // ─── EIXO MOVIMENTO ───
      'Movimento · Ativismo Cultural': ['palestras', 'oficinasWorkshops', 'sarausRecitais', 'congressosSeminarios', 'conferenciasMesas', 'institucionais', 'encontrosAtividades', 'programasEntrevistas', 'curadoriaConsultoria', 'leiturasPoeticas'],
    },
  },
  singletons: {
    cronobiografia: singleton({
      label: 'CronoBiografia',
      path: 'src/app/data/vida/cronobiografia',
      format: { data: 'json' },
      schema: {
        decadas: fields.array(
          fields.object({
            dezena: fields.text({ label: 'Década (ex.: 2020)' }),
            pecas: fields.array(
              fields.conditional(
                fields.select({
                  label: 'Tipo da peça',
                  options: [
                    { label: 'Trecho narrativo (voz da biografia)', value: 'narrativo' },
                    { label: 'Citação com ano (voz da autora)', value: 'citacao' },
                    { label: 'Trecho institucional (letreiro menor)', value: 'institucional' },
                  ],
                  defaultValue: 'narrativo',
                }),
                {
                  narrativo: fields.object({
                    texto: fields.text({ label: 'Texto (vários parágrafos? Separe com uma linha em branco)', multiline: true }),
                    institucionais: fields.array(
                      fields.text({ label: 'Letreiro institucional' }),
                      { label: 'Letreiros institucionais anexos (opcional)' }
                    ),
                  }),
                  citacao: fields.object({
                    ano: fields.text({ label: 'Ano (ex.: 1946)' }),
                    texto: fields.text({ label: 'Texto (voz da autora)', multiline: true }),
                  }),
                  institucional: fields.object({
                    texto: fields.text({ label: 'Texto (letreiro menor)', multiline: true }),
                  }),
                }
              ),
              {
                label: 'Peças da década',
                // Rótulo de cada peça na lista: tipo + ano/começo do texto
                // (conditional entrega discriminant/value direto no props)
                itemLabel: (props: any) => {
                  const resumo = (t: string) => {
                    const plano = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    return plano.length > 42 ? `${plano.slice(0, 42)}…` : plano;
                  };
                  if (props.discriminant === 'citacao') {
                    return `Citação (${String(props.value.fields.ano.value)}) — ${resumo(String(props.value.fields.texto.value))}`;
                  }
                  if (props.discriminant === 'institucional') {
                    return `Institucional — ${resumo(String(props.value.fields.texto.value))}`;
                  }
                  return `Narrativo — ${resumo(String(props.value.fields.texto.value))}`;
                },
              }
            ),
          }),
          {
            label: 'Décadas',
            // Rótulo de cada década na lista: a própria dezena (ex.: 1940-1949)
            itemLabel: (props) => String(props.fields.dezena.value) || 'Década',
          }
        ),
      },
    }),
    // Task 104: Prêmios e Reconhecimento dadificado (21 itens {ano, texto}).
    // O JSON existente era um array puro; agora vive dentro de "itens" —
    // SecaoPremios e CabecalhoFixo foram ajustados na mesma remessa.
    premios: singleton({
      label: 'Prêmios e Reconhecimento',
      path: 'src/app/data/vida/premios',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            ano: fields.integer({ label: 'Ano (ex.: 1984)' }),
            texto: fields.text({ label: 'Prêmio / Homenagem (texto completo)', multiline: true }),
          }),
          {
            label: 'Prêmios e homenagens',
            // Rótulo de cada item na lista: ano + começo do texto
            itemLabel: (props) => {
              const plano = String(props.fields.texto.value || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              const resumo = plano.length > 46 ? `${plano.slice(0, 46)}…` : plano;
              return `${props.fields.ano.value ?? 'Ano'} — ${resumo}`;
            },
          }
        ),
      },
    }),
    // Task 105: Mídia/Imprensa dadificada — grupos de canais (Blogs, Sites e
    // Redes, Contato) + linha de endereço. Dados em src/app/data/vida/imprensa.json.
    imprensa: singleton({
      label: 'Mídia e Contato',
      path: 'src/app/data/vida/imprensa',
      format: { data: 'json' },
      schema: {
        introducao: fields.text({ label: 'Frase de abertura da página' }),
        grupos: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Título do grupo (com emoji)' }),
            links: fields.array(
              fields.object({
                rotulo: fields.text({ label: 'Nome do link (com emoji)' }),
                url: fields.text({ label: 'Endereço (https://… site/rede, ou mailto:… para e-mail)' }),
                descricao: fields.text({ label: 'Descrição embaixo do link (opcional)', multiline: true }),
              }),
              {
                label: 'Links do grupo',
                // Rótulo de cada link na lista: o próprio nome
                itemLabel: (props) => String(props.fields.rotulo.value) || 'Link',
              }
            ),
          }),
          {
            label: 'Grupos de canais',
            // Rótulo de cada grupo na lista: o próprio título
            itemLabel: (props) => String(props.fields.titulo.value) || 'Grupo',
          }
        ),
        enderecoTitulo: fields.text({ label: 'Linha final — nome em negrito (opcional)' }),
        enderecoLinha: fields.text({ label: 'Linha final — cidade, local (opcional)' }),
      },
    }),
    // Task 106: Eixo Movimento — as 10 gavetas do Ativismo Cultural.
    // Formato fiel a ArquivoCategoria; Palestras+Oficinas viram a sub-aba
    // "Palestras & Oficinas" e Institucionais+EncontrosAtividades viram
    // "Encontros & Reuniões" (fusões já feitas pelo site, dedup por id).
    // O arquivo legado ativismo.json (263 itens, formato antigo, sem uso
    // no site) fica FORA do painel de propósito.
    palestras: singleton({
      label: 'Palestras',
      path: 'src/app/data/movimento/Palestras',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    oficinasWorkshops: singleton({
      label: 'Oficinas & Workshops',
      path: 'src/app/data/movimento/OficinasWorkshops',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    sarausRecitais: singleton({
      label: 'Saraus & Recitais',
      path: 'src/app/data/movimento/SarausRecitais',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    congressosSeminarios: singleton({
      label: 'Congressos & Seminários',
      path: 'src/app/data/movimento/CongressosSeminariosSimposios',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    conferenciasMesas: singleton({
      label: 'Conferências & Mesas',
      path: 'src/app/data/movimento/ConferenciasMesas',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    institucionais: singleton({
      label: 'Institucionais (Encontros & Reuniões)',
      path: 'src/app/data/movimento/Institucionais',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    encontrosAtividades: singleton({
      label: 'Atividades Culturais (Encontros & Reuniões)',
      path: 'src/app/data/movimento/EncontrosAtividadesCulturais',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    programasEntrevistas: singleton({
      label: 'Programas & Entrevistas',
      path: 'src/app/data/movimento/ProgramasEntrevistas',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    curadoriaConsultoria: singleton({
      label: 'Curadoria & Consultoria',
      path: 'src/app/data/movimento/CuradoriaConsultoria',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    leiturasPoeticas: singleton({
      label: 'Leituras Poéticas',
      path: 'src/app/data/movimento/LeiturasPoeticas',
      format: { data: 'json' },
      schema: esquemaAtivismo(),
    }),
    aJanelaDosDias: singleton({
      label: 'À Janela dos Dias',
      path: 'src/app/obra/[id]/a-janela-dos-dias/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        orelha: fields.text({ label: 'Orelha', multiline: true }),
        autorOrelha: fields.text({ label: 'Autor da Orelha' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), origem: fields.text({ label: 'Origem' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    aVidaCronica: singleton({
      label: 'A Vida Crônica',
      path: 'src/app/obra/[id]/a-vida-cronica/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    alpharrabio12Anos: singleton({
      label: 'Alpharrabio 12 anos',
      path: 'src/app/obra/[id]/alpharrabio-12-anos/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    passageiraAntologiaPessoal19822024: singleton({
      label: 'Passageira',
      path: 'src/app/obra/[id]/passageira-antologia-pessoal-1982-2024/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        orelha: fields.text({ label: 'Orelha', multiline: true }),
        autorOrelha: fields.text({ label: 'Autor da Orelha' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    aMulherAntiga: singleton({
      label: 'A Mulher Antiga',
      path: 'src/app/obra/[id]/a-mulher-antiga/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    aPalavrapartePequenasProsasEmPoemas: singleton({
      label: 'A Palavraparte - Pequenas prosas em poemas',
      path: 'src/app/obra/[id]/a-palavraparte---pequenas-prosas-em-poemas/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    anotacoesDeLeituras: singleton({
      label: 'Anotações de Leituras',
      path: 'src/app/obra/[id]/anotacoes-de-leituras/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    apontamentosAlbumDeViagens: singleton({
      label: 'Apontamentos - Álbum de Viagens',
      path: 'src/app/obra/[id]/apontamentos---album-de-viagens/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        orelha: fields.text({ label: 'Orelha', multiline: true }),
        autorOrelha: fields.text({ label: 'Autor da Orelha' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), origem: fields.text({ label: 'Origem' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    asArtesDoOficioUmOlharSobreOAbc: singleton({
      label: 'As Artes do Ofício - Um olhar sobre o ABC',
      path: 'src/app/obra/[id]/as-artes-do-oficio---um-olhar-sobre-o-abc/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    cidadeAssassinadaTributoACelsoDaniel: singleton({
      label: 'Cidade Assassinada - Tributo a Celso Daniel',
      path: 'src/app/obra/[id]/cidade-assassinada---tributo-a-celso-daniel/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    elementoFuria: singleton({
      label: 'Elemento Fúria',
      path: 'src/app/obra/[id]/elemento-furia/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    estranhasFormasDeVida: singleton({
      label: 'Estranhas Formas de Vida',
      path: 'src/app/obra/[id]/estranhas-formas-de-vida/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    forasteirosRegistrosNordestinos: singleton({
      label: 'Forasteiros - Registros Nordestinos',
      path: 'src/app/obra/[id]/forasteiros---registros-nordestinos/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    iara: singleton({
      label: 'Iara',
      path: 'src/app/obra/[id]/iara/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    insulas: singleton({
      label: 'Ínsulas',
      path: 'src/app/obra/[id]/insulas/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    inventarioPrecoce: singleton({
      label: 'Inventário Precoce',
      path: 'src/app/obra/[id]/inventario-precoce/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    licoesDeTempo: singleton({
      label: 'Lições de Tempo',
      path: 'src/app/obra/[id]/licoes-de-tempo/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    madeiraDoVinhoASaudade: singleton({
      label: 'Madeira - Do Vinho à Saudade',
      path: 'src/app/obra/[id]/madeira---do-vinho-a-saudade/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    meiaVidaInteira: singleton({
      label: 'Meia Vida Inteira',
      path: 'src/app/obra/[id]/meia-vida-inteira/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    minudencias: singleton({
      label: 'Minudências',
      path: 'src/app/obra/[id]/minudencias/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    opcoesParaMorrerNoEspaco: singleton({
      label: 'Opções para morrer no espaço',
      path: 'src/app/obra/[id]/opcoes-para-morrer-no-espaco/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        orelha: fields.text({ label: 'Orelha', multiline: true }),
        autorOrelha: fields.text({ label: 'Autor da Orelha' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    pecados: singleton({
      label: 'Pecados',
      path: 'src/app/obra/[id]/pecados/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), subtitulo: fields.text({ label: 'Subtítulo' }), obra_arte: fields.text({ label: 'Obra_arte' }), citacao: fields.text({ label: 'Citacao', multiline: true }), texto: fields.text({ label: 'Texto', multiline: true }), artista: fields.text({ label: 'Artista' }), imagem_arte: fields.text({ label: 'Imagem_arte' }) })),
      },
    }),
    poesiaDoIntervalo: singleton({
      label: 'Poesia do Intervalo',
      path: 'src/app/obra/[id]/poesia-do-intervalo/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    poeticasDasCircunstancias: singleton({
      label: 'Poéticas das Circunstâncias',
      path: 'src/app/obra/[id]/poeticas-das-circunstancias/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    retratosFalhados: singleton({
      label: 'Retratos Falhados',
      path: 'src/app/obra/[id]/retratos-falhados/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    se: singleton({
      label: 'Se',
      path: 'src/app/obra/[id]/se/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    solidoesDaMemoria: singleton({
      label: 'Solidões da Memória',
      path: 'src/app/obra/[id]/solidoes-da-memoria/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), citacao: fields.text({ label: 'Citacao', multiline: true }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),
    soliloquios: singleton({
      label: 'Solilóquios',
      path: 'src/app/obra/[id]/soliloquios/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        sobre: fields.object({ dedicatoria: fields.array(fields.text({ label: 'Dedicatória' })), epigrafes: fields.array(fields.object({ texto: fields.text({ label: 'Texto', multiline: true }), autor: fields.text({ label: 'Autor' }) })) }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        partes: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), poemas: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), citacao: fields.text({ label: 'Citacao' }), texto: fields.text({ label: 'Texto', multiline: true }) })) })),
      },
    }),
    sonhoDeHaPouco: singleton({
      label: 'Sonho de Há Pouco',
      path: 'src/app/obra/[id]/sonho-de-ha-pouco/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    tempoEmFuria: singleton({
      label: 'Tempo em Fúria',
      path: 'src/app/obra/[id]/tempo-em-furia/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    caixaPoeticas: singleton({
      label: 'Caixa Poéticas',
      path: 'src/app/obra/[id]/caixa-poeticas/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    marielleDalila: singleton({
      label: 'Marielle Dalila',
      path: 'src/app/obra/[id]/marielle-dalila/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    vestigios: singleton({
      label: 'Vestígios',
      path: 'src/app/obra/[id]/vestigios/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        sobre: fields.object({ dedicatoria: fields.array(fields.text({ label: 'Dedicatória' })), epigrafes: fields.array(fields.object({ texto: fields.text({ label: 'Texto', multiline: true }), autor: fields.text({ label: 'Autor' }) })) }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        partes: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), poemas: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto', multiline: true }), citacao: fields.text({ label: 'Citacao', multiline: true }) })), citacao: fields.text({ label: 'Citacao', multiline: true }) })),
      },
    }),
    setentaAnosPoemasLeitores: singleton({
      label: 'SETENTA',
      path: 'src/app/obra/[id]/setenta-anos-poemas-leitores/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        sobre: fields.text({ label: 'Sobre', multiline: true }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), texto: fields.text({ label: 'Texto' }), imagem_trecho: fields.text({ label: 'Imagem_trecho' }) })),
      },
    }),
    pontos: singleton({
      label: 'ponto(s)',
      path: 'src/app/obra/[id]/pontos/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    fugaEUrgencias: singleton({
      label: 'fuga e urgências',
      path: 'src/app/obra/[id]/fuga-e-urgencias/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'disponivel' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
      },
    }),
    diuturnos: singleton({
      label: 'Diuturnos',
      path: 'src/app/obra/[id]/diuturnos/dados',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título' }),
        subtitulo: fields.text({ label: 'Subtítulo' }),
        genero: fields.text({ label: 'Gênero (não mexer)' }),
        ano: fields.integer({ label: 'Ano' }),
        capa: fields.text({ label: 'Capa — caminho da imagem (não mexer sem orientação)' }),
        status_catalogo: fields.select({ label: 'Status no Catálogo', options: [{ label: 'Disponivel', value: 'disponivel' }, { label: 'Esgotado', value: 'esgotado' }], defaultValue: 'esgotado' }),
        dados: fields.array(fields.object({ label: fields.text({ label: 'Rótulo' }), valor: fields.text({ label: 'Valor' }) })),
        trechos: fields.array(fields.object({ titulo: fields.text({ label: 'Título' }), imagem_mes: fields.text({ label: 'Imagem_mes' }), texto: fields.text({ label: 'Texto', multiline: true }) })),
      },
    }),

    // ─── Task 107: Vitrine da Obra (Fatia 4) — 13 gavetas, dados da home ───
    vitrinePoesia: singleton({
      label: 'Vitrine · Poesia',
      path: 'src/app/data/obra/vitrine-poesia',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Livro', value: 'Livro' }, { label: 'Plaquete', value: 'Plaquete' }, { label: 'Caixa Artística', value: 'Caixa Artística' }, { label: 'Edição Artística', value: 'Edição Artística' }])(),
    }),
    vitrineProsa: singleton({
      label: 'Vitrine · Prosa',
      path: 'src/app/data/obra/vitrine-prosa',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Livro', value: 'Livro' }, { label: 'Plaquete', value: 'Plaquete' }])(),
    }),
    vitrineMimo: singleton({
      label: 'Vitrine · Mimo',
      path: 'src/app/data/obra/vitrine-mimo',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Plaquete', value: 'Plaquete' }])(),
    }),
    coletaneas: singleton({
      label: 'Vitrine · Coletâneas (Países)',
      path: 'src/app/data/obra/coletaneas',
      format: { data: 'json' },
      schema: esquemaColetaneas(),
    }),
    colaboracoes: singleton({
      label: 'Vitrine · Colaborações Literárias',
      path: 'src/app/data/obra/colaboracoes',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Apresentação', value: 'Apresentação' }, { label: 'Prefácio', value: 'Prefácio' }, { label: 'Orelha', value: 'Orelha' }, { label: 'Posfácio', value: 'Posfácio' }, { label: 'Adaptação', value: 'Adaptação' }, { label: 'Ensaio', value: 'Ensaio' }, { label: 'Resenha', value: 'Resenha' }])(),
    }),
    ensaios: singleton({
      label: 'Vitrine · Ensaios',
      path: 'src/app/data/obra/ensaios',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Ensaio', value: 'Ensaio' }, { label: 'Palestra', value: 'Palestra' }, { label: 'Comunicação', value: 'Comunicação' }, { label: 'Discurso', value: 'Discurso' }, { label: 'Artigo', value: 'Artigo' }, { label: 'Depoimento', value: 'Depoimento' }])(),
    }),
    cronicas: singleton({
      label: 'Vitrine · Crônicas',
      path: 'src/app/data/obra/cronicas',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Crônica', value: 'Crônica' }])(),
    }),
    entrevistas: singleton({
      label: 'Vitrine · Entrevistas',
      path: 'src/app/data/obra/entrevistas',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Entrevista', value: 'Entrevista' }])(),
    }),
    traducoes: singleton({
      label: 'Vitrine · Traduções',
      path: 'src/app/data/obra/traducoes',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Tradução', value: 'Tradução' }])(),
    }),
    verbetes: singleton({
      label: 'Vitrine · Verbetes',
      path: 'src/app/data/obra/verbetes',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Verbete', value: 'Verbete' }])(),
    }),
    fortunaCritica: singleton({
      label: 'Vitrine · Fortuna Crítica',
      path: 'src/app/data/obra/fortuna-critica',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Resenha', value: 'Resenha' }])(),
    }),
    leiturasCriticas: singleton({
      label: 'Vitrine · Leituras Críticas',
      path: 'src/app/data/obra/leituras-criticas',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Leitura Crítica', value: 'Leitura Crítica' }])(),
    }),
    estudosCriticos: singleton({
      label: 'Vitrine · Estudos Críticos',
      path: 'src/app/data/obra/estudos-criticos',
      format: { data: 'json' },
      schema: esquemaVitrine([{ label: 'Estudo Crítico', value: 'Estudo Crítico' }])(),
    }),
  },
});
