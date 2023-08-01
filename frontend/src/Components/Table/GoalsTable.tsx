import { Goal } from '../../logic/interfaces';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import GoalRow from './Row/GoalRow';

const GoalsTable = (props: { goals: Goal[] }) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Titlte</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Is achieved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.goals.map((goal: Goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GoalsTable;