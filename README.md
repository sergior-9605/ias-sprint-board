# IAS Sprint Board

Aplicación frontend para la gestión de tareas de un sprint activo. Permite crear, visualizar, editar y filtrar tareas con indicadores de estado, prioridad y avance en tiempo real.

**Autor:** Sergio Alejandro Roa Martín — Ingeniero Electrónico · Desarrollador de Software  
**Estado:** Prototipo / En desarrollo

---

## Características

- **Tablero de tareas** con métricas del sprint (total, abiertas, bloqueadas, completadas, % avance)
- **Filtros combinados** por texto, estado y prioridad
- **CRUD completo:** crear, visualizar y editar tareas
- **Vista responsiva:** tarjetas en mobile, tabla en desktop
- **Badges** visuales de estado y prioridad con codificación por color
- **Íconos de Material Design** (Google Material Icons)
- **Mock API** interceptor — funciona sin backend

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Angular 20 |
| Lenguaje | TypeScript 5.9 |
| Estilos | TailwindCSS 4 + PostCSS |
| Íconos | Google Material Icons |
| Estado | Angular Signals |
| Testing | Karma + Jasmine |

---

## Modelo de datos

```ts
interface SprintTask {
  id:          string;
  title:       string;
  description: string;
  status:      'todo' | 'in-progress' | 'blocked' | 'done';
  priority:    'low' | 'medium' | 'high' | 'critical';
  assignee:    string;
  dueDate:     string;   // 'YYYY-MM-DD'
  tags:        string[];
  createdAt:   string;   // ISO
  updatedAt:   string;   // ISO
}
```

---

## Rutas

| Ruta | Descripción |
|---|---|
| `/tasks` | Tablero principal con métricas y listado |
| `/tasks/new` | Formulario de creación de tarea |
| `/tasks/:id` | Vista de detalle de una tarea |
| `/tasks/:id/edit` | Formulario de edición de tarea |

---

## Arquitectura

El proyecto sigue una estructura **feature-based** con separación por capas dentro de cada feature:

```
src/
├── app/
│   ├── core/
│   │   └── interceptors/
│   │       ├── error-interceptor.ts       # Manejo global de errores HTTP
│   │       └── mock-api-interceptor.ts    # Backend simulado en memoria
│   ├── features/
│   │   └── tasks/
│   │       ├── domain/        # Modelos y tipos (SprintTask, TaskStatus, TaskPriority)
│   │       ├── data-access/   # TaskApi — llamadas HTTP a /api/tasks
│   │       ├── state/         # TaskStore — estado reactivo con Angular Signals
│   │       ├── pages/         # Componentes de página (dashboard, detalle, formulario)
│   │       └── ui/            # Componentes presentacionales (card, badges, filtros)
│   └── shared/                # Validadores y utilidades reutilizables
└── index.html
```

### Gestión del estado

`TaskStore` es un servicio basado en **Angular Signals** que centraliza:

- Lista de tareas y tarea seleccionada
- Filtros activos (búsqueda, estado, prioridad)
- Estado de carga y errores
- Computed signals: `filteredTasks`, `summary`, `isEmpty`

---

## Instalación y uso

**Requisitos previos**

- Node.js v18+
- npm

**Pasos**

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd ias-sprint-board

# 2. Instalar dependencias
npm install

# 3. Levantar servidor de desarrollo
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

**Otros comandos**

```bash
npm run build   # Compilar para producción → dist/
npm run watch   # Build en modo desarrollo con watch
npm test        # Ejecutar tests unitarios con Karma/Jasmine
```

---

## Contribuir

1. Crea una rama descriptiva: `feature/nombre-funcionalidad` o `fix/descripcion-bug`
2. Asegúrate de que los tests existentes pasen: `npm test`
3. Incluye tests para código nuevo cuando sea posible
4. Abre un Pull Request con descripción clara del cambio y pasos para validarlo

**Formateo:** el proyecto usa Prettier (`printWidth: 100`, `singleQuote: true`). Ejecuta el formateador antes de commitear.

---

## Contacto

Para dudas o reportes, abre un issue en el repositorio o contacta al mantenedor principal.
