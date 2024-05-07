/*

Module: addremuser.js

Function:
    Implementation code for Users.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import EditUser from './edituser';
import { constobj } from './../../misc/constants';
import { toast } from 'react-toastify';
import CaptchaDialog from './../CaptchaDialog';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

/*

Name:	AddRemUser()

Function:
    Manages user information in a grid, allowing actions like add, edit, save, 
    cancel, delete, with asynchronous operations, interval-based organization 
    updates, and Material-UI components for rendering and user interaction.

Definition:
    It defines a user management component using React hooks and Material-UI 
    for a grid-based user interface.

Description:
	The component handles user actions (add, edit, save, cancel, delete), 
    utilizes Material-UI for rendering, employs asynchronous operations user 
    updates, checks for organization changes at intervals. The grid displays
    user information, and the component is part of a larger system for managing
    users associated with organizations.

*/
export default function AddRemUser() {
    const { DNC_URL } = { ...constobj };
    const [myuser, setMyUser] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rows, setRows] = React.useState([]);
    const [selid, setSelId] = React.useState();
    const [restUsers, setRestUsers] = useState(['select a Org']);
    const [selUser, setSelUser] = useState('');
    const myroles = ['Org-User', 'Org-Admin', 'App-User', 'App-Admin'];
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [captchaDialogOpen, setCaptchaDialogOpen] = React.useState(false);

    let myorg = sessionStorage.getItem('myOrg');
    const handleButtonClick = () => {
        addUserToOrg();
    };
    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = [id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} onClick={handleSaveClick(id)} label="Save" />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            onClick={handleCancelClick(id)}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                        />
                    ];
                }
                return [<GridActionsCellItem onClick={handleDeleteClick(id)} icon={<DeleteIcon />} label="Delete" color="inherit" />];
            }
        }
    ];
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleEditClick = (id) => () => {
        setSelId(id);
        setMyUser(true);
    };
    const makeuserenable = () => {
        setMyUser(false);
    };
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        Swal.fire(`Role/Status for user ${rows[id - 1].name} updated successfully`);
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };
    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        });
    };
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleDeleteClick = (id) => () => {
        setDeleteItemId(id);
        // Open the captcha dialog for confirmation
        setCaptchaDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        setDeleteConfirmationOpen(false);
        if (deleteItemId !== null) {
            try {
                let dresp = await removeUser(deleteItemId);
                toast.success('User removed successfully');
            } catch (error) {
                toast.error(`User remove failed!`);
            } finally {
                getUserInfo(myorg);
            }
        }
    };
    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        return updatedRow;
    };
    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);
    useEffect(() => {
        myorg = sessionStorage.getItem('myOrg');
        getUserInfo(myorg);
        const interval = setInterval(() => {
            // console.log('This will run every second!');
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getUserInfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    async function getUserInfo(myorg) {
        const myuser = await getUserData(myorg);
        setData(myuser);
        setRows(myuser);
        const alluser = await getAllUserList();
        const linkeduser = getLinkedUser(myuser);
        let finalList = [];
        for (let i = 0; i < alluser.length; i++) {
            if (!linkeduser.includes(alluser[i])) {
                finalList.push(alluser[i]);
            }
        }
        let mynewo = [];
        for (let i = 0; i < finalList.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['label'] = finalList[i];
            mydict['value'] = finalList[i];
            mynewo.push(mydict);
        }
        setRestUsers(mynewo);
        setSelUser(mynewo[0].value);
    }

    async function addUserToOrg() {
        const mydict = {};
        mydict['fncode'] = 'adduser';
        mydict['org'] = myorg;
        mydict['data'] = { users: [selUser] };
        try {
            const myresp = await requestToAddUser(mydict);
            // await getUserInfo(myorg); // Refresh user list after adding
            toast.success('User added successfully');
            // return true; // Return success flag
        } catch (error) {
            toast.error(`Error: No User Found `);
            // return false; // Return error flag
        } finally {
            getUserInfo(myorg);
        }
    }

    /*

    Name:	requestToAddUser()

    Function:
        It takes a parameter mydict,presumably containing data to be sent in 
        the HTTP request. The function returns a Promise,indicating that it 
        performs an asynchronous operation.

    Definition:
        requestToAddUser function. It outlines how the function interacts with
        the Fetch API, constructs headers, and handles asynchronous operations
        using Promises.

    Description:
        requestToAddUser function appears to describe an asynchronous operation
        related to adding a user. It sets up headers, constructs the request 
        options, and uses the Fetch API to make an HTTP PUT request specified
        URL (DNC_URL + '/org'). The function returns a Promise that resolves 
        with the parsed JSON response if the request is successful or rejects
        with an error if there is an issue.

    */
    function requestToAddUser(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/org/' + mydict.org);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Data-1201: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | removeUser(id), which removes a user by making an asynchronous HTTP PUT
    | request to a specified URL. It uses the Fetch API, includes authentication
    | headers, and sends user data in the request body.The function returns a 
    | Promise that resolves with the server response or rejects with an error
    */
    function removeUser(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['fncode'] = 'rmuser';
            mydict['org'] = myorg;
            mydict['data'] = { users: [rows[id - 1].name] };
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/org/' + myorg);
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

    function getLinkedUser(myuser) {
        let linuser = [];
        for (let i = 0; i < myuser.length; i++) {
            linuser.push(myuser[i].name);
        }
        return linuser;
    }

    /*
    | getAllUserList(), which retrieves a list of users through an asynchronous
    | HTTP GET request. It uses Fetch API with authentication headers, processes
    | the response JSON to extract user names, and returns a Promise resolves 
    | with the list of user names or rejects with an error.
    */
    function getAllUserList() {
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
                        myulist.push(item['name']);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*

    Name:	getUserData()

    Function:
        Takes a single parameter myorg representing the organization for user
        data is to be retrieved. The function returns a Promise, indicating it
        performs an asynchronous operation.

    Definition:
        The Fetch API, constructs header, handles asynchronous operations using
        Promises, and processes the response data.
    
    Description:
        The getUserData function designed to fetch user data for a specified
        organization. It use authorization token from sessionStorage, construct
        headers for the HTTP request, and specifies a GET request to retrieve 
        data from a specific URL (DNC_URL + '/orguser/' + myorg).The response
        processed to create a formatted user list, which is then resolved if 
        the request successful or rejected with an error if there's an issue.
    
    Return:
        asynchronous operation is successful, and the reject function is used 
        return an error if there is an issue.

    */
    function getUserData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orguser/' + myorg);
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Data: ', data);
                    data.message.forEach((item, index) => {
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
    async function userChange(e) {
        let selfunc = e.target.value;
        setSelUser(e.target.value);
        // sessionStorage.setItem('myOrg', e.target.value);
    }

    function IconLabelTabs() {
        const [value, setValue] = React.useState(0);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
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
    return (
        <div>
            <div style={{ height: 100, margin: '5px 0' }}>
                {/* <h7 style={{ fontSize: '16px', marginBottom: '5px' }}>Select a User</h7> */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        style={{ width: '30%', marginTop: '-1%' }}
                        id="outlined-select-Main Org"
                        select
                        label="Select User"
                        Placeholder="select user"
                        size="small"
                        helperText=" "
                        value={selUser}
                        onChange={userChange}
                        sx={{ height: '40px' }}
                    >
                        {restUsers.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <ColorButton
                        size="small"
                        style={{ width: '8%', marginLeft: '2%', marginTop: '-1%' }}
                        onClick={handleButtonClick}
                        variant="contained"
                        color="info"
                    >
                        Add
                    </ColorButton>
                </div>
            </div>
            <div className="data-grid-container" style={{ height: 300, width: '100%', marginLeft: -20, marginTop: '-60px' }}>
                {myuser ? <EditUser mydata={{ sdata: rows[selid - 1], hcb: makeuserenable }} /> : null}
                <DataGrid
                    rows={rows}
                    columns={thcolumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    onRowEditCommit={processRowUpdate}
                    onRowEditError={onProcessRowUpdateError}
                    onRowClick={handleEditClick}
                    density="compact"
                    onRowSelectionChange={(newSelection) => {
                        // console.log(newSelection);
                    }}
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
                            size="small"
                            id="linkmail"
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
            {/* Delete Confirmation Dialog */}
            <CaptchaDialog open={captchaDialogOpen} onClose={() => setCaptchaDialogOpen(false)} onDelete={handleDeleteConfirmed} />
        </div>
    );
}

AddRemUser.propTypes = {
    title: PropTypes.string
};

/**** end of addremuser.js ****/
