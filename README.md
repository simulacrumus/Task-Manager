# Task Manager Application

A full-stack task management application built with React and .NET Core Web API.

## Features

- Adding new tasks
- Viewing a list of tasks
- Updating an existing task
- Toggling a task's completion status

## Tech Stack

### Backend

- **.NET Core**
- **Entity Framework Core**
- **Clean folder structure**

### Frontend

- **React**
- **Axios** for API requests
- **Material UI** for styling

## Setup Instructions

### Option 1: Run with Docker

```bash
docker compose up --build
```

API will be available at https://localhost:5001 and app will be available at http://localhost:3000

### Option 2: Manuel setup

### Prerequisites

- .NET 8+ SDK
- Node.js 18+
- npm

#### Backend

```bash
cd server
dotnet restore
dotnet run
```

API will be available at http://localhost:5000

#### Frontend

```bash
cd client
npm install
npm run dev
```

App will be available at http://localhost:5173

## Data Model

```json
{
  "id": "string (guid)",
  "title": "string",
  "description": "string",
  "dueDate": "datetime",
  "isComplete": "boolean",
  "createdAt": "datetime"
}
```

## API Endpoints

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | `/api/v1/tasks`      | Retrieve all tasks      |
| POST   | `/api/v1/tasks`      | Create a new task       |
| PUT    | `/api/v1/tasks/{id}` | Update an existing task |
| DELETE | `/api/v1/tasks/{id}` | Delete a task           |

## Run Tests

```bash
 dotnet test server/Tests
```

## API Documentation

Swagger documentation is available at http://localhost:5001/swagger or https://localhost:5000/swagger

## Notes & Assumptions

- The task model includes the following fields: id, title, description, dueDate, isComplete, and createdAt.
- Basic error handling is implemented to gracefully manage invalid task operations.
- Authentication and advanced filtering were omitted due to time constraints.
- The user interface is intentionally minimal to prioritize core functionality and clarity.
- Loading and error states are handled in the UI to improve user experience.
- API documentation is available via integrated Swagger UI.

## Possible Improvements

- Introduce frontend state management (e.g., using Context API, Redux, or Zustand).
- Add pagination support to improve performance with large datasets.
- Implement more filtering options.
- Use a persistent production-ready database (e.g., PostgreSQL).
- Add comprehensive test coverage for frontend.

## Author

Emrah Kinay
