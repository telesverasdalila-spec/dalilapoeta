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
Task ID: 93
Agent: main
Task: Restauração pós-incidente — subtab Entrevistas de OBRA→Escritos & Leituras recuperada por forense do deploy em produção

Work Log:
- Incidente: usuária reportou "Sumiu: leituras criticas, estudos criticos, entrevistas" em OBRA→Escritos & Leituras/Resenhas. Causa-raiz confirmada: pacote da Task 91 sobrescreveu SecaoObras.tsx com versão regredida (sem dadosEntrevistas); CabecalhoObra.tsx e pastas de entrevista NÃO foram tocados pelo pacote (por isso botão e páginas seguem no ar)
- Arquivo colado pela usuária (SecaoObras antigo) conferido: idêntico ao git local — NÃO continha os dados perdidos; nenhuma fonte local tinha (git fsck: blobs só da era 1-20; drive-obra-full; template-original)
- Forense do AR (dalila-teles-poeta.vercel.app): chunk 40jqv2876n-dz.js = ConteudoEntrevista compilado + CSS verbatim das classes ent-* (com comentários de Task 73/82); HTML das páginas /texto/entrevista-tarso-de-melo e /texto/entrevista-selmo-vasconcellos (descoberta: 2ª entrevista citada no comentário do CSS "Poesia embutida (Selmo Vasconcellos, Tarso de Melo)")
- Criado src/app/texto/[id]/ConteudoEntrevista.tsx (reconstruído do compilado: faixa "Entrevistas", imagem maosescrita2.jpg, selo dtv rotacionado, main corpo-entrevistas, cssEntrevistas resgatado verbatim)
- Criados dados.json verbatim do HTML SSR: entrevista-tarso-de-melo (26 <p>, 2015, subtitulo "Blog Contra Tanto Silêncio — abril de 2015") e entrevista-selmo-vasconcellos (69 <p>, subtitulo "Portal Selmo Vasconcellos")
- page.tsx: roteamento tipo "entrevista" → ConteudoEntrevista (repõe o que o live tinha; description/meta verificada idêntica ao live)
- CabecalhoObra.tsx: subtab Entrevistas entre Crônicas e Traduções + subtítulo "Ensaios, crônicas, entrevistas e traduções da autora, em texto integral para leitura" — verbatim do chunk live
- SecaoObras.tsx: dadosEntrevistas (2 itens com slugs) + roteamento subTabAtiva "entrevistas" (base = versão do pacote 91 que é o live, sem regressão)
- public/imagens/entrevistas/: maosescrita2.jpg e dtv-selo.jpg baixados do live (JPEG válidos)
- worklog.md restaurado do blob órfão eac45ed (era Task 1-20-b, versão mais completa existente localmente)
- Validação: tsc 0 erros em src/; next build OK; next start local: /texto/entrevista-tarso-de-melo (12 perguntas/25 respostas) e /texto/entrevista-selmo-vasconcellos (14/13) com faixa Entrevistas e imagem

Stage Summary:
- Subtab Entrevistas restaurada: botão (CabecalhoObra) + lista com 2 entrevistas (SecaoObras) + 2 páginas de leitura completas verbatim do deploy
- PENDÊNCIA (dados irrecuperáveis localmente): listas "Leituras Críticas" e "Estudos Críticos" de OBRA→Resenhas permanecem no fallback de curadoria — os arrays existiam só no SecaoObras da era pré-91, perdido nas reciclagens; fontes a tentar com a usuária: VS Code Timeline (Open Timeline no arquivo), histórico do GitHub dela, ou zip antigo na pasta Downloads do computador dela
- REGRA reforçada: pacotes futuros só podem tocar arquivos verificados como não-avançados no live (comparar chunk do AR antes de sobrescrever)
