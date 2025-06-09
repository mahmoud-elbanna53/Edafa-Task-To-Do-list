
---

## Prerequisites

- Java 17+ (for backend)
- Node.js & npm (for frontend)
- MySQL (running locally)

---

## Backend Setup

1. **Configure MySQL:**
   - Create a database (e.g., `todo_db`).
   - Update `backend/src/main/resources/application.properties` with your MySQL username and password.

2. **Run the backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   The backend will start on [http://localhost:8080](http://localhost:8080).

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will start on [http://localhost:5173](http://localhost:5173).

---

## Usage

- Register a new user.
- Log in.
- Create, view, update, and delete your tasks.

---

## Notes

- The backend uses JWT for authentication. The frontend stores the token in localStorage and sends it with each request.
- CORS is configured for local development (`http://localhost:5173`).

---

## License

MIT
