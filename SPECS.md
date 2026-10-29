# Especificação Técnica do Projeto - Jogo Casual de Adivinhação de Palavras

## 1. Visão geral

Este documento define a implementação técnica do jogo casual de adivinhação de palavras, com foco em uma experiência enxuta, rápida e acessível, inspirada no padrão clássico de jogos do tipo Wordle.

O design escolhido para o MVP é o conceito de UX Design, pois prioriza clareza, redução de atrito, entendimento instantâneo do jogo e melhor retenção por rodada curta. A proposta é entregar um jogo simples de aprender, fácil de repetir e com potencial de evolução futura.

### Objetivo do produto

- Permitir que o jogador adivinhe uma palavra em um número limitado de tentativas.
- Entregar feedback visual claro a cada tentativa.
- Oferecer uma experiência de 30 segundos a 3 minutos por rodada.
- Incentivar retorno diário com modo de desafio e histórico de partidas.
- Garantir usabilidade em desktop e mobile.

## 2. Requisitos do produto

### 2.1 Requisitos funcionais

- O sistema deve gerar uma palavra secreta válida antes de iniciar uma rodada.
- O jogador deve inserir uma tentativa por vez.
- O sistema deve validar se a tentativa é uma palavra aceita.
- O sistema deve comparar a tentativa com a palavra secreta.
- O sistema deve indicar, por letra, se ela está:
  - correta e na posição correta;
  - correta, mas em posição diferente;
  - inexistente na palavra.
- O sistema deve permitir até 6 tentativas, conforme regra do MVP.
- O sistema deve declarar vitória ou derrota ao final da rodada.
- O sistema deve salvar estatísticas do jogador: vitórias, derrotas, streak e tentativas médias.
- O sistema deve permitir reiniciar uma nova partida.
- O sistema deve permitir compartilhamento do resultado final.
- O sistema deve suportar um modo diário e um modo aleatório.

### 2.2 Requisitos não funcionais

- Interface responsiva para telas pequenas e médias.
- Tempo de carregamento rápido.
- Navegação simples e intuitiva.
- Contraste adequado e foco visível.
- Código organizado e modular.
- Compatibilidade com navegadores modernos.
- Boa performance em dispositivos mobile.

## 3. Escopo do MVP

### Funcionalidades prioritárias

1. Tabuleiro de 5 letras
2. 6 tentativas por partida
3. Feedback por cores
4. Validação de entrada
5. Modo diário
6. Estatísticas básicas
7. Reinício da rodada
8. Compartilhamento do resultado

### Fora do escopo do MVP

- Ranking global online
- Loja de itens ou skins
- Login social
- Modo multijogador
- IA gerativa de dicas
- Playlist de temas complexos

## 4. Arquitetura da solução

### 4.1 Stack sugerido

- Frontend: HTML, CSS e JavaScript puro
- Estrutura: componentes modulares em JavaScript
- Persistência local: localStorage
- Formato de dados: JSON
- Hospedagem: Vercel, Netlify ou GitHub Pages

### 4.2 Estrutura de arquivos

```text
project/
├── index.html
├── styles/
│   ├── reset.css
│   ├── theme.css
│   └── game.css
├── scripts/
│   ├── app.js
│   ├── state.js
│   ├── game.js
│   ├── storage.js
│   ├── ui.js
│   ├── keyboard.js
│   └── utils.js
├── data/
│   ├── dictionary.json
│   └── dailyWords.json
├── assets/
│   ├── icons/
│   └── sounds/
├── README.md
├── SPECS.md
└── PRD.md
```

## 5. Modelo de dados

### 5.1 Palavra secreta

```js
const secretWord = {
  value: "CASA",
  length: 4,
  dailyKey: "2026-10-28",
  category: "casa"
};
```

### 5.2 Estado da partida

```js
const gameState = {
  status: "playing", // playing | won | lost
  currentRow: 0,
  currentCol: 0,
  guessHistory: [],
  board: [],
  secretWord: "",
  maxAttempts: 6,
  isDailyMode: true,
  keyboardState: {},
  stats: {
    played: 0,
    wins: 0,
    losses: 0,
    streak: 0,
    averageGuesses: 0
  }
};
```

### 5.3 Estrutura de uma tentativa

```js
const guess = {
  value: "CASA",
  result: [
    "correct",
    "absent",
    "present",
    "correct"
  ]
};
```

## 6. Fluxo de jogo

### 6.1 Inicialização

1. Carregar estado salvo em localStorage.
2. Verificar se já existe uma partida ativa.
3. Se existir, restaurar progresso.
4. Se não existir, iniciar nova partida.
5. Definir palavra secreta conforme o modo selecionado.

### 6.2 Jogada

