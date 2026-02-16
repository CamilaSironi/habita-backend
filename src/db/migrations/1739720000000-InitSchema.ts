import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1739720000000 implements MigrationInterface {
  name = "InitSchema1739720000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
          CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'closed', 'spam');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('tenant', 'owner', 'admin');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        password_hash TEXT,
        role user_role NOT NULL DEFAULT 'tenant',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        public_id TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'loft', 'villa')),
        price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
        currency CHAR(3) NOT NULL DEFAULT 'USD',
        bedrooms SMALLINT NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
        bathrooms SMALLINT NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
        area_m2 NUMERIC(10,2) NOT NULL CHECK (area_m2 > 0),
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        latitude NUMERIC(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
        longitude NUMERIC(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        owner_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        alt_text TEXT,
        position SMALLINT NOT NULL DEFAULT 0,
        is_cover BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (property_id, position)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
        property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, property_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
        user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        message TEXT NOT NULL CHECK (length(trim(message)) > 0),
        status inquiry_status NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_properties_city_type_price ON properties(city, property_type, price)`);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING GIN (
        to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(city, '') || ' ' || coalesce(country, ''))
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_property_cover_image
      ON property_images(property_id)
      WHERE is_cover = TRUE
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_inquiries_contact_email ON inquiries(contact_email)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at ON inquiries(status, created_at DESC)`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_app_users_updated_at ON app_users`);
    await queryRunner.query(`
      CREATE TRIGGER trg_app_users_updated_at
      BEFORE UPDATE ON app_users
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_properties_updated_at ON properties`);
    await queryRunner.query(`
      CREATE TRIGGER trg_properties_updated_at
      BEFORE UPDATE ON properties
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries`);
    await queryRunner.query(`
      CREATE TRIGGER trg_inquiries_updated_at
      BEFORE UPDATE ON inquiries
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_properties_updated_at ON properties`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_app_users_updated_at ON app_users`);

    await queryRunner.query(`DROP TABLE IF EXISTS inquiries`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites`);
    await queryRunner.query(`DROP TABLE IF EXISTS property_images`);
    await queryRunner.query(`DROP TABLE IF EXISTS properties`);
    await queryRunner.query(`DROP TABLE IF EXISTS app_users`);

    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at`);
    await queryRunner.query(`DROP TYPE IF EXISTS inquiry_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
