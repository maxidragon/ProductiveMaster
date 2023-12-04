import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Timezone } from "../../logic/interfaces";
import TimezoneRow from "./Row/TimezoneRow";

interface Props {
  timezones: Timezone[];
}
const TimezonesTable = ({ timezones }: Props): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timezones.map((timezone: Timezone) => (
            <TimezoneRow key={timezone.id} timezone={timezone} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimezonesTable;
