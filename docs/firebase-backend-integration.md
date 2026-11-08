# Firebase and backend integration

The public Artsgoz site, Aksornsara site, and backoffice share Firebase Authentication. Firebase signs in the user; the backend verifies the ID token and loads the PostgreSQL profile and role. Google login requires a verified address ending in `@student.chula.ac.th`. Email/password login accepts any valid email address. The backend enforces the Google rule on both login and protected requests.

## Environment configuration

Each app has a `.env.example`. Copy its values into that app's ignored `.env` file. Set `VITE_API_BASE_URL` to the backend URL including `/api`. Requests fail with a configuration error when this value is absent. `VITE_API_URL` remains supported for the existing Artsgoz client, and `VITE_AKSORNSARA_API_URL` remains an optional Aksornsara override.

| Environment | Terraform API URL |
| --- | --- |
| dev | `https://tmp.dev.api.artsgoz.com/api` |
| staging | `https://staging.api.artsgoz.com/api` |
| prod | `https://api.artsgoz.com/api` |

These values are in each environment's Artsgoz and Aksornsara `.tfvars` files. Terraform passes them to Cloud Build as `_API_BASE_URL`, and the build exposes them as `VITE_API_BASE_URL`. Terraform and Cloud Build changes have not been deployed.

For local backend development, use `VITE_API_BASE_URL=http://localhost:3000/api`. Set `VITE_MAINTENANCE_MODE=false` to show the app. Firebase web configuration defaults to the supplied `artsgoz-artsgoz-web-develop` project and can be overridden with the documented `VITE_FIREBASE_*` variables. The backend's `FIREBASE_PROJECT_ID` must match the frontend project in each environment. Staging/prod Firebase configuration was not provided; configure it separately if those backends verify a different Firebase project. Analytics is optional and loads only when `VITE_ENABLE_ANALYTICS=true`.

## Firebase Console settings

In [Firebase Authentication for the supplied project](https://console.firebase.google.com/project/artsgoz-artsgoz-web-develop/authentication/providers), enable **Email/Password** and **Google**. Google requires a project support email in the console. Add the actual frontend hostnames and `localhost` under Authentication → Settings → Authorized domains. These remote settings were not changed or verified during implementation.

The Google provider's hosted-domain hint guides the account chooser. Actual access enforcement uses the provider and verified email from the signed Firebase token on the backend; a client-supplied email or role cannot bypass it.

## Backend startup and roles

Run from `artsgoz-backend`:

```sh
go run ./cmd/api
```

Both `./cmd` and `./cmd/api` now use the same bootstrap and routes. The loader reads `.env.local`, then `.env`; process environment values take priority. The API requires PostgreSQL settings and Firebase Admin credentials or Application Default Credentials. Keep backend credentials in that repository's ignored local configuration or deployment secrets.

The bootstrap migrates the models, including FAQ, contact submission, review, and comment status fields. Public and admin API routes are available under both `/api` and `/api/v1`. `/healthz` is outside those prefixes.

New Firebase profiles receive `member`. A backend administrator must assign `writer`, `editor`, `admin`, or `superadmin` before backoffice access is granted. User-role changes require an administrator; client registration cannot choose a privileged role. Dashboard and community moderation routes require `editor`, `admin`, or `superadmin`.

## Integrated behavior

- Email/password sign-in, account creation, password reset, and Google popup login.
- Firebase session restoration and refreshed ID tokens synchronized with the backend before the application exposes a logged-in profile.
- Real logout, profile and avatar updates, and Firebase password changes.
- Public article listing/detail and view-count requests; article changes wait for backend success.
- FAQ retrieval and contact submission; admin user/review/comment retrieval and moderation.
- Authenticated multipart uploads retain the browser-generated content-type boundary.

## Verification

Frontend auth tests cover the Google domain restriction, password exceptions, backend profile synchronization, rejected tokens, and logout during a pending request. Backend tests cover the same domain restriction on login and protected requests, route registration/CORS, authenticated route protection, and environment-file precedence.

Typechecks and production builds were run locally. Backend checks are `go test ./...` and `go vet ./...`. Live Firebase sign-in and database-backed HTTP requests still require a running configured backend and enabled Firebase providers; they were not exercised with a real user account.

## Commits

Use `monorepo-integration-files.txt` for the exact pending monorepo paths and `backend-integration-files.txt` for the backend paths already committed in `c232c7d` (`feat: migrate to firebase`). They exclude ignored `.env` files, build output, dependency folders, credentials, and temporary patches.

Suggested messages:

- Monorepo: `feat(auth): integrate Firebase login and backend API clients`
- Backend: `feat(api): unify routes and enforce Google student email policy`
