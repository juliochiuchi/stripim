-- Sync híbrido com o YouTube: estatísticas reais dos vídeos publicados.
-- Migration idempotente: pode ser aplicada mais de uma vez sem erro.

alter table public.strimpim_videos
  add column if not exists views bigint not null default 0,
  add column if not exists duration_sec integer not null default 0,
  add column if not exists views_synced_at timestamptz;

-- Garante correspondência 1:1 entre um vídeo do YouTube (reference) e uma linha,
-- permitindo que o sync faça upsert via ON CONFLICT (reference).
-- Valores NULL (vídeos manuais sem reference) não são afetados por índices únicos.
-- ATENÇÃO: a criação falha se já existirem registros com o mesmo reference.
create unique index if not exists idx_strimpim_videos_reference_unique
  on public.strimpim_videos (reference);
