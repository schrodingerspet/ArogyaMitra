/*
  Hosting-agnostic API contract reference for frontend integration.
  Keep transport/auth implementation abstract in lib/api adapters.
*/

export const apiContracts = {
  auth: {
    login: {
      method: "POST",
      path: "/api/auth/login",
      request: { email: "string", password: "string" },
      response: { access_token: "string", refresh_token: "string", user: "User" },
    },
    refresh: {
      method: "POST",
      path: "/api/auth/refresh",
      request: { refresh_token: "string" },
      response: { access_token: "string" },
    },
  },
  users: {
    get: { method: "GET", path: "/api/users/{id}", response: "User" },
    update: { method: "PUT", path: "/api/users/{id}", request: "Partial<User>", response: "User" },
  },
  assessments: {
    list: { method: "GET", path: "/api/assessments", response: "Assessment[]" },
    create: { method: "POST", path: "/api/assessments", request: "AssessmentInput", response: "Assessment" },
    update: { method: "PUT", path: "/api/assessments/{id}", request: "AssessmentInput", response: "Assessment" },
  },
  workouts: {
    list: { method: "GET", path: "/api/workouts", response: "WorkoutPlan[]" },
    create: { method: "POST", path: "/api/workouts", request: "WorkoutPlanInput", response: "WorkoutPlan" },
    update: { method: "PUT", path: "/api/workouts/{id}", request: "WorkoutPlanInput", response: "WorkoutPlan" },
  },
  meals: {
    list: { method: "GET", path: "/api/meals", response: "MealPlan[]" },
    create: { method: "POST", path: "/api/meals", request: "MealPlanInput", response: "MealPlan" },
    update: { method: "PUT", path: "/api/meals/{id}", request: "MealPlanInput", response: "MealPlan" },
  },
  progress: {
    list: { method: "GET", path: "/api/progress", response: "ProgressEntry[]" },
    create: { method: "POST", path: "/api/progress", request: "ProgressInput", response: "ProgressEntry" },
  },
  chat: {
    sessions: { method: "GET", path: "/api/chat/sessions", response: "ChatSession[]" },
    send: { method: "POST", path: "/api/chat/message", request: "ChatMessageInput", response: "ChatMessage" },
  },
};
