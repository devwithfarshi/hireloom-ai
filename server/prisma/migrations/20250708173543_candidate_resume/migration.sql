-- CreateTable
CREATE TABLE "candidate_resumes" (
    "id" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_resumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_resumes_candidateId_key" ON "candidate_resumes"("candidateId");

-- AddForeignKey
ALTER TABLE "candidate_resumes" ADD CONSTRAINT "candidate_resumes_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_resumes" ADD CONSTRAINT "candidateResume_profile_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidate_profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
