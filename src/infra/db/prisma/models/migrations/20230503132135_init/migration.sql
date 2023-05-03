-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "rewardPoints" DECIMAL NOT NULL
);
INSERT INTO "new_customers" ("active", "city", "id", "name", "number", "rewardPoints", "street", "zipcode") SELECT "active", "city", "id", "name", "number", "rewardPoints", "street", "zipcode" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
