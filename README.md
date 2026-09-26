# blogClient

Welcome to the **blogClient** project! The React front end for the `fullStackBlog` platform, built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, and backed by the [blogApi](https://github.com/ozandmrcn/blogApi) REST service. Sessions are managed entirely through `httpOnly` cookies, so the token pair issued by the API is never exposed to client-side JavaScript.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Bullseye.png" alt="Bullseye" width="25" height="25" /> Project Overview

blogClient enables visitors to:

- **Register & Sign In:** Account creation and sign-in are handled with Formik, and the resulting cookies are picked up automatically by the browser.
- **Invisible Token Refresh:** A 401 response triggers a single silent refresh and replays the original request, so an expired access token never surfaces as an error.
- **Browse the Feed:** The home page lists every post with its author, publication date, tags and comment count.
- **Read Posts:** Post bodies are rendered as Markdown, with publication date and tags in the sidebar.
- **Comment:** Signed-in readers can add a comment and delete their own; anonymous visitors can still read the thread.
- **Write & Edit Posts:** A Markdown editor with a live preview and a creatable tag picker, restricted to the post's author.
- **Manage Own Posts:** A dedicated page lists the signed-in user's posts with read, edit and delete actions.
- **Route Protection:** Protected routes wait for the session check to finish and send visitors back to the page they came from after signing in.
- **Friendly Failure States:** Every list and detail view has a loading state and a readable error state instead of a blank screen.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="25" height="25" /> Features

- **Fully Type-Safe Data Layer:** Shared `types` module, so every service call and hook is checked against the exact API response shape.
- **One Axios Instance:** A single interceptor pair adds `withCredentials` and owns the refresh-and-replay flow, with a guard list that prevents a failed refresh or a logout from recursing.
- **Server State with React Query:** Caching, invalidation and background refetching are handled declaratively, and mutations invalidate exactly the queries they affect.
- **Markdown Editing & Rendering:** `react-simplemde-editor` for writing, `react-markdown` for reading, with a single place that defines the toolbar.
- **Dark UI from a Design Token Theme:** All colours, fonts and component classes are declared once in `index.css` as Tailwind theme tokens, so screens never hard-code hex values.
- **Route-Level Code Splitting Ready:** Vendor bundles (React, editor) are separated from application code, and the router is the single place that maps URLs to screens.
- **Accessible Forms:** Labelled inputs, `aria-label` on icon-only controls, and inline validation messages.
- **No Dead Routes:** Unknown URLs land on a 404 screen instead of a blank page.
- **Developer Experience:** ESLint with the React Hooks and Fast Refresh rules, type-aware TypeScript, and HMR through Vite.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" alt="Hammer and Wrench" width="25" height="25" /> Technologies Used

- **React** (UI Library)
- **React Router** (Client-Side Routing)
- **TypeScript** (Language)
- **Vite** (Build Tool & Dev Server)
- **Tailwind CSS** (Styling)
- **TanStack Query** (Server State & Caching)
- **Axios** (HTTP Client)
- **Formik** (Form State & Validation)
- **react-select** (Creatable Tag Picker)
- **react-simplemde-editor / easymde** (Markdown Editor)
- **react-markdown** (Markdown Rendering)
- **react-toastify** (Notifications)
- **react-icons** (Icons)
- **ESLint & TypeScript** (Linting & Type Checking)

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" alt="Desktop Computer" width="25" height="25" /> Setup & Installation

To run the client locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/ozandmrcn/blogClient.git

# Navigate into the project folder
cd blogClient

# Install dependencies
npm install

# Create your local environment file from the template
cp .env.example .env.local   # Windows: copy .env.example .env.local

# Start the development server
npm run dev   # Client -> http://localhost:5173
```

> ⚠️ **Note:** The **blogApi** service must be running for anything other than the static shell to render. It also has to allow this origin, so set `FRONTEND_URL=http://localhost:5173` in the API's `.env`.
>
> 💡 **Tip:** The whole stack (API + client + database) can also be started with `docker compose up` from the [root repository](https://github.com/ozandmrcn/fullStackBlog).

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="Gear" width="25" height="25" /> Environment Variables

Only one variable is needed. Copy `.env.example` to `.env.local` and set:

```env
# Base URL of the API, WITHOUT the trailing /api segment
VITE_API_URL=http://localhost:3000
```

> ⚠️ **Important:** Vite inlines every `VITE_*` variable into the JavaScript bundle at **build time**. Never put a secret in this file — anything here is public. The `httpOnly` auth cookies, not this file, are what keep the session safe.
>
> 💡 **Tip:** Because the value is baked in at build time, changing it requires a rebuild (`npm run build`), not just a dev-server restart.

### <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Key.png" alt="Key" width="25" height="25" /> alt="Key" width="25" height="25" /> Scripts

| Script              | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR on port 5173     |
| `npm run build`     | Typecheck, then build the production bundle to `dist` |
| `npm run typecheck` | Run TypeScript without emitting output              |
| `npm run lint`      | Run ESLint over the project                         |
| `npm run preview`   | Serve the production build locally                  |

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" alt="Desktop Computer" width="25" height="25" /> Project Structure

```
blogClient
├── public/                 # Static assets served as-is (logo, banner, avatar)
├── src/
│   ├── components/         # Reusable UI (button, input, header, comments, guards)
│   ├── context/            # Auth context, provider and `useAuth` hook
│   ├── hooks/              # React Query wrappers per feature
│   ├── pages/              # Route components (home, detail, form, own-blogs, auth)
│   ├── services/           # Axios instance and one module per API resource
│   ├── types/              # Shared request/response interfaces
│   ├── utils/              # Form defaults, editor options, formatting helpers
│   ├── App.tsx             # Route table
│   └── main.tsx            # Providers and app entry point
├── .env.example
├── vercel.json             # Vercel build config, /api proxy and SPA rewrite
├── Dockerfile              # Vite build -> nginx runtime
└── nginx.conf              # Static serving, caching and SPA fallback
```

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="25" height="25" /> Deployment

The app is configured for **Vercel**. Import the repository and set one environment variable:

| Variable       | Value                                |
| -------------- | ------------------------------------ |
| `VITE_API_URL` | `/api`                               |

[`vercel.json`](./vercel.json) already sets the build command, the output directory, the SPA rewrite and an `/api/*` proxy to the API, so client-side routes such as `/blog/<id>` resolve on a hard refresh and API calls leave from a single origin.

> 💡 **Why the API is proxied instead of called directly:** a `*.vercel.app` frontend and a `*.onrender.com` API are different *sites*, so every request is third-party. Chrome drops third-party cookies in Incognito and under most privacy settings, which silently breaks the `httpOnly` auth cookies — login appears to succeed and the next protected request is a 401. Proxying `/api/*` through Vercel keeps the cookies first-party on the `*.vercel.app` host, so the session survives in every browser without owning a domain.

For a container deployment, the included multi-stage `Dockerfile` builds the bundle and serves it from nginx:

```bash
# Build, pointing the bundle at your API
docker build -t blog-client --build-arg VITE_API_URL=https://blog-api.onrender.com .

# Run on port 80
docker run -d -p 80:80 blog-client
```

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="Light Bulb" width="25" height="25" /> Notes

- `src/context/auth-context.ts` holds the context object and `useAuth`, while `auth-provider.tsx` holds the component. They are separate so Fast Refresh works correctly in development.
- `localStorage.isLoggedIn` is a UI hint only. The real session lives in an `httpOnly` cookie, so every page load re-confirms it against the API.
- Comment and post counts come from the API. Nothing in the UI invents engagement numbers.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Envelope%20Letters.png" alt="Envelope" width="25" height="25" /> Contact

For any questions or feedback, feel free to contact:  
**Ozan Demircan** – [ozandmrcn47@gmail.com](mailto:ozandmrcn47@gmail.com)
