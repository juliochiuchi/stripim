-- Agendamento recorrente do sync de vídeos do YouTube (pg_cron + pg_net).
--
-- PRÉ-REQUISITOS (executar UMA vez, manualmente, com seus valores reais):
--   select vault.create_secret('https://<PROJECT_REF>.supabase.co', 'project_url');
--   select vault.create_secret('<SERVICE_ROLE_KEY>', 'service_role_key');
--
-- A cadência está definida como "a cada 6 horas" no cron.schedule logo abaixo.
-- Alternativa sem SQL: usar a tela "Cron" do dashboard do Supabase.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- Reagendamento idempotente: remove a tarefa anterior, se existir.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'sync-youtube-videos') then
    perform cron.unschedule('sync-youtube-videos');
  end if;
end $$;

select cron.schedule(
  'sync-youtube-videos',
  '17 */6 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/sync-youtube-videos',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
