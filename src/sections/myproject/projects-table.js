import PropTypes from "prop-types";
import Link from "next/link";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

export const ProjectsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;


  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Tech Stack Used</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Last Modified</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((project) => {
                const isSelected = selected.includes(project.id);

                return (
                  <TableRow hover key={project.id} selected={isSelected}>
                    <TableCell>
                      <Link href={`/aiChat?id=${project.id}`} passHref>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{project.nameOfProject}</Typography>
                        </Stack>
                      </Link>
                    </TableCell>
                    <TableCell>{project.techStackUsed}</TableCell>
                    <TableCell>{project.dateCreated}</TableCell>
                    <TableCell>{project.dateLastModified}</TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color:
                          project.status === "Done"
                            ? "green"
                            : project.status === "In Progress"
                            ? "gray"
                            : "red",
                      }}
                    >
                      {project.status}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={5}
      />
    </Card>
  );
};

ProjectsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
