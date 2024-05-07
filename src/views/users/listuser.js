/*

Module: listuser.js

Function:
    Implementation code for Users.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Typography from '@mui/material/Typography';
import EditUser from './edituser';
import { constobj } from './../../misc/constants';
import { toast } from 'react-toastify';
import CaptchaDialog from './../CaptchaDialog';

/*

Name:	ListUser()

Function:
    Manages user information in a grid, allowing actions like add, edit, save, 
    cancel, delete, with asynchronous operations interval-based organization 
    updates, and Material-UI components for rendering and user interaction.

Definition:
    It defines a ListUser component using React hooks and Material-UI for a 
    grid-based user interface.

Description:
	The  handles user actions (add, edit, save, cancel, delete), utilizes 
    Material-UI for rendering employs asynchronous operations for user updates,
    and checks for organization changes at intervals. The grid displays user 
    information, and the component is part of a larger system for managing users 
    associated with organizations.

*/

export default function ListUser(props) {
    const { DNC_URL } = { ...constobj };
    const myroles = ['Org-User', 'Org-Admin', 'App-User', 'App-Admin'];
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditUser, setShowEditUser] = React.useState(false);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [openCaptchaDialog, setOpenCaptchaDialog] = React.useState(false);
    const [selectedUserIdForDeletion, setSelectedUserIdForDeletion] = React.useState(null);

    const thcolumns = [
        { field: 'id', headerName: 'S/No', width: 8 },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'firstname', headerName: 'First Name', width: 100 },
        { field: 'lastname', headerName: 'Last Name', width: 110 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'status', headerName: 'Status', width: 80 },
        { field: 'lastlogin', headerName: 'Last Login', width: 230 },
        { field: 'logout', headerName: 'Logout', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const { name, role } = row; // Extract name and role from the user's row data
                return [
                    <GridActionsCellItem title="Edit User" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditUser(id)} />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteUser(id, name, role)} // Pass name and role here
                    />
                ];
            }
        }
    ];

    const handleEditUser = (id) => () => {
        setSelId(id);
        setShowEditUser(true);
    };
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    const handleDeleteUser = (id, name, role) => () => {
        setSelId(id);
        // Open the captcha dialog and store the selected user ID for deletion
        setSelectedUserIdForDeletion(id);
        setOpenCaptchaDialog(true);
    };

    const handleCaptchaDialogConfirm = () => {
        setOpenCaptchaDialog(false);
        // Proceed with user deletion using the selectedUserIdForDeletion
        handleConfirmDelete(selectedUserIdForDeletion);
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };
    const handleConfirmDelete = () => {
        deleteUser(selid)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getUserInfo(); // Refresh the user data
                handleCloseDeleteDialog();
            })
            .catch((error) => {
                // console.error('Delete Error: ', error);
                toast.error('Failed to delete user.'); // Show error message using toast
                handleCloseDeleteDialog();
            });
    };

    /*

    Name:	deleteUser()

    Function:
        deleteUser function to delete a user by making asynchronous HTTP DELETE
        requestspecified URL (DNC_URL + '/user/' + [rows[id - 1].name]). 

    Definition:
        deleteUser function includes logic for constructing headers, preparing
        data for the request body making DELETE request using the Fetch API, 
        processing the response data, and handling errors.

    Description:
        deleteUser designed to delete user making an asynchronous HTTP DELETE
        request to specified URL (DNC_URL + '/user/' + [rows[id - 1].name]). It
        includes logic to set up headers, prepare data for the request body, 
        construct the request options, and handle the response.The user to be
        deleted is identified by the id parameter passed to the function.

     Return:
        If there is an error during the request, the Promise is rejected with
        the error (reject(error)).    

    */
    function deleteUser(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            let mydict = {};
            mydict['user'] = myuobj.user;
            mydict['level'] = myuobj.level;
            // console.log('User Request: ', mydict);
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/user/' + [rows[id - 1].name]);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Data-remove: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    // console.log('Remove Error: ', error);
                    reject(error);
                });
        });
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const processRowUpdate = async (newRow) => {
        // console.log('Process Row Update');
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };
    const makeUserEditable = () => {
        setShowEditUser(false);
        getUserInfo();
    };

    async function getUserInfo() {
        const myuser = await getUserData();
        setRows(myuser);
    }

    /*

    Name:	getUserData()

    Function:
        getUserData function to fetch user data by making asynchronous HTTP GET 
        request to a specified URL (DNC_URL + '/user').The user data processed
        to create a formatted user list before resolving the Promise.

    Definition:
        Representation of function, variable, class, other element in code. It
        specifies the characteristics and behavior of the entity being defined.

    Description:
        getUserData function is fetch user data by making asynchronous HTTP GET
        request to a specified URL (DNC_URL + '/user').It includes logic to set
        up headers, construct the request options, and handle the response. The
        user data is processed to create a formatted user list before resolving 
        the Promise.

    */
    function getUserData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/user');
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['name'] = item['name'];
                        myrow['email'] = item['email'];
                        myrow['firstname'] = item['firstName'];
                        myrow['lastname'] = item['lastName'];
                        myrow['role'] = myroles[item['role'] - 1];
                        myrow['status'] = item['status'];
                        myrow['lastlogin'] = item['lastLogin']['login'];
                        myrow['logout'] = item['lastLogin']['logout'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };
    // Close the dialog
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    // Download CSV with the provided file name
    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };
    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
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

    // for PDF
    const [pdfFileName, setPdfFileName] = React.useState('');
    const handleOpenDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(true);
    };
    const handleCloseDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(false);
    };
    const handlePdfFileNameChange = (event) => {
        setPdfFileName(event.target.value);
    };
    const handleExportPdf = () => {
        handleCloseDownloadPdfDialog();
        handleGeneratePdf(pdfFileName);
    };
    const pdfCellWidth = 70;
    const handleGeneratePdf = (fileName) => {
        const doc = new jsPDF();
        const columns = thcolumns.map((col) => col.headerName);
        // Calculate the total number of pages required based on the rows
        const totalPages = Math.ceil(rows.length / 10); // Assuming 10 rows fit on each page
        let startY = 10; // Initial Y position for the first page
        for (let page = 1; page <= totalPages; page++) {
            if (page > 1) {
                doc.addPage();
            }
            // Calculate the ending index for the current page
            const endIndex = page * 10;
            const pageRows = rows.slice((page - 1) * 10, endIndex);
            const tableData = pageRows.map((row) => thcolumns.map((col) => row[col.field]));
            // Calculate the width for each column based on thcolumns
            const columnWidths = thcolumns.map((col) => col.width || 100); // Default width: 100 if not specified
            // Add the PDF table to the document for the current page
            doc.autoTable({
                head: [columns],
                body: tableData,
                startY,
                styles: {
                    fontSize: 10,
                    cellPadding: { top: 5, right: 5, bottom: 5, left: 5 }
                },
                columnStyles: {
                    // Set individual column widths based on thcolumns
                    ...columnWidths.reduce((acc, width, index) => {
                        acc[index] = { cellWidth: width };
                        return acc;
                    }, {})
                    // Add more column styles for each column if needed
                },
                // Set the width of the table to match the content
                tableWidth: 'auto',
                // Add custom 'pageBreak' option to ensure table content flows across pages
                pageBreak: 'auto'
            });
            // Update the starting position for the next page
            startY = doc.autoTable.previous.finalY + 10;
        }
        // Save the PDF
        doc.save(`${fileName}.pdf`);
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
                {/* <Button variant="text" startIcon={<PdfIcon />} onClick={handleOpenDownloadPdfDialog}>
                    Export PDF
                </Button> */}
            </GridToolbarContainer>
        );
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div>
            {showEditUser ? <EditUser mydata={{ sdata: rows[selid - 1], hcb: makeUserEditable }} /> : null}
            <div className="data-grid-container" style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                <DataGrid
                    rows={rows}
                    columns={thcolumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    density="compact"
                    slots={{
                        toolbar: CustomToolbar
                    }}
                />
            </div>
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                        <TextField
                            id="linkmail"
                            size="small"
                            label="Enter Name"
                            fullWidth
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

            <Dialog open={openDownloadPdfDialog} onClose={handleCloseDownloadPdfDialog}>
                <DialogTitle>Enter PDF File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField id="linkmail" label="Enter Name" fullWidth value={pdfFileName} onChange={handlePdfFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadPdfDialog}>Cancel</Button>
                    <Button onClick={handleExportPdf} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

            <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleCaptchaDialogConfirm} />
        </div>
    );
}

/**** end of inviteuser.js ****/
