import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {

  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<UserProps[]>([]);
  const [workspaceId, setWorkspaceId] = useState('default'); // Replace 'default' with your initial workspace id

  useEffect(() => {
    const fetchUsers = () => {
      fetch(`http://localhost:8000/tools?workspace=${workspaceId}`)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error('Fetch error:', err));
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, [workspaceId]);

  // Call setWorkspaceId(newId) when workspace changes (e.g., from a dropdown or popover)

  // Split into IN and OUT
  const inFiltered = applyFilter({
    inputData: users.filter((u) => u.status === 'IN'),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const outFiltered = applyFilter({
    inputData: users.filter((u) => u.status === 'OUT'),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  return (
    <DashboardContent>
      {/* OUT table */}
      <Card sx={{ mb: 3 }}>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterName(e.target.value)
          }
          numSelected={0}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={outFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    outFiltered.map((row) => row.id)
                  )
                }
                headLabel={[]}
              />
              <TableBody>
                {outFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    outFiltered.length
                  )}
                />

                {outFiltered.length === 0 && (
                  <TableNoData searchQuery={filterName} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={table.page}
          component="div"
          count={outFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* IN table */}
      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterName(e.target.value)
          }
          numSelected={0}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={inFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    inFiltered.map((row) => row.id)
                  )
                }
                headLabel={[]}
              />
              <TableBody>
                {inFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    inFiltered.length
                  )}
                />

                {inFiltered.length === 0 && (
                  <TableNoData searchQuery={filterName} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={table.page}
          component="div"
          count={inFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: string[]) => {
      if (checked) {
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    []
  );

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
