# AGENTS.md — proyecto_web2

## Stack

- **Angular 19.1** — standalone components only (`bootstrapApplication`, no NgModules)
- **SSR** via `@angular/ssr` + Express (`outputMode: "server"`), dev server on port 4000
- **Bootstrap 5.3.3** loaded globally in `angular.json` styles (order: bootstrap, then `styles.css`)
- **Testing:** Jasmine 5.5 + Karma 6.4 (`karma-chrome-launcher`, `karma-firefox-launcher`, `karma-coverage`)
- **No lint or formatter** beyond `.editorconfig`

## Commands

| Action | Command |
|---|---|
| Dev server | `npm start` or `ng serve` |
| Build | `npm run build` |
| Dev build (watch) | `npm run watch` |
| Test | `npm test` or `ng test` |
| Generate | `ng generate component <name>` etc. |

## Architecture

- **Routes** all lazy-loaded (see `app.routes.ts`):
  - `home`, `products`, `usuarios`, `inscripciones`, `materias`, `admin` (guarded), `**` (404)
- **Admin guard** uses `canMatch` (modern Angular pattern, see `admin.guard.ts`)
- **Services** use `BehaviorSubject` pattern — no NgRx/Signals
- **API base URL:** `https://localhost:7248/api` (`.NET backend`) — endpoints: `/Usuarios`, `/Materias`, `/IncMaterias`
- **Service split:** `UsuarioService` & `IncmateriasService` hit real API; `MateriaService` & `ProcutsService` are in-memory only
- **`main.ts` has duplicate/redundant HTTP providers** — two `provideHttpClient()` calls + `importProvidersFrom(HttpClientModule)`. All are redundant with each other.
- `ApiService` provides raw CRUD; feature services wrap it with state
- `@angular/localize/init` polyfill is included but no actual i18n setup

## Testing notes

- Spec files exist for components and services alongside sources
- Tests run via Karma (browser-based, not Jest/Node)
- Debug tests in VS Code: `.vscode/launch.json` has Chrome debug configs

## VS Code

- Recommended extension: `angular.ng-template`
- Launch configs for `ng serve` and `ng test` debugging
- `.vscode/*.json` are tracked (see `.gitignore`)

## Gotchas

- `dashboard/` directory exists but is **not referenced in any route**
- `tsconfig.app.json` does **not** glob `src/**/*.ts` — only specific entry files are included
- SSR output to `dist/my-first-app/`, SSR server entry: `dist/my-first-app/server/server.mjs`
