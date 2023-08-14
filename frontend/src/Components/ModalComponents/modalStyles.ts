export const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

export const formStyle = {
  "& > *": {
    mb: "15px",
    width: "100%",
  },
};

export const actionsButtons = {
  display: "flex",
  justifyContent: "end",
  mt: 2,
};

export const buttonStyle = {
  mr: 1,
};
