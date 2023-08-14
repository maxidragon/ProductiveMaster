import { TableRow, TableCell } from "@mui/material";
import { Timezone } from "../../../logic/interfaces";
import { useState, useEffect } from "react";

const TimezoneRow = ({ timezone }: { timezone: Timezone }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formattedTime = currentTime.toLocaleString("pl", {
    timeZone: timezone.name,
  });

  return (
    <>
      <TableRow
        key={timezone.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {timezone.display_name}
        </TableCell>
        <TableCell>{formattedTime}</TableCell>
      </TableRow>
    </>
  );
};

export default TimezoneRow;
