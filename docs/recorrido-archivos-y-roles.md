# Recorrido completo: archivos, camino y rol de cada capa

Este documento explica **qué hace cada archivo** y **cómo viaja una request** dentro de `habita-backend`.

## 1) Mapa de archivos por capa

## Entrada y composición

- `src/server.ts`
  - Arranque de la aplicación.
  - Inicializa TypeORM (`appDataSource.initialize()`), crea app Express y hace `listen`.

- `src/app.ts`
  - **Composition root** (inyección de dependencias manual).
  - Conecta implementaciones concretas:
    - `TypeormPropertyRepository` / `TypeormInquiryRepository`
    - `PropertyService` / `InquiryService`
    - `PropertyController` / `InquiryController`
  - Registra middlewares y rutas (`/api`).

## Configuración

- `src/config/env.ts`
  - Carga `.env` con `dotenv`.
  - Valida variables requeridas y define defaults (`PORT`, `DB_*`).

## Rutas (HTTP layer)

- `src/routes/healthRoutes.ts`
  - Endpoint de salud: `GET /api/health`.

- `src/routes/propertyRoutes.ts`
  - Endpoints de negocio:
    - `GET /api/properties`
    - `GET /api/properties/:publicId`
    - `POST /api/properties/:publicId/inquiries`
  - Solo enruta: no tiene lógica de negocio.

## Controllers (adaptadores de entrada)

- `src/controllers/PropertyController.ts`
  - Valida query params con Zod (`city`, `type`, `maxPrice`, `search`, `sort`).
  - Traduce errores de input a HTTP `400`.
  - Llama a `PropertyService` y responde JSON.

- `src/controllers/InquiryController.ts`
  - Valida `publicId` y body (`contactName`, `contactEmail`, `message`, `userId`).
  - Si no existe propiedad, devuelve `404`.
  - Si crea inquiry, devuelve `201`.

## Services (aplicación/casos de uso)

- `src/services/PropertyService.ts`
  - Orquesta casos de uso de propiedades.
  - Delega lectura a `PropertyRepository`.

- `src/services/InquiryService.ts`
  - Caso de uso: crear inquiry por `publicId`.
  - Primero resuelve `publicId -> id interno` usando `PropertyRepository`.
  - Luego crea inquiry usando `InquiryRepository`.

## Dominio (contratos y tipos de negocio)

- `src/domain/entities/property.ts`
  - Define `PropertyType`, `Property` y `PropertyFilters`.

- `src/domain/entities/inquiry.ts`
  - Define `CreateInquiryInput` e `Inquiry`.

## Repositories (puerto + adaptador)

### Interfaces (puertos)

- `src/repositories/interfaces/PropertyRepository.ts`
  - Contrato para listar, buscar por `publicId` y resolver id interno.

- `src/repositories/interfaces/InquiryRepository.ts`
  - Contrato para crear inquiries.

### Implementaciones TypeORM (adaptadores)

- `src/repositories/typeorm/TypeormPropertyRepository.ts`
  - Construye queries de filtros/sort.
  - Aplica `isPublished = true`.
  - Hace join con imágenes.
  - Mapea `PropertyEntity` a modelo de dominio `Property`.

- `src/repositories/typeorm/TypeormInquiryRepository.ts`
  - Crea y guarda `InquiryEntity` en DB.
  - Mapea resultado ORM a modelo de dominio `Inquiry`.

### Carpeta preparada para otra infraestructura

- `src/repositories/postgres/`
  - En este estado del proyecto, está disponible como espacio para otra implementación (por ejemplo SQL nativo), pero no se usa actualmente.

## Persistencia (infraestructura de datos)

- `src/db/data-source.ts`
  - Configura conexión TypeORM a PostgreSQL.
  - Registra entidades y migraciones.

### Entidades ORM

- `src/db/entities/PropertyEntity.ts`
  - Tabla `properties` + relaciones con imágenes e inquiries.

- `src/db/entities/PropertyImageEntity.ts`
  - Tabla `property_images` + relación con propiedad.

- `src/db/entities/InquiryEntity.ts`
  - Tabla `inquiries` + estado enum (`new`, `contacted`, `closed`, `spam`).

### Migraciones

- `src/db/migrations/1739720000000-InitSchema.ts`
  - Crea schema inicial: tipos enum, tablas, índices y triggers `updated_at`.

- `src/db/migrations/1739720001000-SeedProperties.ts`
  - Inserta datos semilla de propiedades e imágenes iniciales.

## Middleware transversal

- `src/middlewares/errorHandler.ts`
  - Captura errores no manejados y responde `500`.

---

## 2) Camino completo de una request (ejemplo 1)

### `GET /api/properties?city=Buenos%20Aires&sort=price-asc`

1. Entra por `propertyRoutes.ts`.
2. `PropertyController.list` valida query con Zod.
3. `PropertyService.findMany` recibe filtros normalizados.
4. `TypeormPropertyRepository.findMany` arma query SQL (filtros + sort + join imágenes).
5. TypeORM ejecuta contra PostgreSQL.
6. Repositorio mapea entidades ORM a `Property` (dominio).
7. Controller devuelve JSON al cliente.

Rol de cada capa en este flujo:

- **Route**: direcciona.
- **Controller**: valida y adapta HTTP.
- **Service**: coordina caso de uso.
- **Repository**: consulta y mapea persistencia.
- **Domain**: define forma de salida.
- **DB/Entity**: representa datos físicos.

---

## 3) Camino completo de una request (ejemplo 2)

### `POST /api/properties/apt-001/inquiries`

Body:

```json
{
  "contactName": "Juan Pérez",
  "contactEmail": "juan@email.com",
  "message": "Hola, me interesa esta propiedad"
}
```

1. Entra por `propertyRoutes.ts` hacia `InquiryController.createByProperty`.
2. Controller valida `publicId` y body.
3. `InquiryService.createByPublicPropertyId` pide id interno con `PropertyRepository.getInternalIdByPublicId`.
4. Si no existe propiedad publicada: retorna `null` y controller responde `404`.
5. Si existe: `InquiryRepository.create` persiste inquiry en DB.
6. Controller responde `201` con `id`, `status`, `createdAt`.

---

## 4) Patrón de diseño aplicado (en práctico)

- **Repository Pattern**: la app depende de interfaces de repositorio, no de TypeORM directo.
- **Dependency Injection manual**: `app.ts` decide qué implementación concreta usar.
- **Separación por capas**: HTTP, aplicación, dominio e infraestructura tienen responsabilidades claras.

Resultado:

- Menor acoplamiento.
- Más testabilidad.
- Facilidad para reemplazar infraestructura sin romper casos de uso.
