import {backendRequest} from "./request";

export const registerUser = async (email: FormDataEntryValue | null, username: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
    try {
        const body = {
            email: email,
            username: username,
            password: password,
        };
        const response = await backendRequest("auth/users/", "POST", false, body);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};
export const login = async (username: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
    try {
        const response = await backendRequest("get-token/", "POST", false, {username: username, password: password});
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            localStorage.setItem('token', (data.token));
        }
        return response.status;
    } catch (error) {
        console.log(error);
    }
};

export const logout = async () => {
    localStorage.removeItem("token");
};

export const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const response = await backendRequest("auth/password/change/", "POST", true, {
        old_password: oldPassword,
        new_password: newPassword
    });
    return response.status;
};