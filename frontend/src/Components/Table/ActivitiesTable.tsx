import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Activity } from '../../logic/interfaces';

import ActivityRow from './Row/ActivityRow';

const ActivitiesTable = (props: { activities: Activity[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Titlte</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.activities.map((activity: Activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivitiesTable;
