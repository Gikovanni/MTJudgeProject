from pathlib import Path

content = r"""# Aplicação Mobile para Consulta de Regras de Magic: The Gathering

## 1. Visão geral

Desenvolver uma aplicação mobile para consulta rápida de regras, habilidades e interações de cartas de **Magic: The Gathering**.

A aplicação será utilizada durante partidas presenciais, com o objetivo de reduzir o tempo gasto procurando regras manualmente e evitar interrupções prolongadas no ritmo da mesa.

O usuário poderá digitar uma dúvida, uma habilidade, uma palavra-chave ou descrever uma interação entre cartas. A aplicação deverá pesquisar o conteúdo disponível na base de regras e retornar:

- Regras relacionadas à consulta;
- Trechos relevantes do documento;
- Identificação da seção ou número da regra;
- Um resumo da regra em linguagem mais simples;
- Possíveis regras complementares relacionadas à interação.

A aplicação deverá ser desenvolvida nos mesmos moldes do projeto anterior, utilizando **Ionic com Angular**, com foco inicial em dispositivos mobile.

---

## 2. Objetivo principal

Permitir que jogadores consultem rapidamente regras de Magic durante uma partida, utilizando linguagem natural, palavras-chave, habilidades ou descrições de interações.

A resposta deve priorizar velocidade, clareza e rastreabilidade, sempre permitindo que o jogador consulte o texto original da regra utilizada como referência.

---

## 3. Problema que a aplicação resolve

Atualmente, durante uma partida, algumas interações exigem a consulta das regras oficiais.

A busca manual em documentos extensos pode causar:

- Interrupção do ritmo da partida;
- Dificuldade para localizar a regra correta;
- Confusão ao interpretar textos técnicos;
- Consultas repetidas sobre situações semelhantes;
- Dependência de pesquisas externas;
- Dificuldade para identificar quais dúvidas são mais frequentes.

A aplicação deverá centralizar essa consulta e tornar o processo mais rápido.

---

## 4. Plataforma e arquitetura inicial

### 4.1 Aplicação mobile

A aplicação deverá ser desenvolvida com:

- Ionic;
- Angular;
- TypeScript;
- Interface responsiva;
- Prioridade para celulares;
- Possibilidade futura de geração de APK;
- Possibilidade futura de disponibilização como PWA.

### 4.2 Estrutura recomendada

A aplicação deverá ser dividida em funcionalidades independentes:

- Consulta de regras;
- Visualização de resultados;
- Histórico de consultas;
- Gerenciamento da base de regras;
- Exportação de logs;
- Configurações do algoritmo de pesquisa;
- Análise de desempenho das buscas.

---

## 5. Fonte dos dados

A fonte principal será um ou mais arquivos PDF contendo:

- Regras oficiais de Magic;
- Regras abrangentes;
- Regras de habilidades;
- Palavras-chave;
- Interações;
- Exemplos;
- Perguntas frequentes;
- Observações adicionais.

O conteúdo dos documentos deverá ser convertido para uma estrutura pesquisável.

### 5.1 Processamento do PDF

O sistema deverá permitir que o conteúdo do PDF seja:

1. Extraído;
2. Separado em seções;
3. Normalizado;
4. Classificado;
5. Indexado;
6. Pesquisado pelo algoritmo.

Sempre que possível, cada trecho armazenado deverá manter:

- Identificador;
- Número da regra;
- Título da seção;
- Texto completo;
- Palavras-chave;
- Categoria;
- Página do PDF;
- Documento de origem;
- Data ou versão do documento;
- Relação com outras regras;
- Exemplos associados.

---

## 6. Tipos de consulta

### 6.1 Consulta por palavra-chave

Exemplos:

- Vínculo com a vida;
- Atropelar;
- Vigilância;
- Toque mortífero;
- Sacrifício;
- Exílio;
- Prioridade;
- Pilha.

### 6.2 Consulta por habilidade

Exemplos:

- Como funciona iniciativa?
- Uma criatura com vigilância vira para atacar?
- Toque mortífero funciona junto com atropelar?

### 6.3 Consulta por interação

Exemplos:

- O que acontece se uma criatura com iniciativa e toque mortífero bloquear uma criatura com atropelar?
- Posso responder a uma habilidade desencadeada?
- Uma criatura que entrou neste turno pode usar uma habilidade de virar?
- O que acontece se o alvo de uma mágica deixar o campo de batalha?

### 6.4 Consulta por texto de carta

O usuário poderá copiar ou digitar o texto de uma habilidade de carta.

Exemplo:

> Quando esta criatura entrar no campo de batalha, exile outra permanente alvo até que esta criatura deixe o campo de batalha.

O sistema deverá identificar conceitos importantes presentes no texto e localizar regras relacionadas.

### 6.5 Consulta por nome de carta

Como funcionalidade futura, o usuário poderá informar o nome de uma ou mais cartas para pesquisar:

- Texto da carta;
- Habilidades;
- Regras específicas;
- Rulings;
- Interações entre as cartas informadas.

---

## 7. Campo de pesquisa

A tela principal deverá possuir um campo de pesquisa com suporte a:

- Texto livre;
- Palavras-chave;
- Frases completas;
- Texto de habilidades;
- Nome de carta;
- Perguntas em linguagem natural;
- Sugestões automáticas;
- Histórico recente;
- Correção básica de termos digitados incorretamente.

O campo deverá possuir ações para:

- Pesquisar;
- Limpar;
- Colar texto;
- Reutilizar uma consulta anterior;
- Adicionar termos complementares.

---

## 8. Algoritmo de pesquisa

A aplicação deverá possuir um algoritmo responsável por localizar os trechos mais relevantes da base de regras.

### 8.1 Primeira versão

A primeira versão poderá utilizar pesquisa textual baseada em:

- Correspondência exata;
- Correspondência parcial;
- Palavras-chave;
- Frequência de termos;
- Peso por título;
- Peso por número da regra;
- Peso por categoria;
- Remoção de palavras pouco relevantes;
- Normalização de acentos;
- Normalização entre letras maiúsculas e minúsculas;
- Sinônimos cadastrados;
- Pontuação de relevância.

### 8.2 Estratégias de pesquisa

O algoritmo poderá combinar:

- Busca por texto completo;
- Busca por termos individuais;
- Busca por frases;
- Busca aproximada;
- Distância entre palavras;
- Índice invertido;
- TF-IDF;
- BM25;
- Busca semântica;
- Similaridade por embeddings.

A implementação inicial não precisa utilizar todas as estratégias simultaneamente.

O sistema deverá permitir que o algoritmo seja substituído ou melhorado posteriormente.

### 8.3 Critérios de relevância

Cada resultado poderá receber uma pontuação baseada em:

- Termo encontrado no título;
- Termo encontrado no texto;
- Quantidade de termos correspondentes;
- Proximidade entre os termos;
- Correspondência com uma habilidade conhecida;
- Correspondência com uma categoria;
- Correspondência exata com uma frase;
- Quantidade de palavras irrelevantes;
- Popularidade da regra em consultas anteriores;
- Avaliação dos usuários;
- Resultado selecionado anteriormente em pesquisas semelhantes.

### 8.4 Sinônimos e termos relacionados

O sistema deverá permitir a configuração de termos equivalentes.

Exemplos:

- Morrer → ser colocada no cemitério vinda do campo de batalha;
- Remover do jogo → exilar;
- ETB → entrar no campo de batalha;
- Trigger → habilidade desencadeada;
- Stack → pilha;
- Counterar → anular.

A lista de sinônimos deverá poder ser atualizada sem alterar diretamente o algoritmo.

---

## 9. Níveis de especificidade da resposta

### 9.1 Consulta genérica

Exemplo:

> Como funciona atropelar?

Resposta esperada:

- Explicação resumida;
- Regra principal;
- Conceitos relacionados;
- Exemplo simples.

### 9.2 Consulta intermediária

Exemplo:

> Como funciona atropelar quando a criatura bloqueadora tem indestrutível?

Resposta esperada:

- Resumo da interação;
- Regras utilizadas;
- Explicação sobre dano letal;
- Explicação sobre indestrutível;
- Exemplo aplicado.

### 9.3 Consulta específica

Exemplo:

> Uma criatura 5/5 com atropelar e toque mortífero é bloqueada por uma criatura 4/4 indestrutível. Quanto dano pode ser causado ao jogador?

Resposta esperada:

- Resposta direta;
- Passo a passo da distribuição de dano;
- Regras relacionadas;
- Explicação sobre toque mortífero;
- Explicação sobre atropelar;
- Observação sobre indestrutível;
- Texto original das regras consultadas.

### 9.4 Consulta insuficiente

Caso a consulta não possua informações suficientes, o sistema deverá:

- Exibir os possíveis significados;
- Solicitar mais detalhes;
- Apresentar regras gerais relacionadas;
- Sugerir termos para refinar a pesquisa.

---

## 10. Estrutura da resposta

### 10.1 Resposta resumida

Deverá apresentar uma explicação em linguagem simples e direta.

### 10.2 Regras relacionadas

Cada regra relacionada deverá apresentar:

- Número da regra;
- Título;
- Trecho relevante;
- Documento de origem;
- Página;
- Pontuação de relevância;
- Botão para visualizar o texto completo.

### 10.3 Explicação detalhada

Quando necessário, a resposta poderá possuir:

- Contexto da situação;
- Ordem dos acontecimentos;
- Ações dos jogadores;
- Uso da pilha;
- Verificação de ações baseadas no estado;
- Resultado final;
- Exemplo numérico.

### 10.4 Indicador de confiança

O sistema deverá apresentar:

- Alta confiança;
- Confiança média;
- Baixa confiança.

### 10.5 Referência ao texto original

Mesmo quando apresentar um resumo, o sistema deverá permitir que o usuário consulte a regra original.

---

## 11. Geração do resumo

O resumo deverá ser produzido a partir das regras encontradas.

Inicialmente, o resumo poderá ser baseado em modelos predefinidos e regras de transformação.

Futuramente, poderá ser utilizado um modelo de linguagem ou serviço de inteligência artificial.

### 11.1 Requisitos do resumo

O resumo deverá:

- Utilizar linguagem simples;
- Evitar alterar o significado da regra;
- Informar quando houver incerteza;
- Evitar afirmar algo sem referência;
- Utilizar somente regras encontradas na base;
- Identificar as regras utilizadas;
- Diferenciar regra oficial de interpretação;
- Ser curto por padrão;
- Permitir expansão para uma explicação detalhada.

### 11.2 Modos de resposta

- Resposta rápida;
- Resposta detalhada;
- Somente regras oficiais.

---

## 12. Histórico de consultas

Cada item do histórico deverá possuir:

- Texto pesquisado;
- Data e hora;
- Resultados encontrados;
- Resultado selecionado;
- Tempo da pesquisa;
- Resumo apresentado;
- Regras utilizadas;
- Avaliação do usuário;
- Identificador da sessão;
- Versão do algoritmo;
- Versão da base de regras.

O usuário deverá poder:

- Reabrir uma consulta;
- Repetir a pesquisa;
- Excluir um item;
- Limpar todo o histórico;
- Marcar uma consulta como favorita;
- Filtrar consultas;
- Exportar o histórico.

---

## 13. Log do algoritmo de pesquisa

O algoritmo deverá gerar logs estruturados para permitir análises e melhorias futuras.

### 13.1 Objetivo dos logs

Os logs deverão ajudar a identificar:

- Pesquisas sem resultado;
- Pesquisas com baixa relevância;
- Termos mais pesquisados;
- Erros de digitação frequentes;
- Regras mais acessadas;
- Resultados ignorados;
- Resultados selecionados;
- Tempo médio das consultas;
- Pesquisas repetidas;
- Necessidade de novos sinônimos;
- Problemas na indexação;
- Diferenças entre versões do algoritmo.

### 13.2 Exemplo de log

```json
{
  "id": "uuid-da-consulta",
  "sessionId": "uuid-da-sessao",
  "searchedAt": "2026-07-19T14:30:00-03:00",
  "originalQuery": "texto digitado pelo usuario",
  "normalizedQuery": "texto normalizado",
  "recognizedTerms": [
    "atropelar",
    "toque mortifero"
  ],
  "ignoredTerms": [
    "como",
    "funciona"
  ],
  "algorithmVersion": "1.0.0",
  "rulesDatabaseVersion": "2026.01",
  "searchDurationMs": 32,
  "totalResults": 5,
  "results": [
    {
      "ruleId": "702.19",
      "score": 0.94,
      "position": 1
    }
  ],
  "selectedRuleId": "702.19",
  "responseMode": "quick",
  "confidence": "high",
  "userFeedback": "helpful"
}