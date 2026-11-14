# KAVACH

AI-powered construction material inventory system: a web app for Project Admins and Store Managers, a mobile app for Store Managers, an API, and a background worker that reads scanned invoices.

This guide gets the project running on your own computer for development and testing. For a real server, follow `docs/DEPLOYMENT.md` instead.

---

## Start here: see the app working (beginner guide, Windows)

New to this? Follow these steps in order and copy each command exactly. This takes about 5 minutes when the project has been set up before (the `node_modules` folder and the `.env` file already exist). If they don't, do [section 2 (first-time setup)](#2-first-time-setup) once, then come back here.

### What you will end up with

KAVACH is made of parts that must **all be running at the same time**:

```
 Your browser  ──►  Web app (port 3000)  ──►  API (port 3001)  ──►  Database (PostgreSQL)
```

If any one of them is not running, you will see a blank page, an error, or a login that never works. The most common cause: **the database stops every time you restart your computer** and has to be started again (step 2).

### Step 1. Open a terminal in the project folder

1. Open File Explorer and go to the project folder (for example `E:\Kavach`).
2. Click the address bar, type `powershell`, and press **Enter**. A blue or black window opens. That is the terminal.
3. Check that Node.js 22 is active:
   ```powershell
   node -v
   ```
   It must print `v22.something`. If it prints anything else (like `v25.0.0`), run `nvm use 22.23.5` in a terminal opened **as Administrator** (right-click PowerShell, *Run as administrator*), then close it and open a normal terminal again.

### Step 2. Start the database

Use **one** of these, depending on how your database was set up.

**A. The project's own database in the `.local\pg` folder** (when `DATABASE_URL` in `.env` uses port `5433`):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D .local\pg -l .local\pg\pg.log -o "-p 5433" start
```

It prints `server started`. If it says *another server might be running*, that is fine: it was already on.

**B. Docker** (Docker Desktop must be open first):

```powershell
pnpm infra:up
```

Check that the database answers (use `5432` instead of `5433` for Docker):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h localhost -p 5433
```

You want to see `accepting connections`.

### Step 3. Prepare the database (safe to repeat)

```powershell
pnpm db:deploy
pnpm db:seed
```

The second command ends with a list of **demo logins**. If you see it, the database is ready.

### Step 4. Start the app

```powershell
pnpm dev
```

Lots of text scrolls by. **Leave this window open**: closing it, or pressing **Ctrl + C**, stops the app. Wait until you see lines like:

```
api listening on http://localhost:3001
✓ Ready in ...
```

The first start can take a minute.

### Step 5. Open it in your browser

1. First check the API: open http://localhost:3001/health. You should see `{"status":"ok","service":"api"}`.
2. Now open **http://localhost:3000**. You should see the KAVACH sign-in page.
3. Sign in with:
   - Login: `admin@kavach.local`
   - Password: `Kavach@123`

