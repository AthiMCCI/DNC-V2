/*

Module: listgateway.js

Function:
    Implementation code for Gateways.

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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import 'jspdf-autotable';
import { constobj } from './../../misc/constants';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Editgateway from './editgw';
import CaptchaDialog from './../CaptchaDialog';

export default function ListGateway(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditGw, setShowEditGw] = React.useState(false);
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [openCaptchaDialog, setOpenCaptchaDialog] = useState(false);

    const thcolumns = [
        { field: 'id', headerName: 'S/N' },
        { field: 'name', headerName: 'Name' },
        { field: 'hwid', headerName: 'HwId' },
        { field: 'model', headerName: 'Model' },
        { field: 'simmk', headerName: 'SIM' },
        { field: 'orgid', headerName: 'Org' },
        { field: 'location', headerName: 'Location' },
        { field: 'tech', headerName: 'Technology' },
        { field: 'network', headerName: 'Network' },
        { field: 'ssusc', headerName: 'SSUs' },
        { field: 'status', headerName: 'Status' },
        { field: 'remarks', headerName: 'Remarks' },
        { field: 'adate', headerName: 'Date' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            renderCell: ({ row }) => [
                <GridActionsCellItem
                    title="Edit Gateway"
                    icon={<EditIcon />}
                    label="Edit"
                    color="inherit"
                    onClick={handleEditGw(row.id)}
                />,
                <GridActionsCellItem
                    title="Track Gateway"
                    icon={<TrackChangesIcon />}
                    label="Edit"
                    color="inherit"
                    onClick={() => {
                        handleShowGwmr(row);
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    color="inherit"
                    onClick={() => {
                        handleDeleteConfirmation(row.id - 1);
                    }}
                />
            ]
        }
    ];

    const [dynamicColumns, setDynamicColumns] = React.useState(thcolumns);

    const measureTextWidth = (text, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        // Add padding and border widths to the measured text width
        const padding = 1; // You can adjust this value based on your styling
        const border = 1; // You can adjust this value based on your styling
        const width = context.measureText(text).width + padding + border;
        return width;
    };

    const handleDeleteConfirmation = async (id) => {
        setSelId(id);
        setOpenCaptchaDialog(true);
    };

    function deleteGw() {
        return new Promise(async function (resolve, reject) {
            try {
                // Check if rows is not empty and if rows[id - 1] exists
                const gwrow = rows[selid];
                // console.log('Delete GW callback: ', gwrow, gwrow.length);
                if (Object.keys(gwrow).length) {
                    if (gwrow.orgid != null && gwrow.orgid != '') {
                        reject({ message: "Can't delete the Gateway record; remove it from the organization, then try again." });
                    } else {
                        // console.log('Proceed Delete GW');
                        let auth = sessionStorage.getItem('myToken');

                        var myHeaders = new Headers();
                        myHeaders.append('Authorization', 'Bearer ' + auth);
                        myHeaders.append('Content-Type', 'application/json');

                        let mydict = {};
                        mydict['gwid'] = gwrow.gwid;

                        var requestOptions = {
                            method: 'DELETE',
                            headers: myHeaders,
                            body: JSON.stringify(mydict)
                        };

                        var url = new URL(DNC_URL + '/gwunit/' + gwrow.name);

                        fetch(url, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                // console.log('Data-remove: ', data);
                                // Remove the deleted row from the rows state
                                const updatedRows = rows.filter((row) => row.gwid !== gwrow.gwid);
                                resolve(updatedRows);
                            })
                            .catch((error) => {
                                // console.log('Remove Error: ', error);
                                reject(error);
                            });
                    }
                } else {
                    resolve({ message: 'Invalid index for deletion' });
                }
            } catch (error) {
                // console.error('Error deleting GW:', error);
                reject(error);
            }
        });
    }

    const calculateColumnWidths = () => {
        const maxWidths = {};
        dynamicColumns.forEach((col) => {
            const field = col.field;
            const headerText = col.headerName;
            const maxHeaderTextWidth = measureTextWidth(headerText, '29px Arial');

            const maxColumnWidth = Math.max(
                maxHeaderTextWidth,
                ...rows.map((row) => {
                    const cellContent = row[field] ? row[field].toString() : '';
                    const textWidth = measureTextWidth(cellContent, '18px Arial'); // Set the font style as needed
                    return textWidth;
                })
            );

            maxWidths[field] = maxColumnWidth;
        });
        return maxWidths;
    };

    const handleShowGwmr = (row) => {
        props.lgdata.cbf(2);
        props.lgdata.cbfshw(row.name);
    };

    const handleEditGw = (id) => () => {
        setSelId(id);
        setShowEditGw(true);
    };

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

    async function getGwInfo() {
        try {
            const mygw = await getGwData();
            setRows(mygw);
        } catch (error) {
            // console.error('Error getting GW data:', error);
        }
    }

    /*

    Name:	getGwData ()

    Function:
        appendGwData(mydict) send POST request endpoint (DNC_URL + '/agwmr')
        with the provided data (mydict). It returns a Promise that resolve with
        the JSON response from the server upon successful execution or rejects
        with an error if the request fails.

    Definition:
        The function is called with the data you want to append (myData). The 
        try block handles successful execution, and the catch block handles any
        errors that may occur during the request.

    Description:
        Retrieves the authentication token (myToken) from the session storage. 
        (myHeaders) and appends the authorization header using retrieved token. 
        Fetch Data from Server request options (requestOptions) with the method
        'GET' and the headers. URL object (url) based on the DNC_URL
        (which presumably points to the server endpoint for gateway data).

    */
    function getGwData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/gwmr');
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Fetched GW data:', data);
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['gwid'] = item['gwid'];
                        myrow['name'] = item['name'];
                        myrow['hwid'] = item['hwid'];
                        myrow['simmk'] = item['simmk'];
                        myrow['orgid'] = item['orgid'];
                        myrow['location'] = item['location'];
                        myrow['ssusc'] = item['ssusc'];
                        myrow['tech'] = item['tech'];
                        myrow['network'] = item['network'];
                        myrow['model'] = item['model'];
                        myrow['status'] = item['status'];
                        myrow['lactive'] = item['lactive'];
                        myrow['remarks'] = item['remarks'];
                        myrow['adate'] = item['adate'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    // console.error('Error fetching GW data:', error);
                    resolve([]); // Resolve with an empty array in case of an error
                });
        });
    }

    const makeGwEditable = () => {
        setShowEditGw(false);
        getGwInfo();
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
        const calculatedWidths = calculateColumnWidths();
        const updatedColumns = dynamicColumns.map((col) => ({
            ...col,
            width: calculatedWidths[col.field] // Use the calculated width
        }));
        setDynamicColumns(updatedColumns);
    }, [rows]);

    useEffect(() => {
        getGwInfo();
    }, []);

    return (
        <div>
            {showEditGw ? <Editgateway mydata={{ sdata: rows[selid - 1], hcb: makeGwEditable }} /> : null}
            <div style={{ height: 400, width: '105%', marginTop: -1, marginLeft: -20 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={dynamicColumns}
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
                    onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
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
                        <TextField id="linkmail" label="Enter Name" fullWidth value={csvFileName} onChange={handleCsvFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)}>
                {/* Render the CaptchaDialog component */}
                <CaptchaDialog
                    open={openCaptchaDialog}
                    onClose={() => setOpenCaptchaDialog(false)}
                    onDelete={async () => {
                        // Captcha validated, now perform the actual deletion
                        if (selid != null) {
                            try {
                                const updtrows = await deleteGw();
                                if (updtrows) {
                                    getGwInfo();
                                    toast.success('Gateway deleted successfully');
                                }
                            } catch (error) {
                                // console.error('Error deleting GW:', error);
                                toast.error(error.message);
                            }
                        }
                        // Close the captcha dialog after attempted deletion
                        setOpenCaptchaDialog(false);
                    }}
                />
            </Dialog>
        </div>
    );
}

/**** end of listgateway.js ****/
