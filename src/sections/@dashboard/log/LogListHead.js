import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel, Typography } from '@mui/material';

// ----------------------------------------------------------------------

LogListHead.propTypes = {
  headLabel: PropTypes.array,
};

export default function LogListHead({
  headLabel,
}) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
          >
              <Typography variant="subtitle2" noWrap>{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
