export const backendRequest = (path: string, method: string, useAuth: boolean, body?: Object) => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token && useAuth) {
        headers.append("Authorization", `Token ${token}`);
    }
    return fetch(`http://localhost:8000/${path}`, {
        method: method,
        headers: headers,
        redirect: "follow",
        body: JSON.stringify(body),
    });
};