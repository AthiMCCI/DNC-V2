/*

Module: listorguser.js

Function:
    Implementation code for orguser.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { constobj } from './../../../misc/constants';
import EditOrgUser from './editorguser';
import CaptchaDialog from './../../CaptchaDialog';

export default function ListOrgUser(props) {
    const { DNC_URL } = { ...constobj };
    const [myuser, setMyUser] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rows, setRows] = React.useState([]);
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [restUsers, setRestUsers] = useState(['select a Org']);
    const [selUser, setSelUser] = useState(['select a User']);
    const [showEditOrgUser, setShowEditOrgUser] = React.useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const myroles = ['Org-User', 'Org-Admin', 'App-User', 'App-Admin'];
    const [confirmCaptchaDialogOpen, setConfirmCaptchaDialogOpen] = React.useState(false);
    const [selectedUserIdForDelete, setSelectedUserIdForDelete] = React.useState(null);

    let myorg = sessionStorage.getItem('myOrg');

    const handleButtonClick = () => {
        addUserToOrg();
    };

    const thcolumns = [
        { field: 'id', headerName: 'S/No', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem title="Edit User" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditUser(id)} />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteUser(id)} />
                ];
            }
        }
    ];

    const handleEditUser = (id) => () => {
        setSelId(id);
        setShowEditOrgUser(true);
    };
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
    const handleDeleteUser = (id) => () => {
        setSelId(id);
        setSelectedUserIdForDelete(id);
        setConfirmCaptchaDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };

    const handleConfirmCaptchaDelete = async () => {
        handleCloseDeleteDialog();
        setConfirmCaptchaDialogOpen(false);
        try {
            let dresp = await removeUser(selid);
            toast.success('User removed successfully');
        } catch (error) {
            toast.error(`User remove failed!`, error);
        } finally {
            getUserInfo(myorg);
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };
    const makeUserEditable = () => {
        setShowEditOrgUser(false);
        let myorg = sessionStorage.getItem('myOrg');
        getUserInfo(myorg);
    };
    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);

    useEffect(() => {
        // console.log("Use Effect")
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

    /*
    | getUserInfo definitions and implementation of the functions (getUserData,
    | getAllUserList, getLinkedUser, setData, setRow, setRestUsers, setSelUser)
    | (getUserData and getAllUserList) to fetch user data and a list of user.
    | Data Processing: Update state (setData and setRows) with the user data.
    | Filtering Unlinked Users: list of users linked to specified organization
    | (linkeduser). Creates a list of users who are not linked to organization
    | (finalList).
    */
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

    /*
    | addUserToOrg Request Payload: (mydict) with properties for the function
    | code (fncode), organization (org), and user data (data). Adding User to 
    | Organization: Calls the requestToAddUser function with the constructed 
    | dictionary to add the user to the organization. Success Handling: user
    | information by calling the getUserInfo function.Toast Notifications: a 
    | success toast notification if the user is added successfully. Displays an
    | error toast notification if there is an error during the addition.
    */
    async function addUserToOrg() {
        const mydict = {};
        mydict['fncode'] = 'adduser';
        mydict['org'] = myorg;
        mydict['data'] = { users: [selUser] };
        try {
            const myresp = await requestToAddUser(mydict);
            getUserInfo(myorg);
            toast.success('User has been successfully added to the organization!', {
                position: 'top-right',
                autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (error) {
            // console.error('Error adding user:', error);
            toast.error('Failed to add user to the organization. Please try again later.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    /*
    | requestToAddUser It handles authentication adding an authorization token
    | to the request headers and supports asynchronous handling of the HTTP 
    | request and response.
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
            var url = new URL(DNC_URL + '/org');
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
    | removeUser can Fetch API to make an HTTP PUT request to the specified URL
    | with the provided options. Response Handling: The function handles the 
    | response asynchronously using async/await. It parses the JSON response 
    | with response.json(). Logging and Resolution:Logs the received data the
    | console for debugging purposes. Resolves the Promise with the received
    | data if the request is successful.
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

    Name:   getAllUserList()

    Function:
        getAllUserList, Functions is used to make an asynchronous HTTP GET
        request to fetch a list of all users.

    Definition:
        Asynchronous operations Authorization Header It retrieves the 
        authorization token from the session storage and adds it to the request
        headers. Fetch API Utilizes the Fetch API to make an asynchronous HTTP 
        GET request to the specified URL with the provided options. Response
        Handling. The function handles the response asynchronously using 
        async/await. It parses the JSON response with response.json().

    Description:
       The received data to extract user names and populates the myulist array
       with user names. Logging and Resolution Resolves the Promise with the
       populated user list if the request is successful.

    Return:
        There is an error during the fetch or JSON parsing, the Promise is 
        rejected with the encountered error.

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

    Name:   getUserData()

    Function:
        getAllUserList, This function asynchronously fetches user data for a 
        specified organization from a server using a GET request. 

    Definition:
        Asynchronous function (async). It takes a parameter myorg, representing
        the organization for which user data is requested. The function returns
        a Promise, which resolves to an array (myulist) containing formatted 
        user information.

    Description:
       Retrieves user data for a specified organization from a server using a
       GET request. It includes authorization headers, processes the response, and
       transforms the data into a formatted list of user information.

    Return:
        The Promise is rejected with the error.

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

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button style={{ fontSize: '13px' }} variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownloadDialog}>
                    Export CSV
                </Button>
            </GridToolbarContainer>
        );
    }
    return (
        <div>
            {showEditOrgUser ? <EditOrgUser mydata={{ sdata: rows[selid - 1], hcb: makeUserEditable }} /> : null}
            <div style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={thcolumns}
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    density="compact"
                    slotProps={{
                        toolbar: { setRows, setRowModesModel }
                    }}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                />
            </div>
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField
                            id="linkmail"
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
            <CaptchaDialog
                open={confirmCaptchaDialogOpen}
                onClose={() => setConfirmCaptchaDialogOpen(false)}
                onDelete={handleConfirmCaptchaDelete}
            />
        </div>
    );
}

/**** end of listorguser.js ****/
