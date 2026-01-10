-- Bid/Offer RLS policies (DAT-grade).

ALTER TABLE "Bid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bid" FORCE ROW LEVEL SECURITY;

-- Read rules:
-- - bidder tenant can read their own bids
-- - load owner tenant can read bids for their loads
-- - platform admin can read all
DROP POLICY IF EXISTS bid_select ON "Bid";
CREATE POLICY bid_select
ON "Bid"
FOR SELECT
USING (
  "tenantId" = current_setting('app.tenant_id', true)
  OR current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
  OR EXISTS (
    SELECT 1
    FROM "Load" l
    WHERE l.id = "Bid"."loadId"
      AND l."tenantId" = current_setting('app.tenant_id', true)
  )
);

-- Insert rules: bidder tenant inserts their bids; require active plan
DROP POLICY IF EXISTS bid_insert ON "Bid";
CREATE POLICY bid_insert
ON "Bid"
FOR INSERT
WITH CHECK (
  "tenantId" = current_setting('app.tenant_id', true)
  AND "userId" = current_setting('app.user_id', true)
  AND current_setting('app.plan_active', true) = 'true'
);

-- Update/Delete rules:
-- - bidder tenant can withdraw/update their own bid while pending
-- - load owner tenant can accept/reject bids for their loads
-- - platform admin can update/delete all
DROP POLICY IF EXISTS bid_update ON "Bid";
CREATE POLICY bid_update
ON "Bid"
FOR UPDATE
USING (
  current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
  OR (
    "tenantId" = current_setting('app.tenant_id', true)
    AND "userId" = current_setting('app.user_id', true)
  )
  OR EXISTS (
    SELECT 1
    FROM "Load" l
    WHERE l.id = "Bid"."loadId"
      AND l."tenantId" = current_setting('app.tenant_id', true)
  )
)
WITH CHECK (
  current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
  OR (
    "tenantId" = current_setting('app.tenant_id', true)
    AND "userId" = current_setting('app.user_id', true)
  )
  OR EXISTS (
    SELECT 1
    FROM "Load" l
    WHERE l.id = "Bid"."loadId"
      AND l."tenantId" = current_setting('app.tenant_id', true)
  )
);

DROP POLICY IF EXISTS bid_delete ON "Bid";
CREATE POLICY bid_delete
ON "Bid"
FOR DELETE
USING (
  current_setting('app.user_role', true) = 'PLATFORM_ADMIN'
  OR ("tenantId" = current_setting('app.tenant_id', true) AND "userId" = current_setting('app.user_id', true))
);

