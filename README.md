# Habita Backend

API REST para `habita-front` usando `Express + TypeScript + PostgreSQL` con `TypeORM` y estructura base del patrón repository.

## Stack

- Node.js + TypeScript
- Express
- TypeORM
- PostgreSQL (Docker)
- Repository pattern (`interfaces` + `typeorm` implementations)

## Endpoints MVP

- `GET /api/health`
- `GET /api/properties`
  - query params opcionales: `city`, `type`, `maxPrice`, `search`, `sort`
- `GET /api/properties/:publicId`
- `POST /api/properties/:publicId/inquiries`

Body para `POST /api/properties/:publicId/inquiries`:

```json
{
  "contactName": "Juan Pérez",
  "contactEmail": "juan@email.com",
  "message": "Hola, me interesa esta propiedad"
}
```

## Levantar PostgreSQL con Docker

```bash
docker compose up -d
```

## Ejecutar migraciones

Con la base levantada, aplicar schema + seed inicial:

```bash
npm run migration:run
```

Scripts disponibles:

```bash
npm run migration:create
npm run migration:generate
npm run migration:revert
```

## Ejecutar API

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Instalar dependencias:

```bash
npm install
```

3. Modo desarrollo:

```bash
npm run migration:run
npm run dev
```

4. Build producción:

```bash
npm run build
npm start
```

## Estructura

```text
src/
  config/
  controllers/
  db/
  domain/
  middlewares/
  repositories/
    interfaces/
    postgres/
  routes/
  services/
```
