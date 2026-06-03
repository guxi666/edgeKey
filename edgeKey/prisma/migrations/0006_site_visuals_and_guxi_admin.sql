ALTER TABLE "SiteSetting" ADD COLUMN "homeHeroImage" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "defaultProductCover" TEXT;

UPDATE "Admin"
SET "username" = 'guxi',
    "nickname" = COALESCE(NULLIF("nickname", ''), 'guxi')
WHERE "username" = 'admin'
  AND NOT EXISTS (SELECT 1 FROM "Admin" WHERE "username" = 'guxi');
