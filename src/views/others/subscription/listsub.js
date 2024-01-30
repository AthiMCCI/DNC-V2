/*

Module: listsub.js

Function:
    Implementation code for Subscription.
    .

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
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Typography from '@mui/material/Typography';
// User defined Import
import { constobj } from './../../../misc/constants';
import EditSub from './editsub';
import CaptchaDialog from './../../CaptchaDialog';
import { toast } from 'react-toastify';
// Import the CSS for react-toastify if you're using it
import 'react-toastify/dist/ReactToastify.css';

export default function ListSub(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showSubsUser, setShowSubsUser] = React.useState(false);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [openCaptchaDialog, setOpenCaptchaDialog] = React.useState(false);
    const [selectedSubIdForDeletion, setSelectedSubIdForDeletion] = React.useState(null);

    const thcolumns = [
        { field: 'id', headerName: 'S/No', width: 10 },
        { field: 'orgname', headerName: 'Organization', width: 180 },
        { field: 'devices', headerName: 'Total Devices', width: 120 },
        { field: 'splan', headerName: 'Plan Opted', width: 120 },
        { field: 'sdate', headerName: 'Start Date', width: 200 },
        { field: 'edate', headerName: 'End Date', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                // Use "row" to access user data
                const { name, role } = row; // Extract name and role from the user's row data
                return [
                    <GridActionsCellItem title="Edit User" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditSubs(id)} />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteSubs(id)} // Pass name and role here
                    />
                ];
            }
        }
    ];
    const handleDeleteSubs = (id) => () => {
        console.log('Delete Subscription initiated. ID:', id);
        setSelectedSubIdForDeletion(id);
        setOpenCaptchaDialog(true);
    };

    // Function to confirm deletion after captcha validation
    const handleCaptchaDialogConfirm = () => {
        console.log('Captcha confirmed. Deleting subscription with ID:', selectedSubIdForDeletion);
        setOpenCaptchaDialog(false);
        // deleteSubs(selectedSubIdForDeletion);
        handleConfirmDelete();
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };

    const handleConfirmDelete = () => {
        deleteSubs(selectedSubIdForDeletion)
            .then((dresp) => {
                toast.success(dresp.message); // Show success message using toast
                getSubsInfo(); // Refresh the user data
                // handleCloseDeleteDialog();
            })
            .catch((error) => {
                // console.error('Delete Error: ', error);
                toast.error(error); // Show error message using toast
                handleCloseDeleteDialog();
            });
    };
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    const handleEditSubs = (id) => () => {
        setSelId(id);
        setShowSubsUser(true);
    };

    /*
    | The `deleteSubs` function sends a request to delete a subscription from
    | server. It constructs a `DELETE` request with authorization headers and
    | subscription (retrieved using the provided `id` from the `rows` array).
    | The function returns a promise that resolves with the server's response
    | data or rejects in case of an error.
    */
    function deleteSubs(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            console.log('Delete Sub Req Rcvd: ', rows);

            let sdict = {};
            sdict['orgid'] = rows[id - 1].orgid;
            sdict['splan'] = rows[id - 1].splan;
            sdict['sdate'] = rows[id - 1].sdate;
            sdict['edate'] = rows[id - 1].edate;

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify({ sdata: sdict })
            };

            var url = new URL(DNC_URL + '/subs');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Delete Sub Success: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    console.error('Deletion error:', error);
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

    const makeSubsEditable = () => {
        setShowSubsUser(false);
        getSubsInfo();
    };

    async function getSubsInfo() {
        const myuser = await getSubsData();
        setRows(myuser);
    }

    function getSubsData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/subs');
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['orgid'] = item['orgid'] !== null ? item['orgid'].split(',')[0] : '';
                        myrow['orgname'] = item['orgid'] !== null ? item['orgid'].split(',')[1] : '';
                        myrow['devices'] = item['orgid'] !== null ? item['orgid'].split(',')[2] : '';
                        myrow['splan'] = item['splan'];
                        myrow['sdate'] = item['sdate'];
                        myrow['edate'] = item['edate'];
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
                {/* <Button variant="text" startIcon={<PdfIcon />} onClick={handleOpenDownloadPdfDialog}>
                    Export PDF
                </Button> */}
            </GridToolbarContainer>
        );
    }

    useEffect(() => {
        getSubsInfo();
    }, []);

    return (
        <div>
            {showSubsUser ? <EditSub mydata={{ sdata: rows[selid - 1], hcb: makeSubsEditable }} /> : null}
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
                        <TextField size="small" id="linkmail" label="Enter Name" value={csvFileName} onChange={handleCsvFileNameChange} />
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

/**** end of listsub.js ****/
