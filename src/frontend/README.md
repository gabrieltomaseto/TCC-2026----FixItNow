# FixItNow — frontend

Interface web do FixItNow, construída com React, Vite, React Router e Tailwind CSS.

## Executar

```bash
npm ci
npm run dev
```

## Validar

```bash
npm run lint
npm run test
npm run build
```

As telas ficam em `src/Pages`, os componentes reutilizáveis em `src/Components` e as preferências globais em `src/Context`.

Use Node.js 20.19+ ou 22.12+. O Laravel deve estar ativo em `http://127.0.0.1:8000`; o Vite serve a interface em `http://localhost:5173` e encaminha `/api` e `/storage` à API. Em produção, configure `VITE_API_URL=https://sua-api/api` antes do build e configure a origem correspondente no CORS do Laravel.

A revisão integra avaliações por solicitação, descrição, todos os campos do chamado, métricas/histórico reais e status de pedidos sem redesenhar as telas. Veja [RELATORIO_FINAL.md](../../RELATORIO_FINAL.md) para instruções completas.
