// FilterableTable.js
import React, { useState, useMemo, useCallback } from 'react';
import SortableTable from './SortableTable';
import { TextField, Grid, Typography, Box } from '@mui/material';

function FilterableTable({ columns, data, onRequestSort, onRequestFilter, defaultFilters = {} }) {
    const [filters, setFilters] = useState(defaultFilters);

    const handleFilterChange = useCallback((key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (onRequestFilter) {
            onRequestFilter(newFilters);
        }
    }, [filters, onRequestFilter]);

    // Client-side filtering logic
    const filteredData = useMemo(() => {
        if (!data) return [];
        if (onRequestFilter) {
            // If parent handles filtering, just return data as is
            return data;
        }
        let currentData = data;
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                currentData = currentData.filter(item =>
                    String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase())
                );
            }
        });
        return currentData;
    }, [data, filters, onRequestFilter]);

    // Prepare columns for filter inputs
    const filterableColumns = columns.map(col => ({
        ...col,
        // Add filter input component if column is filterable
        filterComponent: col.filterable !== false ? (
            <TextField
                label={`Filter ${col.label}`}
                variant="standard"
                value={filters[col.id] || ''}
                onChange={(e) => handleFilterChange(col.id, e.target.value)}
                size="small"
                sx={{ ml: 1, mr: 1, width: 'calc(100% - 16px)' }} // Adjust width as needed
            />
        ) : null,
    }));

    // You might need to adjust BaseTable's header rendering to include these filter components
    // For simplicity here, we'll just render them separately above the table
    return (
        <div>
            <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Filters</Typography>
                <Grid container spacing={2}>
                    {filterableColumns.map((col) => (
                        col.filterComponent ? (
                            <Grid item xs={12} sm={6} md={3} key={`filter-${col.id}`}>
                                {col.filterComponent}
                            </Grid>
                        ) : null
                    ))}
                </Grid>
            </Box>
            <SortableTable
                columns={filterableColumns} // Pass columns that might contain filter components or have filter logic
                data={filteredData}
                onRequestSort={(orderBy, order) => onRequestSort && onRequestSort(orderBy, order)}
                // Pass current filters or default filters to SortableTable if needed
            />
        </div>
    );
}

export default FilterableTable;
