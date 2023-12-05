import { backendRequest } from "./request";
import { Document as DocumentInterface } from "./interfaces";

export const getDocumentsForProject = async (
  projectId: number,
  page: number,
) => {
  const response = await backendRequest(
    `documents/project/${projectId}?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createDocument = async (
  projectId: number,
  title: string,
  url: string,
) => {
  const response = await backendRequest(`documents/create/`, "POST", true, {
    project: projectId,
    title,
    url,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateDocument = async (document: DocumentInterface) => {
  const response = await backendRequest(
    `documents/${document.id}/`,
    "PUT",
    true,
    document,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteDocument = async (documentId: number): Promise<number> => {
  const response = await backendRequest(
    `documents/${documentId}/`,
    "DELETE",
    true,
  );
  return response.status;
};

export const getRecentDocuments = async (projectId: number) => {
  const response = await backendRequest(
    `documents/recent/${projectId}/`,
    "GET",
    true,
  );
  return await response.json();
};
