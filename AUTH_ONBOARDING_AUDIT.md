# SAATHI — AUTHENTICATION & ONBOARDING FORENSIC AUDIT
**Phase 1 — Architectural, Functional, State & Security Forensic Audit**  
**Status**: READ-ONLY AUDIT COMPLETE — NO SOURCE CODE MODIFIED  
**Date**: September 2026  
**Auditor**: Senior Principal Frontend & Authentication Architect, Supabase Architect, UX & QA Engineering  

---

## EXECUTIVE SUMMARY

A deep architectural forensic audit was conducted across the entire SAATHI codebase (both frontend and backend) to determine why different login/onboarding experiences appear between Mobile and Laptop environments and to diagnose all state, routing, data, and session collisions.

### Key Forensic Findings:
1. **Two Competing Onboarding Flows Exist in the Repository**:
   - **Flow A (`AuthScreen.tsx` @ `/auth`)**: A newly created dual-tab screen ("Login" with Mobile + 4-digit PIN, and "Register" with Full Name, Mobile, PIN, Village, District, Desired Business, and Own Capital).
   - **Flow B (`VoiceOnboardingFlow.tsx` @ `/onboarding`)**: A pre-existing 7-step voice-guided interactive onboarding wizard with TTS speech synthesis prompts, Web Speech API speech-to-text recognition, and individual steps for Name, Age & Mobile, Village & Block, Own Capital, Business Idea, Assets, and Confirmation.

2. **Root Cause of Mobile vs Laptop Discrepancy**:
   - **There is NO device-specific branching in the code** (0 occurrences of `isMobile`, `window.innerWidth`, `userAgent`, or responsive media queries gating auth).
   - **Mobile (Fresh/Incognito State)**: On mobile browsers or unauthenticated sessions with empty `localStorage`, the user passes through `LanguageSelectScreen` (`/language`), then `AuthScreen` (`/auth`), and then—due to a **React state closure bug in `App.tsx` (line 122)** where `profile.isOnboarded` evaluates to `false` from stale closure—is **immediately redirected into `VoiceOnboardingFlow` (`/onboarding`)**. Thus, Mobile users experience **TWO redundant, competing onboarding flows in sequence**.
   - **Laptop (Cached/Persisted State)**: Laptop browsers had pre-existing `localStorage` keys (`saathi_app_saathi_auth_session` with valid `expiresAt` or `saathi_app_user_profile` with `isOnboarded: true` from prior testing or demo mode). On load, `App.tsx` (lines 42–50) detected `isAuthenticated === true` and `profile.isOnboarded === true`, bypassing `AuthScreen` directly to `/home`. Additionally, the PWA Service Worker (`public/sw.js` with `CACHE_NAME = 'saathi-cache-v1'`) utilized a Stale-While-Revalidate pattern caching older bundle files on laptop browsers.

3. **Data Field Collisions**:
   - Multiple divergent naming conventions exist across layers (`name` vs `fullName` vs `full_name`; `ownCapital` vs `availableCapital` vs `capital_available` vs `own_equity`; `age` [number] vs `ageRange` / `age_range` [string enum]).

---

## PART 1 — COMPLETE REPOSITORY AUTH / LOGIN / ONBOARDING FILE INVENTORY

Every file, component, service, route, hook, context provider, storage key, and database schema involved in authentication and onboarding has been mapped:

