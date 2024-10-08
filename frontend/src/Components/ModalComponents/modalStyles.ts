export const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

export const actionsButtons = {
  display: "flex",
  justifyContent: "end",
  gap: 1,
  mt: 2,
};