You are in. Try also `store@kavach.local` (same password) to see what a Store Manager sees. All demo accounts are listed in [section 4](#4-sign-in-with-the-demo-accounts).

### Every next time (after restarting your computer)

Only three things:

1. Open a terminal in the project folder (step 1).
2. Start the database (step 2).
3. Run `pnpm dev` (step 4) and open http://localhost:3000.

### It doesn't work?

| What you see | What it means and what to do |
|---|---|
| Browser says *This site can't be reached* on `localhost:3000` | The app is not running. Run `pnpm dev` and wait for `Ready`. Keep that window open. |
| Sign-in page opens, but signing in fails or spins forever | The API is not running or crashed. Open http://localhost:3001/health. If it doesn't show `ok`, scroll up in the `pnpm dev` window and look for a red error. |
| `Can't reach database server` in the terminal | The database is not running. Do step 2 again. |
| `Unsupported engine` or *wanted node >=22.12 <23* | Wrong Node.js version. See step 1. |
| `pnpm` is not recognized | Install it once: `npm install -g pnpm@12`, then open a new terminal. |
| `JWT_SECRET must be set` | Your `.env` file is missing or incomplete. See [section 2.2](#22-create-your-env-file). |
| `The table ... does not exist` | Run `pnpm db:deploy`. |
| *Port 3000 (or 3001) is already in use* | The app is already running in another terminal window. Use that one, or close it first. |

More problems and fixes are in [section 9](#9-troubleshooting). The rest of this README is the full reference.

---

## Contents

1. [What you need](#1-what-you-need)
2. [First-time setup](#2-first-time-setup)
3. [Run the project](#3-run-the-project)
4. [Sign in with the demo accounts](#4-sign-in-with-the-demo-accounts)
5. [Run one app at a time](#5-run-one-app-at-a-time)
6. [Run the mobile app on a phone](#6-run-the-mobile-app-on-a-phone)
7. [Run the tests and checks](#7-run-the-tests-and-checks)
8. [Other useful commands](#8-other-useful-commands)
9. [Troubleshooting](#9-troubleshooting)
10. [Where to read more](#10-where-to-read-more)

---

## 1. What you need

| Tool | Version | Notes |
|---|---|---|
| Node.js | **22 LTS only** | The repo refuses any other major version. With nvm: `nvm install 22` then `nvm use 22`. |
| pnpm | 12 | `npm install -g pnpm@12` |
| PostgreSQL | 15 or later | Either Docker (easiest) or a PostgreSQL you install yourself. |
| Docker Desktop | optional | Starts PostgreSQL, Redis and MinIO in one command. |
| Expo Go app | optional | On your phone, only if you want to try the mobile app. |

Redis, MinIO (S3 storage) and an OpenAI key are **not** needed to run the project locally. See [section 2.4](#24-ai-reading-of-invoices-optional).

Check your versions:

```sh
node -v     # must print v22.x.x
pnpm -v     # must print 12.x.x
```

## 2. First-time setup

Run every command from the repository folder (the folder that contains this README).

### 2.1 Install the dependencies

```sh
pnpm install
```

### 2.2 Create your `.env` file

Copy the example file:

```sh
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Open `.env` and set **`JWT_SECRET`** to any random text of at least 32 characters. The API will not start without it. To generate one:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Leave everything else as it is for now.

### 2.3 Start the database

**Option A: with Docker (recommended)**

```sh
pnpm infra:up
```

This starts PostgreSQL on port 5432, plus Redis and MinIO, which the default settings do not use. Stop them later with `pnpm infra:down`.

> If port 5432 is already taken by another PostgreSQL on your computer, set `POSTGRES_PORT=5433` in `.env` and change the port in `DATABASE_URL` to `5433` too.

**Option B: with your own PostgreSQL**

Create a user and a database, then put the connection string in `DATABASE_URL` in `.env`:

```sql
CREATE USER kavach WITH PASSWORD 'kavach' CREATEDB;
CREATE DATABASE kavach OWNER kavach;
```

```
DATABASE_URL=postgresql://kavach:kavach@localhost:5432/kavach?schema=public
```

`CREATEDB` is needed only for the automated tests, which create and delete a temporary database.

### 2.4 AI reading of invoices (optional)

You can leave this alone. Without any AI settings, uploaded invoices fail with a clear message and you type the lines by hand. Everything else works.

| You want | Set in `.env` |
|---|---|
| Try the scanning flow **offline, for free**, with the sample documents in `test-docs/` | `AI_PROVIDER=fixture` |
| Read real documents with OpenAI (costs money) | `OPENAI_API_KEY=...` |

> **Do not send real supplier invoices to OpenAI** until the owner has answered decision Q29 in `docs/DECISIONS.md`.

### 2.5 Create the tables and the demo data

```sh
pnpm db:deploy     # creates all the tables
pnpm db:seed       # two demo projects, users, stores and materials
```

`pnpm db:seed` prints the demo logins at the end. It can be run again safely: projects that already exist are skipped.

Setup is done. You only repeat these steps after pulling changes that add migrations (`pnpm db:deploy`) or dependencies (`pnpm install`).

## 3. Run the project

```sh
pnpm dev
```

This starts everything together:

| App | Address | What it is |
|---|---|---|
| Web app | http://localhost:3000 | Open this in your browser |
| API | http://localhost:3001 | Used by the web and mobile apps. Check it at http://localhost:3001/health |
| Worker | (no address) | Reads uploaded invoices in the background |
| Mobile (Expo) | shows a QR code in the terminal | See [section 6](#6-run-the-mobile-app-on-a-phone) |

Stop everything with **Ctrl + C**.

## 4. Sign in with the demo accounts

Open http://localhost:3000. The password for every demo account is **`Kavach@123`**.

| Project | Role | Login (e-mail or mobile) |
|---|---|---|
| SKY | Project Admin | `admin@kavach.local` |
| SKY | Store Manager (one store) | `store@kavach.local` or `9000000001` |
| SKY | Store Manager (two stores) | `store2@kavach.local` or `9000000002` |
| GRN | Project Admin | `admin2@kavach.local` |
| GRN | Store Manager | `store.grn@kavach.local` |

Try the same task as an admin and as a Store Manager to see the difference in what each role can do. The `docs/USER_GUIDE.md` explains every screen.

> After 10 wrong passwords from the same computer, signing in is blocked there for 15 minutes.

## 5. Run one app at a time

Useful when you work on one part only. Each command runs in its own terminal.

```sh
pnpm --filter @kavach/api dev       # API on :3001 (restarts when you save a file)
pnpm --filter @kavach/web dev       # web on :3000
pnpm --filter @kavach/worker dev    # background worker
pnpm --filter @kavach/mobile dev    # Expo, for the mobile app
```

The web and mobile apps need the API running. The worker is only needed for scanned invoices.

### Run the production build locally

```sh
pnpm build
pnpm --filter @kavach/api start
pnpm --filter @kavach/worker start
pnpm --filter @kavach/web start
```

## 6. Run the mobile app on a phone

1. Install **Expo Go** on your phone. The phone and the computer must be on the **same Wi-Fi**.
2. Find your computer's local IP address (Windows: `ipconfig`, macOS: `ipconfig getifaddr en0`, Linux: `hostname -I`), for example `192.168.1.20`.
3. In `.env`, set the API address the phone will use:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.20:3001
   ```
   A phone cannot reach `localhost`; that means the phone itself.
4. Start the API (`pnpm --filter @kavach/api dev`) and then Expo (`pnpm --filter @kavach/mobile dev`).
5. Scan the QR code shown in the terminal with the phone's camera (iPhone) or with Expo Go (Android).
6. Sign in as a Store Manager, for example `store@kavach.local` / `Kavach@123`.

If the phone cannot connect, allow port 3001 through the computer's firewall.

> The mobile app has not yet been tested on a real device. Some features (camera, sharing report files) may need a development build instead of Expo Go.

## 7. Run the tests and checks

The tests need PostgreSQL running (they create and delete their own temporary database, so your data is safe).

```sh
pnpm test         # all tests
pnpm typecheck    # type errors
pnpm lint         # code style rules
pnpm depcruise    # module boundaries
pnpm build        # production build
```

A change is finished only when all five pass.

Run the tests of one app, or one test file:

```sh
pnpm --filter @kavach/api test
pnpm --filter @kavach/api exec vitest run test/reports.spec.ts
pnpm --filter @kavach/mobile exec jest src/App.test.tsx
```

## 8. Other useful commands

| Command | What it does |
|---|---|
| `pnpm project:create -- --code ABC --name "My Site" --admin-name "Name" --admin-email me@example.com --admin-password "Initial#123"` | Creates a new project and its first admin (who must change the password at first login) |
| `pnpm user:reset-password -- --login me@example.com --password "New#Pass123"` | Resets the password of a user who works on several projects |
| `pnpm user:add-member -- --login me@example.com --project ABC --role STORE_MANAGER --stores MAIN` | Adds an existing user to another project |
| `pnpm ops:check` | Health check: stock balances against the ledger, stuck documents (run `pnpm build` first) |
| `pnpm db:migrate` | Creates a new migration after you change `packages/db/prisma/schema.prisma` |
| `pnpm --filter @kavach/db studio` | Opens Prisma Studio to browse the database |
| `pnpm --filter @kavach/worker eval -- --provider fixture` | Runs the AI accuracy check offline on the sample documents |
| `pnpm format` | Formats the code with Prettier |

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `pnpm install` says the Node version is not supported | You are not on Node 22. Run `nvm use 22` and try again. |
| API stops with `JWT_SECRET must be set to at least 32 characters` | Set `JWT_SECRET` in `.env` (section 2.2). |
| `Can't reach database server` | PostgreSQL is not running, or `DATABASE_URL` in `.env` has the wrong port or password. |
| `The table ... does not exist` | Run `pnpm db:deploy`. |
| Imports of `@kavach/shared` or `@kavach/db` fail | Run `pnpm build` once; those packages are used from their built output. |
| Windows: `EPERM ... query_engine-windows.dll.node` during build or tests | An API or worker is still running and holds the Prisma file. Stop it (Ctrl + C) and run again. |
| Uploaded invoice shows "AI reading is not set up" | Expected without an AI key. Set `AI_PROVIDER=fixture` to try the flow with the sample documents, or type the lines by hand. |
| Login blocked: "Too many failed attempts" | Wait 15 minutes, or sign in from another computer. |
| Port 3000 or 3001 already in use | Stop the other program, or change `API_PORT` in `.env` (and `NEXT_PUBLIC_API_URL` to match). |

## 10. Where to read more

| Document | For |
|---|---|
| `docs/USER_GUIDE.md` | How to use every screen, for Project Admins and Store Managers |
| `docs/DEPLOYMENT.md` | Putting KAVACH on a real server |
| `docs/BACKUP_RESTORE.md` | Backups and how to restore them |
| `docs/FINAL_VERIFICATION.md` | What has been tested and what still has to be |
| `docs/PROGRESS.md` | What is built, what is next, known issues |
| `docs/PRD.md` | The product requirements |
| `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` | How it is built and why |
| `docs/CLAUDE.md` | Rules and commands for developers |