### 1.1 Frontend Files & Components
| File Path | Role / Description | Primary Exports / Code Symbols |
| :--- | :--- | :--- |
| [`frontend/src/App.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/App.tsx) | Central Client Router & Auth Gate Coordinator | `App`, `currentRoute`, `activeTab`, `navigateTo` |
| [`frontend/src/main.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/main.tsx) | App Bootstrap & Provider Tree Hierarchy | `ReactDOM.createRoot`, `ServiceWorker` registration |
| [`frontend/src/screens/AuthScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/AuthScreen.tsx) | **Flow A**: Mobile + 4-Digit PIN Login & Registration Form | `AuthScreen`, `handleLogin`, `handleRegister` |
| [`frontend/src/screens/VoiceOnboardingFlow.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/VoiceOnboardingFlow.tsx) | **Flow B**: 7-Step Voice-First Interactive Onboarding Wizard | `VoiceOnboardingFlow`, `currentStepIndex`, `handleNext`, `handleFinish` |
| [`frontend/src/screens/LanguageSelectScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/LanguageSelectScreen.tsx) | 23-Language Initial Gateway & Switcher | `LanguageSelectScreen`, `handleSelect` |
| [`frontend/src/screens/ProfileScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/ProfileScreen.tsx) | In-App Profile Management & Reset Trigger | `ProfileScreen`, `handleSave`, `loadDemoMode`, `resetAllData` |
| [`frontend/src/screens/HomeScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/HomeScreen.tsx) | Post-Onboarding Dashboard & Voice Trigger | `HomeScreen` |
| [`frontend/src/context/AuthContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/AuthContext.tsx) | Auth Session, Login, Register, Logout State | `AuthProvider`, `useAuth`, `AuthSession`, `login`, `register`, `logout` |
| [`frontend/src/context/UserContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/UserContext.tsx) | User Profile State & Onboarding Completion | `UserProvider`, `useUser`, `updateProfile`, `completeOnboarding`, `resetAllData` |
| [`frontend/src/context/LanguageContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/LanguageContext.tsx) | Selected Language Code & Dictionary Loader | `LanguageProvider`, `useLanguage`, `setLanguage`, `t` |
| [`frontend/src/context/VoiceContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/VoiceContext.tsx) | Web Speech API STT & Synthesis TTS Engine | `VoiceProvider`, `useVoice`, `startListening`, `stopListening`, `speak` |
| [`frontend/src/context/AccessibilityContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/AccessibilityContext.tsx) | Font Scaling & Contrast Settings | `AccessibilityProvider`, `useAccessibility` |
| [`frontend/src/context/OfflineContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/OfflineContext.tsx) | Network Status & Offline Queue Sync | `OfflineProvider`, `useOffline`, `triggerManualSync` |
| [`frontend/src/services/storageService.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/storageService.ts) | LocalStorage Abstraction (Prefix: `saathi_app_`) | `storageService.get`, `storageService.set`, `storageService.remove` |
| [`frontend/src/services/profileService.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/profileService.ts) | Local Profile Store with Demo Profile | `profileService.getProfile`, `saveProfile`, `loadDemoProfile`, `resetProfile` |
| [`frontend/src/services/syncService.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/services/syncService.ts) | Offline Action Queue Persistence | `syncService.getQueue`, `syncService.enqueue` |
| [`frontend/src/types/index.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/types/index.ts) | TypeScript Models & Interfaces | `UserProfile`, `LanguageCode`, `DataTrustInfo` |
| [`frontend/src/locales/index.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/index.ts) | Locales Index & Supported Languages Registry | `translations`, `supportedLanguages`, `getTranslation` |
| [`frontend/src/locales/types.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/types.ts) | Translation Key Schema Definitions | `TranslationSchema` |
| [`frontend/src/locales/mr.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/mr.ts) | Marathi Dictionary | `mr` |
| [`frontend/src/locales/hi.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/hi.ts) | Hindi Dictionary | `hi` |
| [`frontend/src/locales/en.ts`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/en.ts) | English Dictionary | `en` |
| [`frontend/public/sw.js`](file:///c:/Users/Dell/Documents/sathi/frontend/public/sw.js) | Service Worker (PWA Static Caching) | `saathi-cache-v1`, `fetch` interceptor |
| [`frontend/public/manifest.json`](file:///c:/Users/Dell/Documents/sathi/frontend/public/manifest.json) | Web App Manifest | `standalone`, `start_url: "/"` |

### 1.2 Backend Files & Routes
| File Path | Role / Description | Primary Exports / Code Symbols |
| :--- | :--- | :--- |
| [`backend/src/routes/authRoutes.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/routes/authRoutes.ts) | Auth API Endpoints (`/auth/register`, `/auth/login`, `/auth/me`) | `authRoutes`, `registerSchema`, `loginSchema` |
| [`backend/src/routes/profileRoutes.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/routes/profileRoutes.ts) | Profile Endpoints (`/profile`, `/profile/onboard`) | `profileRoutes`, `onboardSchema` |
| [`backend/src/services/authService.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/services/authService.ts) | Backend Auth Logic, Token Generation, Supabase Upsert | `authService.register`, `authService.login`, `authService.validateToken` |
| [`backend/src/services/profileService.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/services/profileService.ts) | Supabase Profile Data Aggregator & Fallback | `profileService.getProfile`, `profileService.updateProfile` |
| [`backend/src/middleware/auth.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/middleware/auth.ts) | Supabase JWT & Demo Header Verification | `requireAuth`, `optionalAuth` |
| [`backend/src/config/supabase.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/config/supabase.ts) | Supabase Admin Client Initialization | `supabaseAdmin`, `createScopedSupabaseClient` |
| [`backend/src/config/env.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/config/env.ts) | Environment Variable Schema & Defaults | `env.SUPABASE_URL`, `env.SUPABASE_SERVICE_ROLE_KEY` |
| [`backend/src/ai/context/activeUserContext.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/context/activeUserContext.ts) | AI Active User Context Factory | `ActiveUserContext`, `createDefaultActiveContext` |
| [`backend/src/ai/context/contextEngine.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/ai/context/contextEngine.ts) | AI Business Context Assembler | `ContextEngine`, `assembledBusinessContext` |

