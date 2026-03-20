# Dubey's Dhaba (Split Frontend/Backend)

This repository now hosts a **Next.js frontend** inside `src/` and a dedicated **NestJS backend** under `backend/`. The frontend keeps its UI, while every `/api/*` request in `MenuApp` and the dashboard is rewritten to `NEXT_PUBLIC_API_BASE_URL` (see `next.config.mjs`), so the UI continues to call the familiar endpoints but the traffic is routed to the standalone API service.

## Environment
- `DATABASE_URL` / `POSTGRES_URL` (used by the backend to connect to Neon Postgres).
- `NEXT_PUBLIC_API_BASE_URL` tells the frontend where to proxy `/api` calls (defaults to `http://localhost:3001` for local dev).
- `ADMIN_SESSION_SECRET` (optional) stabilizes dashboard session tokens.
- `POSTGRES_*` helpers and any other Postgres connection details are reused directly by the backend from `.env`.

## Local development
1. Install dependencies from the repo root: `npm install`.
2. Install backend deps: `cd backend && npm install`.
3. Run both services together with `npm run dev:all` (loads `.env`, starts Next dev plus `backend` with `tsx watch src/main.ts`).
4. Alternatively, run frontend-only with `npm run dev` and backend-only with `cd backend && npm run dev`.

## Deployment
### Frontend (Vercel)
1. Push the repo (root package.json still points to the Next app). Vercel will run `npm run build`.
2. In Vercel’s Environment Variables, set `NEXT_PUBLIC_API_BASE_URL` to the public URL of your deployed backend.
3. Any other needed env vars (e.g., `NEXT_PUBLIC_MAP_KEY` if you add more) stay in Vercel now.

### Backend (Render / other host)
1. Point your host (Render, Railway, Fly, etc.) to the `backend/` directory.
2. Install dependencies there, then run `npm run build` and `npm run start` (or `npm run dev` for preview).
3. Copy all `.env` values used by the backend (`DATABASE_URL`, `POSTGRES_URL`, `ADMIN_SESSION_SECRET`, `PORT`, `CORS_ORIGIN`, etc.) into the platform’s env settings so the Nest app can connect to Neon and issue cookies.
4. Once the service is live (e.g., `https://api-dubeysdhaba.onrender.com`), update Vercel’s `NEXT_PUBLIC_API_BASE_URL` to that URL so the frontend continues to use the new backend.

## Notes
- The backend still seeds schema/menu data via the helper modules (`admin-store`, `db`, `security`) moved under `backend/src/services`.
- The frontend never needs to know where the backend lives beyond `NEXT_PUBLIC_API_BASE_URL`, and the rewrite keeps `/api/*` calls unchanged.

## Mobile App Generation (Capacitor)

This project uses **Capacitor** to build native Android and iOS applications from the React web code.

### Prerequisites for Native Builds
Before generating mobile APKs, guarantee your system has the required build toolchains:

**For Android:**
- **Java Development Kit (JDK):** Install JDK 17 (required for most modern Gradle versions).
- **Android Studio:** Install to correctly pull the Android SDK and SDK tools.
- **Environment Variables:** 
  - Set `JAVA_HOME` pointing to your JDK folder (e.g., `C:\Program Files\Java\jdk-17`).
  - Set `ANDROID_HOME` pointing to your Android SDK (e.g., `C:\Users\<user>\AppData\Local\Android\Sdk`).

**For iOS (Mac only):**
- **Xcode:** Installed via the Mac App Store.
- **CocoaPods:** Install by running `sudo gem install cocoapods`.

### 1. Setup New Platforms
Ensure you have built the web app (`npm run build`), then generate the native projects:
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### 2. Generate App Icons and Splash Screens
Place your `logo.png` in a new `assets` folder at the root project directory:
```bash
cp public/logo.png assets/icon.png
cp public/logo.png assets/splash.png
npx @capacitor/assets generate
```
*(This will automatically scale and replace default Capacitor icons in the native platforms).*

### 3. Native Permissions (Geolocation)
If your app utilizes the location toggle on mobile, you must declare location permissions natively:
**Android:** Open `android/app/src/main/AndroidManifest.xml` and add:
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
*(Place these right above the `</manifest>` tag or under the `INTERNET` permission).*

**iOS:** Open `ios/App/App/Info.plist` and add the `NSLocationWhenInUseUsageDescription` key with a description.

### 4. Build the App
**Android APK:**
```bash
cd android
./gradlew assembleDebug  # (Use .\gradlew assembleDebug on Windows CMD/PowerShell)
```
The resulting APK will be found in: `android/app/build/outputs/apk/debug/app-debug.apk`.

**iOS App:**
```bash
npx cap open ios
```
*(This will open Xcode where you can select your signing team and hit Build/Play).*

### 5. Generating Two Distinct Apps (Customer vs. Dashboard)
This project is configured to beautifully support both the public-facing customer Menu app **and** an internal staff Dashboard app from the exact same codebase. 

You can configure which app gets built by toggling the Native `appId` inside `capacitor.config.json` before you compile.

**Building the standard Customer App:**
1. Open `capacitor.config.json` and ensure `"appId": "com.dubeys.dhaba"`.
2. Run `npx cap sync` to write the configs natively.
3. Build your APK/iOS project. Upon launch, the app behaves as a customer food menu.

**Building the internal Staff Dashboard App:**
1. Open `capacitor.config.json` and change the ID to `"appId": "com.dubeys.dashboard"`.
2. Run `npx cap sync` to update the native projects.
3. Build your APK/iOS project. 
*Note: Because the Entry Route (`src/app/page.js`) looks for this specific App ID when it boots, the generated App will instantly bypass the Menu and launch directly to `/dashboard` natively!*
