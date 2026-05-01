import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["user", "admin"]);

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(), // uuid generated in code
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"), // null for Google OAuth users
  role: roleEnum("role").notNull().default("user"),
  googleId: text("google_id").unique(), // null for email/password users
  image: text("image"), // profile picture URL
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Sessions ────────────────────────────────────────────────────────────────
// Lightweight server-side session store (for revocation support)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // session uuid
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // JWT token value
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Admin registration codes ─────────────────────────────────────────────────
// Tracks how many admins have been registered (max 3)
export const adminMetadata = pgTable("admin_metadata", {
  id: integer("id").primaryKey().default(1), // singleton row
  adminCount: integer("admin_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Types ───────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
