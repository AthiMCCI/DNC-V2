/*

Module: taphistory.js

Function:
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
import Swal from 'sweetalert2';
import { useDemoData } from '@mui/x-data-grid-generator';
import 'jspdf-autotable';
import { randomCreatedDate, randomTraderName, randomUpdatedDate, randomId } from '@mui/x-data-grid-generator';
import EditTabHistory from './edittaphistory';
import { constobj } from './../../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import CaptchaDialog from './../../CaptchaDialog';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));
const mydate = randomCreatedDate();
const initialRows = [{ id: 1, location: '', dcp: '', tapCount: '', edate: mydate }];

export default function TapHistory(props) {
    const { DNC_URL, CPLUGIN_URL } = { ...constobj };
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditTabHistory, setshowEditTabHistory] = React.useState(false);
    const [location, setLocation] = useState('All');
    const [dcpoints, setDcpoints] = useState([{ sid: 1, sname: 'All' }]);
    const [selid, setSelId] = React.useState();
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [selSpot, setSelSpot] = useState('All');
    // const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const locations = [
        { id: 1, label: 'All', value: 'All' },
        { id: 2, label: 'Arnot', value: 'Arnot' },
        { id: 3, label: 'Uihlein', value: 'Uihlein' },
        { id: 4, label: 'UVM', value: 'UVM' }
    ];
    const columns = [
        { field: 'id', headerName: 'SlNo', width: 100, editable: false },
        { field: 'location', width: 150, headerName: 'Location', type: 'string', editable: false },
        {
            field: 'dcp',
            headerName: 'DCP',
            type: 'string',
            width: 100,
            editable: false
        },
        {
            field: 'tapCount',
            headerName: 'Tap Count',
            type: 'number',
            width: 150,
            editable: true
        },
        {
            field: 'edate',
            headerName: 'Date (DD/MM/YYYY), Time',
            type: 'dateTime',
            format: 'yyyy/mm/dd',
            width: 250,
            editable: true
        },
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

    const handleDeleteClick = (id) => () => {
        setSelId(id);
        setOpenCaptchaDialog(true);
    };
    const handleCaptchaDialogConfirm = () => {
        console.log('Captcha confirmed. Deleting Tap History with ID:', selid);
        setOpenCaptchaDialog(false);
        deleteTap(selid)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getTapInfo(location, selSpot); // Refresh the data
            })
            .catch((error) => {
                console.error('Delete Error: ', error);
                toast.error('Failed to delete.' + error); // Show error message using toast
            });
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };
    const [openCaptchaDialog, setOpenCaptchaDialog] = React.useState(false);

    const handleConfirmDelete = () => {
        console.log('Start to delete Tap: ', selid);
        deleteTap(selid)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getTapInfo(location, selSpot); // Refresh the user data
                handleCloseDeleteDialog();
            })
            .catch((error) => {
                console.error('Delete Error: ', error);
                toast.error('Failed to delete user.' + error); // Show error message using toast
                handleCloseDeleteDialog();
            });
    };
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

    useEffect(() => {
        getAllSpotTaps();
    }, []);

    async function getAllSpotTaps() {
        let myorg = sessionStorage.getItem('myOrg');
        let mydev = await getDeviceList(myorg, 'All');
        setDcpoints(mydev);
        getTapInfo('All', 'All');
    }

    async function getTapInfo(loc, dcp) {
        const mytap = await getTapData(loc, dcp);
        setRows(mytap);
    }

    function convertdatetime(indata) {
        const [mydate, mytime] = indata.split('T');
        const ndate = mydate.replace(/-/g, '/');
        const [ntime, zonet] = mytime.split(',');
        const ftime = '' + ndate + ',' + ntime + ' AM';
    }

    /*

    Name:	getTapData(loc, dcp)()

    Function:
        function that retrieves tap data based on location (loc) and dcp 
        (possibly stands for "Department of Conservation and Parks") parameter.
        It returns a promise that resolves to an array of tap data.

    Definition:
        CPLUGIN_URL is a variable containing the base URL for tap data endpoint
        the function utilize the sessionStorage to manage authentication, which
        implies that the user's session token is stored in the session storage.

    Description:
        Create a URL object (url) for tap data endpoint (CPLUGIN_URL + '/tap').
        Append non-'All' parameters from mybody to the URL's search parameters.
        Performs a GET request to specified URL with the constructed headers.

    */
    function getTapData(loc, dcp) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mybody = {
                location: loc,
                dcp: dcp
            };
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(CPLUGIN_URL + '/tap');
            for (let key in mybody) {
                if (mybody[key] !== 'All') url.searchParams.append(key, mybody[key]);
            }
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        item['id'] = index + 1;
                        item['edate'] = new Date(item['edate']);
                    });
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getDeviceList function that retrieves a list of devices based on the
    | provided client (gclient) and location (gloc) parameters. It returns a
    | promise that resolves to an array of devices. client 'SomeClient' and 
    | location 'SomeLocation', and the retrieved device list is logged further
    | processed. The result includes an 'All' option with filtered devices.
    */
    function getDeviceList(gclient, gloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(DNC_URL + '/spot/' + gclient, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    let cdev = data.filter(function (row) {
                        if (gloc === 'All') {
                            return row.sname;
                        } else {
                            // return row.Location == gloc && row.rdate == null;
                            return row.location == gloc;
                        }
                    });
                    resolve([{ sid: 1, sname: 'All' }, ...cdev]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let myorg = sessionStorage.getItem('myOrg');
        let mydev = await getDeviceList(myorg, selloc);
        setDcpoints(mydev);
    }

    function triggerTapRead() {
        getTapInfo(location, selSpot);
    }
    async function onSubmitCount(e) {
        triggerTapRead();
    }
    async function spotChange(e) {
        setSelSpot(e.target.value);
        getTapInfo(location, e.target.value);
    }

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    /*
    | updateTap function that updates tap-related data using a specified
    | dictionary (mydict). It returns a promise that resolves to a message
    | indicating the result of the update. The necessary headers (myHeaders)
    | for the HTTP request. Creates a PUT request (requestOptions) with the 
    | specified headers and the body containing the JSON-serialized mydict. 
    | Performs a PUT request to the tap endpoint (CPLUGIN_URL + '/tap') with 
    | the constructed headers and request options.
    */
    function updateTap(mydict) {
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
            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | deleteTap function that deletes tap-related data for a specific record
    | (identified by rid). That deletes tap-related data for a specific record
    | (identified by rid).
    */
    function deleteTap(rid) {
        return new Promise(async function (resolve, reject) {
            let mydict = rows[rid - 1];
            const mybody = {
                location: mydict.location,
                dcp: mydict.dcp,
                edate: mydict.edate
            };
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mybody)
            };
            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Tap Delete Success: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    console.log('Tap delete error: ', error);
                    reject(error);
                });
        });
    }

    const handleEditClick = (id) => () => {
        setSelId(id);
        setshowEditTabHistory(true);
    };
    const makeUserEditable = () => {
        setshowEditTabHistory(false);
        getTapInfo(location, selSpot);
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };
    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        const newdict = {};
        const mid = updatedRow.id;
        const sid = (mid - 1).toString(10);
        newdict['edate'] = updatedRow.edate;
        newdict['tapCount'] = updatedRow.tapCount;
        const mydict = {};
        mydict['location'] = rows[sid].location;
        mydict['dcp'] = rows[sid].dcp;
        mydict['edate'] = rows[sid].edate;
        mydict['tapCount'] = rows[sid].tapCount;
        let uresp = await updateTap({ data: mydict, new: newdict });
        Swal.fire(uresp);
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return (
        <div>
            <div>
                <FormControl size="small" fullWidth style={{ width: '20%', marginRight: '10px' }}>
                    <InputLabel id="status-label">Select Location</InputLabel>
                    <Select labelId="demo-simple-select-label" name="location" id="location" value={location} onChange={locationChange}>
                        {locations.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" fullWidth style={{ width: '20%' }}>
                    <InputLabel id="status-label">Select Data Point (DCP)</InputLabel>
                    <Select labelId="demo-simple-select-label" name="dcpoint" id="dcpoint" value={selSpot} onChange={spotChange}>
                        {dcpoints.map((msgLoc) => (
                            <MenuItem key={msgLoc.sid} value={msgLoc.sname}>
                                {msgLoc.sname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ColorButton
                    style={{ marginTop: '0.5%', marginLeft: '1%' }}
                    size="small"
                    variant="contained"
                    color="success"
                    type="submit"
                    value="Show"
                    onClick={onSubmitCount}
                >
                    Show
                </ColorButton>
            </div>
            {showEditTabHistory ? <EditTabHistory mydata={{ sdata: rows[selid - 1], hcb: makeUserEditable }} /> : null}
            <div style={{ height: 400, width: '100%', marginTop: 20, marginLeft: -20 }}>
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
            <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleCaptchaDialogConfirm} />
        </div>
    );
}

/**** end of taphistory.js ****/
