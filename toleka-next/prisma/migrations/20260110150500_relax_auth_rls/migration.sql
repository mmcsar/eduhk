-- IMPORTANT:
-- We keep RLS "hard" on business tables (Load, SavedSearch, HubspotOutbox).
-- But we relax RLS on auth-enabler tables (Membership, Subscription) to avoid blocking
-- public /register + /login flows when using server-side Prisma with DB credentials.

-- Disable RLS on Membership
ALTER TABLE "Membership" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS membership_select ON "Membership";
DROP POLICY IF EXISTS membership_write ON "Membership";

-- Disable RLS on Subscription
ALTER TABLE "Subscription" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" NO FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS subscription_select ON "Subscription";
DROP POLICY IF EXISTS subscription_write ON "Subscription";

