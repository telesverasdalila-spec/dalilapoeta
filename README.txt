TASK 80 — MOVIMENTO: fusão de abinhas + tabs menores + conserto do desalinhamento
================================================================================

O QUE ACONTECEU (diagnóstico do desalinhamento que você percebeu):
- A Task 73 aumentou a fonte das abas-mãe (1.05rem no desktop, 0.95rem no
  celular) mantendo-as "nowrap" e proibindo encolher (flex-shrink: 0).
- No celular, as 6 abas não cabiam mais na tela: o menu passou a exigir
  501px numa tela de ~390px. Em vez de rolar só dentro do menu, ele
  ARRASTAVA A PÁGINA INTEIRA para os lados — por isso tudo parecia
  empurrado para a direita / fora do centro.
- O mesmo estouro (por 1px!) existia no desktop: 811px de abas num
  espaço de 810px. Com "justify-content: center" + overflow, o início
  do menu ficava inacessível — a impressão de "desalinhado do centro".

O QUE ESTE PACOTE FAZ:
1. FUSÃO (seu pedido 1): a sub-aba "Atividades Culturais" foi absorvida por
   "Encontros & Reuniões". O arquivo EncontrosAtividadesCulturais.json
   continua sendo lido — qualquer registro que exista lá aparece dentro
   de "Encontros & Reuniões", sem duplicar. A listagem ficou com 8 sub-abas.
2. TABS MENORES (seu pedido 2): abas-mãe de 1.05rem -> 0.95rem (desktop),
   0.95 -> 0.9rem (celular), 0.9 -> 0.85rem (telas bem estreitas).
   Sub-abas intocadas.
3. CONCERTO DO ALINHAMENTO:
   - No celular as abas-mãe agora QUEBRAM em duas fileiras centralizadas
     (nunca mais rolam a página de lado).
   - No desktop, a centralização usa o padrão à prova de estouro já
     adotado na régua do tempo (Task 76): se couber, centraliza; se não
     couber, o scroll nasce do primeiro botão (nada some à esquerda).
   - Sub-abas do desktop também ganharam quebra de linha garantida.

ARQUIVOS:
- src/app/components/SecaoMovimento.tsx  (fusão das abinhas)
- src/app/globals.css                    (tamanhos + alinhamento)

COMO APLICAR:
1. Substitua os dois arquivos pelos do pacote (mesmos caminhos).
2. VS Code: Commit & Sync.
3. Aguarde o deploy na Vercel (~2 min) e confira no celular e no desktop.

VERIFICADO ANTES DE ENVIAR:
- TypeScript sem erros; CSS balanceado (125/125 chaves).
- Medido no navegador: desvio de centralização = 0 nas larguras
  390 / 480 / 768 / 1440 px; página inteira sem rolagem lateral.
- VIDA e OBRA testados e intocados (centralização 0, sem vazamento).
- "Encontros & Reuniões" exibe os 8 registros normalmente.