### 1.3 Database & Supabase Migrations
| File Path | Role / Description | Key Tables & Triggers |
| :--- | :--- | :--- |
| [`supabase/migrations/002_profiles.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/002_profiles.sql) | User Identities, Consents, Devices & Trigger | `public.profiles`, `public.user_consents`, `public.user_devices`, `handle_new_user()` |
| [`supabase/migrations/014_security.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/014_security.sql) | Row Level Security (RLS) & Storage Buckets | `public.profiles` RLS (`auth.uid() = id`), Storage Buckets (`profile_assets`, etc.) |
| [`supabase/full_schema.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/full_schema.sql) | Master Schema Definition | Combined schema entrypoint |

---

## PART 2 — AUTH FLOW MAP & ACTUAL EXECUTION PATH

```
Browser Opens Application (URL: /)
        ↓
index.html (loads /src/main.tsx, fonts, meta tags)
        ↓
main.tsx (registers /sw.js, renders provider tree)
        ↓
Providers Initialized:
  ├─ AuthProvider: Reads 'saathi_app_saathi_auth_session' from localStorage
  ├─ LanguageProvider: Reads 'saathi_app_preferred_language' (Default: 'mr')
  ├─ UserProvider: Reads 'saathi_app_user_profile' (Default: DEFAULT_PROFILE, isOnboarded: false)
  ├─ VoiceProvider: Initializes Web Speech API (lang: 'mr-IN')
  ├─ OfflineProvider: Attaches window online/offline listeners
  └─ AccessibilityProvider: Reads font scale & contrast flags
        ↓
App.tsx Evaluates Initial State:
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (!isAuthenticated) return '/language';
    if (!profile.isOnboarded) return '/onboarding';
    return '/home';
  });
        ↓
BRANCH 1: User is NOT Authenticated (session === null || session.expiresAt <= Date.now())
  │
  ├─ 1.1 currentRoute === '/language' (LanguageSelectScreen)
  │       ├─ Displays 23 Indian Languages with search & audio playback
  │       └─ User clicks "पुढे जा / Proceed":
  │            onLanguageConfirmed={() => 
  │              setCurrentRoute(isAuthenticated ? (profile.isOnboarded ? '/home' : '/onboarding') : '/auth')
  │            }
  │            ──> Transitions to currentRoute = '/auth'
  │
  ├─ 1.2 currentRoute === '/auth' (AuthScreen)
  │       ├─ Tab 1: "Login" (Mobile [10 digits] + 4-digit PIN)
  │       │    └─ Calls login(mobile, pin) in AuthContext.tsx
  │       │         ├─ Tries backend POST http://127.0.0.1:5000/api/v1/auth/login
  │       │         └─ Offline Fallback: Generates synthetic offline session & demo profile
  │       │
  │       └─ Tab 2: "Register" (Full Name, Mobile, PIN, Village, District, Capital, Business)
  │            └─ Calls register(...) in AuthContext.tsx
  │                 ├─ Tries backend POST http://127.0.0.1:5000/api/v1/auth/register
  │                 └─ Offline Fallback: Generates session, sets profile.isOnboarded = Boolean(business && village)
  │
  └─ 1.3 onAuthSuccess Callback in App.tsx (Line 121-127):
          onAuthSuccess={() => {
            if (!profile.isOnboarded) {
              setCurrentRoute('/onboarding');
            } else {
              setCurrentRoute('/home');
            }
          }}
          ────────────────────────────────────────────────────────────────
          CRITICAL STATE COLLISION:
          In App.tsx, `profile` in closure is still DEFAULT_PROFILE (isOnboarded: false).
          Even if register() returned isOnboarded: true, App.tsx redirects to '/onboarding'!
          ────────────────────────────────────────────────────────────────
        ↓
BRANCH 2: User Enters '/onboarding' (VoiceOnboardingFlow)
  │
  ├─ Step 0: Name Input (Voice STT + Text Input, Audio prompt spoken)
  ├─ Step 1: Age & Mobile Number
  ├─ Step 2: Location (Village & Block)
  ├─ Step 3: Available Own Capital (₹)
  ├─ Step 4: Proposed Business Idea (Text / Category Chips)
  ├─ Step 5: Available Assets (Land, Shed, Vehicle, Machinery)
  ├─ Step 6: Review & Confirmation Summary Card
  │
  └─ User clicks "प्रवास सुरू करा / Start Journey":
       Calls completeOnboarding(answers) in UserContext.tsx
       ──> Saves to 'saathi_app_user_profile' with isOnboarded: true
       ──> navigateTo('/home')
        ↓
BRANCH 3: User is Authenticated & Onboarded (isAuthenticated === true && profile.isOnboarded === true)
  │
  └─ Renders App Shell:
       ├─ Header (Dynamic title, font scaling, contrast, language modal trigger)
       ├─ OfflineBanner (Real-time network indicator)
       ├─ Active Screen Router (/home, /talk-saathi, /market-gap, /money-loan, etc.)
       ├─ BottomNav (Home, My Business, Central 🎙️ Voice Hero, Market, Money, Profile)
       ├─ VoiceRecorderModal (Global voice interface with quick prompts)
       └─ Quick Language Switcher Modal
