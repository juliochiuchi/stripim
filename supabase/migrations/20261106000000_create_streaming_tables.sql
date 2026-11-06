-- Tabelas da plataforma de streaming (vídeos e categorias)
-- gen_random_uuid() é nativo do PostgreSQL 13+ (disponível no Supabase).
-- Migration idempotente: funciona tanto do zero quanto sobre a v1 já aplicada.

-- Vídeos
create table if not exists public.strimpim_videos (
  id uuid primary key default gen_random_uuid(),
  title varchar(65) not null,
  description varchar(110),
  reference varchar(30),
  publish_date timestamptz not null default now(),
  -- ids das categorias vinculadas (array de uuid)
  category_ids uuid[] not null default '{}'
);

-- Garante a coluna caso a tabela já exista (v1 criada sem ela)
alter table public.strimpim_videos
  add column if not exists category_ids uuid[] not null default '{}';

create index if not exists idx_strimpim_videos_category_ids
  on public.strimpim_videos using gin (category_ids);

-- Categorias
create table if not exists public.strimpim_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null unique
);

-- Remove a tabela de relação da v1 (não é mais utilizada)
drop table if exists public.strimpim_videos_categories;
