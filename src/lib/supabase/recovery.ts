import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let recoveryClient: ReturnType<typeof createSupabaseClient> | null = null

/**
 * Password recovery is intentionally client-only. The SSR client uses PKCE,
 * which requires the browser that requested the email to retain its verifier.
 * Recovery links should work when opened from an email client or another
 * browser, so this isolated client uses Supabase's implicit recovery flow.
 */
export function createRecoveryClient() {
  if (recoveryClient) return recoveryClient

  recoveryClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: true,
        persistSession: true,
        flowType: 'implicit',
        storageKey: 'udyamveda-password-recovery',
      },
    },
  )

  return recoveryClient
}
