import { UserData, UserSettings } from "./interfaces";
import { backendRequest, backendRequestWithFiles } from "./request";

export const registerUser = async (
  email: FormDataEntryValue | null,
  username: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
) => {
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
export const login = async (
  username: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
) => {
  try {
    const response = await backendRequest("get-token/", "POST", false, {
      username: username,
      password: password,
    });
    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userInfo = await getUser();
      localStorage.setItem("username", userInfo.username);
      localStorage.setItem("userId", userInfo.id);
    }
    return response.status;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  const response = await backendRequest("auth/me/", "GET", true);
  return await response.json();
};

export const getUsername = () => {
  return localStorage.getItem("username");
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return token !== null;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<number> => {
  const response = await backendRequest("auth/password/change/", "POST", true, {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.status;
};

export const updateSettings = async (settings: UserSettings) => {
  const response = await backendRequest("auth/me/", "PUT", true, settings);
  return response;
};

export const getUserData = async () => {
  const response = await backendRequest("auth/data/", "GET", true);
  return await response.json();
};

export const updateUserData = async (data: UserData): Promise<number> => {
  const response = await backendRequest("auth/data/", "PUT", true, data);
  return response.status;
};

export const forgotPassword = async (email: string): Promise<number> => {
  const response = await backendRequest("auth/password/reset/", "POST", false, {
    email: email,
  });
  return response.status;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await backendRequest(
    "auth/password/reset/confirm/",
    "POST",
    false,
    {
      token: token,
      password: newPassword,
    },
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateAvatar = async (avatar: File): Promise<number> => {
  const formData = new FormData();
  formData.append("avatar", avatar as Blob);
  const response = await backendRequestWithFiles(
    "auth/avatar/update/",
    "PUT",
    true,
    formData,
  );
  return response.status;
};

export const getUserAvatar = async (userId: number) => {
  const response = await backendRequest(`auth/avatar/${userId}/`, "GET", true);
  const blob = await response.blob();
  return {
    status: response.status,
    url: URL.createObjectURL(blob),
  };
};

export const removeAvatar = async (): Promise<number> => {
  const response = await backendRequest(`auth/avatar/remove/`, "DELETE", true);
  return response.status;
};