```

---

## PART 3 — IDENTIFICATION OF DUPLICATE LOGIN & ONBOARDING EXPERIENCES

The repository contains four distinct user information entrypoints, creating severe UX fragmentation:

| Parameter | Experience 1: AuthScreen | Experience 2: VoiceOnboardingFlow | Experience 3: LanguageSelectScreen | Experience 4: ProfileScreen (In-App) |
| :--- | :--- | :--- | :--- | :--- |
| **1. File Path** | [`frontend/src/screens/AuthScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/AuthScreen.tsx) | [`frontend/src/screens/VoiceOnboardingFlow.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/VoiceOnboardingFlow.tsx) | [`frontend/src/screens/LanguageSelectScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/LanguageSelectScreen.tsx) | [`frontend/src/screens/ProfileScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/ProfileScreen.tsx) |
| **2. Component Name** | `AuthScreen` | `VoiceOnboardingFlow` | `LanguageSelectScreen` | `ProfileScreen` |
| **3. Route / Path** | `/auth` | `/onboarding` | `/language` | `/profile` |
| **4. Who Navigates to It** | `App.tsx` (Line 60, 110) | `App.tsx` (Line 47, 123), `ProfileScreen.tsx` (Line 239) | `App.tsx` (Line 44, 128), `Header.tsx` (Modal) | `BottomNav.tsx` (Tab click), `App.tsx` (Line 75) |
| **5. Trigger State** | `!isAuthenticated` | `isAuthenticated && !profile.isOnboarded` | Fresh visitor or `currentRoute === '/language'` | Tab selection `activeTab === 'profile'` |
| **6. Reachable Currently** | **YES** (Mandatory for unauthenticated users) | **YES** (Mandatory after `AuthScreen`) | **YES** (First screen loaded on fresh visit) | **YES** (Via bottom nav) |
| **7. Architecture Vintage** | **NEW** (Added auth layer with PIN) | **PRE-EXISTING** (Voice-first wizard) | **PRE-EXISTING** (Language gate) | **PRE-EXISTING** (Settings screen) |
| **8. Uses Supabase** | Yes (via backend `authService.ts`) | No (Direct to `UserContext` / `profileService`) | No | No (Direct to `UserContext`) |
| **9. Creates/Updates Profile** | Yes (Calls `updateProfile(res.profile)`) | Yes (Calls `completeOnboarding(answers)`) | No (Updates language only) | Yes (Calls `updateProfile(...)`) |
| **10. Collects Fields:** | | | | |
| • *Language* | Header button only | Reads from context | **YES** (Primary purpose) | Yes (Grid selector) |
| • *Name* | **YES** (Register tab: `fullName`) | **YES** (Step 0: `name`) | No | **YES** (`nameInput`) |
| • *Age* | **NO** | **YES** (Step 1: `age`) | No | **NO** |
| • *Mobile* | **YES** (Login & Register tab) | **YES** (Step 1: secondary `mobile`) | No | **NO** |
| • *Capital / Budget* | **YES** (Register tab: `ownCapital`) | **YES** (Step 3: `ownCapital`) | No | **YES** (`capitalInput`) |
| • *Location* | **YES** (`village`, `district`) | **YES** (`village`, `block`) | No | **YES** (`villageInput`, `blockInput`) |
| • *Business* | **YES** (`desiredBusiness`) | **YES** (`desiredBusiness` + chips) | No | **YES** (`businessInput`) |
| • *Assets* | **NO** | **YES** (Step 5: `availableAssets`) | No | **NO** |
| **11. Supports Voice** | **NO** (Typed inputs only) | **YES** (TTS speech + Web Speech STT) | Audio playback only | No |
| **12. Supports Typed Input**| **YES** | **YES** | Search bar only | **YES** |
| **13. Stores Locally** | Yes (`saathi_app_saathi_auth_session`) | Yes (`saathi_app_user_profile`) | Yes (`saathi_app_preferred_language`) | Yes (`saathi_app_user_profile`) |
| **14. Writes to Supabase** | Yes (via backend `authService.ts`) | No (Client-only unless synced) | No | No (Client-only unless synced) |
| **15. Conflicts With** | `VoiceOnboardingFlow` (re-asks identical data) | `AuthScreen` (redundant data collection) | None | `VoiceOnboardingFlow` (overwrites profile) |

---

## PART 4 — TRACE OF DEVICE DIFFERENCES (MOBILE VS LAPTOP)

A rigorous grep across all JavaScript/TypeScript files, HTML, and CSS was performed for:
`isMobile`, `mobile`, `desktop`, `window.innerWidth`, `matchMedia`, `userAgent`, `navigator.userAgent`, and `@media` queries.

### Forensic Findings on Device Discrepancies:
1. **Zero Device-Branching Logic in Application Code**:
   - There are **no conditional statements** branching on device type or viewport width in `App.tsx`, `AuthContext.tsx`, `UserContext.tsx`, or any screen component.
   - The CSS in [`frontend/src/index.css`](file:///c:/Users/Dell/Documents/sathi/frontend/src/index.css) has a single max-width container (`--max-content-width: 768px`) that centers the mobile container on laptop screens without altering component visibility.

2. **Why Mobile Produced Two Login Experiences in Sequence**:
   - On Mobile (typically tested in fresh tabs, incognito, or cleared mobile browsers), `localStorage` has no stored session (`saathi_app_saathi_auth_session` is `null`).
   - Sequence observed on Mobile:
     1. App starts at `/language` -> User selects language and clicks "Proceed".
     2. App navigates to `/auth` (`AuthScreen`). User registers with Name, Mobile, PIN, Village, Capital, Business.
     3. User submits form. `AuthContext.register()` returns `success: true`.
     4. `AuthScreen` triggers `onAuthSuccess()`.
     5. In `App.tsx` (lines 121–126), the `profile` object in React's current render closure has `profile.isOnboarded === false`.
     6. `App.tsx` immediately executes `setCurrentRoute('/onboarding')`.
     7. Mobile user is thrust into `VoiceOnboardingFlow` (`/onboarding`), forcing them to re-enter Name, Mobile, Village, Capital, and Business a second time.

3. **Why Laptop Produced Only the Older Experience**:
   - On Laptop, earlier development sessions had already stored:
     - `saathi_app_user_profile` with `isOnboarded: true` (e.g., from clicking "Load Demo" or earlier tests).
     - Or `saathi_app_saathi_auth_session` with an active expiration timestamp (`Date.now() + 30 days`).
   - When the app is opened on Laptop:
     - `App.tsx` initializes `currentRoute` as `'/home'` directly.
     - When testing from Profile (`/profile`) and clicking "Reset Data & Restart Onboarding", the app directly routed to `VoiceOnboardingFlow` (`/onboarding`), bypassing `AuthScreen` entirely.
   - **Service Worker Caching**: [`frontend/public/sw.js`](file:///c:/Users/Dell/Documents/sathi/frontend/public/sw.js) registers in production mode and aggressively caches `/src/main.tsx` and static assets under `saathi-cache-v1`. Laptop browsers with cached assets served the older version before `AuthScreen` was mounted.

---

## PART 5 — SUPABASE AUTHENTICATION AUDIT

### 5.1 Architecture & Identity Mapping
- **Unique Identifier**:
  - In PostgreSQL / Supabase Schema ([`supabase/migrations/002_profiles.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/002_profiles.sql)): The primary key of `public.profiles` is a `UUID` directly referencing `auth.users(id) ON DELETE CASCADE`.
  - In Backend API ([`backend/src/services/authService.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/services/authService.ts)): User IDs are generated as synthetic strings: `'usr_' + crypto.randomBytes(8).toString('hex')` or `'usr_' + md5(mobile).substring(0, 16)`.
- **Authentication Credentials**:
  - Frontend/Backend: Authentication is based on **10-digit Indian Mobile Number + 4-digit Security PIN**.
  - Supabase Auth: Built-in Supabase Auth expects Phone OTP (via Twilio/MessageBird in `config.toml`) or Email/Password.
- **Anonymous Authentication**:
  - Anonymous auth is not used in the database. In backend middleware ([`backend/src/middleware/auth.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/middleware/auth.ts)), unauthenticated requests through `optionalAuth` fall back to a default demo UUID (`'00000000-0000-0000-0000-000000000001'`).