1. Usuário digita uma letra ou usa teclado virtual.
2. Sistema valida o tamanho da palavra.
3. Sistema verifica se a palavra está no dicionário.
4. Sistema compara tentativa com a palavra secreta.
5. Sistema atualiza o tabuleiro e o teclado.
6. Sistema verifica vitória/derrota.
7. Sistema salva estado e estatísticas.

### 6.3 Fim de partida

- Vitória: exibir mensagem de sucesso, mostrar número de tentativas e botão de nova rodada.
- Derrota: revelar a palavra secreta e mostrar botão de tentar novamente.

## 7. Regras de negócio

### 7.1 Modo diário

- A palavra é definida com base na data atual.
- O mesmo jogador recebe a mesma palavra no mesmo dia.
- A palavra deve ser estável e consistente para a mesma data.

### 7.2 Modo aleatório

- A palavra é escolhida a partir de um conjunto válido.
- Pode ser recriada a cada nova partida.

### 7.3 Validação da palavra

- A palavra deve estar no dicionário válido.
- A validação pode ser realizada em uma lista local de palavras aceitas.
- Se a tentativa não for válida, exibir mensagem amigável: “Palavra não reconhecida”.

### 7.4 Feedback de letras

A lógica de comparação deve respeitar as regras abaixo:

- Se a letra está na posição correta: marcar como correta.
- Se a letra existe na palavra, mas em outra posição: marcar como presente.
- Se a letra não existe: marcar como ausente.
- Em caso de letras repetidas, o algoritmo deve priorizar posições resolvidas antes de outras ocorrências.

### 7.5 Critério de ordem da lógica

Para evitar erros comuns em palavras com letras repetidas, a validação deve seguir este fluxo:

1. Contar ocorrências de cada letra na palavra secreta.
2. Resolver letras em posição correta primeiro.
3. Marcar as restantes como presentes quando ainda houver ocorrências disponíveis.
4. Marcar o restante como ausente.

## 8. Layout e composição de interface

### 8.1 Dimensões e posicionamento

- Container centralizado em página
- Largura máxima de 520px em desktop
- Tamanho mínimo de 320px em mobile
- Tabuleiro com 5 colunas e 6 linhas
- Distância entre células uniformes
- Espaçamento de 12 a 18px entre elementos

### 8.2 Composição principal

- Cabeçalho com título do jogo
- Indicador de modo e tentativa atual
- Estatísticas de desempenho
- Tabuleiro principal
- Teclado virtual ou teclado físico
- Área de feedback e ações finais

### 8.3 Visual do design escolhido

O design UX prioriza:

- contraste alto para leitura fácil;
- feedback imediato por cores;
- ausência de excesso de elementos;
- botão de ação principal sempre visível;
- mínima necessidade de instruções longas;
- foco na resolução em uma rodada por vez.

## 9. Componentes de interface

### 9.1 Cabeçalho

Responsável por exibir:

- nome do jogo;
- modo atual (Diário / Aleatório);
- botão para reiniciar;
- indicador de tentativas restantes.

### 9.2 Tabuleiro

Estrutura de matriz para 6 linhas e 5 colunas.

Cada célula possui:

- estado vazio;
- estado preenchido;
- estado validado com class via cor;
- suporte visual para foco e acessibilidade.

### 9.3 Teclado virtual

Grid com letras e ações como:

- enviar;
- apagar última letra;
- reiniciar.

Também pode ser implementado como um teclado da web usando teclado físico, sem necessidade de um teclado virtual completo no MVP.

### 9.4 Modal de resultado

Ao final da rodada, exibe:

- mensagem de vitória/derrota;
- palavra secreta;
- botão para jogar de novo;
- botão para compartilhar.

## 10. Acessibilidade

### 10.1 Diretrizes a serem seguidas

- Contraste mínimo de 4.5:1
- Texto com tamanho legível
- Botões com área suficientemente grande para toque
- Input com labels ou texto descritivo
- Foco visível em todos os elementos interativos
- Suporte a teclado físico completo
- Ícones e cores acompanhados de texto
- Evitar uso exclusivo de cor como informação principal

### 10.2 Recomendações técnicas

- Usar `aria-live` em mensagens de status
- Garantir navegação por tab
- Garantir `button` adequado para interações
- Oferecer suporte a leitura por screen reader
- Preservar estrutura semântica em HTML

## 11. Experiência de usuário

### 11.1 Onboarding

A primeira tela deve permitir:

- entender o objetivo em 2 segundos;
- visualizar uma amostra de uma linha e resultado;
- iniciar imediatamente sem longa explicação.

### 11.2 Retenção

Para manter o jogador voltando:

- mostrar streak atual;
- exibir histórico de partidas;
- manter o modo diário como principal ganho de hábito;
- incluir pequena recompensa visual após vitórias;
- mostrar tempo ou progresso por dia.

