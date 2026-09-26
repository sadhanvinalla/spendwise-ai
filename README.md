# SpendWise

SpendWise is a student-focused expense tracker with budgeting, dashboard analytics, and an explainable spending-insights service.

## Architecture

```text
React + Nginx
     |
     | REST
     v
Spring Boot 4.1.1
     |                   |               \ REST
     v                v
PostgreSQL       FastAPI
                     |
                 Spending insights
```

The Spring Boot backend owns authentication, transactions, budgets and dashboard data. The FastAPI service is stateless and receives only the transaction data required for analysis.

## Technology Stack

- Frontend: React, JavaScript, Chart.js
- Backend: Java 17, Spring Boot 4.1.1, Spring Security, JWT, Spring Data JPA
- Database: PostgreSQL 16
- Insights service: Python, FastAPI, Pydantic
- Testing: JUnit/Mockito, pytest, Karate
- DevOps: Git/GitHub, Docker, Docker Compose, Jenkins, Kubernetes

## Features

- User registration and JWT login
- Add, edit and delete income/expense transactions
- Monthly budgets with usage and status
- Monthly dashboard with income, expenses and balance
- Spending insights by category
- Average and largest expense analysis
- Next-month expense estimate based on recorded spending
- Responsive professional frontend

## Local Development

### 1. PostgreSQL

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

### 2. FastAPI

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Spring Boot

In another terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`

### 4. React

In another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

## Full Docker Compose

From the repository root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

The frontend Nginx container proxies `/api/*` requests to the Spring Boot backend. Docker networking uses service names, so the backend reaches FastAPI at `http://ai-service:8000`.

Stop everything:

```bash
docker compose down
```

Remove the PostgreSQL volume too:

```bash
docker compose down -v
```

## Testing

### Backend

```bash
cd backend
mvn test
```

### AI service

```bash
cd ai-service
python -m pytest -q
```

### Frontend

```bash
cd frontend
npm test -- --watchAll=false
npm run build
```

### Karate

Start PostgreSQL and the backend first, then:

```bash
cd karate-tests
mvn test -DbaseUrl=http://localhost:8080
```

## Kubernetes

Build the images:

```bash
docker build -t spendwise-ai-service:latest ./ai-service
docker build -t spendwise-backend:latest ./backend
docker build -t spendwise-frontend:latest ./frontend
```

For Minikube:

```bash
minikube image load spendwise-ai-service:latest
minikube image load spendwise-backend:latest
minikube image load spendwise-frontend:latest
```

Deploy:

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods -n spendwise
kubectl get services -n spendwise
```

Access:

```bash
kubectl port-forward -n spendwise service/frontend 3000:80
```

Then open `http://localhost:3000`.

## Jenkins

`Jenkinsfile` contains a pipeline for:

1. Checkout
2. Backend tests
3. FastAPI tests
4. Frontend test and production build
5. Docker image build
6. Karate API tests
7. Docker cleanup

The Jenkins agent must have Java/Maven, Node/npm, Python, Docker and access to the repository.

## Environment Configuration

Spring Boot supports environment overrides for:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_DDL_AUTO`
- `FASTAPI_BASE_URL`
- `CORS_ALLOWED_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`

The defaults are intended for local development only. Production deployments should use managed secrets rather than committing credentials.

## Project Structure

```text
spendwise-ai/
├── backend/
├── ai-service/
├── frontend/
├── karate-tests/
├── k8s/
├── docker-compose.yml
├── Jenkinsfile
├── .gitignore
└── README.md
```
