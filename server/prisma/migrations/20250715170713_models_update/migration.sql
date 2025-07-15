/*
  Warnings:

  - You are about to drop the column `candidateId` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `candidate_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `candidate_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `candidate_resumes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidateUserId]` on the table `candidate_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[candidateUserId]` on the table `candidate_resumes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyUserId]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateUserId` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateUserId` to the `candidate_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateUserId` to the `candidate_resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyUserId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "candidate_profiles" DROP CONSTRAINT "candidate_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "candidate_resumes" DROP CONSTRAINT "candidateResume_profile_fkey";

-- DropForeignKey
ALTER TABLE "candidate_resumes" DROP CONSTRAINT "candidate_resumes_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_userId_fkey";

-- DropIndex
DROP INDEX "candidate_profiles_userId_key";

-- DropIndex
DROP INDEX "candidate_resumes_candidateId_key";

-- DropIndex
DROP INDEX "companies_userId_key";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "candidateId",
ADD COLUMN     "candidateUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "candidate_profiles" DROP COLUMN "resumeUrl",
DROP COLUMN "userId",
ADD COLUMN     "candidateUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "candidate_resumes" DROP COLUMN "candidateId",
ADD COLUMN     "candidateUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "userId",
ADD COLUMN     "companyUserId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "candidate_profiles_candidateUserId_key" ON "candidate_profiles"("candidateUserId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_resumes_candidateUserId_key" ON "candidate_resumes"("candidateUserId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_companyUserId_key" ON "companies"("companyUserId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_resumes" ADD CONSTRAINT "candidateResume_profile_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "candidate_profiles"("candidateUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "candidate_profiles"("candidateUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
