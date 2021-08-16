ALTER TABLE ONLY orders
    ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW();

CREATE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
    BEFORE
        UPDATE ON orders
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();