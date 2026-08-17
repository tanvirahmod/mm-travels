# Supabase Migrations

Run these SQL files in order in your **Supabase SQL Editor** to set up or update your database schema.

## Migration Order

1. `20260815_01_base_schema.sql` — Creates all tables (lookups, tours, visas, agents)
2. `20260815_02_rls_policies.sql` — Enables RLS with public read-only policies
3. `20260815_03_disable_rls.sql` — **Choose this** to disable RLS entirely (recommended since app has client-side admin auth)
   - OR -
   `20260815_04_full_crud_policies.sql` — **Choose this** to keep RLS enabled with full CRUD policies
4. `20260815_05_add_start_location.sql` — Adds `start_location` column to tours

## Notes

- Only run **one** of `03_disable_rls.sql` or `04_full_crud_policies.sql`, not both.
- If you already have the tables created, you can skip `01_base_schema.sql` and run the ALTER/migration files as needed.
- The app uses client-side admin password protection, so disabling RLS is acceptable for this project.
