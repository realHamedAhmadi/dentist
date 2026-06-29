import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import {TableProps as ParentTableProps,TableCellProps} from "@mui/material";

export interface TableProps extends ParentTableProps {
    components?:object

    data: [object]

    columns: [{ id: string, label: string, align?:TableCellProps['align'] }]

    getRowKey?:(row:object)=>string
}

const defaultComponents = {
    RootContainer: Paper,
    TableContainer: TableContainer,
    Table: Table,
    TableHead: TableHead,
    TableBody: TableBody,
    TableRow: TableRow,
    TableCell: TableCell,
    Typography: Typography,
}

function BaseTable(props:TableProps) {
    const {
        RootContainer=Paper,
        TableContainer=defaultComponents.TableContainer,
        Table=defaultComponents.Table,
        TableHead=defaultComponents.TableHead,
        TableBody=defaultComponents.TableBody,
        TableRow=defaultComponents.TableRow,
        TableCell=defaultComponents.TableCell,
        Typography=defaultComponents.Typography
    } = props.components || {};

    return (
        <RootContainer>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {props.columns.map((column) => (
                                <TableCell key={column.id} align={column.align || 'inherit'}>
                                    <Typography variant="subtitle1" component="div">
                                        {column.label}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row) => (
                            <TableRow key={props.getRowKey ? props.getRowKey(row) : row.id}>
                                {props.columns.map((column) => (
                                    <TableCell key={`${row.id}-${column.id}`} align={column.align || 'inherit'}>
                                        {row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </RootContainer>
    );
}
export default BaseTable;

