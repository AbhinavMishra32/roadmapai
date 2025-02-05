/*
  Warnings:

  - You are about to drop the column `userId` on the `Roadmap` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Roadmap" DROP CONSTRAINT "Roadmap_userId_fkey";

-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "userId",
ADD COLUMN     "recentUserId" TEXT,
ADD COLUMN     "savedUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_recentUserId_fkey" FOREIGN KEY ("recentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_savedUserId_fkey" FOREIGN KEY ("savedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
