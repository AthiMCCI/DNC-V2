import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import EditlistField from './editlistfield';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

const ListFields = ({ userFields, onUserFieldsUpdate }) => {
    console.log('Fields Prop:', userFields);
    const [rows, setRows] = useState([]);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [showEditUser, setShowEditUser] = React.useState(false);
    const [selid, setSelId] = React.useState();
    const [nextId, setNextId] = useState(1);

    const handleRemoveClick = (id) => {
        setSelectedFieldId(id);
        setOpenDialog(true);
    };

    const handleRemoveConfirm = () => {
        const updatedRows = rows.filter((row) => row.id !== selectedFieldId);
        setRows(updatedRows);
        onUserFieldsUpdate(updatedRows); // Update the parent state
        setOpenDialog(false);
    };

    const handleRemoveCancel = () => {
        setSelectedFieldId(null);
        setOpenDialog(false);
    };

    useEffect(() => {
        let maxId = 0;

        const processedRows = userFields.map((field, index) => {
            maxId = Math.max(maxId, field.id); // Track the maximum ID
            return {
                id: field.id, // Add this line
                ...field,
                actions: (
                    <>
                        <IconButton size="small" onClick={() => handleEditUser(field.id)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleRemoveClick(field.id)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </>
                )
            };
        });

        setRows(processedRows);

        // Update the next ID for new rows
        setNextId(maxId + 1);
    }, [userFields]);

    const handleEditUser = (id) => {
        setSelId(id);
        const selectedField = rows.find((row) => row.id === id);

        if (selectedField) {
            const userFields = { ...selectedField };
            delete userFields.id;

            setShowEditUser({
                open: true,
                data: userFields,
                hcb: makeUserEditable
            });
        } else {
            console.error('Selected field not found.');
        }
    };

    const makeUserEditable = () => {
        setShowEditUser(false);
    };
    const handleRowEditStop = (params, event) => {
        if (params.reason === 'editCommit') {
            const updatedRows = rows.map((row) => (row.id === params.id ? { ...row, ...params.data } : row));
            setRows(updatedRows);
        }
    };

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };

    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };
    const handleExportCsv = (fileName) => {
        // Create a CSV string from the rows data
        const csvData = rows.map((row) => Object.values(row).join(',')).join('\n');
        // Create a blob with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });
        // Create a temporary link to download the CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`; // Set the file name with the user-entered name
        document.body.appendChild(a);
        a.click();
        // Clean up the temporary link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
    };
    const handleSaveEdit = (editedData) => {
        // Update the rows state with the edited data
        setRows((prevRows) => prevRows.map((row) => (row.id === editedData.id ? { ...row, ...editedData } : row)));

        // Close the dialog
        setShowEditUser({ open: false, data: null, hcb: null });
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button style={{ fontSize: '13px' }} variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownloadDialog}>
                    Export CSV
                </Button>
                <Button size="small" variant="outlined" onClick={handleUpdateClick}>
                    Update
                </Button>
            </GridToolbarContainer>
        );
    }
    const handleUpdateClick = async () => {
        console.log('Table Data:', rows); // Log the data before sending
        try {
            const response = await fetch('/api/updateFields', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rows)
            });

            if (response.ok) {
                console.log('Update successful!');
            } else {
                console.error('Update failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'fieldName', headerName: 'Field Name', width: 200 },
        { field: 'fieldType', headerName: 'Field Type', width: 150 },
        { field: 'required', headerName: 'Required', width: 120, type: 'boolean' },
        { field: 'enable', headerName: 'Enable', width: 100, type: 'boolean' },
        { field: 'hidden', headerName: 'Hidden', width: 100, type: 'boolean' },
        { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => params.value }
    ];
    const navigate = useNavigate();
    const handleClickUser = () => navigate('/config/user');

    return (
        <Box sx={{ height: 400, width: '100%', marginTop: '2%' }}>
            {showEditUser.open && (
                <EditlistField
                    onFieldSave={handleSaveEdit} // Ensure that handleSaveEdit is passed as onFieldSave
                    initialField={showEditUser.data}
                    onClose={() => setShowEditUser({ open: false, data: null, hcb: null })}
                />
            )}

            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                onRowEditStop={handleRowEditStop}
                processRowUpdate={(params) => params.data}
                density="compact"
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                onEditCellChange={(params) => {
                    setEditField({
                        id: params.id,
                        data: { ...editField.data, [params.field]: params.props.value }
                    });
                }}
                slots={{
                    toolbar: CustomToolbar
                }}
            />

            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                        <TextField
                            id="linkmail"
                            size="small"
                            label="Enter Name"
                            fullWidth
                            value={csvFileName}
                            onChange={handleCsvFileNameChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialog} onClose={handleRemoveCancel}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to remove this field?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemoveCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRemoveConfirm} color="error">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListFields;