- **Profile Table & Auto-Provisioning**:
  - Database Table: `public.profiles`.
  - Supabase Database Trigger: `on_auth_user_created` calls `public.handle_new_user()` on `AFTER INSERT ON auth.users` to automatically create a profile record with `full_name` and `preferred_language`.
- **Onboarding Completion Flag**:
  - Database: `profiles.is_onboarded BOOLEAN NOT NULL DEFAULT FALSE`.
  - Frontend: `profile.isOnboarded: boolean`.
- **Session & Token Disconnect**:
  - In [`backend/src/services/authService.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/services/authService.ts), tokens are generated as synthetic in-memory strings (`'stk_' + crypto.randomBytes(24).toString('hex')`).
  - In [`backend/src/middleware/auth.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/middleware/auth.ts), `requireAuth` calls `supabaseAdmin.auth.getUser(token)`. If `authService` issues synthetic `stk_...` tokens, `supabaseAdmin.auth.getUser(token)` fails unless offline mock handling or demo headers (`x-demo-user-id`) are present.
- **Logout Behavior**:
  - [`frontend/src/context/AuthContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/AuthContext.tsx) (line 175) removes `AUTH_SESSION_KEY` (`saathi_app_saathi_auth_session`).
  - It does NOT clear `saathi_app_user_profile`. As a result, subsequent logins or resets on the same device retain the previous user's profile in local storage.

---

## PART 6 — PROFILE / ONBOARDING DATA AUDIT & FIELD CONFLICT ANALYSIS

### 6.1 Canonical Onboarding Fields Trace
The 6 required canonical onboarding fields were traced across all layers of the application:

| Canonical Field | Collection Point | Client Storage Key | Database Column | AI / Backend Domain Symbol | Field Inconsistencies / Discrepancies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Language** | `LanguageSelectScreen`, `AuthScreen`, `ProfileScreen` | `saathi_app_preferred_language` | `profiles.preferred_language` (`public.language_code`) | `context.language` (`SupportedLanguage`) | **Consistent** across frontend and backend (`mr`, `hi`, `en`, etc.). |
| **2. Full Name** | `AuthScreen` (`fullName`), `VoiceOnboardingFlow` (`name`), `ProfileScreen` (`nameInput`) | `saathi_app_user_profile.name` | `profiles.full_name` (`TEXT`) | `ActiveUserContext.name`, `ProfileData.fullName` | **Naming Mismatch**: Frontend uses `name`, database uses `full_name`, backend DTOs use `fullName`. |
| **3. Age** | `VoiceOnboardingFlow` (Step 1: `age`), NOT in `AuthScreen` | `saathi_app_user_profile.age` (`number`) | `profiles.age_range` (`CHECK IN ('18-25', '26-35', '36-45', '46-60', '60+')`) | `ActiveUserContext.age` (`number`), `ProfileData.ageRange` (`string`) | **Type & Schema Mismatch**: Frontend collects numeric integer (`32`), database requires age range categorical string (`'26-35'`). Missing completely from `AuthScreen`. |
| **4. Mobile Number** | `AuthScreen` (`mobile`), `VoiceOnboardingFlow` (Step 1: `mobile`) | `saathi_app_user_profile.mobile` | `profiles.phone_metadata` (`JSONB`, masked) | `ActiveUserContext.mobile`, `RegisterDto.mobile` | **Representation Mismatch**: Plain 10-digit string on frontend, masked JSONB metadata in database. |
| **5. Available Own Capital** | `AuthScreen` (`ownCapital`), `VoiceOnboardingFlow` (Step 3: `ownCapital`), `ProfileScreen` (`capitalInput`) | `saathi_app_user_profile.ownCapital` (`number`) | `user_resources.capital_available` (`NUMERIC`), `financial_profiles.own_equity` | `ActiveUserContext.availableCapital`, `ContextEngine.financialBaseline.ownCapital` | **Multiple Conflicting Names**: `ownCapital` (Frontend), `capital_available` (DB resources), `own_equity` (DB finance), `availableCapital` (AI context), `capital` (tools). |
| **6. Business Location** | `AuthScreen` (`village`, `district`), `VoiceOnboardingFlow` (`village`, `block`), `ProfileScreen` (`village`, `block`) | `saathi_app_user_profile.village`, `.block`, `.district`, `.state` | `user_locations.custom_village`, `custom_block`, `custom_district`, `custom_state` | `ActiveUserContext.village`, `gramPanchayat`, `block`, `taluka`, `district`, `state` | **Fragmented Collection**: `AuthScreen` omits `block` and `state`; `VoiceOnboardingFlow` omits `district` and `state`; `ProfileScreen` omits `district` and `state`. |

---

## PART 7 — VOICE INPUT & SPEECH ENGINE AUDIT

### 7.1 Web Speech API Architecture
- **Speech Recognition (STT)**:
  - Implemented in [`frontend/src/context/VoiceContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/VoiceContext.tsx) via `window.SpeechRecognition || window.webkitSpeechRecognition`.
  - Non-continuous mode (`continuous = false`) with interim results enabled (`interimResults = true`).
  - Supported language binding:
    - Marathi (`'mr'`) -> `recognition.lang = 'mr-IN'`
    - Hindi (`'hi'`) -> `recognition.lang = 'hi-IN'`
    - English (`'en'`) -> `recognition.lang = 'en-IN'`
    - Other 20 Indian languages -> Fallback to `'en-IN'`.
