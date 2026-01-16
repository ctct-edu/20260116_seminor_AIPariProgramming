import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Users table
 */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
