import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProperties1739720001000 implements MigrationInterface {
  name = "SeedProperties1739720001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO properties (
        public_id,
        title,
        description,
        property_type,
        price,
        currency,
        bedrooms,
        bathrooms,
        area_m2,
        city,
        country,
        latitude,
        longitude,
        is_published
      ) VALUES
      (
        'apt-001',
        'Modern Apartment in Palermo',
        'Bright and modern apartment located in the heart of Palermo, close to cafes and parks.',
        'apartment',
        1200,
        'USD',
        2,
        1,
        68,
        'Buenos Aires',
        'Argentina',
        -34.603684,
        -58.381559,
        TRUE
      ),
      (
        'house-002',
        'Cozy Beach House',
        'Relaxing beach house ideal for families looking for comfort and ocean views.',
        'house',
        1800,
        'USD',
        3,
        2,
        110,
        'Búzios',
        'Brazil',
        -22.757600,
        -41.886000,
        TRUE
      ),
      (
        'loft-003',
        'Minimal Loft',
        'Minimalist loft in a vibrant neighborhood, perfect for professionals.',
        'loft',
        1000,
        'USD',
        1,
        1,
        45,
        'São Paulo',
        'Brazil',
        -23.550520,
        -46.633308,
        TRUE
      ),
      (
        'villa-007',
        'Luxury Villa with Ocean View',
        'Exclusive villa with panoramic ocean views, private pool and premium finishes.',
        'villa',
        5200,
        'USD',
        6,
        4,
        500,
        'Necochea',
        'Argentina',
        -38.554496,
        -58.739608,
        TRUE
      )
      ON CONFLICT (public_id) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO property_images (property_id, image_url, alt_text, position, is_cover)
      SELECT id, 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=687&auto=format&fit=crop', 'Modern Apartment in Palermo', 0, TRUE
      FROM properties
      WHERE public_id = 'apt-001'
      ON CONFLICT (property_id, position) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO property_images (property_id, image_url, alt_text, position, is_cover)
      SELECT id, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae', 'Cozy Beach House', 0, TRUE
      FROM properties
      WHERE public_id = 'house-002'
      ON CONFLICT (property_id, position) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO property_images (property_id, image_url, alt_text, position, is_cover)
      SELECT id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'Minimal Loft', 0, TRUE
      FROM properties
      WHERE public_id = 'loft-003'
      ON CONFLICT (property_id, position) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO property_images (property_id, image_url, alt_text, position, is_cover)
      SELECT id, 'https://plus.unsplash.com/premium_photo-1687960117069-567a456fe5f3?q=80&w=1170&auto=format&fit=crop', 'Luxury Villa with Ocean View', 0, TRUE
      FROM properties
      WHERE public_id = 'villa-007'
      ON CONFLICT (property_id, position) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM property_images WHERE alt_text IN ('Modern Apartment in Palermo', 'Cozy Beach House', 'Minimal Loft', 'Luxury Villa with Ocean View')`);
    await queryRunner.query(`DELETE FROM properties WHERE public_id IN ('apt-001', 'house-002', 'loft-003', 'villa-007')`);
  }
}
