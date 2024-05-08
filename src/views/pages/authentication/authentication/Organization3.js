/*

Module: Organization.js

Function:
    Implementation code for Organization and Add Organization.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditOrganization from './editorganization';
import Swal from 'sweetalert2';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { constobj } from '../../../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { Link } from 'react-router-dom';
import CaptchaDialog from './../../../CaptchaDialog';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Organization() {
    const { DNC_URL } = { ...constobj };
    const [value, setValue] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [mypopup, setMyPopUp] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [orgNameError, setOrgNameError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deleteOrgId, setDeleteOrgId] = React.useState(null);
    const [deleteOrgName, setDeleteOrgName] = React.useState('');
    const [currentTab, setCurrentTab] = React.useState('Organization'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Organization');
                break;
            case 1:
                setCurrentTab('Add Organization');
                break;
            default:
                setCurrentTab('Organization'); // Default to 'User' if newValue is unexpected
                break;
        }
    };
    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'users', headerName: 'Users', width: 100 },
        { field: 'locations', headerName: 'Spots', width: 100 },
        {
            field: 'tags',
            headerName: 'Tags',
            width: 250,
            valueFormatter: ({ value }) => {
                if (Array.isArray(value)) {
                    return value.join(', '); // Join tags with comma and space
                }
                return value;
            }
        },
        { field: 'gateways', headerName: 'Gateways', width: 100 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                            onClick={handleCancelClick(id)}
                        />
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteClick(id, row.name, row.roleStatus)}
                    />
                ];
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
        setMyPopUp(true);
    };
    const makepopenable = () => {
        setMyPopUp(false);
        getOrgInfo();
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
    const handleOpenDeleteDialog = (id, orgName) => {
        setDeleteOrgId(id);
        setDeleteOrgName(orgName);
        setDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteConfirmed = async () => {
        try {
            // console.log('Start to delete an Org:', data[deleteOrgId - 1].name);
            const dresp = await deleteOrg(deleteOrgId);
            toast.success(dresp.message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            getOrgInfo();
            handleCloseDeleteDialog();
        } catch (error) {
            toast.error('An error occurred while deleting the organization. Please try again later.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'toast-error'
            });
            handleCloseDeleteDialog();
        }
    };

    const handleDeleteClick = (id, orgName, roleStatus) => () => {
        handleOpenCaptchaDialog(id, orgName);
    };

    const handleOpenCaptchaDialog = (id, orgName) => {
        setDeleteOrgId(id);
        setDeleteOrgName(orgName);
        setOpenCaptchaDialog(true);
    };
    const [openCaptchaDialog, setOpenCaptchaDialog] = React.useState(false);

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };
    const [data, setData] = useState([{ id: 1, name: '', locations: '', users: '', tags: '', gateways: '', grafanalink: '' }]);

    useEffect(() => {
        getOrgInfo();
    }, []);

    async function getOrgInfo() {
        const myuser = await getOrgData();
        setData(myuser);
        // console.log(myuser);
    }

    /*

    Name:	getOrgData()

    Function:
        Asynchronously fetches and formats organization data, returning a Promise with the 
        formatted list on success or rejecting with an error.

    Definition:
        Asynchronous function getOrgData for fetching and formatting organization data using Fetch API 
        and authorization headers.

    Description:
        This function asynchronously fetches organization data from the server using a GET request 
        with authorization headers. It then constructs a formatted list containing details such as 
        organization name, locations, user count, tags, gateways, and a Grafana link. The formatted 
        list is resolved in the Promise on successful data retrieval or rejected with an error in case 
        of failure.

    Return:
        Fetching and formatting organization data, resolving with the formatted 
        list on success or rejecting with an error.

    */

    // get User data
    function getOrgData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/org');
            let myolist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Data Received:  ', data);
                    data.message.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['name'] = item['name'];
                        myrow['locations'] = item['locations'][0];
                        myrow['users'] = item['users'].length;
                        myrow['tags'] = item['tags'];
                        myrow['gateways'] = item['gateways'].length;
                        myrow['grafanalink'] = item['grafanalink'];
                        myolist.push(myrow);
                    });
                    resolve(myolist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function deleteOrg(id) {
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
            var url = new URL(DNC_URL + '/org/' + data[id - 1].name);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <div>
                        {' '}
                        {/* Use a <div> container here */}
                        <Box sx={{ p: 3 }}>
                            <Typography>{children}</Typography>
                        </Box>
                    </div>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired
    };
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    const handleCreate = () => {
        let orgname = document.getElementById('org_name').value;
        let alltags = document
            .getElementById('otags')
            .value.split(',')
            .map((tag) => tag.trim());
        let orgtags = alltags.filter((row) => row !== '');
        let newOrgNameError = orgname === '';
        let newTagsError = orgtags.length === 0;
        // Only update the error state if there are validation errors
        if (newOrgNameError || newTagsError) {
            toast.error('Please fill out all the required fields.', {
                position: 'top-right',
                autoClose: 5000, // Close the alert after 5 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setOrgNameError(newOrgNameError);
            setTagsError(newTagsError);
        } else {
            setOrgNameError(false);
            setTagsError(false);
            createNewOrg({ name: orgname, tags: orgtags });
        }
    };

    async function createNewOrg(mydict) {
        try {
            const myresp = await addNewOrg(mydict);
            toast.success(myresp.message);
            getOrgInfo();
            setValue(0);
            sessionStorage.setItem('orgupdt', true);
        } catch (error) {
            toast.error(error.message);
        }
    }

    /*

    Name:	addNewOrg()

    Function:
        addNewOrg is an asynchronous function that returns a Promise. It sends a POST request to a specified 
        URL with authorization headers and user-provided data to add a new organization.

    Definition:
        Asynchronous function addNewOrg for adding a new organization using Fetch API and authorization headers.

    Description:
        This function asynchronously adds a new organization by sending a POST request to the server with 
        authorization headers and the provided organization data (mydict). It resolves the Promise with the 
        response data on successful addition or rejects with an error in case of failure.

    Return:
        Asynchronous function for adding a new organization, resolving with response data on success or 
        rejecting with an error.

    */

    function addNewOrg(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/org');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
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
        const csvData = data.map((row) => Object.values(row).join(',')).join('\n');
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
    const breadcrumbs = (
        <>
            {/* Customize your breadcrumbs here */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <RouterLink color="inherit" to="/">
                    {' '}
                    {/* Use RouterLink instead of Link */}
                    <HomeIcon fontSize="small" />
                </RouterLink>
                <Typography variant="body2" color="text.primary">
                    Administration
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );
    return (
        <div>
            {mypopup ? <EditOrganization mydata={{ sdata: data[selid - 1], hcb: makepopenable }} /> : null}
            <MainCard title="Manage Organization" breadcrumbs={breadcrumbs}>
                <div>
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab style={{ color: 'darkblue' }} icon={<Diversity3Icon />} label="Organization" {...a11yProps(0)} />
                                <Tab style={{ color: 'darkblue' }} icon={<GroupAddIcon />} label="Add Organization" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <div className="data-grid-container" style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                                <DataGrid
                                    slots={{ toolbar: GridToolbar }}
                                    rows={data}
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
                        </TabPanel>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '18%' } // Set width to 100% for all screen sizes
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TabPanel value={value} index={1}>
                                <TextField
                                    style={{ width: '23%' }}
                                    label="Organization Name"
                                    id="org_name"
                                    size="small"
                                    required
                                    error={orgNameError} // Dynamic error prop based on orgNameError variable
                                    helperText={orgNameError ? 'Organization Name is required' : ''}
                                />
                                <TextField
                                    style={{ width: '25%' }}
                                    size="small"
                                    id="otags"
                                    label="Tags"
                                    required
                                    error={tagsError} // Dynamic error prop based on tagsError variable
                                    helperText={tagsError ? 'Tags is required' : ''}
                                />

                                {/* Set width to 100% for all screen sizes */}
                                <Stack style={{ marginLeft: '22%', marginTop: '1.7%' }} direction="row" spacing={1}>
                                    <ColorButton size="small" onClick={handleCreate} variant="contained">
                                        Create
                                    </ColorButton>
                                </Stack>
                            </TabPanel>
                        </Box>
                    </Box>
                </div>
            </MainCard>

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

            <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleDeleteConfirmed} />
        </div>
    );
}

/**** end of Organization.js ****/
