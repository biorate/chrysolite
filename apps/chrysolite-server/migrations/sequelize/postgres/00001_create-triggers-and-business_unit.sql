CREATE OR REPLACE FUNCTION update_last_stamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.last_stamp = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_update_trigger(tbl text) RETURNS void AS $$
BEGIN
    EXECUTE format('CREATE TRIGGER %s_stamp_update
                    BEFORE UPDATE OR INSERT ON %s
                    FOR EACH ROW
                    EXECUTE PROCEDURE update_last_stamp()', tbl, tbl);
EXCEPTION
   WHEN duplicate_object THEN
      NULL;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_creation_stamp_indexes(tName text) RETURNS void AS $$
BEGIN
    EXECUTE format('
        CREATE INDEX IF NOT EXISTS %s_creation_index
            ON %s (creation);
        CREATE INDEX IF NOT EXISTS %s_last_stamp_index
            ON %s (last_stamp);', tName, tName, tName, tName);
    PERFORM set_update_trigger(tName);
END
$$ LANGUAGE plpgsql;
