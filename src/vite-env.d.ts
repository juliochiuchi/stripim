/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_LIVE_STREAM_KEY_URL_IPIM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
