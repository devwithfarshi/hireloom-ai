-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "socialLinks" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "domain" TEXT;
