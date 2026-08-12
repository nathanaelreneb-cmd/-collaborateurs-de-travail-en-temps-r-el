import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function AccueilPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, progress")
    .order("created_at", { ascending: false });

  const initials = (profile?.full_name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabel = {
    admin: "Admin",
    membre: "Membre",
    partenaire: "Partenaire",
  }[profile?.role] || "Membre";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          background: "var(--indigo)",
          color: "#EDE9DC",
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 6px 18px",
            marginBottom: 14,
            borderBottom: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "linear-gradient(135deg, var(--ochre), var(--teal))",
              flexShrink: 0,
            }}
          />
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15, color: "#fff", lineHeight: 1.15 }}>
            Espoir Guinée
            <span
              style={{
                display: "block",
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: 400,
                fontSize: 10,
                color: "var(--ochre-light)",
                letterSpacing: ".06em",
                marginTop: 2,
              }}
            >
              ESPACE DE TRAVAIL
            </span>
          </div>
        </div>

        <NavItem label="Accueil" active />
        <NavItem label="Mon espace" />
        <NavItem label="Messagerie" />
        <NavItem label="Documents" />
        <NavItem label="Tâches" />

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,.12)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--ochre-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--indigo-deep)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.3 }}>
            {profile?.full_name || user.email}
            <span style={{ display: "block", color: "#9AA2BC", fontSize: 10.5 }}>{roleLabel}</span>
          </div>
        </div>

        <LogoutButton />
      </aside>

      {/* MAIN */}
      <main style={{ padding: "22px 26px 30px", background: "var(--bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 21 }}>Espace commun</h2>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              Vue d'ensemble pour toute l'équipe Espoir Guinée
            </div>
          </div>
          {(profile?.role === "admin" || profile?.role === "membre") && (
            <button className="btn">+ Nouvelle annonce</button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <span className="label">Annonces de la direction</span>
              {announcements && announcements.length > 0 ? (
                announcements.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--ochre)",
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                        {a.profiles?.full_name || "—"} · {new Date(a.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Aucune annonce pour le moment.</p>
              )}
            </div>
          </div>

          <div className="card">
            <span className="label">Projets en cours</span>
            {projects && projects.length > 0 ? (
              projects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 0",
                    borderBottom: "1px solid var(--line)",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600, flex: 1 }}>{p.name}</div>
                  <div style={{ flex: 2, height: 6, background: "var(--sand)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.progress}%`, background: "var(--teal)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--teal)", width: 34, textAlign: "right" }}>
                    {p.progress}%
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Aucun projet pour le moment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, active }) {
  return (
    <div
      style={{
        padding: "9px 10px",
        borderRadius: 8,
        fontSize: 13.5,
        color: active ? "#fff" : "#C9CEDD",
        fontWeight: active ? 500 : 400,
        background: active ? "rgba(255,255,255,.08)" : "transparent",
        marginBottom: 2,
      }}
    >
      {label}
    </div>
  );
}
