# SvS Scheduler — Agenda de Cargos (Whiteout Survival)

App para a aliança agendar os cargos de presidente dos 3 dias de preparo do SvS (Construção, Pesquisa, Tropas), em blocos de 30 minutos (00:00 às 23:30 UTC).

## Rodando localmente

```bash
npm install
npm run seed   # cria o admin inicial e o evento (mês) ativo
npm run dev
```

Acesse http://localhost:3000 — o app redireciona para o idioma padrão (`/pt`).

Login do admin criado pelo seed: usuário `admin`, senha `changeme123` (definidos em `.env`, variáveis `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`). **Troque a senha em produção** antes de divulgar o link pra aliança — veja "Gerenciar admins" abaixo.

## Variáveis de ambiente

Veja `.env.example`. Copie para `.env` e ajuste:

- `DATABASE_URL` — connection string do Postgres via **pooler** do Supabase (porta 6543, com `?pgbouncer=true`). Em *Project Settings → Connect → Transaction pooler*.
- `DIRECT_URL` — mesma connection string mas na porta 5432 (*Session pooler*). Usada só pelo Prisma para rodar migrações (a porta 6543/transaction não suporta os comandos que as migrações precisam).
- `AUTH_SECRET` — chave usada para assinar as sessões de admin. Gere uma com `openssl rand -base64 32` (ou peça pra mim gerar).
- `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` — usados só pelo `npm run seed`, para criar o primeiro admin.

Este projeto já está usando um banco Postgres real no Supabase (não SQLite local) — local e produção apontam pro mesmo banco por enquanto.

## Gerenciar admins

Não existe tela de criação de admin pela UI (só login). Para adicionar/trocar admins:

- Rode `npm run seed` novamente com `SEED_ADMIN_USERNAME`/`SEED_ADMIN_PASSWORD` diferentes no `.env` — cria um novo admin sem mexer nos existentes.
- Para trocar a senha de um admin existente, edite a tabela `Admin` diretamente (`npx prisma studio` abre uma UI local pra editar o banco) ou peça pra eu adicionar um script `change-password`.

## Deploy (Vercel + Supabase)

O banco (Supabase) já está configurado e com as tabelas criadas. Falta só publicar o app:

1. Crie uma conta grátis em https://vercel.com.
2. Suba este repositório pro GitHub (posso te ajudar com isso) e importe na Vercel.
3. Na Vercel, configure as variáveis de ambiente do projeto: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (os mesmos valores do seu `.env` local).
4. Deploy. A Vercel te dá uma URL pública (ex: `seu-projeto.vercel.app`) pra compartilhar com a aliança.

Se quiser, eu ajudo passo a passo quando você tiver a conta da Vercel pronta (não posso criar a conta por você).

## Estrutura

- `prisma/schema.prisma` — modelos: `Event` (mês/evento), `Booking` (agendamento), `Admin`.
- `src/app/[locale]/` — páginas públicas e admin, por idioma (`pt`, `en`, `ar`, `ru`, `de`).
- `src/app/api/` — rotas: `events/active` (grade pública), `bookings` (criar agendamento), `admin/*` (protegidas).
- `messages/*.json` — traduções.
