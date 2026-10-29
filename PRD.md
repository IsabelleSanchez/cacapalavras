# PRD - Jogo Casual de Adivinhação de Palavras

## 1. Visão geral

Este produto é um jogo casual de adivinhação de palavras, com foco em sessões curtas, alta legibilidade, sensação de progresso e retenção por repetição. O objetivo é criar uma experiência simples de aprender em segundos, mas com profundidade suficiente para manter o jogador voltando todos os dias.

A inspiração principal é o padrão de jogos do tipo Wordle: palpite em um número limitado de tentativas, feedback visual por letras corretas, letras na posição certa e letras ausentes, além de uma proposta de jogo fácil de compartilhar e competir com amigos.

## 2. Pesquisa de mercado e boas práticas

### 2.1. O que torna esse tipo de jogo viral

- Sessões rápidas: normalmente duram de 30 segundos a 3 minutos.
- Regras simples: o jogador entende o objetivo em poucos segundos.
- Feedback imediato: cada tentativa entrega informação útil ao jogador.
- Baixa curva de aprendizado: o jogo pode ser jogado sem tutorial longo.
- Repetição com variedade: diferentes palavras, desafios diários e modos de dificuldade.
- Retenção por streaks e hábito: desafios diários aumentam o retorno.
- Partilha social: resultados fáceis de compartilhar criam tráfego orgânico.

### 2.2. Elementos de sucesso observados em jogos de adivinhação

- Limite de tentativas claro (ex.: 6)
- Palavra secreta com tamanho fixo
- Cores ou indicadores que sinalizam acerto, posição e ausência
- Dicas e validação de palavras
- Modo diário com palavra fixa por dia
- Habilidade de jogar novamente sem custo de entrada
- Estatísticas de vitórias e sequência
- Funcionalidade de compartilhamento
- Acessibilidade: contraste, leitura clara, suporte a teclado e toque

### 2.3. Padrões de design de jogos casuais que importam

- Feedback positivo e recompensa instantânea
- Progressão leve, sem excesso de complexidade
- Objetivos de curto prazo para manter motivação
- Elementos de “one more round”
- Design visual limpo, sem poluição
- Sons sutis e animações leves
- Compatibilidade com mobile-first e desktop

## 3. Proposta de valor

O jogo deve oferecer uma experiência viciante, fácil de iniciar e altamente replayável, com:

- desafios diários;
- sensação de progresso;
- jogabilidade intuitiva;
- possibilidade de competir ou comparar resultados;
- adaptação para web e mobile.

## 4. Público-alvo

- Jogadores casuais que querem entretenimento rápido
- Usuários de smartphones e navegadores
- Pessoas interessadas em jogos de raciocínio e palavras
- Público que gosta de rotina semanal ou diária de desafios

## 5. Objetivos do produto

### 5.1. Objetivos de negócio

- Aumentar retenção por sessão e retorno diário
- Criar um jogo com potencial viral e compartilhável
- Oferecer uma base escalável para futuras expansões

### 5.2. Objetivos de experiência

- Facilitar o onboarding em menos de 10 segundos
- Dar feedback claro e motivador em cada tentativa
- Oferecer emoção sem complicar a experiência

## 6. Funcionalidades propostas

### 6.1. Core gameplay

- Palavra secreta com tamanho definido
- Número de tentativas limitado
- Entrada por teclado ou teclado virtual
- Validação se a palavra existe na base de palavras
- Feedback visual por letra:
  - correta e na posição correta
  - correta, mas em outra posição
  - incorreta
- Mensagem de vitória ou derrota ao final da rodada
- Pop-up de resultado final com explicação breve

### 6.2. Modos de jogo

- Modo clássico: uma rodada por partida
- Modo diário: mesma palavra para todos os jogadores naquela data
- Modo aleatório: nova palavra para cada partida
- Modo por tema: palavras de temas específicos (animais, frutas, tecnologia, etc.)

### 6.3. Progressão e retenção

- Sequência de vitórias (streak)
- Estatísticas por sessão: vitória, derrota, média de tentativas
- Histórico de jogadas
- Desafios diários e recompensas leves
- Ranking local ou global opcional

### 6.4. Social e compartilhamento

- Compartilhar resultado em redes sociais
- Copiar texto de status da partida
- Permitir comparação com amigos
- Emblemas ou conquistas simples

### 6.5. Personalização

- Escolha de tema claro/escuro
- Diferentes tamanhos de teclado ou layout responsivo
- Dificuldade leve/media/difícil

### 6.6. Acessibilidade

- Contraste adequado
- Texto legível
- Suporte a teclado físico e virtual
- Atenção a cores para pessoas com daltonismo
- Possibilidade de usar texto alternativo ou ícones

## 7. Requisitos funcionais

- O sistema deve gerar uma palavra secreta válida antes de iniciar a partida.
- O jogador deve inserir até N tentativas.
- O sistema deve validar a palavra digitada.
- O sistema deve comparar cada letra com a palavra secreta.
- O sistema deve exibir o status de cada letra visualmente.
- O sistema deve identificar vitória ou derrota.
- O sistema deve registrar estatísticas de partidas.
- O sistema deve permitir reiniciar uma nova partida.
- O sistema deve permitir compartilhar resultado.

## 8. Requisitos não funcionais

- Tempo de carregamento baixo
- Interface responsiva em mobile e desktop
- Navegabilidade clara e intuitiva
- Performance estável em navegadores modernos
- Código organizado para futuras expansões

## 9. Premissas e restrições

- O jogo será inicialmenter desenvolvido como web app
- O foco inicial é em mecânica central funcional e experiência simples
- Menor prioridade para monetização no primeiro ciclo
- A base de palavras precisa ser validada e controlada

## 10. Perguntas para validação

1. Qual público você deseja atender primeiro: geral, estudantes, crianças ou adultos?
2. A versão inicial será web, mobile ou ambas?
3. O jogo deve priorizar modo diário, partidas ilimitadas ou os dois?
4. Qual o tamanho da palavra: 5 letras, 6 letras ou palavras variáveis?
5. Você quer foco em modalidade clássica, temática ou ensino de vocabulário?
6. O produto deve ter ranking local, global ou nenhum?
7. Você deseja monetização por anúncios, assinatura leve ou jogo gratuito sem anúncios?
8. O jogo deve priorizar simplicidade máxima ou uma experiência com mais modos e progressão?

## 11. Próximos passos

Depois que essas respostas forem definidas, o produto será convertido em um PRD mais completo com:

- objetivos específicos;
- escopo MVP;
- backlog inicial;
- critérios de aceitação;
- estrutura de dados e regras de jogo;
- roadmap de desenvolvimento.
