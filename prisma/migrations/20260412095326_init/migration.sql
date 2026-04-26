-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalCredits" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "RequirementCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requiredCredits" REAL NOT NULL,
    "degreeId" TEXT NOT NULL,
    CONSTRAINT "RequirementCategory_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "credits" REAL NOT NULL,
    "grade" REAL,
    "semester" TEXT,
    CONSTRAINT "UserCourse_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "RequirementCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryCourses_AB_unique" ON "_CategoryCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryCourses_B_index" ON "_CategoryCourses"("B");
