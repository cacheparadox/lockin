import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://hoqarmpzwdpldqxhidbd.supabase.co",
    "sb_publishable_RYoPGwfnNwwkOpvR2Cr3Qw_G0KFxmY-"
  );
}