- **Text-to-Speech (TTS Synthesis)**:
  - Implemented via `window.speechSynthesis` and `SpeechSynthesisUtterance`.
  - Pace: `utterance.rate = 0.92` (calibrated for clear rural listening).
  - Indian Voice Matching: Searches `window.speechSynthesis.getVoices()` for voices matching `-IN` or language prefix.

### 7.2 Voice Flow During Onboarding
- **In `VoiceOnboardingFlow.tsx`**:
  - Each step automatically speaks the question prompt via `speak(prompt, voiceLang)` after a 400ms delay.
  - Large microphone button allows voice response. The speech transcript actively updates `currentInputText`.
  - Every step provides a typed `<input>` or `<textarea>` fallback.
- **In `AuthScreen.tsx`**:
  - **No voice recognition or synthesis is integrated**. All fields require manual typing.

---

## PART 8 — MULTILINGUAL & LOCALIZATION FLOW AUDIT

### 8.1 Language Flow Pipeline
The target pipeline:
$$\text{Language Selection} \longrightarrow \text{UI Text} \longrightarrow \text{Voice STT/TTS} \longrightarrow \text{AI Context} \longrightarrow \text{Business Modules}$$

### 8.2 Audit of Current Implementation:
1. **Selection & Storage**:
   - `LanguageSelectScreen.tsx` sets `preferred_language` in `localStorage` and updates `document.documentElement.lang`.
