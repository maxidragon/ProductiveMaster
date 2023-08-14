import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Timezone } from '../../logic/interfaces';
import TimezoneRow from './Row/TimezoneRow';

const TimezonesTable = (props: { timezones: Timezone[] }) => {
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
          {props.timezones.map((timezone: Timezone) => (
            <TimezoneRow key={timezone.id} timezone={timezone} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimezonesTable;
