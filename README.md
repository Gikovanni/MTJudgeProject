# MTJudge

Aplicação Ionic com Angular para consulta rápida e rastreável das regras de Magic: The Gathering.

## Estrutura

- `apps/mobile`: aplicação Ionic/Angular, incluindo a visualização web de desenvolvimento.
- `apps/mobile/src/app/core`: contratos, serviços transversais e infraestrutura.
- `apps/mobile/src/app/features`: funcionalidades isoladas do produto.
- `apps/mobile/src/app/shared`: componentes e utilitários reutilizáveis.
- `docs`: documentação do produto e material de referência.

## Executar no navegador

```bash
npm install
npm start
```

Abra `http://localhost:4200`. Os comandos devem ser executados na raiz do repositório; eles encaminham para a aplicação mobile.

## Comandos disponíveis

```bash
npm run build
npm run test
npm run lint
```

## Fluxo de trabalho

A branch `main` contém somente a base estável. Cada funcionalidade deve ser desenvolvida em uma branch própria, com commit independente, para merge manual posterior.

O PDF das regras e o roadmap permanecem no repositório como fontes de referência. O processamento e a indexação do PDF serão implementados em uma funcionalidade específica.

## Reddit (opcional)

Após uma pesquisa, o app oferece um link para pesquisar o mesmo termo diretamente no Reddit. Não há integração com a API, OAuth, tokens ou coleta de dados pelo MTJudge.
