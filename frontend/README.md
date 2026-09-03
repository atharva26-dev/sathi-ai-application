# SAATHI (साथी) - Frontend Application
### Rural Business Intelligence, Financial Guidance & Mentorship Assistant

The frontend is a Progressive Web Application (PWA) built with React 18, TypeScript, and Vite, featuring voice-first interaction, offline caching, and Marathi/Hindi/English localization.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will start on `http://127.0.0.1:3000/`.

### 3. Build for Production
```bash
npm run build
```
Generates the optimized static build in `dist/`.

---

## Directory Layout

```
frontend/
├── public/                # Static assets, PWA manifest, service worker
│   ├── logo.svg
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/        # Reusable accessible UI components
│   ├── context/           # React context providers (Language, User, Voice, Offline, Accessibility)
│   ├── locales/           # Multilingual dictionaries (Marathi, Hindi, English)
│   ├── screens/           # 22 interactive business, finance & mentorship screens
│   ├── services/          # Data contracts and API service layer
│   ├── types/             # TypeScript domain interfaces
│   ├── App.tsx            # Master router and bottom navigation coordinator
│   ├── index.css          # Design system, tokens, typography & animations
│   └── main.tsx           # Root entry point with context providers
├── .env.example           # Environment template
├── index.html             # Base HTML template with Google Fonts
├── package.json           # Scripts & dependencies
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite build configuration
```
