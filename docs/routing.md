# Routing Guide

A beginner-friendly walkthrough of how routes work in the `frontend` and `backoffice` apps.

Both apps use the same pattern, so once you understand one, you understand both.

---

## What is routing?

A router watches the URL in the browser's address bar and decides which React component to show.

- URL is `/` → show `HomePage`
- URL is `/about` → show `AboutPage`
- URL is `/dashboard` → show `DashboardPage`

We use [**react-router** v7](https://reactrouter.com/) to do this.

---

## The big picture

Here's what happens when someone visits a page:

```
User types URL  →  Router reads URL  →  Router picks the matching route
                                              ↓
                                       Renders the layout
                                              ↓
                                       Renders the page inside the layout
```

The router config is built once when the app starts. Then every time the URL changes, the router figures out which components to render.

---

## File layout

Each app has the same folders:

```
apps/<app>/src/
├── main.tsx                    ← entry point, mounts <App /> to the DOM
├── app/
│   └── app.tsx                 ← renders <AppRouter />
├── layouts/
│   └── MainLayout.tsx          ← navigation bar + <Outlet />
└── routes/
    ├── AppRouter.tsx           ← assembles the full route tree
    ├── paths.ts                ← all URL strings live here
    ├── home/
    │   ├── homeRoutes.tsx      ← route definitions for "home"
    │   └── pages/
    │       └── HomePage.tsx    ← the actual page component
    └── about/
        ├── aboutRoutes.tsx
        └── pages/
            └── AboutPage.tsx
```

**Rule of thumb:** one feature = one folder under `routes/`. Each feature owns its own routes file + page components.

---

## The pieces, one by one

### 1. `paths.ts` — the URL dictionary

Every URL in the app is defined here, once. Nowhere else.

```ts
// apps/frontend/src/routes/paths.ts
export const PATHS = {
  ROOT: '/',
  ABOUT: '/about',
} as const;
```

**Why this matters:** if you ever need to rename `/about` to `/info`, you change it in one place. Everywhere else uses `PATHS.ABOUT` and updates automatically.

### 2. A page component — the actual UI

A page is just a normal React component.

```tsx
// apps/frontend/src/routes/about/pages/AboutPage.tsx
export default function AboutPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About</h1>
      <p>Frontend about page.</p>
    </div>
  );
}
```

Nothing special — no router knowledge required. Pages are just components.

### 3. A feature routes file — wires URL to component

```tsx
// apps/frontend/src/routes/about/aboutRoutes.tsx
import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import AboutPage from './pages/AboutPage';

export const aboutRoutes: RouteObject[] = [
  {
    path: PATHS.ABOUT,
    element: <AboutPage />,
  },
];
```

This exports an **array** of route objects. Each object says "when URL matches this `path`, render this `element`."

It's an array (not a single object) because a feature might own several URLs — for example, `dashboard` might have `/dashboard`, `/dashboard/settings`, `/dashboard/users`.

### 4. `MainLayout.tsx` — the shared shell

Every page in the app shows the same nav bar at the top. Instead of repeating it in every page, we put it in a **layout** and let pages render *inside* it.

```tsx
// apps/frontend/src/layouts/MainLayout.tsx
import { Link, Outlet } from 'react-router';
import { PATHS } from '../routes/paths';

export default function MainLayout() {
  return (
    <div>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to={PATHS.ROOT}>Home</Link>
        <Link to={PATHS.ABOUT}>About</Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

Two things to notice:

- **`<Link>`** is react-router's version of `<a>`. Use it for in-app navigation — it doesn't reload the page.
- **`<Outlet />`** is a placeholder. The router replaces it with whichever child page matches the URL.

### 5. `AppRouter.tsx` — the assembly

This is where everything plugs together.

```tsx
// apps/frontend/src/routes/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import { aboutRoutes } from './about/aboutRoutes';
import { homeRoutes } from './home/homeRoutes';
import { PATHS } from './paths';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [...homeRoutes, ...aboutRoutes],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```

What this says:

- "At the root URL, render `<MainLayout />`."
- "Inside that layout (`<Outlet />`), render whichever **child** matches — pulled from `homeRoutes` and `aboutRoutes`."

So a URL of `/about` renders `<MainLayout>` with `<AboutPage>` placed in its `<Outlet />`.

### 6. `app.tsx` and `main.tsx` — just plumbing

```tsx
// apps/frontend/src/app/app.tsx
import { AppRouter } from '../routes/AppRouter';

export function App() {
  return <AppRouter />;
}
export default App;
```

```tsx
// apps/frontend/src/main.tsx
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

These rarely change. `main.tsx` is the entry; `app.tsx` just mounts the router.

---

## How to add a new page

Let's add a `/contact` page to the frontend.

**Step 1.** Add the URL to `paths.ts`:

```ts
export const PATHS = {
  ROOT: '/',
  ABOUT: '/about',
  CONTACT: '/contact', // ← new
} as const;
```

**Step 2.** Create the page component:

```tsx
// apps/frontend/src/routes/contact/pages/ContactPage.tsx
export default function ContactPage() {
  return <h1>Contact us</h1>;
}
```

**Step 3.** Create the routes file:

```tsx
// apps/frontend/src/routes/contact/contactRoutes.tsx
import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import ContactPage from './pages/ContactPage';

export const contactRoutes: RouteObject[] = [
  { path: PATHS.CONTACT, element: <ContactPage /> },
];
```

**Step 4.** Wire it into `AppRouter.tsx`:

```tsx
import { contactRoutes } from './contact/contactRoutes';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [...homeRoutes, ...aboutRoutes, ...contactRoutes], // ← added
  },
]);
```

**Step 5.** (Optional) Add a nav link in `MainLayout.tsx`:

```tsx
<Link to={PATHS.CONTACT}>Contact</Link>
```

Done. Visit `/contact` and you'll see your page.

---

## How to navigate between pages

### As a link (user clicks)

```tsx
import { Link } from 'react-router';
import { PATHS } from '../routes/paths';

<Link to={PATHS.ABOUT}>Go to About</Link>
```

Use `<Link>`, **never** `<a>`. `<a>` reloads the page; `<Link>` does not.

### In code (after a button click, form submit, etc.)

```tsx
import { useNavigate } from 'react-router';
import { PATHS } from '../routes/paths';

function MyButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(PATHS.ABOUT)}>Go</button>;
}
```

---

## Nested routes (advanced but common)

Say `dashboard` has multiple sub-pages: `/dashboard`, `/dashboard/profile`, `/dashboard/settings`. They all share a sidebar. You'd structure it like this:

```tsx
// dashboardRoutes.tsx
import { Outlet } from 'react-router';

const DashboardLayout = () => (
  <div>
    <Sidebar />
    <Outlet />  {/* sub-page renders here */}
  </div>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverviewPage /> },   // /dashboard
      { path: 'profile', element: <DashboardProfilePage /> }, // /dashboard/profile
      { path: 'settings', element: <DashboardSettingsPage /> }, // /dashboard/settings
    ],
  },
];
```

Key points:

- **`index: true`** means "this is the default page when the URL exactly matches the parent."
- Child `path` values are **relative** — `'profile'` becomes `/dashboard/profile`.
- The parent's `<Outlet />` is where children render.

---

## Reading URL parameters

For dynamic URLs like `/users/123`:

```tsx
// routes
{ path: '/users/:userId', element: <UserPage /> }

// inside UserPage
import { useParams } from 'react-router';

export default function UserPage() {
  const { userId } = useParams();
  return <p>User ID: {userId}</p>;
}
```

---

## Common gotchas

- **Use `<Link>` not `<a>`** for internal navigation. `<a>` triggers a full page reload and loses all React state.
- **Pages are just components.** They don't need any router setup themselves — `useParams`, `useNavigate`, etc. work because the router is provided at the top of the tree.
- **Always reference `PATHS.X`**, never hardcoded strings. Otherwise renaming a URL means hunting through every file.
- **Forgot to add to `AppRouter.tsx`?** New routes files don't auto-register. You must spread them into `children`.
- **`element` vs `Component`** — both work in v7. We use `element: <Page />` (JSX) for consistency with the rest of the route tree.

---

## Where to learn more

- Official docs: https://reactrouter.com/
- The full route tree for each app lives in `apps/<app>/src/routes/AppRouter.tsx` — read that file first when exploring a new app.
