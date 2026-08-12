# Espace de travail — Espoir Guinée

Base de départ Next.js + Supabase pour la plateforme collaborative ONG, avec :
- Authentification e-mail/mot de passe
- 3 rôles : `admin`, `membre`, `partenaire`
- Espace commun : annonces + liste de projets

## 1. Installer les dépendances

```bash
npm install
```

## 2. Configurer Supabase

1. Copiez `.env.local.example` en `.env.local`
2. Remplissez avec l'URL et la clé API de votre projet Supabase
   (Project Settings > API dans le tableau de bord Supabase)

## 3. Créer les tables dans Supabase

Ouvrez **SQL Editor** dans votre projet Supabase, collez le contenu de
`supabase/schema.sql`, puis exécutez-le. Cela crée :
- `profiles` (utilisateurs + rôle)
- `projects` (projets avec % d'avancement)
- `project_members` (accès des partenaires par projet)
- `announcements` (annonces internes)

Un nouveau compte reçoit automatiquement le rôle `membre`. Pour créer un
compte `admin` ou `partenaire`, modifiez la colonne `role` directement
dans **Table Editor > profiles** après inscription.

## 4. Lancer le projet en local

```bash
npm run dev
```

Ouvrez http://localhost:3000 — vous serez redirigé vers `/login`.

## 5. Déployer sur Vercel

1. Poussez ce dossier sur votre dépôt GitHub
2. Sur vercel.com, importez le dépôt
3. Ajoutez les mêmes variables d'environnement que `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Déployez — chaque futur push mettra à jour le site automatiquement

## Prochaines étapes (suite du cahier des charges)

- [ ] Mon espace individuel (tâches assignées, fichiers, agenda)
- [ ] Messagerie en temps réel (canaux par projet, Supabase Realtime)
- [ ] Partage de fichiers avec historique de versions (Supabase Storage)
- [ ] Suivi des tâches (tableau à faire / en cours / terminé)
- [ ] Notifications e-mail
