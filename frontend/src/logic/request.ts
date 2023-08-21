export const backendRequest = (
  path: string,
  method: string,
  useAuth: boolean,
  body?: unknown,
) => {
  const apiUrl = import.meta.env.PROD ? "/api" : "http://localhost:8000";
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token && useAuth) {
    headers.append("Authorization", `Token ${token}`);
  }
  return fetch(`${apiUrl}/${path}`, {
    method: method,
    headers: headers,
    redirect: "follow",
    body: JSON.stringify(body),
  });
};
