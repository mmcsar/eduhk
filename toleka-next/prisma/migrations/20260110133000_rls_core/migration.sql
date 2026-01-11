-- Core RLS policies for multi-tenant safety.
-- Apply after Prisma creates tables.

-- Membership
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membership_select ON "Membership";
CREATE POLICY membership_select
ON "Membership"
FOR SELECT
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

DROP POLICY IF EXISTS membership_write ON "Membership";
CREATE POLICY membership_write
ON "Membership"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

-- Subscription
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS subscription_select ON "Subscription";
CREATE POLICY subscription_select
ON "Subscription"
FOR SELECT
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

DROP POLICY IF EXISTS subscription_write ON "Subscription";
CREATE POLICY subscription_write
ON "Subscription"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

-- Load (private table)
ALTER TABLE "Load" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Load" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS load_select ON "Load";
CREATE POLICY load_select
ON "Load"
FOR SELECT
USING (
  -- owner tenant always sees their data
  "tenantId" = current_setting('app.tenant_id', true)
  -- subscribers can read public POSTED loads across tenants
  OR ("status" = 'POSTED' AND current_setting('app.plan_active', true) = 'true')
  -- platform admin sees all
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

DROP POLICY IF EXISTS load_write ON "Load";
CREATE POLICY load_write
ON "Load"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

-- HubSpot outbox
ALTER TABLE "HubspotOutbox" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HubspotOutbox" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS hubspot_outbox_select ON "HubspotOutbox";
CREATE POLICY hubspot_outbox_select
ON "HubspotOutbox"
FOR SELECT
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

DROP POLICY IF EXISTS hubspot_outbox_write ON "HubspotOutbox";
CREATE POLICY hubspot_outbox_write
ON "HubspotOutbox"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

