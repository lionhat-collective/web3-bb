/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `authorAddress` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "authorAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("address");

-- CreateIndex
CREATE INDEX "Forum_id_slug_parentId_categoryId_idx" ON "Forum"("id", "slug", "parentId", "categoryId");

-- CreateIndex
CREATE INDEX "Post_slug_id_idx" ON "Post"("slug", "id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorAddress_fkey" FOREIGN KEY ("authorAddress") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
