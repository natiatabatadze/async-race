# Async Race

**Deployed:** https://async-race-pink.vercel.app

**Self-assessed score:** 300 / 300 _(functional & non-functional checklist)_
**Overall Code Quality:** up to 100 pts — assigned separately by the reviewer

## About

Single-page application for managing a collection of remote-controlled cars, operating their engines, and tracking race statistics. Built with Angular 18 using standalone components and signal-based state management.

## Stack

- Angular 18 (standalone components, signals)
- TypeScript (strict mode)
- RxJS
- ESLint (Airbnb) + Prettier

## Running locally

This is the **frontend only**. The mock server must be running locally for the app to work.

```bash
# 1. Clone and start the mock server (in a separate terminal)
#    https://github.com/mikhama/async-race-api
git clone https://github.com/mikhama/async-race-api
cd async-race-api
npm install
npm start          # runs on http://localhost:3000

# 2. In this project:
npm install
npm run dev        # runs on http://localhost:4200
```

> The deployed build expects the backend at `http://localhost:3000`. Without a running
> server the UI loads but the car list stays empty — this is expected.

## Scripts

| Script              | Purpose                           |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start dev server                  |
| `npm run build`     | Production build                  |
| `npm run lint`      | ESLint check (`--max-warnings 0`) |
| `npm run format`    | Prettier auto-format              |
| `npm run ci:format` | Prettier check (CI)               |

## Architecture

```
src/app/
├── core/
│   ├── services/      # API layer (garage, engine, winners)
│   ├── models/        # Car, Winner, EngineResponse, CarRaceState
│   ├── constants/     # endpoints, page sizes, validation, car names
│   └── utils/         # random name / color helpers
├── features/
│   ├── garage/        # garage view, garage store, race store
│   └── winners/       # winners view, winners store
└── shared/
    └── components/    # car icon, spinner
```

State lives in singleton signal stores (`providedIn: 'root'`), which keeps view state
persistent across navigation. The API, UI, and state layers are kept separate.

---

## Checklist — 300 / 300 pts

> Overall Code Quality (up to 100 pts) is assigned by the reviewer and excluded from this self-check.

### 🚀 UI Deployment

- [x] **Deployment Platform:** Deployed on Vercel — https://async-race-pink.vercel.app

### ✅ Requirements to Commits and Repository

- [x] **Commit guidelines compliance:** Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`)
- [x] **Checklist included in README.md**
- [x] **Score calculation**
- [x] **UI Deployment link in README.md**

### Basic Structure — 80 / 80

- [x] **Two Views (10):** "Garage" and "Winners" with Angular Router and lazy loading
- [x] **Garage View Content (30):** View name, car create/edit panel, race control panel, garage section
- [x] **Winners View Content (10):** View name, winners table, pagination
- [x] **Persistent State (30):** Page number, sort state, and form inputs preserved across view switches (singleton signal stores)

### Garage View — 90 / 90

- [x] **CRUD Operations (20):** Create, update, delete; empty names blocked, max length enforced; deleted cars removed from winners too
- [x] **Color Selection (10):** RGB color picker with live preview on the car SVG
- [x] **Random Car Creation (20):** "Generate 100" — names from 12 brands × 12 models, random hex colors
- [x] **Car Management Buttons (10):** "Select" and "Remove" per car
- [x] **Pagination (10):** 7 cars per page
- [x] **Empty Garage (10):** Friendly message when garage is empty
- [x] **Empty Garage Page (10):** Removing the last car on a page navigates back

### 🏆 Winners View — 50 / 50

- [x] **Display Winners (15):** Winners saved/updated after each race and shown in the table
- [x] **Pagination (10):** 10 winners per page
- [x] **Winners Table (15):** №, car icon, name, wins, best time; wins increment, best time kept only if lower
- [x] **Sorting (10):** Clickable "Wins" / "Best Time" headers with ASC/DESC toggle (server-side)

### 🚗 Race — 170 / 170

- [x] **Start Engine Animation (20):** Velocity request → animate → drive request; a 500 error freezes the car at its elapsed position
- [x] **Stop Engine Animation (20):** Stop request → car returns to start
- [x] **Responsive Animation (30):** Adapts down to 500px
- [x] **Start Race Button (10):** Starts all cars on the current page (synchronized via `forkJoin`)
- [x] **Reset Race Button (15):** Returns all cars to start and stops engines
- [x] **Winner Announcement (5):** Modal with the winner's car, name, and time
- [x] **Button States (20):** Engine A disabled while driving/broken; engine B disabled while idle
- [x] **Actions during the race (50):** During a race, single-car engine buttons (A/B), management buttons (Select, Remove), Create, Generate, pagination, and navigation to Winners are all disabled. The race runs until a winner is found or it is reset.

### 🎨 Prettier and ESLint — 10 / 10

- [x] **Prettier Setup (5):** `.prettierrc`; `format` (auto-fix) and `ci:format` (check) scripts
- [x] **ESLint Configuration (5):** ESLint 9 + Airbnb style guide, `lint` with `--max-warnings 0`, TypeScript strict mode

### 🌟 Overall Code Quality — _reviewer-assigned (up to 100)_

- Modular structure: `core/` (services, models, constants, utils), `features/` (garage, winners), `shared/` (components)
- Signal-based state in singleton stores; clear separation of API, UI, and state layers
- Small, single-purpose functions; magic numbers and strings extracted to constants