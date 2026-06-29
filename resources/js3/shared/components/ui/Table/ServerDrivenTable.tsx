// ServerDrivenTable.js
import React, { useState, useEffect, useCallback } from 'react';
import CrudTable from './CrudTable'; // Or FilterableTable if CRUD logic is handled externally
import { CircularProgress, Typography, Box,TextField } from '@mui/material';
import {IconButton} from "@mui/material";

// Mock API function (replace with actual API call)
const mockApi = async ({ page, limit, orderBy, order, filters }) => {
    console.log("API Call:", { page, limit, orderBy, order, filters });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Mock Data Generation ---
    const allItems = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i + 1}`,
        name: `Item ${i + 1}`,
        category: ['A', 'B', 'C'][i % 3],
        value: Math.floor(Math.random() * 1000),
        createdAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    }));

    // Apply Filters
    let filteredItems = allItems.filter(item => {
        let match = true;
        if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) match = false;
        if (filters.category && item.category !== filters.category) match = false;
        // Add more filter logic as needed
        return match;
    });

    // Apply Sorting
    if (orderBy) {
        filteredItems.sort((a, b) => {
            if (!a[orderBy] || !b[orderBy]) return 0; // Handle cases where orderBy field might be missing
            const valA = String(a[orderBy]).toLowerCase();
            const valB = String(b[orderBy]).toLowerCase();
            if (order === 'asc') {
                return valA < valB ? -1 : valA > valB ? 1 : 0;
            } else {
                return valB < valA ? -1 : valB > valA ? 1 : 0;
            }
        });
    }

    // Apply Pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
        data: paginatedItems,
        totalItems: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
    };
};
// --- End Mock API ---

function ServerDrivenTable({ columns }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0, // 0-indexed
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    });
    const [sortOptions, setSortOptions] = useState({ orderBy: '', order: 'asc' });
    const [filterOptions, setFilterOptions] = useState({});

    // Fetch data whenever parameters change
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockApi({
                page: pagination.page,
                limit: pagination.limit,
                orderBy: sortOptions.orderBy,
                order: sortOptions.order,
                filters: filterOptions,
            });
            setData(response.data);
            setPagination(prev => ({
                ...prev,
                totalItems: response.totalItems,
                totalPages: response.totalPages,
            }));
        } catch (err) {
            setError('Failed to load data. Please try again later.');
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sortOptions, filterOptions]);

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Dependency array ensures re-fetch on relevant changes

    // Handlers for SortableTable
    const handleRequestSort = useCallback((orderBy, order) => {
        setSortOptions({ orderBy, order });
        // Reset to first page when sorting changes
        setPagination(prev => ({ ...prev, page: 0 }));
    }, []);

    // Handlers for FilterableTable
    const handleRequestFilter = useCallback((newFilters) => {
        setFilterOptions(newFilters);
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, page: 0 }));
    }, []);

    // Handler for pagination changes
    const handlePageChange = useCallback((event, newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    const handleLimitChange = useCallback((event) => {
        setPagination(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 0 })); // Reset to page 0 on limit change
    }, []);

    // Prepare columns for the underlying table
    // Example: Add filterable and sortable flags based on your needs
    const processedColumns = columns.map(col => ({
        ...col,
        sortable: col.sortable !== false, // Default to sortable
        filterable: col.filterable !== false, // Default to filterable
        // Ensure ID is present for sorting/filtering keys
        id: col.id || col.accessor // Assuming 'id' or 'accessor' is the key for data
    }));

    // --- Render Logic ---
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading data...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Render the CrudTable (or FilterableTable) and pass necessary props
    return (
        <div>
            {/* You might want to pass pagination controls separately or integrate them */}
            {/* For simplicity, we assume CrudTable might handle its own Add/Edit/Delete if needed */}
            <CrudTable // Using CrudTable as the base, which already includes Filterable and Sortable
                columns={processedColumns}
                initialData={data} // Pass fetched data
                // If CrudTable also needs to fetch data, you'd pass down fetch handlers
                // For now, CrudTable manages its own data state internally, so we pass fetched data
                onDataChange={(newData) => {
                    // If CrudTable modifies data locally and you want to sync back to server-driven state
                    // This would require a more complex state management or dedicated API calls for each CRUD op.
                    // For this example, let's assume CrudTable's changes are just for local display until a re-fetch.
                    console.log("Data changed locally by CrudTable:", newData);
                    // Optionally, trigger a re-fetch or individual update API call here
                }}
                // Pass down sorting and filtering handlers
                onRequestSort={handleRequestSort}
                onRequestFilter={handleRequestFilter}
            />

            {/* Pagination Controls (Example) */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <Typography>Rows per page:</Typography>
                <TextField
                    select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    variant="standard"
                    SelectProps={{ native: true }}
                    InputProps={{ disableUnderline: true }}
                >
                    {[10, 25, 50].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </TextField>
                <Typography>{`${pagination.page * pagination.limit + 1}-${Math.min((pagination.page + 1) * pagination.limit, pagination.totalItems)} of ${pagination.totalItems}`}</Typography>
                <IconButton
                    onClick={(e) => handlePageChange(e, pagination.page - 1)}
                    disabled={pagination.page === 0}
                    aria-label="previous page"
                >
                    <i className="material-icons">chevron_left</i>
                </IconButton>
                <IconButton
                    onClick={(e) => handlePageChange(e, pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    aria-label="next page"
                >
                    <i className="material-icons">chevron_right</i>
                </IconButton>
            </Box>
        </div>
    );
}

export default ServerDrivenTable;
