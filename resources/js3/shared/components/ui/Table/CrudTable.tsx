// CrudTable.js
import React, { useState, useCallback, useEffect } from 'react';
import FilterableTable from './FilterableTable';
import { Button,Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Helper function to generate unique IDs for new items
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

function CrudTable({ columns, initialData = [], onDataChange }) {
    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null); // null for add, object for edit
    const [originalItemForEdit, setOriginalItemForEdit] = useState(null); // To track changes

    // Initialize data from initialData prop
    useEffect(() => {
        const processedData = initialData.map(item => ({ ...item, id: item.id || generateId() }));
        setData(processedData);
        if (onDataChange) {
            onDataChange(processedData);
        }
    }, [initialData]);

    const handleAddClick = () => {
        setCurrentItem({}); // Start with an empty object for adding
        setOriginalItemForEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (row) => {
        setCurrentItem({ ...row }); // Copy the item to edit
        setOriginalItemForEdit({ ...row }); // Store original for change tracking
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (rowId) => {
        const newData = data.filter(item => item.id !== rowId);
        setData(newData);
        if (onDataChange) {
            onDataChange(newData);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setCurrentItem(null);
        setOriginalItemForEdit(null);
    };

    const handleSave = () => {
        if (!currentItem) return;

        let newData;
        const isEditing = !!currentItem.id;

        if (isEditing) {
            // Update existing item
            newData = data.map(item => (item.id === currentItem.id ? currentItem : item));
        } else {
            // Add new item
            const newItemWithId = { ...currentItem, id: generateId() };
            newData = [...data, newItemWithId];
        }

        setData(newData);
        if (onDataChange) {
            onDataChange(newData);
        }
        handleDialogClose();
    };

    // Prepare columns to include action buttons
    const crudColumns = React.useMemo(() => {
        const actionColumn = {
            id: 'actions',
            label: 'Actions',
            sortable: false,
            filterable: false,
            align: 'center',
            renderCell: (rowData) => ( // Custom render for action cells
                <>
                    <IconButton aria-label="edit" onClick={() => handleEditClick(rowData)} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteClick(rowData.id)} size="small">
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </>
            ),
        };

        // Add the action column to the end, ensure it's not added if already present
        const hasActionColumn = columns.some(col => col.id === 'actions');
        if (hasActionColumn) return columns;

        return [...columns, actionColumn];
    }, [columns, data]); // Re-calculate if columns or data changes

    // Override BaseTable's cell rendering to use renderCell if provided
    const customRenderedData = data.map(row => {
        const renderedRow = {};
        crudColumns.forEach(col => {
            if (col.renderCell) {
                renderedRow[col.id] = col.renderCell(row);
            } else {
                renderedRow[col.id] = row[col.id];
            }
        });
        return renderedRow;
    });

    // Prepare fields for the dialog based on columns (excluding 'actions' or other non-editable fields)
    const dialogFields = columns
        .filter(col => col.id !== 'actions' && !col.readOnly) // Exclude action column and readOnly fields
        .map(col => ({
            id: col.id,
            label: col.label,
            type: col.type || 'text', // Default to text, could use 'number', 'date', etc.
            numeric: col.numeric,
        }));

    return (
        <div>
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Add New Item
                </Button>
            </div>

            <FilterableTable // Inherits from FilterableTable
                columns={crudColumns}
                data={customRenderedData} // Use data processed for renderCell
                // Pass sort/filter handlers if they need to interact with Crud state or API
                onRequestSort={(orderBy, order) => { /* Handle sort if needed */ }}
                onRequestFilter={(filters) => { /* Handle filter if needed */ }}
            />

            {/* Dialog for Add/Edit */}
            <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentItem?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {dialogFields.map((field) => (
                            <Grid item xs={12} sm={field.type === 'text' && dialogFields.length > 1 ? 6 : 12} key={field.id}>
                                <TextField
                                    autoFocus={field.id === (dialogFields[0]?.id)} // Focus first field
                                    margin="dense"
                                    label={field.label}
                                    type={field.type}
                                    fullWidth
                                    variant="standard"
                                    value={currentItem?.[field.id] || ''}
                                    onChange={(e) => setCurrentItem(prev => ({ ...prev, [field.id]: e.target.value }))}
                                    // Add error handling or validation as needed
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CrudTable;
