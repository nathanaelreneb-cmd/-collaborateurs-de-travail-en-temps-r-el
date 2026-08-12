"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: 10,
        background: "transparent",
        border: "1px solid rgba(255,255,255,.2)",
        color: "#C9CEDD",
        borderRadius: 8,
        padding: "7px 10px",
        fontSize: 12,
        cursor: "pointer",
        width: "100%",
      }}
    >
      Se déconnecter
    </button>
  );
}
