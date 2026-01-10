-- SavedSearch + LoadPublicListing RLS policies.

-- LoadPublicListing is public-readable, tenant-writable.
ALTER TABLE "LoadPublicListing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoadPublicListing" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS listing_select_public ON "LoadPublicListing";
CREATE POLICY listing_select_public
ON "LoadPublicListing"
FOR SELECT
USING (true);

DROP POLICY IF EXISTS listing_write_tenant ON "LoadPublicListing";
CREATE POLICY listing_write_tenant
ON "LoadPublicListing"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
);

-- SavedSearch is private to user/tenant
ALTER TABLE "SavedSearch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedSearch" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS saved_search_select ON "SavedSearch";
CREATE POLICY saved_search_select
ON "SavedSearch"
FOR SELECT
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  AND "userId" = current_setting('app.user_id', true)
);

DROP POLICY IF EXISTS saved_search_write ON "SavedSearch";
CREATE POLICY saved_search_write
ON "SavedSearch"
FOR INSERT, UPDATE, DELETE
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  AND "userId" = current_setting('app.user_id', true)
)
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  AND "userId" = current_setting('app.user_id', true)
);

