/*

Module: brixhistory.js

Function:s
    Implementation code for brixtap.
    .

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Swal from 'sweetalert2';
import { useDemoData } from '@mui/x-data-grid-generator';
import 'jspdf-autotable';
import Typography from '@mui/material/Typography';
import { randomCreatedDate, randomTraderName, randomUpdatedDate, randomId } from '@mui/x-data-grid-generator';
import EditBrixHistory from './editbrixhistory';
import { constobj } from './../../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CaptchaDialog from './../../CaptchaDialog';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));
const mydate = randomCreatedDate();
const initialRows = [{ id: 1, brix: '', date: mydate }];

export default function BrixHistory(props) {
    const { CPLUGIN_URL } = { ...constobj };
    const [rows, setRows] = React.useState(initialRows);
    const [showEditBriHistory, setshowEditBriHistory] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [location, setLocation] = useState('Arnot');
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);

    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };

    // Close the dialog
    const columns = [
        { field: 'id', headerName: 'SlNo', width: 100 },
        { field: 'brix', headerName: 'Brix', width: 100 },
        { field: 'date', headerName: 'Date/Time', width: 400 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        title="Edit User"
                        icon={<EditIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteClick(id)} />
                ];
            }
        }
    ];
    const handleEditClick = (id) => () => {
        setSelId(id);
        setshowEditBriHistory(true);
    };
    const [openCaptchaDialog, setOpenCaptchaDialog] = useState(false);

    const handleDeleteClick = (id) => () => {
        setSelId(id);
        setOpenCaptchaDialog(true);
    };
    const handleCaptchaDialogConfirm = () => {
        console.log('Captcha confirmed. Deleting Brix History with ID:', selid);
        setOpenCaptchaDialog(false);
        deleteBrix(selid)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getBrixInfo(location); // Refresh the data
            })
            .catch((error) => {
                console.error('Delete Error: ', error);
                toast.error('Failed to delete.' + error); // Show error message using toast
            });
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };
    const handleConfirmDelete = () => {
        deleteBrix(selid)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getBrixInfo(location); // Refresh the user data
                handleCloseDeleteDialog();
            })
            .catch((error) => {
                // console.error('Delete Error: ', error);
                toast.error('Failed to delete user.'); // Show error message using toast
                handleCloseDeleteDialog();
            });
    };
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

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });
    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    useEffect(() => {
        getBrixInfo('Arnot');
    }, []);

    async function getBrixInfo(selloc) {
        const mybrix = await getBrixData(selloc);
        setRows(mybrix);
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };
    const makeUserEditable = () => {
        setshowEditBriHistory(false);
        getBrixInfo(location);
    };

    /*

    Name:	getBrixData(selloc)()

    Function:
        getDbList asynchronous function responsible for fetching Brix data for
        a specified location (selloc). It returns a promise that resolves to an
        array of objects containing Brix values and corresponding dates.

    Definition:
        function takes the selected location (selloc) as a parameter. It 
        retrieves the authorization token from the session storage and creates
        headers for the HTTP request.

    Description:
        It then creates an array (clist) containing objects for each data entry
        where each object has properties id (index + 1), brix (Brix value for
        the selected location), and date (date associated with the Brix value).
        The function resolves the promise with the clist array.

    Return:
        Error occurs during the fetch or processing, the function rejects the 
        promise with the error.

    */
    function getBrixData(selloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(CPLUGIN_URL + '/brix/' + selloc, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let clist = [];
                    data.forEach((item, index) => {
                        clist.push({ id: index + 1, brix: item[selloc], date: item['rdate'] });
                    });
                    resolve(clist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | converttimestr function that takes a JavaScript Date object (bdate) as a
    | parameter and converts it into a formatted date and time string. The time
    | is split into an array (mytime) using the 'T' delimiter and further split
    | using the '.' delimiter to remove milliseconds. The function constructs
    | a formatted date and time string (mybrixdate) in the format 
    | 'MM-DD-YYYY,HH:mm:ss'.
    */
    function converttimestr(bdate) {
        let brixdate = bdate.toISOString();
        let mydate = brixdate.split('T')[0].split('-');
        let mytime = brixdate.split('T')[1].split('.')[0];
        let mybrixdate = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        return mybrixdate;
    }

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        const newdict = {};
        const mid = updatedRow.id;
        const sid = (mid - 1).toString(10);
        let newdtstr = converttimestr(updatedRow.date);
        newdict['rdate'] = newdtstr;
        newdict[location] = updatedRow.brix;
        const mydict = {};
        let mydtstr = converttimestr(rows[sid].date);
        mydict['rdate'] = mydtstr;
        mydict[location] = rows[sid].brix;
        let uresp = await updateBrix({ data: mydict, new: newdict });
        Swal.fire(uresp);
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    /*
    | updateBrix function takes a dictionary (mydict) as a parameter, which is
    | expected to contain the data to be updated. It retrieve authentication 
    | token from the session storage (myToken). It sets up the necessary header
    | including authorization header with the token and content type header.
    */
    function updateBrix(mydict) {
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
            fetch(CPLUGIN_URL + '/brix', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    /*
    | deleteBrix function that sends a DELETE request to remove Brix data based
    | on specified row ID (rid). The function takes a row ID (rid) parameter
    | which is used to identify the specific Brix data to be delet. It creates
    | a dictionary (mydict) to represent the data to be sent the request body
    | This includes the Brix value (mydict[location]) and the date 
    | (mydict['rdate']) extracted from the corresponding row in the dataset.
    */
    function deleteBrix(rid) {
        return new Promise(async function (resolve, reject) {
            const mydict = {};
            let dtstr = converttimestr(new Date(rows[rid - 1].date));
            mydict['rdate'] = dtstr;
            mydict[location] = rows[rid - 1].brix;
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            fetch(CPLUGIN_URL + '/brix', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let mybrix = await getBrixData(selloc);
        setRows(mybrix);
    }
    async function onSubmitShow(e) {
        let mybrix = await getBrixData(location);
        setRows(mybrix);
    }

    return (
        <div>
            <div>
                <FormControl size="small" fullWidth style={{ width: '20%', marginRight: '10px' }}>
                    <InputLabel id="status-label">Select Location</InputLabel>
                    <Select labelId="demo-simple-select-label" name="location" value={location} id="location" onChange={locationChange}>
                        {locations.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ColorButton
                    style={{ marginTop: '0.5%' }}
                    size="small"
                    variant="contained"
                    color="success"
                    type="submit"
                    value="Show"
                    onClick={onSubmitShow}
                >
                    Show
                </ColorButton>
            </div>
            {showEditBriHistory ? <EditBrixHistory mydata={{ sdata: rows[selid - 1], location: location, hcb: makeUserEditable }} /> : null}
            <div className="data-grid-container" style={{ height: 400, width: '100%', marginTop: 20, marginLeft: -20 }}>
                <DataGrid
                    {...data1}
                    loading={loading}
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={columns}
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    density="compact"
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                />
            </div>

            {/* csv dowload name change option dilogue */}
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                        <TextField
                            id="linkmail"
                            label="Enter Name"
                            size="small"
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

            <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleCaptchaDialogConfirm} />
        </div>
    );
}

/**** end of brixhistory.js ****/
