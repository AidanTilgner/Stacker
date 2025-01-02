# Lightning
This template is designed for building user interfaces for backend functions, fast. Nothing else, it's just a simple way to add a web interface to a set of backend functions. This is designed for extremely lightweight application development, and nothing else.

## Use-Cases
Some use-cases for Lightning template include:
- Local-only tools
- Proofs of Concept

## Stack
The Lightning template uses the following technologies:
- **React**: [docs](https://react.dev) | because it's what I'm used to and it's popular
- **Express.js**: [docs](https://expressjs.com) | because it's simple, well-supported, and fast
- **Bun Sqlite**: [docs](https://bun.sh/docs/api/sqlite) | because it's a simple set of utilities over Sqlite3
- **Mantine.js**: [docs](https://mantine.dev) | because this avoids having to define most components from scratch
- **React-Router 7**: [docs](https://reactrouter.com/home) | because it just works
- **Phosphor Icons**: [docs](https://github.com/phosphor-icons/react) | because it's a great icon lib

Essentially what we have here is a React frontend, which uses React-Router's `BrowserRouter` and Mantine.js's component library for rapid frontend iteration. On the backend we have an Express.js app, which has an integration with a Sqlite3 database through `bun:sqlite`.

## Startup
Make sure you have `degit` installed ([instructions here](https://github.com/Rich-Harris/degit)).

1. Clone this template: `degit AidanTilgner/Temple/templates/lightning`
2. Install dependencies: `bun install`
3. Modify `package.json` with your name: `name: "new project"`
4. Copy the `.env.example` to a new file called `.env`, fill in the variables
5. Start building! The `client/index.ts` and `index.ts` files are the entrypoints.
6. Run `bun run dev` to start the project in development mode
7. Run `bun run build`, then `bun run start` to start the project, make sure to set the `NODE_ENV` to production
