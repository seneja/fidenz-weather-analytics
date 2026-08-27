# Weather Comfort Index Full-Stack Application

This is a full-stack weather analytics application that fetches current weather data for multiple cities, computes a custom "Comfort Index Score" (0-100) per city, ranks them from most to least comfortable, and presents them in a responsive, authenticated dashboard.

---

## Technical Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Swagger (via `swagger-ui-express` & `swagger-jsdoc`)
- **HTTP Client**: Axios (for OpenWeatherMap calls)
- **Caching**: In-Memory (`node-cache`) with a 5-minute TTL
- **Authentication**: Auth0 JWT validation (`express-oauth2-jwt-bearer` & `@auth0/auth0-react`)
- **Testing**: Vitest for unit testing scoring/ranking logic

---

## Project Structure
- `/backend`: Node.js Express server + Vitest tests.
- `/frontend`: React dashboard built with Vite.
- `/postman`: Contains Postman collection export for manual API queries.

---

## Setup & Running the Application

### 1. Requirements
Ensure you have Node.js (v18+) and npm installed.

### 2. Environment Variables Configuration

#### Backend (`/backend/.env`)
Create a `.env` file in the `/backend` folder:
```env
PORT=3001
OWM_API_KEY=87adbbe45f785fbed95fbdb4c11b0e2b
AUTH0_DOMAIN=your-auth0-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.weathercomfort.com
CLIENT_ORIGIN=http://localhost:5173
```

#### Frontend (`/frontend/.env`)
Create a `.env` file in the `/frontend` folder:
```env
VITE_AUTH0_DOMAIN=your-auth0-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=https://api.weathercomfort.com
```

### 3. Running Backend Server
```bash
cd backend
npm install
npm run build      # Compile TypeScript
npm run dev        # Run server in dev/watch mode
npm run test       # Run Vitest unit tests
```

### 4. Running Frontend Client
```bash
cd frontend
npm install
npm run dev        # Launch Vite server (runs on http://localhost:5173)
```

---

## Custom Comfort Index Formula

Instead of a raw linear scale, comfort scores are evaluated using **Gaussian distance-from-ideal** decay curves. This ensures that the score peaks exactly at the ideal condition and falls off smoothly in both hot/cold or humid/dry directions.

The 4 scoring parameters are defined as:
1. **Temperature ($T$ in Celsius)**:
   - *Ideal*: $22^\circ\text{C}$
   - *Formula*: $S_{\text{temp}} = 100 \times e^{-0.5 \left(\frac{|T - 22|}{8}\right)^2}$
2. **Humidity ($H$ in %)**:
   - *Ideal*: $45\%$
   - *Formula*: $S_{\text{humidity}} = 100 \times e^{-0.5 \left(\frac{|H - 45|}{20}\right)^2}$
3. **Wind Speed ($W$ in m/s)**:
   - *Ideal*: $2\text{ m/s}$
   - *Formula*: $S_{\text{wind}} = 100 \times e^{-0.5 \left(\frac{|W - 2|}{4}\right)^2}$
4. **Cloudiness ($C$ in %)**:
   - *Ideal*: $20\%$
   - *Formula*: $S_{\text{cloud}} = 100 \times e^{-0.5 \left(\frac{|C - 20|}{30}\right)^2}$

### Parameter Weights
The comfort scores are combined linearly using weighted coefficients:
$$\text{Comfort Index Score} = 0.40 \times S_{\text{temp}} + 0.30 \times S_{\text{humidity}} + 0.15 \times S_{\text{wind}} + 0.15 \times S_{\text{cloud}}$$

All computations are processed strictly on the backend. Cities are ranked descending based on their final scores (with alphabetical sorting by name as a tie-breaker).

---

## Caching Strategy
- **Mechanism**: Backend caches raw OpenWeatherMap API responses for each city using `node-cache`.
- **TTL**: 5 minutes ($300\text{ seconds}$).
- **Flow**: When `/api/weather` is requested, the server checks the cache. On cache hit, the server skips the Axios call, immediately returning the computed score. On cache miss, it calls OpenWeatherMap, updates the cache, and computes scores.
- **Debug Cache Endpoint**: `/api/debug/cache` is a public endpoint showing `{ cityId: number, status: "HIT" | "MISS", cachedAt: string | null }` to easily verify cache validity.

---

## Auth0 Configuration (Dashboard Steps)
1. **API Setup**: Create an API in the Auth0 Dashboard with identifier `https://api.weathercomfort.com` (matching `AUTH0_AUDIENCE`). Set signing algorithm to `RS256`.
2. **SPA Setup**: Create a Single Page Application in Auth0, configure Allowed Callback/Logout URLs to `http://localhost:5173`.
3. **MFA Enablement**: Under **Security > Multi-factor Auth**, enable **Email** verification.
4. **Disable Sign Ups**: In **Authentication > Database > Username-Password-Authentication**, toggle **Disable Sign Ups** to `ON`.
5. **Lower Password Policy**: Under **Authentication > Database**, set the password strength policy to **None** or **Low** to allow simple passwords for test users.
6. **Whitelist Test User**: Go to **User Management > Users**, click **Create User**:
   - *Email*: `careers@fidenz.com`
   - *Password*: `Pass#fidenz`

---

## API Verification (Swagger & Postman)

### 1. Swagger UI (Recommended)
You can test the APIs directly using the built-in Swagger documentation. Once the backend server is running, navigate to:
[http://localhost:3001/api-docs](http://localhost:3001/api-docs) or simply the root [http://localhost:3001/](http://localhost:3001/) to query the endpoints.

### 2. Postman
Import the file in `/postman/weather_comfort_index_collection.json` into Postman.
- Set the `ACCESS_TOKEN` variable in the collection variables tab after signing into the frontend and retrieving the JWT token (accessible via the browser network tab).
- Run the public cache endpoint to view cache status.

---

## Architectural Trade-offs
- **In-Memory Cache vs Redis**: In-memory caching (`node-cache`) was chosen over Redis for simplicity, speed of development, and zero-dependency deployments. However, it means caches do not survive server restarts.
- **Email MFA vs Authenticator App**: Email-based MFA is simpler to configure for grading and whitelisting credentials.
- **No Database vs Persistent Storage**: Since the cities list is static and the Comfort Index relies on fresh weather conditions, a database is not required.
- **Gaussian vs Linear Decay**: Gaussian curves yield smoother grading around the ideal values (avoiding sharp drops), mimicking real human comfort perception much better.
