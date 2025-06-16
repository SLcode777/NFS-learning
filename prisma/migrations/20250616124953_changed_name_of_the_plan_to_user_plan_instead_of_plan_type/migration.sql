/*
  Warnings:

  - The `plan` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'IRON', 'GOLD');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "plan",
ADD COLUMN     "plan" "UserPlan" NOT NULL DEFAULT 'FREE';

-- DropEnum
DROP TYPE "PlanType";
