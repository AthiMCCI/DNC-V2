/*

Module: DataSource.js

Function:
    Implementation code for DataSource.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
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
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import Editdatasource from './editdatasources';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'jspdf-autotable';
import './datasrc.css';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { constobj } from './../../misc/constants';
import 'react-toastify/dist/ReactToastify.css';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import CaptchaDialog from './../CaptchaDialog';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

/*

Name:	DataSource()

Function:
    Start  "DataSource" managing state for various parameters related to data 
    sources, including database details, selected items, and row modes. It also
    utilizes the Material-UI Grid component with actions for editing, saving, 
    canceling, and deleting rows.

Definition:
    data source parameters, Material-UI Grid integration with actions editing, 
    saving, canceling, and deleting rows.

Description:
	handles the state for data source details such as name, URL, database 
    credentials, and selected item. It incorporates Material-UI Grid displaying
    data action like editing, saving, canceling, and deleting row. Additionally
    it includes state management for pop-up dialogs and navigation functions.

*/

export default function DataSource() {
    const { DNC_URL } = { ...constobj };
    const [dsname, setDsName] = React.useState('');
    const [dburl, setDbUrl] = React.useState('http://influxdb:8086');
    const [dbuname, setDbUname] = React.useState('');
    const [dbpwd, setDbPwd] = React.useState('');
    const [dblist, setDblist] = React.useState([]);
    const [seldb, setSelDb] = React.useState('');
    const [mmtlist, setMmtlist] = React.useState([]);
    const [selmmt, setSelMmt] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [rows, setRows] = React.useState([]);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [mypopup, setMyPopUp] = React.useState(false);
    const [openCaptchaDialog, setOpenCaptchaDialog] = React.useState(false);

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });
    const [value, setValue] = React.useState(0);
    const [currentTab, setCurrentTab] = React.useState('Data Source'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Data Source');
                break;
            case 1:
                setCurrentTab('Add Data Source');
                break;
            default:
                setCurrentTab('Data Source'); // Default to 'User' if newValue is unexpected
                break;
        }
    };
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

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 50 },
        { field: 'dsname', headerName: 'Name', width: 150 },
        { field: 'dburl', headerName: 'URL', width: 350 },
        { field: 'dbname', headerName: 'DataBase Name', width: 160 },
        { field: 'mmtname', headerName: 'Measurement Name', width: 220 },
        { field: 'user', headerName: 'User', width: 80 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
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
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteUser(id)} />
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
        getDsInfo();
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
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const handleDeleteUser = (id) => () => {
        setSelId(id);
        setOpenCaptchaDialog(true);
    };
    const handleCloseCaptchaDialog = () => {
        setOpenCaptchaDialog(false);
    };
    const handleConfirmDeleteWithCaptcha = async () => {
        // Close the captcha dialog
        setOpenCaptchaDialog(false);

        try {
            // Perform user deletion
            // console.log('Start to delete a DS: ', data[selid - 1].dsname);
            let dresp = await deleteDs(selid);
            toast.success(dresp.message); // Show success message
            getDsInfo();
        } catch (error) {
            // console.error('Error deleting DS:', error);
            toast.error('Error deleting data source.'); // Show error message
        }
    };
    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };
    const handleConfirmDelete = async () => {
        setConfirmDeleteDialogOpen(false);
        try {
            // console.log('Start to delete a DS: ', data[selid - 1].dsname);
            let dresp = await deleteDs(selid);
            toast.success(dresp.message); // Show success message
            getDsInfo();
        } catch (error) {
            // console.error('Error deleting DS:', error);
            toast.error('Error deleting data source.'); // Show error message
        }
    };

    /*
    | deleteDs function delete data source with the specified ID asynchronously
    | It retrieves authentication information and user details, sets request 
    | headers, creates the request body, configures request options, builds the
    | request URL, and then perform the data deletion operation. The promise is
    | resolved with the response data successful, and rejected with an error
    | if any issues occur.
    */
    function deleteDs(id) {
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
            var url = new URL(DNC_URL + '/dsrc/' + data[id - 1].dsname);
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
    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        return updatedRow;
    };
    const [dsnameValid, setDsnameValid] = useState(false);
    const [dburlValid, setDburlValid] = useState(false);
    const [dbValid, setDbValid] = useState(false);
    const [mmtValid, setMmtValid] = useState(false);

    /*

    Name:   onsavesource ()

    Function:
        Asynchronous function for handling the creation and storage of a data
        source. It validates input fields, sets error flags, displays toast
        notifications for incomplete fields, and calls setDataSource to create 
        a new data source.

    Definition:
        Asynchronous function onsavesource for creating and storing a data
        source, with input validation, error handling, toast notifications, and
        calls to setDataSource.

    Description:
        handles the storage of a data source. It validate input field 
        completeness, sets error flag, displays a toast notification incomplete
        fields, and call the setDataSource function to create a new data source
        with the provided information. Upon success, it display a success toast
        clears fields, and updates the display of data sources. If an error 
        occurs during the process, it displays an error toast.

    Return:
        Asynchronous function for creating and storing data source, displaying
        success or error toasts based on the outcome.

    */
    async function onsavesource() {
        const dsname = document.getElementById('dsname_tin').value;
        const dburl = document.getElementById('dburl_tin').value;
        if (!dsname || !dburl || !seldb || !selmmt) {
            setDsnameValid(!dsname);
            setDburlValid(!dburl);
            setDbValid(!seldb);
            setMmtValid(!selmmt);
            // Show an error toast notification for incomplete fields
            toast.error('Please fill out all required fields.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return;
        } else {
            setDsnameValid(false);
            setDburlValid(false);
            setDbValid(false);
            setMmtValid(false);
        }
        let srcdict = {};
        srcdict['dsname'] = document.getElementById('dsname_tin').value;
        srcdict['dburl'] = document.getElementById('dburl_tin').value;
        srcdict['dbname'] = seldb;
        srcdict['mmtname'] = selmmt;
        srcdict['uname'] = document.getElementById('dbuname_tin').value;
        srcdict['pwd'] = document.getElementById('dbpwd_tin').value;
        try {
            let dres = await setDataSource(srcdict);
            toast.success(dres.message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            clearAllFields();
            setValue(0);
            getDsInfo();
        } catch (err) {
            toast.error(err.message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    function clearAllFields() {
        setDsName('');
        setDbUrl('http://influxdb:8086');
        setDbUname('');
        setDbPwd('');
    }

    //passwordfield
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = (event) => {
        event.preventDefault();
        setDsName(document.getElementById('dsname_tin').value);
        setDbUrl(document.getElementById('dburl_tin').value);
        setDbUname(document.getElementById('dbuname_tin').value);
        setDbPwd(document.getElementById('dbpwd_tin').value);
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //refreshdbonclick
    const handleRefershdb = async () => {
        setDsName(document.getElementById('dsname_tin').value);
        setDbUrl(document.getElementById('dburl_tin').value);
        setDbUname(document.getElementById('dbuname_tin').value);
        setDbPwd(document.getElementById('dbpwd_tin').value);
        const mydbs = await getDbList();
        let mydblst = [];
        for (let i = 0; i < mydbs.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mydbs[i];
            mydict['label'] = mydbs[i];
            mydblst.push(mydict);
        }
        setDblist(mydblst);
        setSelDb(mydblst[0].value);
        // console.log('My DBs ****', mydblst);
    };

    const handleRefershmmt = async () => {
        let mydb = seldb;
        const mymmts = await getMmtList(mydb);
        let mymmtlst = [];
        for (let i = 0; i < mymmts.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mymmts[i];
            mydict['label'] = mymmts[i];
            mymmtlst.push(mydict);
        }
        setMmtlist(mymmtlst);
        setSelMmt(mymmtlst[0].value);
    };

    const [data, setData] = useState([
        {
            id: 1,
            dsname: '',
            dburl: '',
            dbname: '',
            mmtname: '',
            uname: '',
            pwd: '',
            user: ''
        }
    ]);

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
        getDsInfo();
    }, []);

    async function getDsInfo() {
        const myuser = await getUserData();
        setData(myuser);
        // console.log('Set Data :', myuser);
    }

    async function onchangeDb(e) {
        let mseldb = e.target.value;
        setSelDb(mseldb);
        // console.log('Handle Read MMgt');
        if (mseldb !== '') {
            const mymmts = await getMmtList(mseldb);
            let mymmtlst = [];
            for (let i = 0; i < mymmts.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['value'] = mymmts[i];
                mydict['label'] = mymmts[i];
                mymmtlst.push(mydict);
            }
            setMmtlist(mymmtlst);
            setSelMmt(mymmtlst[0].value);
        }
    }

    async function onchangeMmt(e) {
        let mselmmt = e.target.value;
        setSelMmt(mselmmt);
    }

    /*
    | setDataSource function create new data source using provided information
    | asynchronously. retrieve authentication information, set request header,
    | configures request options, builds the request URL, and then performs the
    | data source creation operation. The promise is resolved with the response
    | data if successful, and rejected with an error if any issues occur.
    */
    function setDataSource(mydict) {
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
            var url = new URL(DNC_URL + '/dsrc');
            fetch(url, requestOptions)
                .then(async (response) => {
                    if (response.status == '400') {
                        let resp = await response.json();
                        reject(resp.message);
                    } else {
                        // console.log('Response Code: ', response.status);
                        //return response.json()
                        let data = await response.json();
                        resolve(data);
                    }
                })
                .catch((error) => {
                    // console.log('Err Resp SDS: ', error);
                    reject(error);
                });
        });
    }

    /*
    | getDbList function retrieves a list of databases asynchronously based on
    | the provided information. It retrieves authentication information, sets 
    | request headers, gets database connection details from input fields, 
    | configures request options, builds the request URL, and then performs the
    | database list retrieval operation. The promise is resolved with database
    | list if successful, and rejected with an error if any issues occur.
    */
    function getDbList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['dburl'] = document.getElementById('dburl_tin').value;
            mydict['dbuname'] = document.getElementById('dbuname_tin').value;
            mydict['dbpwd'] = document.getElementById('dbpwd_tin').value;
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getdbl');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.db_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getMmtList function retrieves a list of MMTs asynchronously based on the
    | provided database and connection information. authentication information,
    | sets request headers, gets database connection details from input fields,
    | adds the database name to the dictionary, configures request options, 
    | builds the request URL, then perform the MMT list retrieval operation.
    | The promise is resolved with the list of MMTs if successful, and rejected
    | with an error if any issues occur.
    */
    function getMmtList(dbname) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['dburl'] = document.getElementById('dburl_tin').value;
            mydict['dbuname'] = document.getElementById('dbuname_tin').value;
            mydict['dbpwd'] = document.getElementById('dbpwd_tin').value;
            mydict['dbname'] = dbname;
            // console.log('MMT Param: ', mydict);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getmmtl');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('List of MMT: ', data);
                    resolve(data.mmt_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getUserData function retrieve user data asynchronously, specifically data
    | source information, and returns a promise. It retrieves authentication 
    | information, sets request headers, configures request options, builds the
    | request URL, performs the user data retrieval operation, processes the 
    | retrieved data, the promise with the processed data if successful. If any
    | issues occur, the promise is rejected with an error.
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
            var url = new URL(DNC_URL + '/dsrc');
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['dsname'] = item['dsname'];
                        myrow['dburl'] = item['dburl'];
                        myrow['dbname'] = item['dbname'];
                        myrow['mmtname'] = item['mmtname'];
                        myrow['uname'] = item['uname'];
                        myrow['pwd'] = item['pwd'];
                        myrow['user'] = item['user'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // Tab bar function starts
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
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
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

    return (
        <div className="dashboard-container">
            {mypopup ? <Editdatasource mydata={{ sdata: data[selid - 1], hcb: makepopenable }} /> : null}
            <div className="dashboard-inner">
                <MainCard title="Manage Data Source" breadcrumbs={breadcrumbs}>
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<SettingsInputAntennaOutlinedIcon />}
                                        label="Data Source"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<AddCircleOutlinedIcon />}
                                        label="Add Data Source"
                                        {...a11yProps(1)}
                                    />
                                </Tabs>
                            </Box>

                            {/* tab bar started for gateways */}
                            <TabPanel value={value} index={0}>
                                <div style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                                    <DataGrid
                                        {...data1}
                                        loading={loading}
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

                            {/* tab bar for Add gateway */}
                            <TabPanel value={value} index={1}>
                                <Box
                                    component="form"
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '20px',
                                        padding: '15px'
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    {/* First row */}
                                    <TextField
                                        size="small"
                                        label="Name"
                                        defaultValue={dsname}
                                        id="dsname_tin"
                                        required
                                        error={dsnameValid}
                                        helperText={dsnameValid ? 'Name is required' : ''}
                                    />
                                    <TextField
                                        size="small"
                                        label="URL"
                                        defaultValue={dburl}
                                        id="dburl_tin"
                                        required
                                        error={dburlValid}
                                        helperText={dburlValid ? 'URL is required' : ''}
                                    />

                                    {/* Second row */}
                                    <TextField size="small" label="User-Name" defaultValue={dbuname} id="dbuname_tin" />
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="dbpwd_tin"
                                            size="small"
                                            defaultValue={dbpwd}
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>

                                    {/* Third row */}
                                    <TextField
                                        id="selectdb"
                                        select
                                        size="small"
                                        label="Select Database"
                                        required
                                        fullWidth
                                        error={dbValid}
                                        helperText={dbValid ? 'Select Database is required' : ''}
                                        value={seldb}
                                        onChange={onchangeDb}
                                        SelectProps={{
                                            IconComponent: () => (
                                                <IconButton
                                                    className="refresh-icon-button" // Apply your CSS class here
                                                    onClick={handleRefershdb}
                                                    color="primary"
                                                    aria-label="Refresh Database"
                                                >
                                                    <RefreshIcon />
                                                </IconButton>
                                            )
                                        }}
                                    >
                                        {dblist.map((option) => (
                                            <MenuItem key={option.value} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    {/* Fourth row */}
                                    <TextField
                                        id="selectmmt"
                                        select
                                        size="small"
                                        onChange={onchangeMmt}
                                        required
                                        error={mmtValid}
                                        helperText={mmtValid ? 'Select Measurement is required' : ''}
                                        label="Select Measurement"
                                        value={selmmt}
                                        SelectProps={{
                                            IconComponent: () => (
                                                <IconButton
                                                    className="refresh-icon-button" // Apply your CSS class here
                                                    onClick={handleRefershmmt}
                                                    color="primary"
                                                    aria-label="Refresh Database"
                                                >
                                                    <RefreshIcon />
                                                </IconButton>
                                            )
                                        }}
                                    >
                                        {mmtlist.map((option) => (
                                            <MenuItem key={option.value} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    {/* Save button */}
                                    <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '8px' }}>
                                        <ColorButton size="small" onClick={onsavesource} variant="contained">
                                            Save
                                        </ColorButton>
                                    </div>
                                </Box>
                            </TabPanel>
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
                <CaptchaDialog open={openCaptchaDialog} onClose={handleCloseCaptchaDialog} onDelete={handleConfirmDeleteWithCaptcha} />
            </div>
        </div>
    );
}

/**** end of DataSource.js ****/
