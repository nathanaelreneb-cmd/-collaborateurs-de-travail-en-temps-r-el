-- ============================================================
-- Schéma de base : Espace de travail collaboratif ONG
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Rôles disponibles
create type user_role as enum ('admin', 'membre', 'partenaire');

-- 2. Table des profils (liée à auth.users géré par Supabase Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'membre',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Un utilisateur peut voir tous les profils (nécessaire pour afficher noms/rôles dans l'app)
create policy "Profils visibles par tous les membres connectés"
  on profiles for select
  using (auth.role() = 'authenticated');

-- Un utilisateur peut modifier uniquement son propre profil
create policy "Un utilisateur modifie son propre profil"
  on profiles for update
  using (auth.uid() = id);

-- 3. Table des projets
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  progress smallint not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);

alter table projects enable row level security;

-- 4. Table de liaison : quels partenaires ont accès à quel projet
create table project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (project_id, user_id)
);

alter table project_members enable row level security;

-- Admin + membres internes voient tous les projets
create policy "Admin et membres voient tous les projets"
  on projects for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'membre')
    )
  );

-- Les partenaires ne voient que les projets où ils sont ajoutés
create policy "Partenaires voient uniquement leurs projets"
  on projects for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
    )
  );

-- Seul l'admin peut créer/modifier des projets
create policy "Seul l'admin gère les projets"
  on projects for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 5. Table des annonces (espace commun — réservé aux membres internes)
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

-- Seuls admin + membres voient les annonces internes (pas les partenaires)
create policy "Annonces visibles par admin et membres uniquement"
  on announcements for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'membre')
    )
  );

create policy "Admin et membres publient des annonces"
  on announcements for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'membre')
    )
  );

-- 6. Création automatique du profil à l'inscription
-- (le rôle par défaut est 'membre' ; l'admin devra promouvoir manuellement
--  les comptes admin/partenaire depuis Supabase Table Editor pour la V1 pilote)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Nouveau membre'), 'membre');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Quelques données de démonstration (optionnel — à adapter/supprimer)
-- insert into projects (name, progress) values
--   ('Santé communautaire — Kankan', 64),
--   ('Formation jeunes — Conakry', 80),
--   ('Agriculture durable — Kindia', 35);
