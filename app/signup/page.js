"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (error) {
      setError("Impossible de créer le compte. " + error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="brand-mark" />
          <h1>Compte créé</h1>
          <p className="sub">
            Vérifiez votre boîte e-mail pour confirmer votre compte, puis
            connectez-vous. Un administrateur devra ensuite valider votre
            rôle (membre ou partenaire).
          </p>
          <a className="btn" href="/login" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            Aller à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-mark" />
        <h1>Créer un compte</h1>
        <p className="sub">Rejoignez l'espace de travail de votre ONG</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Nom complet</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Fatoumata Sylla"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.org"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <div className="switch-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
}