## 12. Persistência

### 12.1 localStorage

Usar `localStorage` para salvar:

- estado atual da partida;
- histórico de partidas;
- estatísticas do usuário;
- última data usada no modo diário.

### 12.2 Estrutura de persistência

```js
localStorage.setItem("word-game-state", JSON.stringify(gameState));
localStorage.setItem("word-game-stats", JSON.stringify(stats));
```

## 13. Lógica de comparação das letras

### 13.1 Algoritmo recomendado

```js
function evaluateGuess(secret, guess) {
  const result = Array(guess.length).fill("absent");
  const remaining = {};

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      result[i] = "correct";
    } else {
      remaining[secret[i]] = (remaining[secret[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    if (remaining[guess[i]]) {
      result[i] = "present";
      remaining[guess[i]] -= 1;
    }
  }

  return result;
}
```

## 14. Gerenciamento de estado

### 14.1 Estado central

A lógica do jogo deve ser centralizada em um módulo `state.js` ou `game.js`, e o restante da UI deve consumir esse estado por funções reativas ou renderização incremental.

### 14.2 Regras de atualização

- A mudança do estado deve disparar renderização do tabuleiro.
- O teclado deve refletir letras já validadas.
- O modal de resultado deve abrir somente ao final da rodada.
- O estado deve ser salvo após cada mudança relevante.

## 15. Estrutura de componentes JS

### 15.1 `app.js`

Responsável por:

- inicializar a aplicação;
- carregar dados do estado;
- montar o tabuleiro;
- capturar eventos do usuário.

### 15.2 `game.js`

Responsável por:

- criar palavra secreta;
- validar tentativa;
- comparar palavras;
- avançar estado da rodada;
- verificar vitória/derrota.

### 15.3 `ui.js`

Responsável por:

- renderizar o tabuleiro;
- renderizar teclado;
- renderizar status e feedback;
- controlar modal e mensagens.

### 15.4 `storage.js`

Responsável por:

- salvar/ler dados do navegador;
- manter histórico e estatísticas;
- sincronizar com modo diário.

### 15.5 `keyboard.js`

Responsável por:

- mapear eventos de teclado físico;
- controlar teclado virtual;
- sincronizar letras validadas com estado.

## 16. Testes

### 16.1 Testes unitários

- avaliação de tentativa com letras repetidas;
- vitória em última tentativa;
- derrota ao exceder o limite;
- geração de palavra diária estável;
- persistência de dados no navegador.

### 16.2 Testes de usabilidade

- tempo até o primeiro clique;
- clareza de instrução;
- identificação de erro sem leitura longa;
- navegação completa por teclado.

### 16.3 Testes de compatibilidade

- Chrome e Edge
- Safari mobile
- dispositivos com telas pequenas
- acessibilidade por leitor de tela

## 17. Roadmap de implementação

### Fase 1 - Base funcional

- estrutura HTML/CSS
- tabuleiro e células
- entrada de letras
- lógica de validação
- cálculo de estados

### Fase 2 - Retenção e feedback

- modo diário
- persistência local
- estatísticas
- mensagem final e reinício
- compartilhamento

### Fase 3 - Refinamento

- teclado virtual
- refinamento visual
- dark mode
- acessibilidade avançada
- otimização de mobile

### Fase 4 - Expansão

- temas por categoria
- dificuldade variável
- ranking local
- novos modos de jogo

## 18. Critérios de aceitação do MVP

- O jogador consegue iniciar uma partida sem tutorial longo.
- A palavra pode ser adivinhada em até 6 tentativas.
- Cada tentativa devolve feedback claro por letra.
- O sistema valida palavras inválidas.
- O jogo salva e restaura estado.
- O jogador consegue reiniciar facilmente.
- A interface funciona em mobile e desktop.
- A experiência é acessível por teclado e texto legível.

## 19. Riscos e mitigação

### Risco: palavras repetidas
Mitigação: usar lista controlada e validação por conjunto fixo.

### Risco: confusão por letras repetidas
Mitigação: regra rigorosa de avaliação por posição e contagem.

### Risco: baixa retenção
Mitigação: oferecer streak, modo diário e estatísticas simples.

### Risco: acessibilidade insuficiente
Mitigação: revisar contraste, foco, labels e apoio ao teclado.

## 20. Conclusão

A implementação do jogo deve priorizar simplicidade, rapidez e clareza, respeitando as diretrizes do design UX escolhido. O MVP deve entregar uma experiência de alta legibilidade e baixo atrito, permitindo evolução com novos modos, temas e recursos sem perder a essência do jogo casual.

A base técnica sugerida é estável, leve e fácil de evoluir, ideal para um projeto web de pequeno e médio porte com forte potencial de retenção.
