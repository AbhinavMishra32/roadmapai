-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "careerStage" TEXT NOT NULL DEFAULT '',
    "educationField" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "fieldKnowledge" TEXT NOT NULL DEFAULT '',
    "skillsToGrow" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "careerGoal" TEXT NOT NULL DEFAULT '',
    "workSetting" TEXT NOT NULL DEFAULT '',
    "roleType" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "startTime" TEXT NOT NULL DEFAULT '',
    "learningPreference" TEXT NOT NULL DEFAULT '',
    "careerMaterials" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
