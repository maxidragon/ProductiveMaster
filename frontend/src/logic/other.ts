export const formatDate = (date: Date): string => {
  console.log(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const calculateTotalPages = (count: number, perPage: number): number => {
  return Math.ceil(count / perPage);
};

export const statusPretyName = (status: string): string => {
  switch (status) {
    case "PLANNED":
      return "Planned";
    case "TO_LEARN":
      return "To learn";
    case "TODO":
      return "To do";
    case "IN_PROGRESS":
      return "In progress";
    case "DONE":
      return "Done";
    default:
      return "";
  }
};
