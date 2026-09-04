import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  photoCount: integer("photo_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const photos = sqliteTable(
  "photos",
  {
    id: text("id").primaryKey(),
    guestId: text("guest_id").notNull(),
    guestName: text("guest_name").notNull(),
    objectKey: text("object_key").notNull(),
    thumbnailObjectKey: text("thumbnail_object_key"),
    contentType: text("content_type").notNull(),
    hidden: integer("hidden").notNull().default(0),
    hiddenAt: text("hidden_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_photos_hidden_created_at").on(table.hidden, table.createdAt)],
);
