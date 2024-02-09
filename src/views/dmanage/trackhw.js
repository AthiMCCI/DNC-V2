/*

Module: trackhw.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from '../../misc/constants';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditDevice from './editssu';
import EditHw from './edithw';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';

export default function TrackHw(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditStock, setShowEditStock] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);

    let snhold = cfgmenu['alias']['Stock'] ? cfgmenu['alias']['Stock'] : 'Stock';

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 10 },
        { field: 'hwsl', headerName: 'HW Serial', width: 150 },
        { field: 'boardrev', headerName: 'Board Revision', width: 110 },
        { field: 'fwver', headerName: 'Fw.Ver', width: 80 },
        { field: 'tech', headerName: 'Technology', width: 120 },
        { field: 'network', headerName: 'Network', width: 100 },
        { field: 'region', headerName: 'Region', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 130 },
        { field: 'adate', headerName: 'Date', width: 190 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        title={`Edit ${snhold}`}
                        icon={<EditIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleEditHw(id)}
                    />
                ];
            }
        }
    ];
    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };
    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
    };
    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };
    const handleExportCsv = (fileName) => {
        // Filter out the 'actions' column from the columns for CSV export
        const filteredColumns = thcolumns.filter((column) => column.field !== 'actions');
        // Extract column headers
        const headers = filteredColumns.map((column) => column.headerName);
        // Generate CSV data string, excluding the 'actions' data
        const csvRows = rows.map((row) => {
            return filteredColumns
                .map((column) => {
                    // Handle potential commas and quotes in cell values
                    let cellValue = row[column.field] ? row[column.field].toString() : '';
                    cellValue = cellValue.replace(/"/g, '""'); // Escape double quotes
                    return `"${cellValue}"`; // Wrap cell values in quotes to handle commas and quotes
                })
                .join(',');
        });

        // Combine headers and row data into a single CSV string
        const csvData = [headers.join(','), ...csvRows].join('\n');

        // Create a blob with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });
        // Create a temporary link to download the CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`; // Set the file name
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
                <Button
                    style={{ fontSize: '13px' }}
                    variant="text"
                    startIcon={<DownloadIcon />}
                    onClick={handleOpenDownloadDialog} // Make sure this line correctly references the function
                >
                    Export CSV
                </Button>
            </GridToolbarContainer>
        );
    }

    const handleEditHw = (id) => () => {
        // console.log('Handle Edit Hw');
        setSelId(id);
        setShowEditStock(true);
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

    /*

    Name:	getHwTrack()

    Function:
        It fetches hardware tracking data based on a specified hardware serial
        number (hwsl). The function makes a GET request to a URL authorization
        header, retrieves the data, and formats it into a list before resolving
        the Promise.

    Definition:
        Asynchronous function getHwTrack for fetching hardware tracking data 
        based on a hardware serial number using Fetch API and authorization 
        headers. It returns a Promise.

    Description:
        The data includes details such as hardware serial number (hwsl), board 
        revision (boardrev), firmware version (fwver), technology (tech), 
        network, region, remarks, arrival date (adate), and user. The formatted
        list is then resolved in the Promise on successful data retrieval or 
        rejected with an error.

    Return:
        function for fetching hardware tracking data, returning a Promise that
        resolves with a formatted list on success or rejects with an error.

    */

    function getHwTrack() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/thwmr/' + props.thdata.selHwsl);
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['hwsl'] = item['hwsl'];
                        myrow['boardrev'] = item['boardrev'];
                        myrow['fwver'] = item['fwver'];
                        myrow['tech'] = item['tech'];
                        myrow['network'] = item['network'];
                        myrow['region'] = item['region'];
                        myrow['remarks'] = item['remarks'];
                        myrow['adate'] = item['adate'];
                        myrow['user'] = item['userid'];

                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function trackOneHw() {
        const mystock = await getHwTrack();
        setRows(mystock);
        // console.log(mystock);
    }

    const makeStockEditable = () => {
        setShowEditStock(false);
        // getStockInfo();
    };
    const makeDmdEditable = () => {
        setShowEditDmd(false);
        getStockInfo();
    };

    useEffect(() => {
        trackOneHw();
    }, []);

    return (
        <div>
            {showEditStock ? <EditHw mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable }} /> : null}
            {showEditDmd ? <EditDmd mydata={{ sdata: rows[selid - 1], hcb: makeDmdEditable, userName: selectedUserName }} /> : null}
            <div style={{ height: 400, width: '100%', marginTop: 10, marginLeft: -20 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={thcolumns}
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    density="compact"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={onProcessRowUpdateError}
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
                    <TextField size="small" label="CSV File Name" value={csvFileName} onChange={handleCsvFileNameChange} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv}>Download</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of trackhw.js ****/
