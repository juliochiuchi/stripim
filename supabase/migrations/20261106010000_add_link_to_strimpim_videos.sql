-- Adiciona a coluna "link" à tabela de vídeos.
-- Migration idempotente: pode ser aplicada mais de uma vez sem erro.

alter table public.strimpim_videos
  add column if not exists link varchar(255);
