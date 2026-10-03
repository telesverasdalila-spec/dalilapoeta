# Worklog — Site Memorial Dalila Teles Veras

---
Task ID: 1
Agent: Super Z (principal)
Task: Reconstituir o template original do site memorial (Next.js) a partir de arquivos colados pelo usuário (uploads falhando)

Work Log:
- Ambiente fullstack Next.js inicializado (init script OK, dev server porta 3000)
- Pesquisa real: biografia/obras da Dalila Teles Veras (Wikipédia, Quatetê, Jornal de Poesia) — salvos em scripts/wiki_texto.txt, search1/2.json
- Imagens placeholder geradas: public/dalila-colorida.png (retrato artístico) + public/dalila-pb.png (P&B via PIL)
- Área de montagem criada em template-original/ (app/ e components/)

Arquivos recebidos do usuário (coleados no chat):
- [x] app/Hero.tsx          (1º colado — hero com eixos vida/obra/movimento, imagens pb/colorida)
- [x] app/page.tsx          (2º colado — home: Hero + condicionais por eixo + rodapé #2D3748)
- [x] app/globals.css       (3º colado — visual completo; ver insights abaixo)
- [x] app/layout.tsx        (4º colado — Inter var --font-inter + Cormorant_Garamond var --font-cormorant, lang pt-BR, body min-h-full flex flex-col)
- [x] components/CabecalhoFixo.tsx (5º colado — abas internas do eixo Vida)
- [x] components/EstradaVida.tsx   (6º colado — CronoBiografia completa em 7 décadas, c-1940..c-2020)
- [x] components/ReguaTempo.tsx    (7º colado — régua de décadas com scroll-spy + modo "marco")
- [x] components/SecaoPremios.tsx  (8º colado — prêmios agrupados por década, linha vinho)

Observações de SecaoPremios.tsx:
- premios.json: itens { ano: number, descricao: string }; ordena b.ano - a.ano (mais novo → mais velho)
- Agrupa por década via extrairAnoBase(ano) do lib/tempo (3ª função confirmada do lib: calcularDecadas, scrollParaSecao, extrairAnoBase)
- Wrapper externo usa classe .header-obra como CONTAINER da seção (é por isso que ReguaTempo busca .header-obra como fallback) — sem regra CSS no globals.css (ok, semântica)
- Separadores de década: id={`c-${decada}`} + .separador-genero → servem de âncora p/ régua dos prêmios (ordem decrescente)
- .estrada .estrada-obra (linha vinho) + .trecho com strong ano — descrição justificada
- Mesmo padrão de agrupamento será usado em Obras e Movimento (comentário no código)

Observações de ReguaTempo.tsx:
- Dois modos: "decadas" (botões + scroll-spy) e "marco" (selo único tipo "Desde 1992" — usado provavelmente na Obra)
- Formato dos rótulos de década: "1940-1949"; alvo de scroll = id `${idPrefix}${anoInicio}` (ex.: c-1940) com fallback para anos dentro da década
- Scroll-spy: no scroll (rAF throttled), calcula seção mais próxima sob o header (header-vida OU header-obra — ⚠️ .header-obra confirmada aqui, provavelmente header sticky da SecaoObras)
- Botão ativo auto-centraliza horizontalmente na .regua-anos
- irParaDecada: scroll suave com offset do header -20px
- ⚠️ Import `scrollParaSecao` de "./lib/tempo" é NÃO USADO no código (irParaDecada tem lógica própria) → na integração, criar a função no lib/tempo.ts mesmo assim OU remover o import p/ lint limpo (decidir: manter fidelidade + função existente no lib é mais seguro)
- ⚠️ Import path "./lib/tempo" (relativo a components/) ≠ "../lib/tempo" do CabecalhoFixo → na integração normalizar para "@/lib/tempo" nos dois

Observações de EstradaVida.tsx:
- Seções por década com id="c-1940".."c-2020" e classe .secao-decada → ReguaTempo provavelmente faz scroll para esses ids
- Usa .trecho (narrativa), .trecho-citacao (memórias em 1ª pessoa com .ano), span[data-ano="1972"] (iluminação), span.institucional (cargo/filiações)
- Classes .secao-decada e .institucional NÃO existem no globals.css colado (ou eram em outro css ou sem estilo) — verificar com usuário se quer regra para .institucional
- Conteúdo fiel: nasceu 02.07.1946; emigrou 1957 no Santa Maria; 1972 casou c/ Valdecirio Teles Veras → Santo André; filhas Carolina/Isabela/Alice; 5 netos; Livrespaço 1983-94; APCA 1993 (revista Livrespaço); UBE 86-96; Alpharrabio desde 1992; coluna Viaverbo 95-99; 7 Anos 7 Cidades (1999); Cidadã Honorária 2004 (Câmara); Janela Cultural RedeTV 2007-09; blogs; UFABC CEC 2013-23; Mulherio das Letras 2017; Honoris Causa UFABC (ato nº 181/2019, cerimônia 21.9.2021); Colar Guilherme de Almeida 2022; VI FELISA 2023

Novos arquivos descobertos via imports de CabecalhoFixo:
- [ ] components/ReguaTempo.tsx  (props: modo="decadas", decadas, ordemScroll="decrescente")
- [ ] lib/tempo.ts               (função calcularDecadas(anos, ordem))
- [ ] data/vida/premios.json     (itens com campo .ano)

Lógica do CabecalhoFixo (eixo Vida tem 3 ABAS INTERNAS):
- crono   → título "CronoBiografia" / subtítulo "Da Madeira ao Brasil: A poesia como ato de resistência" → régua décadas 1940..ano atual (crescente) → deve renderizar EstradaVida
- premios → "Prêmios e Reconhecimentos" / "Prêmios, láureas, homenagens, títulos" → régua décadas dos anos de premios.json (decrescente) → deve renderizar SecaoPremios
- imprensa→ "Mídia" / "Presença digital da autora" → SEM régua → deve renderizar SecaoImprensa
- IntersectionObserver ilumina span[data-ano] ao passar sob o header (rootMargin = altura do header + 10px); re-observa ao trocar aba

⚠️ INCONSISTÊNCIA detectada no page.tsx colado:
- page.tsx chama <CabecalhoFixo abaAtiva="vida" mudarAba={() => {}} /> e renderiza EstradaVida + SecaoPremios juntos, sem SecaoImprensa
- Com abaAtiva="vida" o título vira "CronoBiografia" e NENHUMA régua aparece; botões de aba não fazem nada (mudarAba vazio)
- PERGUNTA pro usuário na hora da integração: restaurar a lógica de abas (estado abaAtiva no page/eixo Vida com render condicional crono/premios/imprensa) ou manter literal como colou?
- Recomendação: restaurar lógica (CabecalhoFixo foi claramente construído para isso)

⚠️ FIX necessário na integração (manter arquivo original intacto em template-original/):
- globals.css body usa font-family: 'Cormorant Garamond' literal — next/font gera nome com hash, então o literal NÃO resolve.
  Ao montar em src/, trocar body para: font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  (Inter já ok via @theme --font-sans: var(--font-inter); elementos que usam 'Inter' literal idem — substituir por var(--font-inter))

Notas do usuário sobre SecaoImprensa:
- Contém dados de contato/mídia: links, telefone, redes sociais
- Todos os menus chamam listagens, EXCETO SecaoImprensa (só dados de mídia/internet)
- Nome "Imprensa" mantido, conteúdo mudou

Insights extraídos do globals.css:
- Fontes: 'Cormorant Garamond' (body, por nome literal) + 'Inter' (tabs/menus) + var(--font-inter) no @theme → layout.tsx provavelmente carrega via next/font (Inter com variable) e/ou <link> Google Fonts
- Paleta: dourado #d4af37 (vida), vinho #7a3b5a (obra), header #fdfcf8, rodapé #2D3748
- Hero: crossfade pb→colorida on hover (opacity 0.85/1.2s)
- CabecalhoFixo: header-vida sticky, tabs-principal (tab-btn.ativa), tabs-sub (tab-sub-btn.ativa), container .ativismo-ativo força tabs-sub visível no mobile
- Régua do tempo: regua-tempo (btn-decada por década, .escondida esconde) — interage com span[data-ano].data-iluminada (anços iluminados ao clicar década)
- EstradaVida: container-vida, .estrada (linha vertical dourada ::before), .trecho (::after bolinha), titulo-evento, local-info, data-info, tags-container/tag, texto-original, trecho-citacao (blocos de citação #f4f0e6)
- SecaoObras: .estrada-obra (linha vinho), .separador-genero (separadores por gênero), .tipo-publicacao (selinho em itálico)
- Responsivo: 768px (mobile), 480px, 390-420px — tudo já coberto

Arquivos pendentes (inferidos dos imports de page.tsx):
- [ ] components/CabecalhoFixo.tsx   (cabeçalho com abas, prop abaAtiva/mudarAba)
- [ ] components/EstradaVida.tsx     (linha do tempo "estrada")
- [ ] components/SecaoPremios.tsx    (prêmios)
- [ ] components/SecaoObras.tsx      (obras)
- [ ] components/SecaoMovimento.tsx  (movimento)
- [ ] components/SecaoImprensa.tsx   (imprensa/mídia — importada mas NÃO usada no JSX de page.tsx)
- [ ] app/layout.tsx (fontes: Inter/Cormorant Garamond)

Stage Summary:
- Aguardando usuário colar os demais arquivos; nada foi movido para src/ ainda
- Decisão: montar em template-original/ e copiar para src/ só quando completo (evita quebrar dev server)

---
Task ID: 1-b
Agent: Super Z (principal)
Task: Receber parte 4/4 e integrar as 4 partes de SecaoObras.tsx num arquivo único

Work Log:
- Parte 4/4 salva em template-original/parts/SecaoObras.p4.tsx (dadosFortunaCritica 10 resenhas + componente completo)
- Integração: cat p1+p2+p3+p4 > components/SecaoObras.tsx (345 linhas) — verificado: 10 arrays + componente, fechamento OK
- ⚠️ AJUSTE aplicado na linha 7 (tipo TabObra): "cronicas" → "ensaios"
  Motivo: a lógica do componente (p4) usa "ensaios" como ABA PRINCIPAL; "cronicas" é SUBABA de ensaios.
  Sem o ajuste o TypeScript daria erro (TS2367) nas comparações tabAtiva === "ensaios".
  Subabas "cronicas" nas linhas 259/336 preservadas intactas.
- Estrutura integrada confirmada (10 arrays de dados):
  dadosPoesia(23) · dadosProsa(7) · coletaneasBrasil(35) · coletaneasPortugal(8) · coletaneasOutros(7)
  · dadosColaboracoes(~55) · dadosEnsaios(25) · dadosCronicas(9) · dadosVerbetes(12) · dadosFortunaCritica(10)
- 5 abas principais: obras(poesia|prosa) · coletaneas(brasil|portugal|outros) · colaboracoes(apresentacoes|prefacios|adaptacoes) · ensaios(ensaios|cronicas) · resenhas(fortuna|verbetes)
- Novas descobertas do componente:
  * CabecalhoObra props: tabAtiva, mudarTab, subTabAtiva, mudarSubTab, anos (= calcularDecadas(anos, "crescente"))
  * 🔗 Link "Conheça a obra →" apenas na aba "obras" → href=/obra/{slug} onde slug = titulo.toLowerCase().normalize("NFD").removeAcentos.replace(espacos/–—(), '-')
    ⇒ EXISTE uma página dinâmica de conteúdo por livro (app/obra/[slug]/page.tsx ou similar) — PENDENTE pedir ao usuário
  * window.scrollTo({top:0, behavior:"instant"}) ao trocar aba/subaba
  * Agrupamento: decada = floor(anoBase/10)*10; separador id={`c-${decada}`} com rótulo anoVisivel (valor bruto do 1º item do grupo); decada 0 → "Data não informada"
  * ⚠️ Para lib/tempo.ts: extrairAnoBase DEVE lidar com number | string — casos reais: "1999-2004" (faixa, dadosCronicas) e 0 (dadosColaboracoes ~10 itens "Data não informada")
  * Estado vazio: bloco "📝 Conteúdo em processo de curadoria..." quando obrasAtuais.length === 0

Stage Summary:
- SecaoObras.tsx COMPLETO e arquivado em template-original/components/ (fonte: 4 partes em parts/)
- Pendências restantes: components/CabecalhoObra.tsx · components/SecaoMovimento.tsx · components/SecaoImprensa.tsx · lib/tempo.ts · data/vida/premios.json · app/obra/[slug]/page.tsx (página de conteúdo do livro — NOVA descoberta)
- Pergunta ainda sem resposta do usuário: page.tsx do eixo Vida — restaurar lógica das abas (recomendado) ou manter literal?

---
Task ID: 1-c
Agent: Super Z (principal)
Task: Receber e arquivar components/SecaoImprensa.tsx (9º arquivo colado)

Work Log:
- Salvo em template-original/components/SecaoImprensa.tsx — FIEL ao colado, sem modificações
- Análise do componente:
  * "use client" necessário (usa onMouseOver/onMouseOut para underline nos links)
  * SEM props, SEM imports (nem React/Link) — componente 100% apresentacional
  * Reusa classes do eixo Vida: .container-vida + .estrada (linha DOURADA, não .estrada-obra vinho) + .trecho
  * 3 blocos com h3 inline-styled (dourado #d4af37 + borda inferior #ebebeb): Blogs / Sites e Redes Sociais / Contato
  * Links inline-styled vinho #7a3b5a com underline on-hover via handlers JS
  * Conteúdo real: blog À Janela dos Dias (dalilatelesveras.blogspot.com, desde 2009) · Blog do Alpharrabio (blog.alpharrabio.com.br, 2006-2023) · site alpharrabio.com.br · Instagram @dalilatelesveras · Facebook /dalilatelesveras · e-mail dalila@alpharrabio.com.br · endereço institucional Alpharrabio, Santo André SP
  * ⚠️ SEM telefone no código atual (nota antiga do usuário citava telefone — conteúdo evoluiu, nada a fazer, fidelidade mantida)
  * Confirma o padrão "exceção": sem ReguaTempo, sem décadas, sem listagem — só mídia/contato
  * Encaixe: renderiza quando aba "imprensa" do eixo Vida estiver ativa (lógica do CabecalhoFixo)

Stage Summary:
- 11/11 arquivos colados recebidos e arquivados (Hero, page, globals.css, layout, CabecalhoFixo, EstradaVida, ReguaTempo, SecaoPremios, SecaoObras ✓, SecaoImprensa ✓, SecaoMovimento ✓)
- Pendências restantes: components/CabecalhoObra.tsx · lib/tempo.ts · lib/tags.ts (NOVO) · data/vida/premios.json · 11 × data/movimento/*.json (NOVO) · app/palestras/[slug]/page.tsx (NOVO) · app/obra/[slug]/page.tsx
- Decisão pendente do usuário: eixo Vida no page.tsx — restaurar abas (recomendado) ou manter literal
- Usuário pediu: falar em PORTUGUÊS a partir de agora (respostas estavam em chinês)

---
Task ID: 1-d
Agent: Super Z (principal)
Task: Receber e arquivar components/SecaoMovimento.tsx (11º arquivo colado — eixo Movimento completo)

Work Log:
- Salvo em template-original/components/SecaoMovimento.tsx — FIEL ao colado (incl. comentários "✅ CORRIGIDO" do usuário)
- Usuário confirmou nos comentários que os paths já estão corrigidos p/ src/: ../components/ReguaTempo, ../lib/tempo, ../lib/tags, ../data/movimento/* (a partir de components/, ../X = src/X — todos resolvem corretamente)

Análise do componente (AUTOSSUFICIENTE — header próprio):
- Header próprio: .header-vida + h1#titulo-pagina "Projetos Culturais" + .header-subtitle "Projetos, Ativismo e Iniciativas"
- 6 ABAS PRINCIPAIS (estado próprio tabAtiva, default "ativismo"):
  ativismo | alpharrabio | nucleo | abeces | livrespaco | emmovimento
- 9 SUB-ABAS (só na aba ativismo; subAtivismo default "palestras_oficinas"):
  palestras_oficinas · saraus · congressos · conferencias · institucionais · atividades_culturais · programas · curadoria · leituras
- Aba ativismo: dados JSON agrupados DÉCADA (id={`c-${decada}`} .separador-genero) → ANO (separador mini 0.65rem #ccc) → EventoCard
- Outras 5 abas: textos estáticos embutidos no record `textos` (alpharrabio 4 trechos · nucleo 5 · abeces 4 · emmovimento 6 · livrespaco 3)
- Wrapper: className="ativismo-ativo" quando tab=ativismo (força tabs-sub visível mobile) + inline maxWidth 850px
- Régua: <ReguaTempo modo="decadas" decadas={...} decadaInicial={...} sempreVisivel />

🆕 DESCOBERTAS:
1. lib/tags.ts — NOVO lib: getTagStyle(tag) → { bg, text, border } (cores das tags #tag)
2. 11 JSONs de data/movimento/: Palestras · LeiturasPoeticas · SarausRecitais · CongressosSeminariosSimposios · ConferenciasMesas · OficinasWorkshops · Institucionais · EncontrosAtividadesCulturais · CuradoriaConsultoria · ProgramasEntrevistas · ativismo
3. ROTA DINÂMICA /palestras/[slug_texto] — EventoCard renderiza Link "Leia o texto →" quando registro tem slug_texto
4. ReguaTempo NOVOS props: decadaInicial (string) + sempreVisivel (boolean) — atualizar união de props conhecida

Lógica relevante:
- FUSÃO de dados: palestras SEM slug_texto + oficinas → dedupe por ID (Map) → sub-aba "palestras_oficinas"
- formatarData("YYYY-MM-DD"): "0000-00-00"→"" · YYYY-00-00→ano · YYYY-MM-00→"mês de ano" · completo→d/m/yyyy
- agruparPorDecada: sort DESC por anoBase, pula anoBase===0, agrupa década→ano
- EventoNovo: { id, titulo_evento, data "YYYY-MM-DD", data_fim?, local, cidade, estado, pais, categoria_principal, tags[], participantes?, slug_texto?, texto_original }
- ArquivoCategoria: { categoria, total_registros, descricao, tags_comuns, registros }
- Estado vazio: "📝 Nenhum registro encontrado para esta categoria."

⚠️ IMPORTS NÃO USADOS (decidir na integração):
- dadosAtivismos (data/movimento/ativismo.json) — importado mas NÃO aparece em dadosPorSubAba
- dadosPremios (data/vida/premios.json) — importado mas NÃO usado no corpo
- Opções: (a) remover imports p/ lint limpo ou (b) manter fidelidade + arquivos JSON mesmo assim
- Sugestão: manter os JSONs no projeto (podem ser úteis) e remover só os 2 imports não usados — ou perguntar ao usuário

Stage Summary:
- Eixo MOVIMENTO completo e arquivado (componente mais complexo até agora: 6 abas + 9 sub-abas + fusão de dados)
- Total: 11 arquivos TSX/CSS colados arquivados em template-original/
- Pendências: components/CabecalhoObra.tsx · lib/tempo.ts · lib/tags.ts · data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 1-e
Agent: Super Z (principal)
Task: Receber e arquivar components/CabecalhoObra.tsx (12º arquivo colado — cabeçalho do eixo Obra)

Work Log:
- Salvo em template-original/components/CabecalhoObra.tsx — FIEL ao colado
- Props confirmadas: { tabAtiva: string, mudarTab, subTabAtiva, mudarSubTab, anos: string[] } — bate com o que SecaoObras passa (anos = calcularDecadas(anos, "crescente"))
- 5 abas principais: obras · coletaneas · colaboracoes · ensaios · resenhas
  ✅ CONFIRMA o ajuste "cronicas"→"ensaios" feito na integração do SecaoObras (aba principal é "ensaios"; "cronicas" é sub-aba)
- Sub-abas por aba:
  * obras (default): poesia | prosa — "Obras Publicadas" / "Relação das obras da autora, desde a primeira publicação"
  * coletaneas: brasil | portugal | outros — "Coletâneas & Antologias"
  * colaboracoes: apresentacoes | prefacios | adaptacoes — "Colaborações Literárias"
  * ensaios: ensaios | cronicas — "Ensaios & Crônicas"
  * resenhas: fortuna | leituras | estudos | verbetes — "Críticas & Resenhas"
- ⚠️ DESCOBERTA: aba resenhas tem 4 SUB-ABAS (fortuna, leituras, estudos, verbetes), mas SecaoObras só tem arrays dadosFortunaCritica + dadosVerbetes
  → na integração, VERIFICAR como SecaoObras trata subTabAtiva "leituras"/"estudos" (provável: caem no estado vazio "Conteúdo em processo de curadoria")
- Classe do header: .header-vida (mesma do eixo Vida — NÃO existe .header-obra específica aqui; ReguaTempo faz fallback p/ ambas)
- Régua: <ReguaTempo modo="decadas" decadas={anos} ordemScroll="decrescente" /> — sem decadaInicial/sempreVisivel
- Títulos/subtítulos trocam por aba (let + if/else, ids #titulo-pagina / #subtitulo-pagina mantidos p/ scroll-spy)
- "use client" necessário (onClick handlers)

Stage Summary:
- 12 arquivos arquivados; eixo Obra agora tem cabeçalho + seção completos
- Pendências restantes: lib/tempo.ts · lib/tags.ts · data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 1-f
Agent: Super Z (principal)
Task: Receber e arquivar lib/tempo.ts (13º arquivo colado — funções compartilhadas da régua do tempo)

Work Log:
- Salvo em template-original/lib/tempo.ts — FIEL ao colado (incl. comentários de correção do usuário)
- 3 funções confirmadas com assinaturas exatas:
  * extrairAnoBase(ano: number | string): number — number retorna direto (incl. 0); string → regex /\d{4}/ (1º ano de 4 dígitos; "1999-2004" → 1999); sem match → 0
  * calcularDecadas(anos: number[], ordem: "crescente" | "decrescente" = "crescente"): string[] — filtra a > 0; rótulos `${d}-${d+9}` (ex: "1980-1989"); vazio → []; decrescente inverte
  * scrollParaSecao(idDoDestino: string) — scroll suave com offset .header-vida.offsetHeight - 20px
- ✅ VALIDAÇÕES CRUZADAS:
  * calcularDecadas retorna string[] → bate com CabecalhoObra.props anos: string[] ✅
  * extrairAnoBase number|string cobre os casos reais do SecaoObras (0 = "Data não informada", "1999-2004" em dadosCronicas) ✅
  * decadaInicial do SecaoMovimento = decadasFixas[last] → string "2020-2029" (ReguaTempo decadaInicial é STRING de rótulo) ✅
- ⚠️ Nota integração: ReguaTempo importa scrollParaSecao de "./lib/tempo" (path errado + import não usado — irParaDecada tem lógica própria). Na integração: corrigir path p/ "../lib/tempo" e/ou remover o import (decidir)
- Header do doc: usuário explica que o lib centraliza lógica que antes era duplicada por seção

Stage Summary:
- lib/tempo.ts completo — desbloqueia compilação de CabecalhoFixo, ReguaTempo, SecaoPremios, SecaoObras, SecaoMovimento
- Pendências restantes: lib/tags.ts · data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 1-g
Agent: Super Z (principal)
Task: Receber e arquivar lib/tags.ts (14º arquivo colado — sistema de cores das tags)

Work Log:
- Salvo em template-original/lib/tags.ts — FIEL ao colado
- Sistema de cores por categoria (getTagStyle → { bg, text, border }):
  * 🔴 VERMELHO #fde8e8/#C0392B — TAGS_PANDEMIA (2: atividades_virtuais_pandemia, virtual)
  * 🔵 AZUL #e8f0fe/#2980B9 — TAGS_SUBCATEGORIA (21: palestra, sarau, recital, congresso... leitura_poetica)
  * 🟡 DOURADO #fdf6e3/#D4AF37 — TAGS_ENRIQUECIMENTO (~230 tags: pessoas, instituições, temas, eventos/projetos)
  * ⚠️ DOURADO é o FALLBACK: qualquer tag fora das 2 listas explícitas recebe dourado (dados podem ter tags novas)
- Predicates extra: isSubcategoriaTag, isPandemiaTag, isEnriquecimentoTag (enriquecimento = NÃO pandemia E NÃO subcategoria → inclui desconhecidas)
- ⚠️ Tags com acentos/cedilha nos valores: "livrespaço", "25_anos_livrespaço", "solidões_da_memoria" — manter EXATOS (batem com os valores nos JSONs)
- SecaoMovimento só importa { getTagStyle }; predicates são exports extras (uso futuro/externo)
- Comentário de localização do usuário: "app/lib/tags.ts" — na nossa estrutura src/ vai para src/lib/tags.ts; import "../lib/tags" do SecaoMovimento resolve correto

Stage Summary:
- lib/ COMPLETO (tempo.ts + tags.ts) — todos os imports TS do projeto agora resolvidos exceto páginas de conteúdo
- Pendências restantes: data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 1-h
Agent: Super Z (principal)
Task: Receber e arquivar lib/tag.ts (15º arquivo colado — tipos compartilhados dos JSONs de movimento)

Work Log:
- Salvo em template-original/lib/tag.ts (SINGULAR — arquivo distinto de tags.ts, os dois coexistem no lib/)
- Conteúdo: exports EventoNovo + ArquivoCategoria ("molde do arquivo JSON inteiro")
- ⚠️ DISCREPÂNCIA detectada vs. a cópia LOCAL dentro de SecaoMovimento.tsx:
  * tag.ts NÃO tem o campo slug_texto?: string
  * SecaoMovimento.tsx (cópia local) TEM slug_texto?: string (necessário p/ o Link "Leia o texto →" → /palestras/[slug])
  * SEM conflito de compilação: SecaoMovimento declara as interfaces localmente (não importa de tag.ts) e faz casts `as ArquivoCategoria`
- Nenhum arquivo recebido até agora importa de tag.ts — provável consumidor: app/palestras/[slug_texto]/page.tsx (a receber)
- Nada a corrigir agora; manter fiel. Na integração, opção futura: SecaoMovimento importar tipos de lib/tag.ts estendendo EventoNovo c/ slug_texto — MAS só se usuário quiser (fidelidade primeiro)

Stage Summary:
- lib/ agora com 3 arquivos: tempo.ts · tags.ts · tag.ts
- Pendências restantes: data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)
- Pergunta nova ao usuário (não bloqueante): a página /palestras/[slug_texto] importa os tipos de lib/tag.ts?

---
Task ID: 1-h-correção
Agent: Super Z (principal)
Task: Correção do usuário — lib/tag.ts NÃO existe no template original

Work Log:
- Usuário esclareceu: só existe tags.ts no lib/; ele esqueceu que já tinha enviado e digitou o nome errado ("tag.ts")
- Ação: REMOVIDO template-original/lib/tag.ts (rm) — lib/ confirmado com apenas tempo.ts + tags.ts
- Os tipos EventoNovo/ArquivoCategoria vivem LOCALMENTE dentro de SecaoMovimento.tsx (declarações próprias + casts as ArquivoCategoria) — sem lib de tipos compartilhados
- A pergunta sobre import de tipos pela página /palestras/[slug_texto] fica sem efeito (não há lib/tag.ts); quando a página chegar, ver como ela tipa os dados

Stage Summary:
- lib/ FINAL: tempo.ts + tags.ts (2 arquivos)
- Estrutura do template-original até aqui: app/ (Hero, page, globals.css, layout) · components/ (CabecalhoFixo, EstradaVida, ReguaTempo, SecaoPremios, SecaoObras, SecaoImprensa, SecaoMovimento, CabecalhoObra) · lib/ (tempo, tags) · parts/ (4 partes SecaoObras)
- Pendências restantes: data/vida/premios.json · 11 × data/movimento/*.json · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 1-i
Agent: Super Z (principal)
Task: Receber e arquivar data/movimento/Institucionais.json (16º arquivo — 1º JSON de dados)

Work Log:
- Uploads FALHARAM de novo (3 tentativas: zip, imagens, jsons — diretório upload/ sempre vazio) → usuário passou a COLAR os JSONs
- Criadas pastas template-original/data/movimento/ e data/vida/
- Salvo data/movimento/Institucionais.json — FIEL, uma linha; JSON validado (python json.load ✓)
- 8 registros: inst-001..008 · anos 1986, 1990, 1992, 1998, 1999, 2000, 2007, 2013
- Conteúdo real: UBE-SP (1986, Secretária Geral/Diretora/Conselho) · Instituto Fernando Pessoa (1990, Vice-Presidência) · CEC-UFABC (2013-23, 5 mandatos) · Conselho Municipal de Cultura Santo André (1998, Voto de Congratulações) · Laboratório Gestão Regional IMES (1999-2001) · Conselho Editorial Cadernos CEAPOG (2000, 12 números) · Fórum Permanente de Debates Culturais Grande ABC (coordenou 2007-2017) · Alpharrabio (desde 1992, diretora-proprietária, catálogo ~200 títulos)
- DESCOBERTAS de schema (vs. interface EventoNovo do SecaoMovimento):
  * CAMPO EXTRA: numero_ordem (nº em todos os 8 registros — sem efeito p/ TS, cast as ArquivoCategoria tolera extras)
  * TODOS têm slug_texto (ex: "ube-sp", "alpharrabio") → EventoCard renderizará Link "Leia o texto →" → /palestras/{slug} mesmo em institucionais (comportamento do template: fiel)
  * Tags com HÍFEN não presentes em tags.ts ("fernando-pessoa", "comite-extensao", "conselho-municipal", "santo-andre", "forum-debates", "grande-abc") → getTagStyle cai no FALLBACK dourado ✓
  * Datas: mistura "1986-01-00" (mês sem dia → "janeiro de 1986") e "1998-10-20" (completa → 20/10/1998) — formatarData cobre ✓

Stage Summary:
- 1/12 JSONs arquivados (11 movimento + premios)
- Pendências: data/vida/premios.json · 10 × data/movimento/*.json (Palestras, LeiturasPoeticas, SarausRecitais, CongressosSeminariosSimposios, ConferenciasMesas, OficinasWorkshops, EncontrosAtividadesCulturais, CuradoriaConsultoria, ProgramasEntrevistas, ativismo) · app/palestras/[slug_texto]/page.tsx · app/obra/[slug]/page.tsx
- Decisão pendente: abas do eixo Vida no page.tsx (recomendado: restaurar)

---
Task ID: 7
Agent: Super Z (principal)
Task: RESGATE PÓS-RECICLAGEM DA MÁQUINA + adoção do projeto canônico da usuária (Drive)

Work Log:
- DIAGNÓSTICO: a máquina foi reciclada no meio da sessão (rootfs mudou de id ~13:48). Explica: uploads obra.zip falhando (2 sessões), rm -rf inconsistente, processos morrendo. A reciclagem restaurou o FS para o commit HEAD de 23 Sep (src/ = scaffold; perdeu-se TODO o src/ das obras, gerar_vestigios.py/gerar_janela_dias.py, screenshots, legado_*.htm e flat_originals de parts/).
- SOBREVIVERAM: template-original/ (23 Sep), scripts/ parciais, worklog.md parcial (Tasks 1..1-i), public (dalila imgs), .git (só até 23 Sep), e o download NOVO do Drive.
- Usuária forneceu pasta do Drive (1BKl9rZYQEMZRwGcda2CJWlaB7DIzzvC2) após liberar acesso. gdown baixou 187 arquivos/95MB = SEU projeto canônico mais recente (app/ com componentes, lib, data, obra/[id] com 34 dados.json, cronicas/, ensaios/, texto/, public com 53 imagens).
- Decisão: ADOÇÃO INTEGRAL do projeto dela (prevalece sobre reconstruções). src/app recebeu app/ completo; obra/[id]/page.tsx dela virou ConteudoObra.tsx + wrapper server (page.tsx) com generateStaticParams (34 ids via fs) + generateMetadata (fs read dados.json + sobreTexto de src/lib/tipos-obras.ts).
- Limpeza: removidos src/components (cópias template), src/data, src/lib/{obras,tempo,tags}.ts (duplicados); dados vivem em src/app/data e src/app/obra/[id]/*/dados.json.
- Correções aplicadas: import soliloquios aninhado (solidoes-da-memoria/soliloquios) em ConteudoObra; page.tsx home → imports "@/components"; ReguaTempo "./lib/tempo" → "../lib/tempo"; texto/[id]/page.tsx dela (WIP com JSX quebrado) preservado verbatim como page.tsx.wip + placeholder "Em construção"; 9 JSONs de movimento (stubs vazios [] do Drive) envolvidos na moldura ArquivoCategoria {categoria,total_registros,descricao,tags_comuns,registros:[]} por scripts/preparar_dados_movimento.py (Institucionais real com 8 registros e ativismo 263 itens intocados); CSS da escada dourada (.sobre-container/.dedication/.staircase/.quote-block/.quote-body/.quote-author + @keyframes surgir-quote) re-anexado ao globals.css dela; imagens do Drive copiadas para public/ (53 refs: 45 OK, 8 faltantes).
- FERRAMENTA: dev server só sobrevive se lançado pelo boot da plataforma; processos setsid/nohup morrem entre chamadas → fluxo "mega-chamada" (servidor + curl + playwright na mesma chamada). agent-browser inutilizável (daemon morre entre invocações; screenshots saem como "site can't be reached") → scripts/verificar_screenshots.py com Playwright Python (DOM hidratado + screenshots).
- Verificação: tsc 0 erros em src/; rotas 200 (home 3 eixos, 6+ fichas novas licoes/diuturnos, slug-inexistente → "Página em construção"); conteúdo hidratado OK (orelha Tarso de Melo, origem "Retirado do livro: Lições de Tempo (1983)", ISBN, escada 4 epígrafes, poemas com **negrito**, artes Pecados, botão loja em disponivel, "Edição: Esgotada" nos dados); 10 screenshots em download/verificacao-recuperacao/; next build OK com /obra/[id] SSG 34 paths.

Stage Summary:
- Site adotou o projeto canônico da usuária: 34 fichas SSG, capas reais (45/53 imagens), 4 variantes de ficha servidas pelo ConteudoObra dela.
- FALTANTES (8 imagens, provavelmente do obra.zip): capas de 70-anos, vidacronica, apontamentos, inventario, licoesdetempo, passageira, pontos + arte inveja-andre-miranda.jpg.
- Dados de movimento (9 categorias) são stubs vazios no Drive — aguardando dados reais da usuária; texto/[id] WIP dela aguarda conclusão.
- Lição registrada: sessões longas devem commitar cedo e often (git parou em 23 Sep); uploads instáveis → pedir link do Drive direto.

---
Task ID: 7
Agent: main
Task: Retomada pós-compressão: reiniciar server, verificar download Drive, mapear site completo

Work Log:
- Dev server caiu (000) -> reiniciado com nohup, home 200
- Download Drive 3ª tentativa em background (gdown-run3.log), destino upload/drive-obra
- Conteúdo do Drive = projeto original completo: app/ (Hero, SecaoObras, cronicas, ensaios, obra, palestras, data, public) + obra.zip
- Verificação: TODAS as 34 pastas em src/app/obra/[id]/ têm dados.json e respondem 200
- Rotas testadas 200: /, /cronicas, /ensaios, /obra/cronica, /obra/cronica/[id], 34x /obra/[slug]

Stage Summary:
- Site 100% no ar com 34 fichas de obra publicáveis (resumo anterior de "7 páginas" estava desatualizado)
- Download Drive em andamento em background; integração de imagens public/ na próxima etapa

---
Task ID: 8
Agent: main
Task: Reconciliação do acervo original (Drive 94MB/187 arquivos) com o projeto

Work Log:
- Download Drive concluído (3ª tentativa, background, /tmp/gdown-run3.log)
- diff public/ Drive vs projeto: idênticos exceto dalila-colorida/pb (Drive = fotos autênticas 1920x1080; projeto tinha placeholder IA 864x1152) -> SUBSTITUÍDO pelas autênticas
- diff obra/: dados.json todos idênticos aos canônicos; soliloquios estava aninhado dentro de solidoes-da-memoria -> movido para topo, import corrigido em ConteudoObra.tsx (linha 72) -> 35 obras com página
- movimento/*.json: Drive tinha placeholders 3 bytes; projeto tem estrutura (mesmo que vazia) -> mantido projeto
- Capas com caminho divergente nos JSONs: criados prosa/1999-capa-vidacronica.jpg e cronicas/2005-capa-apontamentos.jpg (JSON prevalece); copiadas versões sem acento (inventario, licoesdetempo)
- 5 imagens ausentes do acervo original -> capas provisórias elegantes geradas (scripts/gerar_capas_provisorias.py): 70-anos, passageira.png, pontos, inveja-andre-miranda, cronicas-capinha
- Validação os.walk: 55/55 referências de imagem resolvem
- Page.tsx: projeto mantém versão SSG (melhorada); zip tinha original client-side

Stage Summary:
- 35 fichas de obra no ar (antes 34), foto autêntica no hero, 0 imagens quebradas
- Pendente p/ usuária: escaneamentos reais de 5 capas provisórias + arte Inveja
- SSR sem conteúdo das abas (abaAtiva via useEffect) = padrão do código original; refinamento SEO futuro

---
Task ID: 9
Agent: main
Task: Corrigir tab Prêmios & Reconhecimentos (texto repetido da cronobiografia) com layout da cronobiografia

Work Log:
- Diagnóstico: page.tsx chamava CabecalhoFixo com abaAtiva="vida" e mudarAba no-op -> tabs mortas; premios.json só tinha placeholder "Prêmio Literário 2024"
- premios.json reescrito com 21 reconhecimentos fornecidos pela usuária (1984-2024, crescente)
- SecaoPremios.tsx reescrito: layout idêntico à cronobiografia (trecho-citacao, ano dourado em cima) + filigrana CSS entre entradas
- globals.css: nova classe .filigrana (linha dourada gradiente + losango central)
- page.tsx: estado abaVida (crono|premios|imprensa) real, Mídia também conectada
- CabecalhoFixo: régua de prêmios agora crescente; âncoras de década invisíveis mantidas p/ navegação
- Turbopack servia CSS velho -> reinício com rm -rf .next resolveu
- Verificado no browser: 21 entradas + 20 filigranas, tabs crono/premios/mídia OK

Stage Summary:
- Tab Prêmios funcional com conteúdo correto e layout pedido (ano em cima, filigrana horizontal)
- Mídia tab também ressuscitada; cronobiografia intacta

---
Task ID: 10
Agent: main
Task: Corrigir régua dos anos da aba Prêmios & Reconhecimentos (não navegava/destaque fixo)

Work Log:
- Diagnóstico via browser (agent-browser): na aba Prêmios, as 5 âncoras de década (c-1980...c-2020) estavam EMPILHADAS no topo da seção (todas @y=795) -> qualquer clique da régua rolava para o mesmo lugar e o scroll-spy travava em 1980-1989
- Causa: SecaoPremios.tsx renderizava o bloco de âncoras separado do conteúdo; CronoBiografia (EstradaVida) usa âncoras no fluxo do conteúdo
- Fix: âncora c-XXXX inserida ANTES do primeiro item de cada década (map com detecção de primeiraDaDecada); filigranas e layout preservados
- Fix extra: removido import fantasma scrollParaSecao de ./lib/tempo em ReguaTempo.tsx (caminho inexistente, função não usada)
- Validação browser: 5 décadas clicáveis levam à posição certa (âncora a 285px, abaixo do header fixo); scroll-spy segue scroll (y=2600 -> 2010-2019, y=900 -> 1990-1999); screenshot confirma régua + filigranas; regressão CronoBiografia OK (1970-1979 + scroll-spy)

Stage Summary:
- Régua da aba Prêmios 100% funcional (clique navega por década, destaque acompanha o scroll)
- CronoBiografia intacta; zero erros de página
- Nota: SecaoObras/SecaoMovimento já usam âncoras dentro dos grupos de década (padrão correto) — sem impacto

---
Task ID: 11
Agent: main
Task: Footer da home em dourado (pedido da usuária)

Work Log:
- page.tsx: footer trocado de cinza-ardósia (#2D3748, texto branco) para gradiente dourado #D4AF37->#C29B2E
- Texto em vinho escuro #4e2138 (contraste ~5:1 sobre o dourado), Georgia serif, letterSpacing 1.5px
- Filigrana em vinho (linha gradiente + losango rotacionado) acima do nome — eco do ornamento das seções
- Validado no browser (screenshot): contraste bom, sem erros de página

Stage Summary:
- Footer dourado com identidade da paleta (dourado + vinho + filigrana)
- Footer de fonte das crônicas (obra/cronica) não alterado — é referência de texto, não rodapé de site

---
Task ID: 12
Agent: main
Task: Prêmios & Reconhecimentos no layout EXATO da CronoBiografia (linha com círculos, sem filigranas)

Work Log:
- Pedido da usuária: filigranas deixaram a aba inconsistente com a CronoBiografia; quer a linha vertical com círculos ordenando cada prêmio
- CSS: círculos = .trecho::after; linha = .estrada::before; .secao-decada é wrapper sem estilo (âncora)
- SecaoPremios.tsx reescrito: .estrada > .secao-decada[id=c-XXXX] > .trecho (círculo) > .trecho-citacao (ano dourado + texto itálico) — DOM idêntico à EstradaVida
- Filigranas removidas do JSX (classe .filigrana mantida no CSS, sem usos)
- Validação browser: 21 trechos com círculo, 0 filigranas, âncoras c-1980..c-2020 nas secao-decada; régua clique 2010-2019 -> topo 285px, destaque correto; regressão CronoBiografia OK

Stage Summary:
- Aba Prêmios agora usa a mesma linguagem visual da CronoBiografia (linha dourada + círculos + cards ano/texto)
- .filigrana ficou como CSS órfão no globals.css (sem usos; mantida por conveniência)

---
Task ID: 13
Agent: main
Task: Eixo OBRA — tab "Ensaios & Crônicas" vira "Escritos & Leituras" com 3 subtabs e texto integral do site legado

Work Log:
- Scraping legado (scripts/raspar_legado.py): 38 páginas baixadas (28 palestras incl. 19/25 fora do índice, 9 crônicas com URL acentuada %C3%B4, Traduções)
- Gerador (scripts/gerar_textos_legado.py): parser tolerante FrontPage (remove <a> antes de fatiar <p> não fechados), charset cp1252->UTF-8, capitulares size=6/font tags fundidas sem espaço, itálico de parágrafo inteiro >120 chars tratado como artefato (removido; inline preservado), notas de fonte -> fonte_original, separadores "/ / /" removidos
- 38 textos gerados em src/app/texto/[id]/{slug}/dados.json (28 ensaios + 9 crônicas + 1 traduções-texto-único com títulos de poemas em .titulo-poema, versos em .verso)
- Título real descoberto: palestras19 = "Poesia feita por mulheres" (RECAP 5.04.1997), não "A mulher e a literatura"
- p24 = só ensaio da Amália (nanico 22, 2011); p25 = "A Criação literária como matéria de memória e esquecimento" (1999); p27 = Saramago c/ subtítulo "anotações de leitura"
- Página de leitura: ConteudoTexto.tsx (cliente, baseado no page.tsx.wip da usuária, paleta vinho/dourado) + page.tsx server com SSG (generateStaticParams + generateMetadata) espelhando ficha de obra
- Home: page.tsx aceita ?eixo=obra|vida|movimento (Hero usa estado, não âncoras) p/ link "← Voltar para Escritos & Leituras"
- SecaoObras.tsx: dadosEnsaios (28 itens, 27 com slug; "O escritor luso-brasileiro" 1990 sem página legado), dadosCronicas (9), dadosTraducoes (1); link "Leia o texto →" nos 3 subtabs; type TabObra "escritos"
- CabecalhoObra.tsx: tab "Escritos & Leituras", subtabs Ensaios/Crônicas/Traduções
- Arquivado stray dados.json antigo (crônica 9 de sessão anterior) em scripts/legado/dados.json.versao-anterior-cronica9.json
- Validação: 38 rotas /texto/[slug] 200; contagens 29/9/1 itens e 28 links Ensaios; página de leitura, contexto, fonte e volta funcionando; poemas centrados com título enfatizado

Stage Summary:
- "Escritos & Leituras" no ar: 38 textos integrais recuperados verbatim do site legado com páginas SSG próprias
- Arquivos .wip da usuária mantidos como referência (page.tsx.wip não compilado)
- Pendente p/ usuária: conferir título "Sentir-se Português na Diáspora" e "O Poeta e a Cidade" (ano 0 = "Data não informada" na régua)

---
Task ID: 14
Agent: main
Task: Página de leitura /texto/[id] no layout EXATO da ficha de obra + imagem fixa por categoria

Work Log:
- Pedido da usuária: "deixar igual a página do obras", manter a faixa em cima e os estilos de letra; 1 imagem fixa por categoria (Ensaios/Crônicas/Traduções)
- Imagens do Drive (gdown --folder, pasta 1r2nqBonV9Z7Y0n_KNMEWcz2TtJAhWcuD): placeholder-ensaios.png, placeholder-cronicas.png, placeholder-traducoes.png (400x600), FaixaObras.png + zip obras-publicadas (só diuturnos mensais, não usado) — checksums idênticos aos que já estavam em public/imagens/obras-publicadas/{ensaios,cronicas,traducoes}/
- ConteudoTexto.tsx reescrito espelhando ConteudoObra: faixa 80px FaixaObras.png com overlay + "Dalila Teles Veras • {Ensaios|Crônicas|Traduções}"; container 1100px Georgia #333; link voltar vinho; flex 375px + conteúdo (h1 Georgia itálico 2.2rem #1a1a1a; tipo•ano Inter 0.75rem uppercase #999; subtítulo itálico; contexto Inter 0.85rem); imagem fixa da categoria no lugar da capa (aspectRatio 2/3, boxShadow 0 15px 40px)
- Corpo: coluna de conteúdo com borderTop fina, Georgia 1.1rem/1.9, justify; poemas de traduções centrados (titulo-poema uppercase, verso, dedicatoria); fonte original no fim em Inter 0.8rem (antes emoji 📚/📷 removidos — estilo minimalista da ficha)
- Convertida para server component (sem styled-jsx; CSS via <style dangerouslySetInnerHTML> escopado em .corpo-texto)
- Validação browser: traduções, ensaio (Emigração 2016 c/ contexto Funchal) e crônica (A Língua 1999-2004 c/ contexto Viaverbo) — faixa, imagem, título, metadados OK; 38 rotas /texto/* todas 200; navegação real: tab Escritos & Leituras → "Leia o texto" → página; voltar → /?eixo=obra; regressão /obra/a-janela-dos-dias e home OK; 0 erros no log

Stage Summary:
- /texto/[id] agora é o gêmeo visual da ficha /obra/[id]: mesma faixa, mesmas fontes, imagem fixa por categoria no lugar da capa
- page.tsx.wip da usuária mantido como referência, não compilado

---
Task ID: 15
Agent: main
Task: Refinamento das Crônicas — tabs de entradas por data (estilo ficha de obra), títulos internos maiúsculos/finos/dourados, categorias separadas em componentes

Work Log:
- Análise: 4 crônicas "Anotações de Leituras" são diários (parágrafos-data "sábado 15", "terça 12, Atenas", "quinta 01"): I=14, II=13, III=12, IV=9 entradas; 5 demais são corridas
- Criado css-corpo.ts compartilhado: h2/h3 internos agora em Cormorant Garamond (peso 500, fino), MAIÚSCULAS, letterSpacing 3px, cor dourada #8b6914 (dourado de texto da paleta) + linha #D4AF37; .titulo-entrada para datas (1.5rem, mesmo estilo)
- Criado ConteudoCronica.tsx (cliente, useState): parser agrupa <p> por RE /^(segunda|...|domingo)\s+\d+/i; diário → tabs estilo ficha de obra (Inter 0.75rem, peso 400 fino, uppercase, ativa #8b6914 + borderBottom 2px #D4AF37, scroll horizontal); título da entrada no corpo em dourado fino; texto corrido → sem tabs, verbatim
- page.tsx roteia por tipo: cronica → ConteudoCronica; ensaio/traducao → ConteudoTexto (categorias separadas para refinamentos independentes)
- ConteudoTexto.tsx usa o css-corpo compartilhado (h2 dourado vale p/ traduções: "ANTONIO MACHADO" agora dourado fino)
- Fix: data não duplica (parser não recoloca o p-data no corpo)
- Validação: 9/9 crônicas 200 (tabs 14/13/12/9 e 0 nas corridas); clique "SEXTA 29, SALVADOR" mostra entrada certa; 38 rotas /texto/* 200; 0 erros no log; tradução com h2 dourado OK

Stage Summary:
- Crônicas-diário agora navegam por tabs de datas (estilo idêntico às tabs da ficha de obra), título de entrada dourado fino no corpo
- Títulos internos em todas as categorias: maiúsculos, finos (Cormorant), dourados
- Componentes separados por categoria (pronto p/ refinar ensaios e traduções na sequência)
- Nota p/ usuária: dourado de texto usa #8b6914 (mesmo tom das citações da ficha de obra) por legibilidade sobre creme; linhas em #D4AF37

---
Task ID: 16
Agent: main
Task: Refinamento fino das Crônicas — dias empilhados (sem tabs) + linha de contexto no lugar de "Crônica • ano"

Work Log:
- Pedido da usuária: nas "Anotações de Leituras" remover tabs e empilhar os dias (mantendo o estilo dourado fino); trocar "CRÔNICA • 1999-2004" por "Coluna Viaverbo — Caderno Cultura & Lazer, Diário do Grande ABC" no mesmo estilo
- Aplicado à série toda (I-IV, mesmas 14/13/12/9 entradas) por consistência editorial da série; corridas sem mudança de corpo
- ConteudoCronica.tsx: useState removido; entradas renderizadas empilhadas (.titulo-entrada dourado + parágrafos, join("") verbatim); bloco de tabs eliminado; corpo sempre com borderTop fina
- Linha sob o título: contextoItens (evento) no estilo Inter 0.75rem uppercase espaçado #999; fallback "Crônica • ano" se não houver contexto; parágrafo de contexto duplicado removido
- Validação: IV com 9 .titulo-entrada e 0 tabs; "SEXTA 25" empilhada correta; Crônica de Outono mostrando "COLUNA VIAVERBO — CADERNO CULTURA & LAZER, DIÁRIO DO GRANDE ABC"; 9/9 crônicas 200; 0 erros no log

Stage Summary:
- Diários de leitura agora fluem como diário (dia sobre dia, título dourado fino), sem tabs
- Metadado das crônicas: contexto da coluna no lugar do rótulo "Crônica • ano"

---
Task ID: 17
Agent: main
Task: Refinamento das Traduções — componente próprio da categoria, títulos de poemas dourados finos, metadado com o veículo de publicação

Work Log:
- Categoria Traduções = 1 texto-coletânea ("traducoes": Machado + Benedetti bilíngues, 3 poemas ES+PT, ensaio introdutório, 164 versos)
- Criado ConteudoTraducao.tsx (server, mesmo pacote visual das crônicas): faixa "Dalila Teles Veras • Traduções", imagem fixa placeholder-traducoes.png, h1 Georgia itálico, subtítulo itálico, corpo verbatim (poemas empilhados, sem tabs — preferência da usuária p/ poemas)
- Linha de metadados: contexto.evento no padrão da linha Viaverbo → "Revista A Cigarra — nº 31 (ago/1997) e nº 35 (jun/2000)"; fallback "Tradução • ano"; adicionado contexto ao dados.json
- css-corpo.ts: p.titulo-poema agora Cormorant 500 fino, #8b6914, uppercase, 3px, centrado, 1.35rem, sem linha (extensão do tratamento dourado dos títulos internos; classe só existe em traduções)
- Limpeza de artefatos do legado em traducoes/dados.json (scripts/limpa_traducoes.py, sem tocar em palavras): removido h2 "Mario Benedetti" duplicado no meio do poema ES "ESE GRAN SIMULACRO"; 31 parágrafos do poema ES sem classe → class="verso" (centrados como o restante)
- page.tsx: tipo "traducao" → ConteudoTraducao (3 componentes, um por categoria)
- Validação: evals confirmam metaLinha A Cigarra, h2/h3 dourados (#8b6914), titulo-poema Cormorant 500 dourado centrado, 10 títulos, 164 versos centrados; regressão 38/38 rotas /texto 200, home, /?eixo=obra, /obra/a-janela-dos-dias 200; crônica Viaverbo intacta; diário IV 9 entradas empilhadas 0 botões; ensaios sem h2 no fonte (nada a renderizar — confirmado); 0 erros no log
- Screenshots: scripts/shot-trad-{topo,poema,benedetti}.png

Stage Summary:
- Traduções no mesmo padrão refinado das Crônicas: categoria isolada, dourado fino nos títulos (autores, seções e poemas), veículo de publicação na linha de metadados
- Texto 100% verbatim preservado; só artefatos HTML do legado foram limpos
- Pendente p/ usuária: conferir se deseja algo específico nos Ensaios (nenhum tem h2 interno hoje); typo antigo "Universidade Federal do ABNC"; capas provisórias aguardando escaneamentos

---
Task ID: 18
Agent: main
Task: Traduções — subtabs por autor traduzido (Antonio Machado / Mario Benedetti)

Work Log:
- Pedido da usuária: "duas subtabs cada uma com o nome do autor que é traduzido"
- ConteudoTraducao.tsx → "use client": parseSecoes divide o texto nos <h2> de autores (matchAll /<h2[^>]*>...<\/h2>/g); cada seção guarda o h2 (título dourado permanece no corpo, padrão dos diários); < 2 autores → fallback verbatim sem tabs
- Tabs no estilo fino dourado aprovado nas crônicas: Inter 0.75rem peso 400, uppercase, letterSpacing 2px; ativa #8b6914 + borderBottom 2px #D4AF37; inativa #999; barra com borderBottom #e0e0e0, overflowX auto
- Estado padrão = 1ª seção (Machado); useState null → fallback para primeira
- Validação: estado padrão h2 corpo ["Antonio Machado"] + 82 versos; clique Benedetti → h2 ["Mario Benedetti"], 82 versos, 4 poemas (ESE GRAN SIMULACRO, ESSE GRANDE SIMULACRO, AH LAS PRIMICIAS, AH AS PRIMÍCIAS), nota A Cigarra nº 35; cores das tabs alternam corretamente; 38/38 rotas 200; 0 erros no log
- Screenshots: scripts/shot-trad-tabs-{machado,benedetti}.png

Stage Summary:
- Traduções com navegação por autor: tab "ANTONIO MACHADO" (ensaio + El Crimen ES/PT) e tab "MARIO BENEDETTI" (bio + 2 poemas ES/PT), cada seção termina na sua nota da A Cigarra
- Texto verbatim intacto; divisão apenas nos marcadores <h2> existentes

---
Task ID: 19
Agent: main
Task: Ensaios — componente próprio da categoria + metadado com veículo/evento (fecha o ciclo das 3 categorias)

Work Log:
- Pedido da usuária: "Vamos para o Ensaios agora!!!" (após aprovar o pacote das Traduções)
- Levantamento: 29 ensaios, 24 com contexto.evento (conferência, coletânea, revista + data), 5 sem (fallback); nenhum tem h2/h3 no fonte (confirmado Task 17)
- Criado ConteudoEnsaio.tsx (server): mesmo pacote visual — faixa "Dalila Teles Veras • Ensaios", imagem fixa placeholder-ensaios.png, h1 Georgia itálico, corpo verbatim
- Linha de metadados no padrão Viaverbo/A Cigarra: contextoItens (evento • local, cidade • organizador) no estilo Inter 0.75rem uppercase fino #999; fallbacks "Ensaio • ano" e "Ensaio" (ano=0); a linha de contexto separada e duplicada do ConteudoTexto foi absorvida
- page.tsx: tipo "ensaio" → ConteudoEnsaio (as 3 categorias agora com componente próprio; ConteudoTexto fica como fallback defensivo p/ outros tipos)
- Validação: Funchal "FUNCHAL, MADEIRA (PORTUGAL), 10.11.2016" OK; UNESCO/Paris (linha longa) OK; a-amalia "Ensaio • 2011" OK; o-poeta-e-a-cidade "Ensaio" OK; 38/38 rotas 200; home 200; 0 erros no log
- Screenshot: scripts/shot-ensaio-funchal.png

Stage Summary:
- Ciclo completo: Ensaios, Crônicas e Traduções com componente, imagem e refinamentos próprios
- Padrão de metadado unificado nas 3 categorias: veículo/evento de publicação na linha sob o título

---
Task ID: 20
Agent: main
Task: Refinamentos de leitura — poemas em dourado, fonte sem link do site legado, bibliografia em subtab nos ensaios

Work Log:
- Pedido da usuária (3 itens): poemas/poesias em dourado; retirar o link da fonte (site legado sairá do ar); bibliografia em subtab
- css-corpo.ts: p.verso e p.dedicatoria agora #8b6914 (poema inteiro dourado: título, dedicatória e versos); prosa permanece #333
- Fonte: nos 4 componentes (/texto) o fonte_original.url não é mais renderizado como <a> — texto simples (URL ainda aparece literal no texto da fonte; limpeza opcional futura). Rotas antigas /ensaios, /cronicas, /obra/cronica só ligadas de componente morto (SecaoObras_CORRIGIDO não importado) — intocadas
- Bibliografia em subtab (ConteudoEnsaio → "use client"): RE_BIBLIO acha o marcador <p>Bibliografia:</p> (com/sem <b>); caminha pelos <p> seguintes (entradas com "-" + linhas de continuação), parando em notas finais ("(", "*", "Roteiro...") que permanecem no texto principal; tabs "Texto | Bibliografia" no estilo fino dourado; bibliografia alinhada à esquerda via .corpo-bibliografia
- 7 ensaios com seção real: a-criacao (4 entradas + notas (*)/(**)), joao-ramalho (8 + nota publicação), o-poeta (6 + nota roteiro), os-congressos (6 + 2 sub-itens + nota "*"), revistas-literarias (13 com continuações + nota), saramago (21, até o fim), seduzir (6 sem traços, até o fim)
- Validação: o-poeta (0 entradas "-" na aba Texto; 6 + marcador na Bibliografia, left, sem Roteiro); 6 demais confirmados (notas finais no principal; "-" remanescentes = travessões de prosa anteriores ao marcador, verificados no fonte); emigracao sem bibliografia → 0 tabs; traduções verso/dedicatoria rgb(139,105,20); bloco Fonte com 0 links (a-lingua e traduções); 38/38 rotas 200; home 200; 0 erros no log
- Screenshots: scripts/shot-ensaio-bibliografia.png, shot-versos-dourados.png

Stage Summary:
- Poemas agora inteiramente dourados (títulos, dedicatórias e versos)
- Bloco Fonte sem hyperlink do site legado em todas as páginas de leitura
- 7 ensaios com Bibliografia em subtab dedicada, notas finais preservadas no texto

---
Task ID: 20-b
Agent: main
Task: Reescopo do dourado — versos/poemas em dourado SOMENTE nos ensaios (esclarecimento da usuária)

Work Log:
- Esclarecimento da usuária: "eu queria que somente os versos, poemas e poesias dos conteúdos da aba ensaios" — o dourado da Task 20 tinha ido global (p.verso/p.dedicatoria no css-corpo compartilhado, dourando traduções inteira)
- Levantamento exaustivo: nenhum ensaio tinha class="verso" no fonte; poemas nos ensaios em 3 formatos legado — parágrafos com <br> (versos quebrados), parágrafos inteiros em <i>, e poemas linha-por-parágrafo (1 verso = 1 <p>, o formato mais comum)
- Curadoria manual parágrafo a parágrafo em 14 ensaios (mapas completos via scripts/dump_mapa_completo.py e dump_mapa2.py); excluídos falsos positivos: prosa com <br> do Word (ex. p#31 a-amalia, p#7 emigracao), listas de jornais/bios (a-imprensa, a-literatura p#113+), títulos de seção prosa (a-vez-da-utopia p#26-31 é fragmento bold duplicado do legado), citações prosaicas
- scripts/marca_versos_ensaios.py: 878 parágrafos marcados com class="verso" em 14 ensaios (emigracao 170, poesia-feita-por-mulheres 178, poesia-madeirense 146, a-literatura 48, o-poeta 68, os-congressos 52, cafe 89, joao-ramalho 36, pessoa-entranhado 35, a-amalia 22, as-palavras 15, pessoa-e-saramago 14, a-cultura 4, a-criacao 1); verificação de prefixo do 1º parágrafo de cada intervalo (normalizando aspas); titles/epígrafes/notas "(in...)" do bloco do poema marcados juntos
- Verbatim garantido: scripts/verifica_verbatim.py compara texto sem tags vs git HEAD — 14/14 OK, nenhuma palavra alterada
- css-corpo.ts: p.verso e p.dedicatoria voltaram a #333 no CSS compartilhado; novas regras escopadas .corpo-texto.corpo-ensaios p.verso/p.dedicatoria { color: #8b6914 } — dourado só em ensaios
- ConteudoEnsaio.tsx: <main> agora sempre com classe corpo-ensaios (além de corpo-bibliografia na subtab)
- Validação no browser: pessoa-entranhado 35 versos rgb(139,105,20) centrados; emigracao 170 versos dourados; traduções 82 versos visíveis rgb(51,51,51) (escuro — revertido) com titulo-poema ainda dourado (aprovado Task 17); 38/38 rotas /texto 200; home 200; 0 erros no log
- Screenshots: scripts/shot-ensaio-versos-dourados.png (emigracao, epígrafe Guimarães Rosa + toponímicos dourados), scripts/shot-traducao-versos-escuros.png (El Crimen: título dourado, versos escuros)

Stage Summary:
- Dourado dos poemas agora restrito aos ensaios, como a usuária pediu; traduções e crônicas voltaram ao corpo escuro
- 878 parágrafos de poesia identificados e marcados nos 14 ensaios com poemas — inclusive os linha-por-parágrafo, invisíveis para detectors simples
- Padrão visual do poema nos ensaios: versos centrados, apertados (margin 2px) e dourados #8b6914, títulos/epígrafes do bloco incluídos
---
Task ID: 62
Agent: main
Task: Regeneração pós-queda de energia (reconstruir Tasks 60/61) + Task 62: restaurar conteúdo legado da aba Resenhas | Leituras Críticas (e Estudos Críticos)

Work Log:
- Queda de energia da usuária → rollback do filesystem para o checkpoint de 25 Sep (worklog em 20-b, dados.json dos 3 livros em versão antiga 439-485B, capa passageira placeholder 29KB, sem bloco subtítulo no ConteudoObra). Ambiente re-verificado item a item (arquivos surgiram com atraso na sync pós-boot; estado final = pré-Task 60)
- Site conceito re-localizado por força bruta de URLs: https://dalila-teles-veras.vercel.app (buildId 2bdy5z6zr5em0 intacto) — chunk de dados re-baixado (20.805B, idêntico) + capa real passageira.png (453.618B, idêntico)
- scripts/extract_conceito_3livros.mjs recriado: extração string-aware do objeto d={...} (marcadores "opcoes-para-morrer-no-espaco":{ / "passageira-antologia-pessoal-1982-2024":{ / insulas:{ ) + new Function → scripts/conceito_dados/*.json; batimento 100% com a Task 61 (Passageira sobre 1033c/orelha 558c Lilian Sais/11 cartões; Opções sobre 512c/orelha 416c Amanda Vital; Ínsulas sobre 1740c/6 cartões Fósforo)
- scripts/merge_conceito_3livros.mjs recriado (mesmas decisões): Passageira ano 2026 + verbatim + capa real em public/; Opções título minúsculo + cartão Prêmio Oceanos 1º + cartões do site (placeholder "Formato" do conceito fora); Ínsulas subtítulo "Dalila Teles Veras" + cartões Fósforo; limpeza dos subtítulos residuais diuturnos/soliloquios/vestigios
- ConteudoObra.tsx: bloco subtítulo sob o h1 re-adicionado ({livro.subtitulo && ...}) — 930 linhas
- TASK 62 (Leituras Críticas): legado baixado de http://www.dalila.telesveras.nom.br/leiturascr%C3%ADticas.htm + 6 páginas de livros + EstudosCriticos1.htm (ISO-8859-1→UTF-8). Estrutura: menu por livro → leituras completas em rows de tabela
- Inventário: 34 leituras críticas (Estranhas 1, Retratos 2, Janela 13, Vestígios 12, Artes 3 — incluindo "Lentes Atentas"/Fabiano Calixto não listada no menu, A Vida Crônica 3) + 1 estudo crítico (Clara Moura Lourenço, Univ. Coimbra, com BIBLIOGRAFIA/notas + poema "10 de junho" da página)
- scripts/gerar_leituras_criticas.py: parser limpar_fragmento (herdado de gerar_textos_legado.py) + curadoria bloco a bloco (scripts/lc_raw/, blocos_indice.txt) → 35 fichas /texto/[slug]/dados.json (tipo leitura-critica/estudo-critico, subtitulo "Por...", contexto evento "Sobre <livro>"/local-fonte, fonte_original com URL legado; nota (*) da Irene em fonte_original.nota; split "Poesia na Janela – ..."; cartas sem título usam frase de abertura como título)
- SecaoObras.tsx: arrays dadosLeiturasCriticas (34) + dadosEstudosCriticos (1) gerados; wiring leituras/estudos; "Leia o texto →" estendido p/ resenhas leituras+estudos
- ConteudoTexto.tsx: tipoRotulo/tipoFaixa com "Leitura Crítica"/"Estudo Crítico" (faixa "Resenhas") + union do tipo
- BUG de pipeline herdado corrigido (129 casos): espaço comido antes de tags inline ("Do latim<i>fatum</i>") — limpar_fragmento não colapsa mais whitespace antes de tags; corrige_espacos_tags.py cirúrgico em todos os dados.json; auditoria vs RAWs (audita_espacos_tags.py) reverteu itálico parcial intencional "e<i>stranhas"; corrige_fecha_tag.py (27 casos fecha+letra) com correção de posicionamento (26 casos exatos aplicados + saramago "Alegri</i>a)")
- Validação: tsc 0 erros; playwright verifica_task62.py 40/40 OK (3 fichas completas, lista de leituras, página de leitura, estudo+poema, regressão escritos/fortuna/verbetes, subtítulos residuais); HTTP 73/73 rotas /texto 200 + obras + home; screenshots shot62-*.png

Stage Summary:
- Trabalho das Tasks 60/61 restaurado por completo (3 fichas verbatim do conceito + capa real + subtítulos)
- Leituras Críticas: 34 textos completos do site legado com layout idêntico aos ensaios/crônicas/traduções (lista por ano + "Leia o texto →" + página de leitura padrão); Estudos Críticos: 1 estudo acadêmico
- Bug de espaços comidos por tags inline corrigido em TODO o acervo de textos (155 correções validadas contra os RAWs)
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 63
Agent: main
Task: Leituras Críticas agrupadas por livro (pedido da usuária após ver a lista por ano)

Work Log:
- Pedido da usuária: a lista por ano da leitura ficou ruim; volta ao agrupamento por livro (como no menu do site legado), no formato "[ano do livro] - [Nome do Livro]" → "-[por Autor n] - [link]Leia"
- Mapeamento livro→leituras a partir do campo "sobre <livro>" das 34 fichas + anos dos livros do catálogo da aba Obras Publicadas (Estranhas Formas de Vida 2013, Retratos Falhados 2008, Vestígios 2003, À Janela dos dias 2002, As Artes do Ofício 2000, A Vida Crônica 1999)
- SecaoObras.tsx: novo array estático leiturasAgrupadasPorLivro (6 grupos: 1+2+12+13+3+3 = 34 leituras); autores verbatim das fichas "Por ..." (única exceção: um-belo-livro... sem autor pessoal → atribuição verbatim do legado "Jornal O Capital, julho 2002, Aracaju, Sergipe", confirmada em scripts/lc_raw/jane_11.txt); grupos ordenados por ano do livro decrescente; dentro do grupo, ordem do legado preservada
- Render: branch própria para a aba leituras (separador-genero com "{ano} - {nome}", âncora c-{década} só no 1º livro da década; linha "- por {autor} - " + Link "Leia" → /texto/[slug] no estilo #7a3b5a); régua de décadas agora alimenta-se dos anos dos LIVROS (não das leituras); demais subtabs (fortuna/verbetes/estudos) inalteradas
- Validação: tsc 0 erros; scripts/verifica_leituras_por_livro.py 24/24 no browser (6 cabeçalhos em ordem, 34 linhas, contagens por grupo 1/2/12/13/3/3, 34 links Leia com hrefs corretos, sem "Data não informada", Estudos/Fortuna/Verbetes regressão OK) + 34/34 rotas /texto HTTP 200; screenshot scripts/shot-leituras-por-livro.png
- Nota técnica: SecaoObras só renderiza no eixo "obra" (page.tsx gating por estado/URL ?eixo=obra) — teste browser precisa de /?eixo=obra

Stage Summary:
- Leituras Críticas agrupadas pelos 6 livros comentados, no formato exato pedido pela usuária; 34 leituras intactas com links para as páginas de leitura
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 64
Agent: main
Task: Restaurar a subtab Entrevistas em Escritos & Leituras (conteúdo legado entrevistasdalilatelesveras.htm)

Work Log:
- Usuária reportou sumiço da subtab "Entrevistas"; verificado que ela não existe em nenhum commit git (provável perda no rollback da 1ª queda de energia — checkpoint 25 Sep era anterior) — reconstruída do zero a partir do legado
- Legado baixado: menu entrevistasdalilatelesveras.htm + Entrevistadalilatelesveras01..07.htm (ISO-8859-1→UTF-8); mesmo template das leituras críticas (conteúdo = TR3 da tabela)
- Curadoria bloco a bloco (scripts/ent_raw/ent_*.txt): TODOS os blocos são conteúdo em todas as 7 páginas (intros, bios, Q&A, poemas da pág. 06, poema Gastão Cruz na pág. 07; pergunta 5 da pág. 07 termina "Por q" truncada NO PRÓPRIO legado — verificado no HTML bruto, mantida verbatim)
- scripts/gerar_entrevistas.py: 7 fichas /texto/[slug]/dados.json (tipo "entrevista"), texto = html_limpo por bloco (preserva <i> das perguntas, dropcap "b<b>ecos</b>", negritos); fonte_original com URL legado; tags balanceadas OK
- Fichas: IMES-NOTÍCIAS 2004 (sem subtitulo, veículo), PD Literatura 2002 (Rodrigo de Souza Leão), Floriano Martins 2008 (prefácio de Retratos Falhados), Álvaro Alves de Faria 2009 (Pastores de Virgílio), Sérgio Simka 2012 (Portal Mauá e Região), Selmo Vasconcellos s.d. (ano 0 → "Data não informada", com 3 poemas), Tarso de Melo 2015 ("Sobre poesia, ainda", enquete)
- Wiring: CabecalhoObra (subtab Entrevistas entre Crônicas e Traduções + subtítulo "Ensaios, crônicas, entrevistas e traduções..."); SecaoObras (dadosEntrevistas + case "entrevistas"; link "Leia o texto" já coberto pela condição escritos); ConteudoTexto (tipo "entrevista" na union, rotulo "Entrevista", faixa "Entrevistas")
- INCIDENTE: import de gerar_leituras_criticas.py re-executou a geração da Task 62 e revertou correções manuais em 3 fichas (a-estranheza "vida <b>", para-quem-perdeu, resistencia) — restauradas do HEAD via git checkout; dump_entrevistas.py corrigido para função limpar_fragmento local (nunca importar o gerador)
- Validação: tsc 0 erros; scripts/verifica_entrevistas.py 22/22 (subtab visível, subtítulo, 7 itens na lista, Data não informada, 7 links, ficha completa com faixa/rótulo/subtitulo/Q&A verbatim, Selmo com poemas, regressão leituras-por-livro + rotas 8/8 HTTP 200); screenshots shot-entrevistas-lista.png / shot-entrevistas-ficha.png

Stage Summary:
- Subtab Entrevistas restaurada em Escritos & Leituras com as 7 entrevistas completas do legado, layout idêntico a ensaios/crônicas/traduções
- Fichas da Task 62 reintegradas ao estado corrigido (incidente do import neutralizado)
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 65
Agent: main
Task: Cor de contraste para as PERGUNTAS das entrevistas (pedido da usuária: "as perguntas tinham uma cor de contraste com as respostas na versão anterior")

Work Log:
- Investigação da "versão anterior": legado (perguntas pretas, só <b>/<i> — sem cor), site conceito vercel.app (chunks JS baixados — sem Q&A de entrevistas, só eventos do movimento), git (fichas das entrevistas têm UM único commit, o da Task 64 — o estilo antigo perdeu-se no rollback da queda de energia e é irrecuperável) e template-original (nada) → recriado o contraste com o accent do site #7a3b5a (rosa-grená dos links/"Leia o texto")
- Levantamento bloco a bloco dos formatos de pergunta nas 7 fichas: IMES <b>IN</b>: (7, parágrafo-gigante com <br>, respostas <b>Dalila</b>:), Álvaro <p>AAF/AFF - (12, sendo 1 parágrafo MISTO pergunta+DTV no mesmo <p>), Floriano <p>FM (9), PD <b>/<strong>PD - (10), Selmo <b>SELMO VASCONCELLOS</b> (6, com variação de espaço antes de </b>; versos do poema "como salvar..." NÃO são perguntas), Sérgio Simka <p><i>...</i></p> integral (10 prompts), Tarso enquete <p>N. (5; a 4 abre com aspa CP1252 \x93 legada, verbatim)
- scripts/marcar_perguntas_entrevistas.py: adiciona class="pergunta" aos <p> de pergunta (51) e envolve trechos em span.pergunta (8: 7 do IMES + 1 do parágrafo misto do Álvaro — nesse o <p> fica SEM classe para não colorir a resposta); guardas: contagens exatas por ficha (aborta se divergir), verbatim strip-tags antes/depois idêntico, tags balanceadas, idempotente (nunca importar geradores — lição da Task 64)
- css-corpo.ts: .corpo-texto p.pergunta, .corpo-texto span.pergunta { color: #7a3b5a } — respostas permanecem #333
- Validação: tsc 0 erros; scripts/verifica_perguntas_entrevistas.py 7/7 (contagens p/span exatas, cor computada rgb(122,59,90) nas perguntas, respostas rgb(51,51,51), versos do poema do Selmo intactos, resposta do parágrafo misto do Álvaro intacta, respostas "Dalila:" do IMES intactas); HTTP 200 7/7 entrevistas + regressão ensaio/leitura; screenshots shot65-pd-qa.png, shot65-imes-qa.png, shot65-sergio-perguntas.png (contraste visual confirmado)

Stage Summary:
- As 59 perguntas das 7 entrevistas agora aparecem em rosa-grená #7a3b5a (contraste com as respostas #333), com o texto 100% verbatim (apenas atributo class adicionado)
- Parágrafos mistos e o gigante do IMES: cor aplicada só ao trecho da pergunta (span), resposta permanece escura
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 66
Agent: main
Task: Correções de transcrição na Entrevista a Álvaro Alves de Faria (reportadas pela usuária): travessão virado "quadradinho" + 1ª pergunta sem a cor das perguntas

Work Log:
- Diagnóstico do "quadradinho": os .htm do legado são ISO-8859-1 declarado com bytes CP1252 do Word (0x93 " / 0x94 " / 0x96 – / 0x97 —); navegadores exibem ISO-8859-1 como windows-1252, então o legado MOSTRAVA os travessões certos — a conversão ISO-8859-1→UTF-8 da Task 64 preservou os controles C1 (U+0093/U+0094/U+0096/U+0097), que browsers atuais desenham como tofu. Confirmado byte a byte no legado bruto (legado_entrevista_04.htm: 5× 0x96, exatamente os 5 da ficha)
- Auditoria do acervo inteiro (82 fichas /texto + 3 /obra + data/*.json): 41 C1 em 6 entrevistas (alvaro 5×0x96, floriano 2×0x96, imes 9×0x93+9×0x94, pd 3×0x96+2×0x97, selmo 1×0x96+2×0x93+1×0x94, tarso 4×0x93+3×0x94); ensaios/crônicas/traduções/leituras limpos
- scripts/corrige_c1_cp1252.py: substituição 1:1 provada posição a posição (só C1, mapa CP1252 completo); verificação cruzada por ficha vs legado bruto (contagem de cada byte no .htm original == contagem corrigida: 5/5, 2/2, 9/9, 9/9, 3/3, 2/2, 2/2, 1/1, 4/4, 3/3); pós-check: nenhum C1 restante; correção de bug no próprio script (zip desalinhado pela marcação que muda tamanho — comparação isolada antes da marcação)
- 2º ponto: 1ª pergunta do Álvaro abre com "- <b>Álvaro Alves de Faria</b> – Dalila, ..." (nome completo; as demais usam AAF/AFF — por isso escapou da Task 65) → class="pergunta" adicionada; Álvaro agora com 12 p.pergunta + 1 span
- Validação: tsc 0 erros; verifica_perguntas_entrevistas.py 7/7 (regressão Task 65 com alvaro p=12); checks Task 66 no browser: "Álvaro Alves de Faria – Dalila" com en dash correto, 1ª pergunta rgb(122,59,90), IMES com aspas “disseminação” corretas, PD com em dash "gestões — ... —", Tarso pergunta 4 "4. “Tenho que dar...", zero tofu nas 4 páginas; HTTP 200 7/7; screenshots shot66-alvaro-1a-pergunta.png, shot66-imes-aspas.png

Stage Summary:
- Os 41 "quadradinhos" das entrevistas corrigidos para os caracteres reais do legado (aspas “ ” e travessões – —), com contagem byte a byte batendo com o site original
- 1ª pergunta do Álvaro (nome completo) agora colorida como as demais; texto 100% verbatim
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 67
Agent: main
Task: Separar perguntas e respostas em parágrafos próprios ("respiro") — pedido da usuária: "pergunta e resposta tudo na mesma linha" (exemplo: /texto/entrevista-alvaro-alves-de-faria)

Work Log:
- Diagnóstico: o parser da Task 64 converteu separadores de bloco do legado em espaços. Casos: (1) Álvaro p7 — legado tinha <br><br> entre a pergunta AFF e a resposta DTV dentro de 1 <p>; hoje estavam colados na mesma linha (2) IMES — TODA a entrevista (7 Q + 7 A) num único <p> gigante de 21 <br>, sem margem de parágrafo (3) bônus encontrado no scan: Sérgio Simka pergunta 6 "Q<i>uais são as maiores dificuldades..." tinha o Q FORA do <i> no legado → escapou do padrão <p><i> da Task 65 e não estava colorida
- Scans automáticos (scripts/scan_qa_colados.py, scan_perguntas_sem_classe.py): confirmaram que só essas 3 fichas tinham o problema; Floriano/PD/Selmo/Tarso já corretas
- scripts/corrige_qa_paragrafos.py: Álvaro misto → <p class="pergunta"> + <p> DTV; IMES gigante → 7 <p class="pergunta"> + 7 <p> de resposta (<p><br><span> eliminado, <br><br> virou fronteira de parágrafo, <br> final removido); Sérgio Q6 ganhou class="pergunta". Espaços preservados ENTRE </p> e <p> (posição invisível) para o guard verbatim passar; guardas: strip-tags + whitespace normalizado idêntico, tags balanceadas, contagens exatas (1/7/6/1), zero C1
- Contagens finais: Álvaro 32 p (13 pergunta), IMES 15 p (7+7), Sérgio 23 p (11 pergunta); total de perguntas coloridas 61
- Verificação: tsc 0 erros; verifica_perguntas_entrevistas.py 7/7 (contagens, cor rgb(122,59,90) nas perguntas, respostas rgb(51,51,51), Álvaro: resposta DTV em <p> separado com margin-bottom 20px e sem colagem; IMES: nenhum <p> com IN:+Dalila:, 7 Q + 7 A, respiro 20px; Selmo: versos do poema intactos); HTTP 200 7/7; screenshots shot67-alvaro-separacao.png, shot67-imes-separacao.png, shot67-imes-final.png, shot67-sergio-pergunta6.png

Stage Summary:
- Perguntas e respostas agora em parágrafos próprios com o respiro de 20px nas 3 fichas afetadas (Álvaro, IMES, Sérgio Simka); texto 100% verbatim (só estrutura HTML)
- Bônus: 6ª pergunta do Sérgio Simka (dropcap Q fora do <i> no legado) agora colorida como as demais
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 68
Agent: main
Task: Restaurar os dados do Eixo Movimento perdidos no vai-e-volta de energia — distribuição nas subtabs da tab Ativismo Cultural (usuária forneceu pasta do Drive 1Q0ZVOF3TDMitMbTHeq60vsVU7-_yVSG7)

Work Log:
- Estado encontrado: 9 JSONs de movimento como stubs vazios de 25/09 (rollback da 1ª queda); Institucionais.json (8) e ativismo.json (263) sobreviveram; distribuição anterior nunca commitada e worklog das tasks perdidas sumiu no rollback
- Download do Drive (gdown no venv): 9 JSONs curados da usuária (38 registros, schema próprio: id/titulo/tipo/modalidade/ano/dataCompleta/local/cidade/estado/descricao) + AtivismoCultural.txt (106KB)
- AtivismoCultural.txt = array TS `dadosPalestrasOficinas` com 263 registros — COMPARADO byte a byte com src/app/data/movimento/ativismo.json: IDÊNTICOS (era só backup; parse TS->JSON em scripts/parse_ao_drive.js com balancemaneto ciente de strings/URLs http://)
- Mapeamento adotado (scripts/gerar_dados_movimento.py): palestras-conferencias(5)→Palestras; oficina-workshops(4)→OficinasWorkshops; saraus-recitais(5)→SarausRecitais; congressos-seminarios(4)→CongressosSeminariosSimposios; mesas-debate-rodas-conversa(4)→ConferenciasMesas; encontros-leituras SPLIT por tipo: 3 Leitura Pública→LeiturasPoeticas + 1 Encontro→EncontrosAtividadesCulturais; entrevistas-programas(4)+lives-podcasts(4)→ProgramasEntrevistas; curadoria-consultoria(4)→CuradoriaConsultoria
- Conversão de schema para a moldura ArquivoCategoria idêntica ao Institucionais sobrevivente: id "<prefixo>-NNN" + numero_ordem, dataCompleta→data ISO "AAAA-MM-00" (parser 4 padrões, 38 formatos) + data_fim para faixas ("22 de novembro a 12 de dezembro de 1990"→1990-11-22 a 1990-12-12), estado "Internacional"→pais "Portugal" (Funchal), tags do vocabulário do lib/tags.ts (subcategoria azul + virtual vermelho), descricao→texto_original; ordenação cronológica; sem slug_texto (rota /palestras não existe — evita link morto)
- Stubs antigos salvos em scripts/backup_movimento_stubs/; Institucionais e ativismo intocados; SecaoMovimento.tsx conferido vs template-original: fiel (só diferenças defensivas ?./?? de sessões anteriores); dadosAtivismos importado e não renderizado é design do template dela
- Validação: tsc 0 erros; scripts/verifica_movimento.py 9/9 subtabs (contagens 9/5/4/4/8/1/8/4/3, zero "Nenhum registro", décadas renderizadas, Funchal mostra Portugal, pill #virtual presente); rotas 200 (home 3 eixos + /texto); screenshots shot68-palestras.png, shot68-leituras.png

Stage Summary:
- As 9 subtabs do Ativismo Cultural repovoadas com os 38 registros curados da usuária (total 46 com os 8 Institucionais sobreviventes), no schema normalizado do site e texto verbatim dela
- ativismo.json (263) confirmado intacto; ativo como backup do Drive da usuária
- Decisões de mapeamento comunicadas à usuária (split encontros/leituras, lives/podcasts em Programas & Entrevistas) — reversível se ela preferir outra distribuição
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 69
Agent: main
Task: Verificar e restaurar o livro "Alpharrabio 12 anos" em Obras Publicadas (usuária perguntou se o texto e a imagem se perderam)

Work Log:
- Diagnóstico: o REGISTRO no catálogo (dadosProsa: "Alpharrabio 12 anos", 2004, "Em coautoria com Luzia Maninha") sobreviveu — idêntico em template-original, conceito_chunks e drive-obra-full; a CAPA também sobreviveu em disco (public/imagens/obras-publicadas/poesia/2004-capa-Alpharrabio12anos.jpg, foto do livro "uma história em curso") — porém a FICHA /obra/alpharrabio-12-anos nunca foi commitada (git log --all vazio) e a página caía em "Página em construção" (o texto sim se perdeu no rollback das quedas de energia)
- Ficha recriada em src/app/obra/[id]/alpharrabio-12-anos/dados.json com dados 100% verbatim: titulo, subtitulo "uma história em curso" (da capa + bibliografia do estudo legado), genero Prosa, ano 2004, capa (arquivo original), status_catalogo esgotado, sobre = definição da autora verbatim do estudo crítico legado ("o registro, de um ciclo cumprido, o registro de uma casa de livros, notas sobre uma casa de palavras, anotações sobre uma casa de artes, memórias de uma casa de cultura, notícias de uma micro usina de ideias e projetos") + atribuição, dados da edição (Ano/Tipo/Editora "Alpharrabio Edições, Santo André/SP"/Coautoria "Luzia Maninha Teles Veras")
- ConteudoObra.tsx: ficha registrada no import + mapa livros["alpharrabio-12-anos"] (imports estáticos — sem isso o cliente não enxerga a ficha nova)
- BÔNUS — varredura das subtabs Poesia/Prosa comparando slug gerado pela listagem (titulo → slugify) vs pastas de fichas: 6 links "Conheça a obra" MORTOS apesar de fichas existentes (A Palavraparte, Poética das Circunstâncias, Forasteiros, Elemento em Fúria, Madeira, As Artes do Ofício — pastas com "---" ou nomes divergentes; bug herdado também da SecaoObras_CORRIGIDO da usuária). Corrigido com slug explícito nas 6 entradas + href preferindo obra.slug com fallback ao slug gerado
- Pendências reportadas à usuária (fichas realmente inexistentes → "Página em construção", estado suportado pelo template): ponto(s), Seduzir para a Poesia, Minudências (esta tem capa em disco: 2000-capa-minudencias.jpg)
- Validação: tsc 0 erros; scripts/verifica_alpharrabio12.py 29/29 (ficha completa: capa decodificada naturalWidth=400, título/subtítulo/PROSA, Sobre com citação, Dados da Edição com 5 cards incluindo EDIÇÃO Esgotada auto; listagem Prosa intacta; regressão a-vida-cronica; 6 links consertados abrindo ficha); screenshots shot69-alpharrabio-ficha.png, shot69-alpharrabio-dados.png, shot69-lista-prosa.png

Stage Summary:
- Alpharrabio 12 anos: ficha restaurada com capa + citação da autora + dados de edição; página saiu do "Página em construção"
- 6 links mortos da listagem (Poesia/Prosa) agora abrem suas fichas existentes
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 70
Agent: main
Task: Ficha Minudências a partir do legado (pedido da usuária: usar o conteúdo de http://www.dalila.telesveras.nom.br/Minudencias.htm na ficha minudencias)

Work Log:
- Contexto: pendência herdada da Task 69 (Minudências constava como "Página em construção"; capa 2000-capa-minudencias.jpg já existia em disco)
- Legado baixado (scripts/legado_minudencias/Minudencias.htm, ISO-8859-1/CP1252, 3.2KB): página do livro com título, link Alpharrabio Edições, formato "(16 x 23 cm, 136 pp.)" e descrição em 2 parágrafos (projeto de diarização de 1999 / origem na empreitada de Antonio Possidonio Sampaio, 1992, ABC Cotidiano - Cotidiário)
- scripts/gerar_ficha_minudencias.py: extração verbatim dos 2 <p ALIGN="right"> do legado (drop de tags, unescape, soft wraps -> espaço único, \n\n entre parágrafos); guardas de prefixos/âncoras/finais, zero C1, zero resto de tag; aspas de abertura do P1 (sem fecho NO PRÓPRIO legado) e "idéia" pré-acordo preservados
- src/app/obra/[id]/minudencias/dados.json: titulo Minudências, genero Prosa, ano 2000, capa original, status esgotado, sobre = 2 parágrafos verbatim, dados: Ano 2000 / Tipo Diário (catalogo "Diário. SP: Alpharrabio") / Editora Alpharrabio Edições, SP / Formato 16 x 23 cm / Páginas 136 pp. (padrão das fichas irmãs a-vida-cronica/a-janela-dos-dias)
- ConteudoObra.tsx: import + livros["minudencias"] (imports estáticos — mesmo wiring da Task 69)
- Slug: listagem Prosa gera "minudencias" automaticamente de "Minudências" (NFD) — casa com a pasta; nenhuma edição no SecaoObras necessária
- Validação: tsc 0 erros; scripts/verifica_minudencias.py 27/27 (HTTP 200, sem "Página em construção", capa naturalWidth=1890, Sobre verbatim P1/P2 com âncoras, 5 cards + EDIÇÃO Esgotada auto, link Conheça a obra → /obra/minudencias, regressão a-vida-cronica/alpharrabio-12-anos/diuturnos); screenshots shot70-minudencias-ficha.png, shot70-minudencias-dados.png, shot70-lista-prosa.png

Stage Summary:
- Ficha /obra/minudencias saiu do "Página em construção": capa original + texto verbatim do legado (2 parágrafos) + Dados da Edição completos
- Fichas de obras ainda sem fonte (seguem "Página em construção", conforme levantamento da Task 69): Seduzir para a Poesia (pasta inexistente) e demais sem legado identificado
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 70-b (fechamento)
Agent: main
Task: Encerramento da fase — reempacotamento v15 para GitHub (usuária disse "terminou tudo por agora")

Work Log:
- QA final antes do pacote: scripts/varredura_final_fechamento.py — 120 rotas varridas (home 3 eixos + 37 fichas /obra + 80 páginas /texto): TODAS HTTP 200 e nenhuma ficha com conteúdo caiu em "Página em construção"; único alerta era falso positivo (curl sem JS não vê rótulo do eixo obra) — confirmado no browser com scripts/confirma_eixos_browser.py 4/4 (OBRAS PUBLICADAS renderiza em maiúsculas via CSS)
- /api/baixar-pacote NÃO existe mais no código (só resta o route.ts "Hello world" — mecanismo da v14 perdido nos rollbacks das quedas de energia); pacote v15 gerado direto do git: `git archive --format=zip --prefix=dalila-teles-veras/ -o download/dalila-teles-veras-site-v15-final.zip HEAD`
- Verificação do pacote: zip íntegro (unzip -t), 1410 entradas = 1072 arquivos + 338 diretórios, batendo 1:1 com `git ls-files` (1072=1072; 6 "diferenças" são apenas nomes UTF-8 — git exibe escapado, zip traz "liçõesdetempo/inventário.jpg" reais); diff byte a byte OK (minudencias/dados.json, ConteudoObra.tsx, worklog, package.json); maior arquivo 7MB (folga do limite de 100MB do GitHub)
- Estado do git: working tree limpo, último commit inclui a Task 70 completa (ficha minudencias + wiring + scripts + screenshots)
- Pacote: download/dalila-teles-veras-site-v15-final.zip (303MB, pasta raiz dalila-teles-veras/ ao descompactar, SEM .git — repo limpo para git init + push)

Stage Summary:
- Fase encerrada a pedido da usuária ("terminou tudo por agora"); site 100% validado (tsc 0 erros, 120 rotas 200, eixos OK no browser)
- Pacote v15 completo (snapshot exato do HEAD, incluindo src/, public/, scripts/, upload/, drive-obra-full/, template-original/, worklog) disponível em download/ para o GitHub
- Usuária voltará depois "com os apontamentos da cliente amiga" — sessão futura de revisões

---
Task ID: 71
Agent: main
Task: RECONSTRUÇÃO TOTAL pós-2ª queda de energia — rollback para o checkpoint de 25 Sep perdeu as Tasks 60-70 (git também revertido; commit 44969bc da Task 70 inexistente como objeto); pedido da usuária: recriar o download v15

Work Log:
- Diagnóstico: .git com 38 commits todos de 25 Sep (último feb3348 21:46); reflog sem rastro dos commits de 01 Oct; zip v15 de download/ sumiu; worklog.md regrediu a 20-b; 3 fichas conceito em versão antiga (403-485B); 9 subtabs de movimento como stubs ~150B; sem leituras críticas/entrevistas/alpharrabio/minudencias
- SOBREVIVEU (Tasks 1-59): 38 fichas /texto, 35 fichas /obra, ativismo.json (263), Institucionais.json (8), scripts/legado/ + gerar_textos_legado.py
- Documentação recuperada: entradas 62-70-b re-anexadas ao worklog a partir do contexto da sessão (scripts/worklog_recuperado_62a67.md)
- Reconstrução em andamento conforme as receitas das tasks originais (todas documentadas acima)
Work Log (conclusão Task 71):
- Tasks 60/61 (3 fichas conceito): chunk de dados re-localizado — o "buildId" 2bdy5z6zr5em0 é um CHUNK NOMEADO visível no HTML da vercel (/_next/static/chunks/2bdy5z6zr5em0.js, 20.805B idêntico à Task 62); extract string-aware recriado (scripts/extract_conceito_3livros.mjs) — batimento 100% (Passageira sobre 1033c/orelha 558c Lilian Sais/11 cartões/ano 2026; Opções 512c/416c Amanda Vital; Ínsulas 1740c/6 cartões); merge recriado com as decisões (capa real passageira.png 453.618B re-baixada da vercel; cartão Prêmio Oceanos 1º; placeholder "Formato" fora; subtítulos residuais diuturnos/soliloquios/vestigios limpos); bloco subtítulo re-adicionado ao ConteudoObra (markup exato extraído do HTML SSR da vercel)
- Task 62 (35 fichas leituras/estudo): legados re-baixados (6 páginas + EstudosCriticos1.htm); contagens batendo (Estranhas 1, Retratos 2, Janela 13, Vestígios 12, Artes 3 c/ "Lentes Atentas", Vida Crônica 3 = 34 + 1 estudo); parser limpar_fragmento recriado COM 2 correções novas descobertas na reconstrução: (a) html.unescape ANTES do colapso (&nbsp; virava \xa0 intocável), (b) SmartTags <st1:/st2:> do Word removidas do html_limpo; curadoria bloco a bloco (cabeçalhos removidos por igualdade normalizada; títulos de cartas = 1ª sentença >=20c cortada em vírgulas/aspas, com cosmética de título e fecho de aspas); poema "10 de junho" incluído no estudo; arrays gerados (34+1) e wiring no SecaoObras (branch própria leituras, "Leia o texto" estendido p/ estudos)
- Task 63: leiturasAgrupadasPorLivro (6 grupos 1/2/12/13/3/3, ordem do legado), régua de décadas pelos anos dos LIVROS, âncora c-{década} no 1º grupo da década, linha "- por {autor} - Leia"
- Tasks 64-67 (7 entrevistas): legados re-baixados; fichas geradas com curadoria por página (IMES: gigante dividido nos <b>IN</b>/<b>Dalila</b> → 7+7; Álvaro: misto B07 dividido no " DTV - " → 13 perguntas; PD 10; Floriano 9; Sérgio 11 (Q<i>uais preservado); Selmo 6 + 3 poemas; Tarso 5 com aspa " da pergunta 4); 61 perguntas class="pergunta" (contagem exata da Task 67) + CSS p.pergunta #7a3b5a re-adicionado; zero C1 (decode CP1252 direto) e zero SmartTags; dadosEntrevistas + subtab Entrevistas + subtítulo de Escritos
- Task 68 (movimento): Drive re-baixado (gdown 6.4.1); 9 subtabs repovoadas com 38 registros (split encontros/leituras 1+3; lives-podcasts junto em Programas); parser de datas 4 padrões c/ data_fim; Funchal estado Internacional → pais Portugal; tags do vocabulário (subcategoria azul + virtual vermelho); contagens das subtabs 9/5/4/4/8/1/8/4/3 = 46 exatas; Institucionais (8) e ativismo (263) intocados; stubs em scripts/backup_movimento_stubs/
- Tasks 69/70: fichas alpharrabio-12-anos (JSON fiel ao contexto) e minudencias (gerador recriado, texto verbatim P1/P2); href com obra.slug ?? re-aplicado
- LIÇÃO DA 2ª QUEDA: a sync pós-boot chegou em FASES — o estado interim (lido às 13:30) tinha remanescentes das Tasks 69 (6 slugs na SecaoObras) que a sync final sobre-escreveu; slugs re-adicionados após detectar a divergência na verificação (4 pastas órfãs de execuções intermediárias dos títulos de cartas removidas)
- Validação: tsc 0 erros; scripts/verifica_reconstrucao71.py 68/68 no browser (6 cabeçalhos agrupados, 34 links Leia, estudos, ficha de leitura, subtab Entrevistas 7 itens, perguntas rgb(122,59,90) Álvaro 13/IMES 7, 9 subtabs do movimento com Funchal/Portugal + virtual, 3 fichas conceito com orelhas/cartões/trechos, alpharrabio+minudências completas, 8 links Conheça a obra); varredura 120/120 rotas HTTP 200 (home 3 eixos + 37 /obra + 80 /texto, nenhuma ficha em "Página em construção"); screenshots shot71-*.png
- Pacote v15 recriado: download/dalila-teles-veras-site-v15-final.zip (git archive do HEAD, prefixo dalila-teles-veras/)

Stage Summary:
- Reconstrução TOTAL concluída: o estado pós-Tasks 62-70 foi integralmente restaurado e revalidado (fichas, wiring, cores, movimento, conceito, fechamentos)
- Pacote v15 disponível novamente em download/ para o GitHub

---
Task ID: 72
Agent: main
Task: Aba Estudos Críticos — acrescentar o texto do legado "Texto de José Pereira da Silva.htm" (<title>: "José Armando Pereira da Silva sobre Dalila Teles Veras", 2002), apontado pela usuária

Work Log:
- Git íntegro pós-queda (HEAD 31a4e9a com Task 71); legado baixado para scripts/legado_estudo_jose_armando/ (CP1252, 7.910B)
- scripts/gerar_estudo_jose_armando.py: receitas Task 62 (decode CP1252 direto, unescape ANTES do colapso, soft wraps -> espaço, zero C1, zero tag residual); 15 blocos <p> -> filtros de chrome (cabeçalho "DAlila Teles Veras texto de..." — normalizado NFD, por isso "índice" virava "indice" no filtro 1º; rodapé índice/Poesia/Projetos/Crônicas; &nbsp; vazio; cabeçalho cinza = título removido por igualdade normalizada) -> 11 parágrafos (10 + assinatura), 4.495 caracteres
- Itálicos semânticos re-aplicados por substituição contada (cada título exatamente 1x): Lições do Tempo, Inventário Precoce, A Palavraparte, A Vida Crônica, As Artes do Ofício; assinatura final <p><i>José Armando Pereira da Silva / 2002</i></p>; drop-cap estilizado do "O" inicial convertido a texto puro (artefato de layout)
- Verbatim preservado: travessão "muita labuta – iniciada", aspas simples de " na citação Barrault, "freqüência" pré-acordo, "muito além do limites da região" (sic do legado), rua Eduardo Monteiro, 151
- src/app/texto/[id]/jose-armando-pereira-da-silva-sobre-dalila-teles-veras/dados.json: tipo estudo-critico, titulo "Dalila Teles Veras" (título real do texto), subtitulo "Texto de José Armando Pereira da Silva", ano 2002, fonte_original padrão das irmãs
- SecaoObras.tsx: dadosEstudosCriticos + cartão { ano 2002, descricao "Texto de José Armando Pereira da Silva", slug } — gera "Leia o texto →" pelo wiring existente (branch resenhas/estudos); SSG descobre a pasta automaticamente
- Validação: tsc 0 erros em src/ (16 erros pré-existentes só em drive-obra-full/ e upload/, cópias de backup fora do build); scripts/verifica_estudo_jose_armando.py 19/19 no browser (ficha completa 11 parágrafos + 6 itálicos; aba Resenhas > Estudos Críticos com 2 cartões; clique navega p/ ficha) — 3 falsos negativos iniciais eram CSS text-transform: uppercase ("Fonte", "Estudo Crítico"), lição 70-b re-aplicada; scripts/varredura_task72.py 121/121 rotas 200 (37 /obra + 81 /texto + home), zero "Página em construção"
- Screenshots: shot72-estudo-jose-armando-ficha.png, shot72-aba-estudos.png

Stage Summary:
- Aba Estudos Críticos agora com 2 estudos (Clara Moura Lourenço 2009 + José Armando Pereira da Silva 2002); ficha nova verbatim do legado
- Pacote v15 em download/ ficou DESATUALIZADO (não contém esta ficha); reempacotar só quando a usuária encerrar esta rodada de apontamentos

---
Task ID: 73
Agent: main
Task: Remover o bloco "Fonte" (URL do site antigo) da ficha do Professor José Armando Pereira da Silva — pedido da usuária

Work Log:
- dados.json da ficha jose-armando-pereira-da-silva-sobre-dalila-teles-veras: campo fonte_original removido (o bloco é condicional em ConteudoTexto — desaparece por inteiro); proveniência permanece registrada neste worklog
- scripts/gerar_estudo_jose_armando.py: gerador atualizado para não readicionar o campo (comentário citando o pedido)
- scripts/verifica_estudo_jose_armando.py: check invertido — "bloco Fonte AUSENTE" (sem dalila.telesveras.nom.br e sem "site legado"); revalidação 19/19 no browser
- Screenshot shot73-fim-da-ficha-sem-fonte.png (página termina na assinatura "José Armando Pereira da Silva / 2002")

Stage Summary:
- Ficha do Professor Armando sem referência visível ao site antigo; as demais fichas (35+) mantêm o bloco "Fonte" até decisão da usuária (oferecida varredura em lote)

---
Task ID: 74
Agent: main
Task: Remover o bloco "Fonte" (referência visível ao site antigo) de TODAS as fichas — usuária: "tira de todas"

Work Log:
- Mapeamento: 80 dados.json em src/app/texto/[id]/ com fonte_original + 1 crônica em src/app/obra/cronica/[id]/ (que renderizava "fonte" com LINK CLICÁVEL para o legado no page.tsx próprio); os 4 componentes de /texto (ConteudoTexto/Cronica/Traducao/Ensaio) renderizam o bloco de forma condicional
- scripts/remover_fonte_todas_fichas.py: removeu fonte_original das 81 fichas (bloco desaparece por inteiro) e fonte + fonte_original da crônica "A Cidade do Meu Desejo"
- Varredura por resquícios (domínio dalila.telesveras.nom.br ou rótulo "Site legado" em qualquer dados.json de src/): 2 ocorrências na rota antiga /cronicas ([id]/dados.json — que serve QUALQUER id com o mesmo arquivo, quirk client-render — e a-lingua-a-patria-possivel/, dado órfão sem page.tsx); curadoria mínima: fonte "Coluna Viaverbo (1999-2004) - Site legado" -> "Coluna Viaverbo (1999-2004)" e nota_rodape sem a frase "Texto preservado do site anterior..." (informação real de publicação preservada)
- Resquício final em dados.json: 0
- Validação: varredura 121/121 rotas HTTP 200 e SEM "dalila.telesveras.nom.br"/"Site legado" no HTML SSR (varredura_task72.py estendida); browser (Playwright): lentes-atentas, entrevista-imes-noticias e /cronicas/a-cidade-do-meu-desejo limpos, e /cronicas mantém "Coluna Viaverbo (1999-2004)"
- Observação estrutural (não alterada sem aval da usuária): a árvore src/app/cronicas/ é rota antiga órfã — nada no menu aponta para ela (só voltarUrl interno), qualquer /cronicas/{id} mostra a mesma crônica; candidata a remoção futura

Stage Summary:
- Nenhuma página do site exibe mais referência ao site legado (regra "site legado invisível" agora integralmente cumprida); informação real de publicação (ex.: Coluna Viaverbo 1999-2004) preservada
- Geradores históricos (ex.: gerar_textos_legado.py) ainda escrevem fonte_original se re-executados — relembrar de re-limpar ou ajustá-los antes de qualquer regeneração
- Pacote v15 segue desatualizado (Tasks 72-74 fora dele); reempacotar quando a usuária encerrar a rodada

---
Task ID: 75
Agent: main
Task: Aba Crônicas refletindo o legado cronicasdalilatelesveras.htm com os layouts/estilos dos ensaios + verificação de conformidade ("Verifique se tudo foi subido e organizado")

Work Log:
- Legado baixado (scripts/legado_cronicas/cronicasdalilatelesveras.htm, CP1252, 4.945B — byte-idêntico ao backup antigo scripts/legado/cronicas.htm): índice com 9 crônicas (Crônica de Outono, A Cidade do meu desejo, O Direito ao Silêncio, Bibliocasa, Anotações de Leituras i-iv, A Língua a Pátria Possível) → cronicas1..9.htm já preservados em scripts/legado/raw/
- Levantamento: as 9 fichas /texto já existiam completas (6-28 parágrafos cada) com tipo "cronica", contexto Coluna Viaverbo — Caderno Cultura & Lazer, Diário do Grande ABC; ConteudoCronica.tsx já usa o mesmo pacote visual dos ensaios (faixa FaixaObras.png, imagem da categoria, título Georgia itálico, linha de metadados, cssCorpoTexto) — divergência intencional mantida: versos dourados só nos ensaios e títulos de entrada de diário nas crônicas (pedidos anteriores da usuária)
- SecaoObras.tsx dadosCronicas: typo "Biblocasa" -> "Bibliocasa" (título do legado e da ficha); ordem reordenada para a ORDEM DO ÍNDICE DO LEGADO (era ordem inversa); "A Língua, a Pátria Possível" padronizado como na ficha
- scripts/verifica_cronicas_task75.py: verificação verbatim parágrafo a parágrafo das 9 fichas contra cronicas1..9.htm (CP1252, html.unescape antes do colapso, NFD, chrome filtrado) — descubra: parágrafos <p> SEM fechamento no legado (terminam em </td>) e a palavra "Socráticas" partida por resíduo </b> (">S</font></b><font>ocráticas")
- CORREÇÃO VERBATIM: ficha anotacoes-de-leituras-iv tinha "S ocráticas" (espaço dentro da palavra, herdado da geração) -> "Socráticas"; re-escrito com json.dumps ensure_ascii=False indent=2
- Resultado verbatim: 9/9 OK (legado e ficha com contagens iguais: 6/10/10/6/28/26/24/19/8 parágrafos)
- scripts/verifica_cronicas_task75_browser.py (Playwright): 95/95 checks — subtab Crônicas com 9 itens na ordem do legado, 9 links "Leia o texto →" apontando os slugs certos, typo eliminado; as 9 fichas HTTP 200, faixa "Dalila Teles Veras • Crônicas", linha COLUNA VIAVERBO, imagem placeholder-cronicas.png carregada (naturalWidth=400), corpo .corpo-texto, zero referência ao site legado; entradas de diário douradas rgb(139,105,20) nas Anotações; "Socráticas, de José Paulo Paes" renderizado; regressão ensaio sentir-se-portugues-na-diaspora intacta (lição 70-b: checks case-insensitive por causa do CSS uppercase)
- screenshots: shot75-aba-cronicas.png (+ fim da lista), shot75-anotacoes-diario.png
- tsc 0 erros em src/; varredura_task72.py: 121 rotas (37 /obra + 81 /texto + home), 0 falhas
- "tudo subido": working tree commitado após este commit (Tasks 72-75); pacote v15 de download/ segue DESATUALIZADO (fora Tasks 72-75), reempacotar só quando a usuária encerrar a rodada

Stage Summary:
- Aba Crônicas agora é espelho fiel do índice do legado: 9/9 crônicas verbatim, ordem do legado, sem typo, sem referência ao site antigo, layout/estilo do pacote dos ensaios
- 1 defeito verbatim real corrigido ("Socráticas"); verificador trata <p> abertos do legado
- Pendência mantida: rota órfã src/app/cronicas/ (fora do menu, decisão futura da usuária); pacote v15 aguardando "terminou"

---
Task ID: 76
Agent: main
Task: Remoção da rota órfã /cronicas (aval da usuária: "sim já delete e reempacote. Gostaria de terminar tudo") + reempacotamento v16 final

Work Log:
- Confirmação prévia: nenhum link/href fora da própria árvore aponta para /cronicas (as únicas menções a "cronicas" em src/ são caminhos de imagem /imagens/obras-publicadas/cronicas/, que ficam em public/ e não mudam); rota também ausente de sitemap/robots (não existem)
- git rm -r src/app/cronicas/ (page.tsx com lista de 2 crônicas no design azul antigo + [id]/page.tsx que servia QUALQUER id com o mesmo dados.json + 2 dados.json) — histórico preservado no git
- Validação pós-remoção: /cronicas e /cronicas/{id} -> 404; /texto/{slug} das crônicas, /obra e home -> 200; varredura_task72.py 121 rotas 0 falhas; verifica_cronicas_task75_browser.py 95/95; tsc 0 erros em src/
- Higiene do repo para o pacote: download/dalila-teles-veras-site-v15-final.zip (292MB) desrastreado (git rm --cached, arquivo permanece em download/) + .gitignore com download/*.zip — evita pacote aninhado e respeita o limite de 100MB do GitHub
- Pacote v16: git archive --format=zip --prefix=dalila-teles-veras/ -o download/dalila-teles-veras-site-v16-final.zip HEAD -- ':(exclude)skills' (309.4MB; skills/ é diretório de plataforma, não estava no v15)
- Verificação do v16: testzip OK; composição 1:1 com git ls-files (1022=1022, menos skills/ e zips de download; diferenças de nomes UTF-8 escapado = falsos positivos conhecidos da 70-b); sem .git/; sem pacote v15/v16 aninhado; maior arquivo 6.5MB; spot-checks: ficha José Armando SEM fonte_original, zero fonte_original em todos os dados.json de /texto, SecaoObras com "Bibliocasa" e Crônica de Outono primeiro, "Socráticas" corrigido, worklog com Tasks 72-75, src/app/cronicas/ ausente

Stage Summary:
- Site encerrado por pedido da usuária: rota órfã removida, zero referência ao site legado em todo o site, aba Crônicas espelhando o legado
- Pacote FINAL: download/dalila-teles-veras-site-v16-final.zip ( Tasks 72-76 inclusas; substitui o v15 desatualizado)
- Próxima sessão prevista: apontamentos da cliente amiga

---
Task ID: 77
Agent: main
Task: Botão/rota de download do pacote v16 (usuária: "TRAGA O BOTÃO DE DOWNLOAD PRA EU BAIXAR O ZIP")

Work Log:
- Mecanismo da era v14 (/api/baixar-pacote) confirmado perdido: nunca existiu nos commits acessíveis (git log --all mostra apenas src/app/api/route.ts); recriado do zero
- src/app/api/baixar-pacote/route.ts: GET/HEAD que serve em STREAMING o zip mais recente de download/ (sem buffer de 300MB em memória; Readable.toWeb(createReadStream)), headers Content-Type application/zip, Content-Length e Content-Disposition attachment; 404 JSON se não houver pacote; dynamic = "force-dynamic" — utilitário fora do conteúdo do site memorial (nada no menu aponta para ele)
- Escolha automática: último zip lexicográfico em download/ (v16 > v15)
- Validação: HEAD 200 com content-length 309407244 e filename correto; GET baixa os 309MB e o MD5 via rota é IDÊNTICO ao do arquivo original (c64a7efce40494ee48e60603cee1cb5c); tsc 0 erros em src/; home, ficha de crônica e ficha de obra seguem 200
- Commit inclui a rota; o zip NÃO entra no repo (download/*.zip no .gitignore, Task 76)

Stage Summary:
- Download do pacote v16 disponível em /api/baixar-pacote no servidor de desenvolvimento (link de preview entregue à usuária)

---
Task ID: 78
Agent: main
Task: Reentrega do pacote v16 no painel de arquivos (usuária: só aparece a v15 nos botões de download)

Work Log:
- Verificação de integridade: dalila-teles-veras-site-v16-final.zip presente em download/ (309.407.244 B), MD5 c64a7efce40494ee48e60603cee1cb5c — IDÊNTICO ao registrado na Task 76 (arquivo íntegro, não houve corrupção)
- Causa provável: a v15 foi entregue numa mensagem anterior (card antigo do painel); a v16 foi gravada no fim da sessão passada e o painel não reescaneou download/ desde então
- Ação: touch no mtime do v16 (18:42) para forçar rescan do painel; rota /api/baixar-pacote revalidada (HEAD 200, content-length 309407244, filename v16 correto, home 200) como caminho alternativo de download
- Nenhuma alteração de código ou conteúdo do site; zip fora do repo (gitignore Task 76)

Stage Summary:
- v16 íntegra e disponível por 2 caminhos: painel de arquivos (após rescan/recarga) e <link-de-preview>/api/baixar-pacote

---
Task ID: 79
Agent: main
Task: Divisão do pacote v16 em partes baixáveis (usuária: botão da v16 não aparece no painel e o download do preview falha mesmo com reload)

Work Log:
- Diagnóstico: v16 (309.407.244 B) existe e íntegra (MD5 c64a7efce40494ee48e60603cee1cb5c conferido de novo), rota local responde 200 — a falha é no CANAL de entrega: painel de arquivos e proxy de preview rejeitam respostas ~309 MB (a v15 com 306.150.416 B aparecia; a v16 tem ~3 MB a mais — limite de resposta entre os dois tamanhos)
- Composição do v16 medida: upload/ 93.8MB + drive-obra-full/ 93.4MB (referências internas do Drive) + public/ 91.2MB (essencial) + scripts/ 19.6MB + resto pequeno
- Solução: divisão em 4 partes de <= 90 MiB — scripts/gera_partes_v16.py gera dalila-teles-veras-site-v16-final.parte1..4de4.zip (94.371.840×3 + 26.291.724 B) + LEIA-ME-pacote-v16.txt com instruções de reunião (copy /b no Windows, cat no macOS/Linux) e MD5 de conferência
- Verificação da divisão: cat das 4 partes | md5sum = c64a7efce40494ee48e60603cee1cb5c — IDÊNTICO ao original (remontagem garantida)
- Partes no TOP-LEVEL de download/ para o painel enxergar; nomes ".parteKdeN.zip" ordenam ANTES do zip cheio ("parte" < "zip") — /api/baixar-pacote sem parâmetro continua servindo o pacote completo
- Rota /api/baixar-pacote estendida: ?parte=K serve a K-ésima parte (streaming, Content-Disposition com nome da parte, 404 se inexistente); ?lista devolve JSON com pacote + partes + URLs + instruções; HEAD aceita ?parte
- Validação: tsc 0 erros em src/; HEAD ?parte=1 -> 200/94.371.840/filename correto; ?lista JSON correto; GET ?parte=4 baixado via rota com MD5 IDÊNTICO ao arquivo local (c57aec3bb02b829879e09a31c964f0cb); home 200
- LEIA-ME-pacote-v16.txt fora do repo (gitignore download/LEIA-ME-*.txt; zips já cobertos por download/*.zip)

Stage Summary:
- Entrega da v16 resolvida por 2 canais: partes de ~90 MB no painel de arquivos e /api/baixar-pacote?parte=1..4 no link de preview; reunião com 1 comando reproduz o zip original (MD5 conferido nas duas pontas)

---
Task ID: 80
Agent: main
Task: Diuturnos sem abas de mês — 12 meses na mesma página, títulos dourados, linha fina entre meses, imagens alternando esquerda/direita (pedido da usuária antes de baixar o pacote)

Work Log:
- Estado anterior: aba Trechos do ConteudoObra mostrava 1 mês por vez via botões-aba (janeiro..dezembro); layout antigo do Diuturnos (imagem sempre à ESQUERDA, título escuro) removido (linhas 447-525)
- Novo componente DiuturnosFluxo em src/app/obra/[id]/ConteudoObra.tsx: os 12 meses SEQUENCIAIS na mesma página; título do mês Georgia uppercase letterSpacing 5px na cor DOURADA #8b6914 (mesmo dourado de Pecados e do diário das crônicas); linha fina dourada 1px (gradiente transparente→#d4af37→transparente) ENTRE os meses (11 separadores, nenhum depois de dezembro); imagens ALTERNANDO — meses ímpares (janeiro, março...) imagem à ESQUERDA, meses pares (fevereiro, abril...) à DIREITA via flexDirection row/row-reverse; parsing de **negrito** mantido (marcadores de dia como "sábado 1"); flexWrap+minWidth para telas estreitas
- Condição de ativação: livro.trechos.some(t => t.imagem_mes) — só o Diuturnos usa imagem_mes; Pecados (artista) e A Janela dos Dias (origem) mantêm a navegação por botões intacta
- Verificação scripts/verifica_diuturnos_task80.py: 17/18 checks (1 falso negativo do MEU seletor CSS — hex vs rgb serializado; conferido manualmente: Pecados mantém botões Inveja..Soberba e clique em Soberba mostra h2 SOBERBA) — 12 meses h2 em ordem, 12/12 títulos rgb(139,105,20), 11 linhas 1px, alternância esq/dir confirmada nos meses 1/2/3/12, 12/12 imagens naturalWidth>0, zero "site legado", home/pecados/janela 200; screenshots shot80-diuturnos-topo.png e shot80-diuturnos-meio.png
- tsc 0 erros em src/
- Implementação do "outro chat" não existe no histórico (commits antigos só têm dados.json em drive-obra-full) — recriado do zero conforme a descrição da usuária

Stage Summary:
- Diuturnos agora é um fluxo poético contínuo: 12 meses numa página, dourado, linhas finas, imagens em zigue-zague; demais livros de trechos inalterados
- Pacote v16 ficou OBSOLETO com esta mudança → regerar como v17 e re-dividir em partes

---
Task ID: 80-b
Agent: main
Task: Reempacotamento v17 (v16 obsoleta pela mudança do Diuturnos) + limpeza dos pacotes antigos

Work Log:
- v17 gerada: git archive HEAD -- ':(exclude)skills' -> download/dalila-teles-veras-site-v17-final.zip (310.177.262 B; MD5 0972d264dcea086030eea6102753eb60) — inclui Tasks 72-80 (aba Crônicas, rota órfã fora, rota de partes, DiuturnosFluxo)
- scripts/gera_partes_pacote.py (genérico, recebe o zip como argumento; substitui gera_partes_v16.py): 4 partes de 90 MiB + parte final 27.061.742 B + LEIA-ME-pacote.txt (instruções copy /b e cat + MD5)
- Remontagem validada: cat das 4 partes | md5sum = 0972d264dcea086030eea6102753eb60 — IDÊNTICO
- DiuturnosFluxo conferido DENTRO do zip (2 ocorrências + #8b6914); rota /api/baixar-pacote?lista lista v17 + 4 partes; pacote segue "mais recente" lexicográfico (parte < zip)
- Limpeza: v15 (306MB), v16 zip + 4 partes e LEIA-ME-pacote-v16.txt apagados de download/ (usuária NÃO chegou a baixá-los; download/ agora só tem v17 + 4 partes + LEIA-ME + README + screenshots task80)

Stage Summary:
- Pacote FINAL de entrega: v17 (Tasks 72-80) em 4 partes <=90MB via painel e /api/baixar-pacote?parte=1..4; MD5 de conferência 0972d264dcea086030eea6102753eb60

---
Task ID: 81
Agent: main
Task: Troca da imagem de dezembro pela imagem de janeiro (elogio da usuária à diagramação: "Ficou absurdamente lindo... igual ao que imaginei")

Work Log:
- dados.json do Diuturnos: imagem_mes de dezembro diuturnos-dezembro.jpg -> diuturnos-janeiro.jpg (mesmo arquivo de janeiro, no mesmo lugar — lado DIREITO, índice 11)
- Verificação Playwright: src de dezembro = diuturnos-janeiro.jpg, naturalWidth 197 (carregada), lado DIREITA mantido; screenshot shot80b-diuturnos-dezembro.png
- Arquivo diuturnos-dezembro.jpg permanece em public/ (ativo original do Drive; apenas desreferenciado no dados.json)

Stage Summary:
- Dezembro fecha o ciclo do ano com a mesma imagem de janeiro (abre/fecha espelhados); verificado no navegador; pacote regerado como v18
