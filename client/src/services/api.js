const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ---------- AUTH ----------

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// Get token helper
const getToken = () => localStorage.getItem("token");

// 📊 Dashboard API
export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/tasks/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};

// ---------- PROJECTS ----------
export const createProject = async (data) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const getProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};

// ---------- TASKS ----------

export const createTask = async (data) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const getTasksByProject = async (projectId) => {
  const res = await fetch(`${BASE_URL}/tasks/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
};

export const updateTask = async (id, status) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status })
  });

  return res.json();
};