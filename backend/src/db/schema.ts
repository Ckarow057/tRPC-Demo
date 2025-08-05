import { pgTable, serial, varchar, date, timestamp } from 'drizzle-orm/pg-core';

// Users table - matches migration exactly
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    first_name: varchar('first_name', { length: 50 }).notNull(),
    last_name: varchar('last_name', { length: 50 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    birthdate: date('birthdate'),
    created_at: timestamp('created_at').defaultNow(),
});

// Coffee table - matches migration exactly
export const coffee = pgTable('coffee', {
    id: serial('id').primaryKey(),
    product_name: varchar('product_name', { length: 50 }).notNull(),
    bean: varchar('bean', { length: 50 }).notNull(),
    roast: varchar('roast', { length: 50 }).notNull(),
    grind: varchar('grind', { length: 50 }).notNull(),
});

// Merchandise table - matches migration exactly
export const merch = pgTable('merch', {
    id: serial('id').primaryKey(),
    product_name: varchar('product_name', { length: 50 }).notNull(),
    product_category: varchar('product_category', { length: 50 }).notNull(),
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Coffee = typeof coffee.$inferSelect;
export type NewCoffee = typeof coffee.$inferInsert;

export type Merch = typeof merch.$inferSelect;
export type NewMerch = typeof merch.$inferInsert;