2. **Translation Dictionaries**:
   - [`frontend/src/locales/`](file:///c:/Users/Dell/Documents/sathi/frontend/src/locales/):
     - Comprehensive translations exist for `mr` (Marathi), `hi` (Hindi), and `en` (English).
     - 20 additional Indian languages are registered in `supportedLanguages` and mapped to fallbacks (`bn: hi`, `ta: en`, `te: en`, `gu: hi`, `kok: mr`, etc.).
3. **Identified Inconsistencies & Hardcoded Strings**:
   - **`AuthScreen.tsx`**: Contains inline ternary operators for Marathi/English instead of referencing `t.auth.*` dictionary keys (lines 46, 50, 67, 109, 160, 177, 239, 370).
   - **`App.tsx`**: `getHeaderTitle()` hardcodes Marathi title strings in a `switch(currentRoute)` block (lines 149–191) rather than using localized translation keys.
   - **`VoiceRecorderModal.tsx`**: Quick prompts are hardcoded in Marathi (lines 316–319).

---

## PART 9 — COMPLETE APPLICATION ROUTE MAP

| Route Path | Component | Access Gate | Auth Required | Onboarding Required | Redirect Destination on Violation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/language` | `LanguageSelectScreen` | Public Gate | No | No | N/A (Proceeds to `/auth` or `/home`) |
| `/auth` | `AuthScreen` | Public Auth Gate | No | No | Redirects to `/onboarding` or `/home` on success |
| `/onboarding` | `VoiceOnboardingFlow` | Onboarding Gate | Yes | No | Redirects to `/home` on completion |
| `/home` | `HomeScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` if not authenticated |
| `/talk-saathi` | `TalkToSaathiScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/business-discovery` | `BusinessDiscoveryScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/local-market` | `LocalMarketScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/market-gap` | `MarketGapScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/competitors` | `CompetitorMappingScreen`| Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/feasibility` | `BusinessFeasibilityScreen`| Protected Shell| **Yes** | **Yes** | Redirects to `/auth` |
| `/swot` | `SWOTScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/stress-test` | `StressTestScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/simulator` | `BusinessSimulatorScreen`| Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/money-loan` | `FinancialManagerScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/budget` | `BudgetManagerScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/schemes` | `SchemeRouterScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/emi` | `LoanEducationScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/working-capital` | `WorkingCapitalScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/marketing` | `MarketingManagerScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/pricing` | `PricingStrategyScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/expansion` | `ExpansionPlannerScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/mentor` | `MentorRoadmapScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |
| `/profile` | `ProfileScreen` | Protected Shell | **Yes** | **Yes** | Redirects to `/auth` |

---

## PART 10 — AUTHENTICATION & ONBOARDING STATE MACHINE

### 10.1 State Machine Diagram
```
                     [ START: Browser Open ]
                                │
                                ▼
                       [ UNINITIALIZED ]
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
   [ !isAuthenticated ]                   [ isAuthenticated ]
             │                                     │
             ▼                                     ▼
   [ LANGUAGE_GATE ]                      [ CHECK_PROFILE ]
   (LanguageSelectScreen)                          │
             │                         ┌───────────┴───────────┐
             ▼                         ▼                       ▼
    [ AUTH_SCREEN_GATE ]     [ !profile.isOnboarded ]  [ profile.isOnboarded ]
      (AuthScreen: /auth)              │                       │
      ├─ Login Tab                     ▼                       ▼
      └─ Register Tab         [ VOICE_ONBOARDING ]       [ SAATHI_HOME ]
             │               (VoiceOnboardingFlow)        (HomeScreen)
             ▼                         │                       ▲
     [ AUTH_SUCCESS ]                  ▼                       │
             │             [ COMPLETE_ONBOARDING ] ────────────┘
             ▼                         │
   (State Closure Bug)                 ▼
   Forces to Onboarding ────> [ PROFILE_COMPLETE ]
```

### 10.2 Contradictory State Analysis
1. **Contradictory State 1 (Auth Success vs Closure Stale State)**:
   - When a new user registers via `AuthScreen`, `AuthContext.register()` sets `isOnboarded: true` in the returned profile.
   - However, `App.tsx` evaluates `if (!profile.isOnboarded)` from its un-updated closure and forces the user into `VoiceOnboardingFlow`, causing double-onboarding.
2. **Contradictory State 2 (Session Logout vs Profile Retention)**:
   - Calling `logout()` clears `saathi_auth_session` but leaves `user_profile` intact in `localStorage`.
   - If a new user subsequently logs in, the previous user's profile remains active in `UserContext` until explicitly overwritten.

---

## PART 11 — ROOT CAUSE ANALYSIS & SEVERITY RANKING

| Rank | Issue Summary | Code Evidence & Mechanism | Impact |
| :--- | :--- | :--- | :--- |
| **P0** | **Duplicate Competing Onboarding Screens** | `AuthScreen.tsx` and `VoiceOnboardingFlow.tsx` both exist and both collect Name, Mobile, Village, Capital, and Business. | User confusion, redundant data entry, UX fragmentation. |
| **P0** | **React Closure Bug Forcing Flow Collisions** | In [`frontend/src/App.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/App.tsx#L121-L127), `onAuthSuccess` inspects stale `profile.isOnboarded` closure instead of the newly returned profile. | Mobile / fresh users are always forced through both onboarding flows back-to-back. |
| **P1** | **Independent Local Storage Keys Without Sync** | `saathi_app_saathi_auth_session` and `saathi_app_user_profile` are managed separately in [`AuthContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/AuthContext.tsx) and [`UserContext.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/context/UserContext.tsx). | Stale profile persistence after session expiry or logout. |
| **P1** | **PWA Service Worker Aggressive Caching** | [`frontend/public/sw.js`](file:///c:/Users/Dell/Documents/sathi/frontend/public/sw.js) caches `/src/main.tsx` and static assets under `saathi-cache-v1`. | Laptop browsers with cached bundles serve previous UI builds. |
| **P2** | **Data Model Naming Discrepancies** | `name` vs `fullName` vs `full_name`; `ownCapital` vs `availableCapital`; `age` vs `age_range`. | Potential data drops during backend sync and AI context assembly. |
| **P3** | **Hardcoded Strings in Auth & Headers** | `AuthScreen.tsx` and `App.tsx` contain hardcoded Marathi/English strings. | Language switcher does not update 100% of auth header labels. |

---

## PART 12 — SECURITY & DATA INTEGRITY AUDIT

1. **Supabase Service Role Key Protection**:
   - `SUPABASE_SERVICE_ROLE_KEY` is **strictly restricted to the backend environment** ([`backend/src/config/env.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/config/env.ts)).
   - Frontend environment files ([`frontend/.env.example`](file:///c:/Users/Dell/Documents/sathi/frontend/.env.example)) only expose `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. **Row Level Security (RLS)**:
   - [`supabase/migrations/014_security.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/014_security.sql) enforces 100% RLS across all 34 tables with strict `auth.uid() = user_id` isolation.
3. **PII Masking**:
   - [`supabase/migrations/002_profiles.sql`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/002_profiles.sql) stores phone metadata as masked JSONB to prevent unencrypted PII leakage.
4. **Offline Auth Resilience**:
   - The application supports seamless offline graceful degradation when network connectivity to the backend or Supabase is unavailable.

---

## PART 13 — FINAL RECOMMENDATIONS & CONSOLIDATION ROADMAP

### 13.1 Files to be Consolidated (in Future Implementation Phase):
1. **Consolidate `AuthScreen.tsx` + `VoiceOnboardingFlow.tsx` into ONE Canonical Voice-First Onboarding Flow**:
   - Eliminate the duplicate typed form in `AuthScreen.tsx`.
   - Incorporate the 4-digit PIN security step into the voice-first onboarding journey.
2. **Unify `AuthContext.tsx` and `UserContext.tsx`**:
   - Synchronize `session` and `profile` updates atomically.
3. **Normalize Data Field Models**:
   - Standardize on canonical types: `fullName`, `mobile`, `pin`, `age` (number) -> `ageRange` (mapped enum), `ownCapital`, `village`, `block`, `district`, `state`, `desiredBusiness`, `availableAssets`.

### 13.2 Files that MUST NOT Be Touched / Preserved:
- All financial calculation engines ([`backend/src/domain/finance/`](file:///c:/Users/Dell/Documents/sathi/backend/src/domain/finance/)).
- Government scheme evaluator ([`backend/src/domain/schemes/schemeEvaluator.ts`](file:///c:/Users/Dell/Documents/sathi/backend/src/domain/schemes/schemeEvaluator.ts)).
- Market gap analysis engine ([`frontend/src/screens/MarketGapScreen.tsx`](file:///c:/Users/Dell/Documents/sathi/frontend/src/screens/MarketGapScreen.tsx), [`backend/src/domain/market/`](file:///c:/Users/Dell/Documents/sathi/backend/src/domain/market/)).
- All database migration schemas ([`supabase/migrations/`](file:///c:/Users/Dell/Documents/sathi/supabase/migrations/)).

---

# CANONICAL SAATHI LOGIN FLOW — PROPOSED, NOT IMPLEMENTED

> [!IMPORTANT]
> **PROPOSAL ONLY — NO CODE MODIFICATIONS APPLIED IN THIS AUDIT PHASE.**

The canonical, single, unified user journey for SAATHI will be:

```
                      1. LANGUAGE SELECTION
             (Searchable 23 Indian Languages + TTS Audio)
                                ↓
                        2. WELCOME & TRUST
           (Rural Business Vision, Voice Assistant Introduction)
                                ↓
        3. SINGLE CANONICAL AUTHENTICATION & ONBOARDING
            (One Unified, Voice-First, Accessible Flow)
                                ↓
       4. VOICE-FIRST USER & ENTERPRISE INFORMATION COLLECTION
         ├─ STEP 1: Full Name (Voice / Type)
         ├─ STEP 2: Mobile Number & 4-Digit Security PIN
         ├─ STEP 3: Age Range (Voice / Select)
         ├─ STEP 4: Business Location (Village, Block, District)
         ├─ STEP 5: Available Own Capital (₹) (PS-91 Baseline)
         ├─ STEP 6: Desired Business Idea & Available Assets
         └─ STEP 7: Interactive Voice Confirmation & Review
                                ↓
                           5. VALIDATE
           (Format check, PIN security, LGD location resolution)
                                ↓
                    6. CREATE / UPDATE PROFILE
         (Persist locally in storageService & sync to Supabase)
                                ↓
                    7. ONBOARDING COMPLETE (100%)
                                ↓
                        8. SAATHI HOME
                                ↓
                   CONNECTED BUSINESS MODULES:
   ├─ Business Advisory & Discovery (/business-discovery)
   ├─ Local Market Radar & Competitor Map (/local-market, /competitors)
   ├─ Market Gap High-Opportunity Engine (/market-gap)
   ├─ Business Feasibility & SWOT (/feasibility, /swot)
   ├─ PS-91 Financial Waterfall & Loan Structuring (/money-loan)
   ├─ Government Schemes Router (PMEGP, Mudra, CMEGP) (/schemes)
   ├─ Profit Simulator & Stress Testing (/simulator, /stress-test)
   ├─ Customer Acquisition & Pricing Strategy (/marketing, /pricing)
   ├─ Safe Expansion Roadmap (/expansion, /mentor)
   └─ Continuous AI & Voice Mentor (🎙️ Talk to Saathi)
```

---

AUDIT COMPLETE — NO SOURCE CODE MODIFIED.
