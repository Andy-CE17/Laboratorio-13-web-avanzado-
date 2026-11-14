CREATE SCHEMA IF NOT EXISTS laboratorio13;
REVOKE ALL ON SCHEMA laboratorio13 FROM PUBLIC;

CREATE TABLE IF NOT EXISTS laboratorio13.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz
);
