const BACKEND_ORIGIN = import.meta.env.PROD ? "/api" : "http://localhost:8000";

export const backendRequest = (
  path: string,
  method: string,
  useAuth: boolean,
  body?: unknown,
) => {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token && useAuth) {
    headers.append("Authorization", `Token ${token}`);
  }
  return fetch(`${BACKEND_ORIGIN}/${path}`, {
    method: method,
    headers: headers,
    redirect: "follow",
    body: JSON.stringify(body),
  });
};

export const backendRequestWithFiles = (
  path: string,
  method: string,
  useAuth: boolean,
  body: FormData,
) => {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  if (token && useAuth) {
    headers.append("Authorization", `Token ${token}`);
  }

  return fetch(`${BACKEND_ORIGIN}/${path}`, {
    method: method,
    headers: headers,
    redirect: "follow",
    body: body,
  });
};
