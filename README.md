# Prueba Técnica: API de Gestión de Solicitudes de Pólizas

Esta es una API REST desarrollada con **NestJS** y **TypeORM** para la gestión, filtrado, paginación y actualización de solicitudes de pólizas de seguros, incluyendo control de roles y optimización de consultas mediante caché.

## Características y Tecnologías
- **Framework:** NestJS (TypeScript)
- **Base de Datos:** SQL Server (usando TypeORM)
- **Documentación:** Swagger
- **Optimización:** Cache Manager (In-memory caching para filtros de solicitudes)
- **Validaciones:** Class-validator y Class-transformer dentro de DTO's

## Project setup

```bash
$ npm install
```

## Compilar and correr el proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

**Variables de Entorno (`.env`):**
  Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de .env.example y configura tus credenciales de base de datos:
  ```env
  DB_NAME=Promass_Prueba
  DB_USER=tu_usuario
  DB_PASSWORD=tu_contraseña
  DB_HOST=localhost
  JWT_SECRET=tu_secret_jwt
  DB_PORT=1433
  PORT=3000

 ```
**Documentación de la API (Swagger)**
```
La documentación interactiva de todos los endpoints, esquemas de datos y DTOs está integrada en el proyecto. Una vez que el servidor esté corriendo, puedes acceder desde tu navegador a:

http://localhost:3000/docs-policy-requests


Endpoints Principales Disponibles:

POST /auth/login - Inicio de sesión

POST /policy-requests - Crear una nueva solicitud de póliza.

GET /policy-requests - Listar solicitudes con filtros (status, customerName, folio), paginación (numRequests) y soporte de caché.

GET /policy-requests/:id - Obtener el detalle de una solicitud por ID.

PATCH /policy-requests/:id/status - Actualizar el estatus de la póliza (Requiere rol admin o supervisor).

```
**Decisiones Técnicas**
```
### 1. Manejo del Caché (`CacheManager`)
- **Decisión:** Se implementó una estrategia de almacenamiento en caché (In-Memory) con un tiempo de vida (TTL) de 5 minutos para el endpoint `GET /policy-requests`.
- **Justificación:** Las consultas con filtros complejos (como búsquedas por `LIKE` en strings con `customerName` o `folio`) y paginación suelen ser costosas para la base de datos a medida que el volumen de datos crece. Al cachear la respuesta basándonos en la combinación única de filtros, reducimos drásticamente la carga en la base de datos y mejoramos el tiempo de respuesta (latencia) para peticiones repetitivas de los usuarios.

### 2. Uso de `Brackets` en TypeORM (Query Builder)
- **Decisión:** Para el filtrado de solicitudes, se utilizó el operador `Brackets` de TypeORM para agrupar las condiciones `OR` (`customerName` o `folio`).
- **Justificación:** Esto asegura que la condición del estado (`status = :status`) se aplique de manera estricta y global, evitando errores donde un `OR` suelto podría saltarse el filtro de estatus requerido.

### 3. Endpoint para desactivar usuario (Delete ('deactivate/:id'))
- **Decisión:** Para comporbación de status al iniciar sesión.
- **Justificación:** Lo agregue como extra para poder validar que unicamente puedan iniciar sesión aquellos usuarios que tengan status = 'activo' en base de datos, si está como 'inactive' el endpoint (`auth/login`) lanzará un error mencionando que dicho usuario se encuentra inactivo.

```
**Nota sobre el alcance del proyecto (Testing)**
```
Para esta entrega, decidí priorizar la arquitectura robusta del backend, la optimización mediante caché con CacheManager y la documentación interactiva con Swagger. Debido a que actualmente estoy profundizando en mis conocimientos sobre testing automatizado con Jest, preferiero ser transparente en mi trabajo y no incluir algo que aún no domino, ya que si colocara algo sobre testing no sería de mi autoría o conocimiento. 

Se que restará puntos y lo entiendo perfecto, agradezco mucho su tiempo, solo trato de ser honesto con mi trabajo y con ustedes que me brindan esta oportunidad de tomar la prueba.


```
**Evidencias de pruebas ejecutadas** 
```
- Registro de usuario

[![Captura-de-pantalla-2026-05-16-221917.png](https://i.postimg.cc/j2Qgj4LB/Captura-de-pantalla-2026-05-16-221917.png)](https://postimg.cc/zHvStWwk)

- Inicio de sesión

[![Captura-de-pantalla-2026-05-16-221936.png](https://i.postimg.cc/QCrYsydX/Captura-de-pantalla-2026-05-16-221936.png)](https://postimg.cc/k6fvvwSZ)

- Desactivar usuario

[![Captura-de-pantalla-2026-05-16-221947.png](https://i.postimg.cc/nrtSZPhn/Captura-de-pantalla-2026-05-16-221947.png)](https://postimg.cc/nj0GGTmW)

- Crear solicitud de póliza

[![Captura-de-pantalla-2026-05-16-222006.png](https://i.postimg.cc/zvStfFV6/Captura-de-pantalla-2026-05-16-222006.png)](https://postimg.cc/p5rYG8QJ)

-Obtener póliza por id

[![Captura-de-pantalla-2026-05-16-222019.png](https://i.postimg.cc/hvbyG1fH/Captura-de-pantalla-2026-05-16-222019.png)](https://postimg.cc/SYR7T8Lr)

- Obtener pólizas por filtros

[![Captura-de-pantalla-2026-05-16-222040.png](https://i.postimg.cc/QCk4MJFG/Captura-de-pantalla-2026-05-16-222040.png)](https://postimg.cc/SYR7T8LD)

- Actualizar status de póliza

[![Captura-de-pantalla-2026-05-16-222051.png](https://i.postimg.cc/90t8fYDj/Captura-de-pantalla-2026-05-16-222051.png)](https://postimg.cc/gLjqSRyM)