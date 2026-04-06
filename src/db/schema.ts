import {
    pgTable,
    text,
    uuid,
    varchar,
    integer,
    serial,
    timestamp,
    pgEnum,
    unique
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Define the User Roles
export const roleEnum = pgEnum("user_role", ["admin", "teacher", "student", "parent"]);

// 2. The Base Profile (Centralized User Info)
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(), // Matches Supabase auth.users.id
    email: text("email").unique().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    role: roleEnum("role").default("student").notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(), // Managed via DB Trigger
});

// 3. Academic Structure
export const grades = pgTable("grades", {
    id: serial("id").primaryKey(),
    level: varchar("level", { length: 10 }).notNull(), // "1", "10"
    name: text("name").notNull(), // "First Grade", "High School"
});

export const sections = pgTable("sections", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 10 }).notNull(), // "A", "B"
    gradeId: integer("grade_id")
        .references(() => grades.id, { onDelete: "cascade" })
        .notNull(),
    roomNumber: text("room_number"),
    classTeacherId: uuid("class_teacher_id").references(() => teachers.id), // Reference Teacher table specifically
}, (t) => ({
    // Refinement: Prevent duplicate section names within the same grade
    unq: unique().on(t.name, t.gradeId),
}));

// 4. Role-Specific Data
export const students = pgTable("students", {
    id: uuid("id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
    studentId: varchar("student_id", { length: 20 }).unique().notNull(), // School-specific ID
    sectionId: integer("section_id").references(() => sections.id),
    enrollmentDate: timestamp("enrollment_date").defaultNow(),
    parentId: uuid("parent_id").references(() => profiles.id),
});

export const teachers = pgTable("teachers", {
    id: uuid("id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
    employeeId: varchar("employee_id", { length: 20 }).unique().notNull(),
    department: text("department").notNull(),
    specialization: text("specialization"),
    joiningDate: timestamp("joining_date").defaultNow(),
});

// --- RELATIONS ---

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    studentData: one(students, {
        fields: [profiles.id],
        references: [students.id],
    }),
    teacherData: one(teachers, {
        fields: [profiles.id],
        references: [teachers.id],
    }),
    children: many(students), // For parents
}));

export const gradesRelations = relations(grades, ({ many }) => ({
    sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
    grade: one(grades, {
        fields: [sections.gradeId],
        references: [grades.id],
    }),
    classTeacher: one(teachers, {
        fields: [sections.classTeacherId],
        references: [teachers.id],
    }),
    students: many(students),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
    profile: one(profiles, {
        fields: [teachers.id],
        references: [profiles.id],
    }),
    managedSection: one(sections), // For class teachers
}));

export const studentsRelations = relations(students, ({ one }) => ({
    profile: one(profiles, {
        fields: [students.id],
        references: [profiles.id],
    }),
    section: one(sections, {
        fields: [students.sectionId],
        references: [sections.id],
    }),
    parent: one(profiles, {
        fields: [students.parentId],
        references: [profiles.id],
    }),
}));