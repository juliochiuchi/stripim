# Stripim

Interface de uma plataforma de streaming (estilo Twitch/YouTube/Netflix) feita para demonstrar qualidade de UI, organização de front-end e padrões de arquitetura — com dados mockados e camada de services pronta para trocar por uma API real.

![Preview](./src/assets/printscreen-readme.png)

## O que tem aqui

- Feed com trilhos (rails) e destaque (hero) para lives e vídeos publicados
- Filtros por categoria, abas (para você / ao vivo / vídeos) e busca
- Página de assistir com player embutido (YouTube) e layout de “watch”
- Chat simulado (mock) para demonstrar experiência de live
- Publicação de conteúdo (mock) com validação de formulário (Zod + React Hook Form)

## Diferenciais técnicos

- Separação clara entre UI, hooks e services para facilitar integração com API real
- Roteamento tipado e estrutura de páginas baseada em rotas
- Componentes de UI consistentes (design system) com foco em ergonomia de dev
- Validação de formulários com schema (Zod) e estados de loading/sucesso

## Stack

- React + TypeScript
- Vite
- TanStack Router (roteamento tipado)
- Tailwind CSS + shadcn/ui (Radix) para UI primitives
- Zod + React Hook Form (validação e formulários)

## Estrutura do projeto

- `src/pages`: rotas e layouts (TanStack Router)
- `src/components/streaming`: componentes de domínio (feed, cards, player, chat, etc.)
- `src/components/ui`: componentes base (shadcn)
- `src/services/streaming`: “API” mock e regras simples de listagem/criação
- `src/hooks/streaming`: hooks para consumo dos services

## Como rodar localmente

Pré-requisitos: Node.js 18+.

```bash
npm ci
npm run dev
```

A aplicação sobe (por padrão) em `http://localhost:5173`.

## Como navegar

- Home: `/`
- Busca: `/search`
- Assistir: `/watch/:id` (IDs existem no feed; também dá para publicar via “Publicar (mock)”)

## Scripts úteis

```bash
npm run lint
npm run build
npm run preview
```

## Dados e integrações

O projeto roda 100% com dados mockados por padrão. A camada de services foi isolada para substituição por API real sem reescrever a UI.

Existe um `.env` com placeholders para Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Próximos passos (ideias)

- Autenticação e perfis de canal (Supabase/Auth ou backend próprio)
- Persistência real de streams e chat (realtime)
- Upload de thumbnails e organização de biblioteca
- Testes (unit/integration) para services, hooks e páginas principais

## Contato

- Autor: Julio Araujo
