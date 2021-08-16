DROP trigger set_timestamp on orders;
DROP function trigger_set_timestamp();
ALTER TABLE orders DROP COLUMN updated_at;