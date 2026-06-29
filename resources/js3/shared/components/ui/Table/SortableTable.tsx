// SortableTable.js
import React, { useState, useMemo } from 'react';
import BaseTable from './BaseTable';
import { TableSortLabel, Box } from '@mui/material';

function SortableTable({ columns, data, onRequestSort, defaultOrder = 'asc', defaultOrderBy }) {
    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        if (onRequestSort) {
            onRequestSort(property, isAsc ? 'desc' : 'asc');
        }
    };

    // Client-side sorting logic (can be overridden or managed by parent)
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const orderVal = comparator(a[0], b[0]);
            if (orderVal !== 0) return orderVal;
            return a[1] - b[1]; // Stable sort based on original index
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);
    };

    const sortedData = useMemo(() => {
        if (!data) return [];
        if (onRequestSort) {
            // If parent handles sorting, just return data as is
            return data;
        }
        // Otherwise, perform client-side sorting
        return stableSort(data, getComparator(order, orderBy));
    }, [data, order, orderBy, onRequestSort]);


    const visuallyHidden = {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    };

    // Map columns to include sorting logic
    const sortableColumns = columns.map(col => ({
        ...col,
        label: (
            <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : 'asc'}
                onClick={() => col.sortable !== false && handleRequestSort(col.id)}
                disabled={col.sortable === false}
            >
                {col.label}
                {orderBy === col.id ? (
                    <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
            </TableSortLabel>
        ),
    }));

    return (
        <BaseTable
            columns={sortableColumns}
            data={sortedData}
            noDataMessage="No data available for sorting."
        />
    );
}

export default SortableTable;
