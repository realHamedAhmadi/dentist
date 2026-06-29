// components/tables/PaginatedTable.jsx
import React, {useState, useMemo} from 'react';
import {TablePagination, Box, Typography} from '@mui/material';
import BaseTable from './BaseTable';

const PaginatedTable = ({columns, data, defaultItemsPerPage = 5}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultItemsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // بازگشت به صفحه اول وقتی تعداد ردیف در صفحه تغییر می‌کند
    };

    const paginatedData = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data ? data.slice(startIndex, endIndex) : [];
    }, [data, page, rowsPerPage]);

    // propsی که برای نمایش کنترل‌های صفحه‌بندی لازم است
    const paginationControls = {
        count: data ? data.length : 0,
        page,
        rowsPerPage,
        onPageChange: handleChangePage,
        onRowsPerPageChange: handleChangeRowsPerPage,
    };

    return (
        <Box>
            <BaseTable columns={columns} data={paginatedData}/>
            {data && data.length > 0 && (
                <TablePagination
                    component="div"
                    count={paginationControls.count}
                    page={paginationControls.page}
                    onPageChange={paginationControls.onPageChange}
                    rowsPerPage={paginationControls.rowsPerPage}
                    onRowsPerPageChange={paginationControls.onRowsPerPageChange}
                    labelRowsPerPage="تعداد در صفحه:"
                    labelDisplayedRows={({from, to, count, page}) =>
                        `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`
                    }
                    sx={{mt: 2}}
                />
            )}
        </Box>
    );
};

export default PaginatedTable;
