# Painel de Sorteio

Projeto simples que exibe um painel para sortear um participante a partir de um payload JSON com `nome` e `telefone`.

Como usar (frontend apenas):

- Abra `index.html` no navegador (duplo-clique) ou rode via servidor estático.
- Cole no campo o JSON no formato: `[{"nome":"João","telefone":"(11) 99999-9999"}, ...]` e clique em `Carregar`.
- Clique em `Sortear` para executar a animação e exibir o vencedor.

Backend (opcional):

1. Instale dependências:

```bash
npm install
```

2. Rode o servidor (servirá os arquivos e aceita POST /payload):

```bash
npm start
```

3. Envie o payload JSON para `http://localhost:3000/payload` via POST (array de participantes). O servidor salvará o último payload em `last_payload.json`.

Observações:
- O frontend também contém `window.loadParticipantsFromJSON(data)` para carregar participantes por script.
- O projeto é intencionalmente simples; posso adaptar para: integrar diretamente com API, adicionar validação/remoção de duplicados, exportar resultado, ou adicionar logs.

## Publicar no GitHub Pages

Este repositório já está preparado para deploy automático via GitHub Actions com o workflow:

- `.github/workflows/deploy-pages.yml`

### Passo a passo

1. Suba o repositório para o GitHub com branch principal `main`.
2. No GitHub, abra `Settings > Pages`.
3. Em `Build and deployment`, selecione `Source: GitHub Actions`.
4. Faça um push na `main` (ou rode o workflow manualmente em `Actions`).
5. Aguarde o job `Deploy static content to Pages` concluir.

### URL final

A URL costuma ficar assim:

- `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

### Importante

- O GitHub Pages hospeda apenas o frontend estático (`index.html`, `styles.css`, `app.js`).
- O backend em `server.js` e a rota `POST /payload` não rodam no GitHub Pages.
