/*

Module: editgm.js

Function:
    Implementation code for Gateways.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useSelector } from 'react-redux';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

const useStyles = makeStyles((theme) => ({
    dialogWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
    },
    dialogCard: {
        width: '100%',
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2),
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        [theme.breakpoints.down('sm')]: {
            width: '90%'
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2)
    },
    updateButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d32f2f'
        },
        width: '48%'
    },
    appendButton: {
        backgroundColor: '#4ca',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047'
        },
        width: '48%'
    },
    cancelButton: {
        backgroundColor: 'Gray',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'Gray'
        },
        width: '48%'
    }
}));

export default function EditDevice(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [open, setOpen] = React.useState(true);
    const [selOrg, setSelOrg] = useState(props.mydata.sdata.orgid);
    const [selLoc, setSelLoc] = useState(props.mydata.sdata.location);
    const [selRemarks, setSelRemarks] = useState(props.mydata.sdata.remarks);
    const [selStatus, setSelStatus] = useState(props.mydata.sdata.status);
    const [selModel, setSelModel] = useState(props.mydata.sdata.model); // Set an initial valid value or empty string
    const [selTech, setSelTech] = useState(props.mydata.sdata.tech); // Set an initial valid value or empty string
    const [selNw, setSelNw] = useState(props.mydata.sdata.network); // Set an initial valid value or empty string
    const [selDate, setSelDate] = useState(new Date(props.mydata.sdata.adate)); // State for DateTimePicker
    const [myorgs, setMyorgs] = useState([]);
    const [myorglocs, setMyorglocs] = useState([]);
    const classes = useStyles();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] = useState(false);

    let dnhold = cfgmenu['alias']['Device'] ? cfgmenu['alias']['Device'] : 'Device';

    const locoptions = cfgmenu['autooptions']['locations'] ? cfgmenu['autooptions']['locations'] : [];
    const modeloptions = cfgmenu['autooptions']['gwmodel'] ? cfgmenu['autooptions']['gwmodel'] : [];
    const statusoptions = cfgmenu['autooptions']['gwstatus'] ? cfgmenu['autooptions']['gwstatus'] : [];
    const remarkoptions = cfgmenu['autooptions']['remarks'] ? cfgmenu['autooptions']['remarks'] : [];

    const nwtechdict = cfgmenu['autooptions']['technology'] ? cfgmenu['autooptions']['technology'] : [];
    const nwtech = Object.keys(nwtechdict);

    const technology = [];
    const nwdict = {};

    for (let i = 0; i < nwtech.length; i++) {
        technology.push({ value: nwtech[i], label: nwtech[i] });
        nwdict[nwtech[i]] = [];
        for (let k = 0; k < nwtechdict[nwtech[i]].length; k++) {
            nwdict[nwtech[i]].push({ value: nwtechdict[nwtech[i]][k], label: nwtechdict[nwtech[i]][k] });
        }
    }

    async function techChange(e) {
        setSelTech(e.target.value);
    }
    async function nwChange(e) {
        setSelNw(e.target.value);
    }

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };
    const handleUpdateConfirmationDialogOpen = () => {
        setIsConfirmed(true);
        setShowUpdateConfirmationDialog(true);
    };
    const handleUpdateConfirmationDialogClose = () => {
        setIsConfirmed(false);
        setShowUpdateConfirmationDialog(false);
    };
    const handleUpdate = async () => {
        handleUpdateConfirmationDialogOpen();
    };

    /*
    | Depends on the implementation of the updateGw function, which provided
    | here. Additionally, the usage of certain elements such as selTech, selNw,
    | selModel
    */
    const handleUpdateConfirmation = () => {
        handleUpdateConfirmationDialogOpen();
        let edata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            simmk: props.mydata.sdata.simmk,
            ssusc: props.mydata.sdata.ssusc,
            tech: props.mydata.sdata.tech,
            network: props.mydata.sdata.network,
            model: props.mydata.sdata.model,
            status: props.mydata.sdata.status,
            orgid: props.mydata.sdata.orgid,
            location: props.mydata.sdata.location,
            remarks: props.mydata.sdata.remarks,
            adate: props.mydata.sdata.adate
        };
        let ndata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            simmk: document.getElementById('simmk').value,
            ssusc: document.getElementById('ssusc').value,
            tech: selTech,
            network: selNw,
            model: selModel,
            status: selStatus,
            orgid: selOrg,
            location: selLoc,
            remarks: selRemarks,
            adate: selDate
        };
        updateGw({ edata: edata, ndata: ndata });
        props.mydata.hcb();
        setOpen(false);
    };

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const handleConfirmationDialogOpen = () => {
        setIsConfirmed(true);
        setShowConfirmationDialog(true);
    };
    const handleConfirmationDialogClose = () => {
        setIsConfirmed(false);
        setShowConfirmationDialog(false);
    };
    const handleAppend = async () => {
        handleConfirmationDialogOpen();
    };
    const handleConfirmation = async () => {
        setShowConfirmationDialog(false);
        let gwdata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            gwid: props.mydata.sdata.gwid,
            simmk: document.getElementById('simmk').value,
            ssusc: document.getElementById('ssusc').value,
            tech: selTech,
            network: selNw,
            model: selModel,
            status: selStatus,
            orgid: selOrg,
            location: selLoc,
            remarks: selRemarks,
            adate: selDate
        };
        appendGw({ gwdata: gwdata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function appendGw(mydict) {
        try {
            let sresp = await appendGwData(mydict);
            toast.success('Gateway Added Successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (err) {
            toast.error(err.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    /*

    Name:	appendGwData(mydict)()

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
        Retrieves the user authentication token (myToken) and user information
        (myUser) from the session storage. Parses the user information (myUser)
        as JSON to obtain a user object (myuobj). Constructs the request header
        (myHeaders) with the authentication token and content type.

    */
    function appendGwData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/agwmr');
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

    /*
    | updateGwData function is a JavaScript function that sends a PUT request
    | to a specified endpoint (DNC_URL + '/gwmr') the provided data (mydict).
    | It returns a Promise that resolves with the JSON response from the server
    | upon successful execution or rejects with an error if the request fails.
    | the data you want to update (myData). The try block handles successful
    | execution, and the catch block handles any errors that may occur during
    | the request.
    */
    function updateGwData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/gwmr');
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
    async function updateGw(mydict) {
        try {
            let sresp = await updateGwData(mydict);
            toast.success('Gateway Updated Successfully ', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (err) {
            toast.error(err.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
    }

    const handleDateChange = (date) => {
        setSelDate(date);
    };

    /*

    Name:	getClientData()

    Function:
        function that fetches data from a server endpoint (DNC_URL + '/org')
        using a GET request. It returns a Promise that resolves with the data
        obtained from the server or rejects with an error if the request fail.

    Definition:
        function is called using await to asynchronously retrieve client data.
        The try block handles successful execution, and the catch block handles
        any errors that may occur during the request. The client data is then 
        logged to the console.

    Description:
        Retrieves the user authentication token (myToken) from session storage.
        Constructs the request headers (myHeaders) with authentication token
        and content type. Creates a GET request (requestOptions) with specified
        method and headers. Constructs the complete URL for the request by 
        combining the base URL (DNC_URL) and the endpoint ('/org').
    */
    function getClientData() {
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
            let myslist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Real Data: ', data);
                    let myloc = [];
                    data.forEach((item) => {
                        myloc.push(item.name);
                    });
                    resolve(myloc);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const modelChange = async (e, nv) => {
        setSelModel(nv);
    };
    const statusChange = async (e, nv) => {
        setSelStatus(nv);
    };
    const orgChange = async (e, nv) => {
        setSelOrg(nv);
    };
    const locChange = async (e, nv) => {
        setSelLoc(nv);
    };
    const remChange = async (e, nv) => {
        setSelRemarks(nv);
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        // setSelOrg(myorg);
        getSpotInfo(props.mydata.sdata.orgid);
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.dialogWrapper}
            >
                <div className={classes.dialogCard}>
                    <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                        {`Manage Gayeway - ${props.mydata.sdata.name}`}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '45ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                {/* {/ {/ First Column /} /} */}
                                <TextField
                                    style={{ width: '100%' }}
                                    id="gwname"
                                    value={props.mydata.sdata.name}
                                    label="Name"
                                    size="small"
                                />
                                <TextField style={{ width: '100%' }} id="hwid" value={props.mydata.sdata.hwid} label="Hwid" size="small" />
                            </Box>
                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                {/* {/ {/ Second Column /} /} */}
                                <Autocomplete
                                    freeSolo
                                    options={modeloptions}
                                    value={selModel}
                                    onChange={modelChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '10%' }}
                                            id="model"
                                            label="Model"
                                            size="small"
                                            onChange={(e) => setSelModel(e.target.value)}
                                        />
                                    )}
                                />
                                <TextField
                                    style={{ width: '100%', marginTop: '10%' }}
                                    id="simmk"
                                    defaultValue={props.mydata.sdata.simmk}
                                    label="SIM card Make"
                                    size="small"
                                />
                                <TextField
                                    style={{ width: '100%', marginTop: '1%' }}
                                    id="gwtech"
                                    select
                                    label=" Technology"
                                    helperText=" "
                                    value={selTech}
                                    size="small"
                                    onChange={techChange}
                                >
                                    {technology.length > 0 &&
                                        technology.map((option) => (
                                            <MenuItem key={option.id} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                <TextField
                                    style={{ width: '100%', marginTop: '1%' }}
                                    id="gwnw"
                                    select
                                    size="small"
                                    label=" Network"
                                    helperText=" "
                                    value={selNw}
                                    onChange={nwChange}
                                >
                                    {selTech != null > 0 &&
                                        nwdict[selTech].map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Box>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                <Autocomplete
                                    freeSolo
                                    options={myorgs}
                                    defaultValue=""
                                    value={selOrg}
                                    onChange={orgChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '-3%' }}
                                            label="Organization/Client"
                                            size="small"
                                            onChange={(e) => setSelOrg(e.target.value)}
                                        />
                                    )}
                                />
                                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                    <Autocomplete
                                        freeSolo
                                        options={locoptions}
                                        onChange={locChange}
                                        defaultValue=""
                                        value={selLoc}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{ width: '220%', marginTop: '-7%' }}
                                                label="Location"
                                                size="small"
                                                onChange={(e) => setSelLoc(e.target.value)}
                                            />
                                        )}
                                    />
                                </Box>
                                <Autocomplete
                                    freeSolo
                                    options={statusoptions}
                                    onChange={statusChange}
                                    value={selStatus}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%' }}
                                            label="Status"
                                            size="small"
                                            onChange={(e) => setSelStatus(e.target.value)}
                                        />
                                    )}
                                />
                                <TextField
                                    style={{ width: '100%' }}
                                    id="ssusc"
                                    defaultValue={props.mydata.sdata.ssusc}
                                    label={`${dnhold}s connected`}
                                    size="small"
                                />
                                <Autocomplete
                                    freeSolo
                                    options={remarkoptions}
                                    value={selRemarks}
                                    onChange={remChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '5%' }}
                                            label="Remarks"
                                            size="small"
                                            onChange={(e) => setSelRemarks(e.target.value)}
                                        />
                                    )}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Select In Date/Time"
                                        value={selDate}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                size="small"
                                                {...params}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '5%' // Adjust the width as needed
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box display="flex" justifyContent="center" marginTop="30px">
                                {/* {/ {/ Append Button /} /} */}
                                <ColorButton
                                    style={{ marginRight: '1rem', width: '40%' }}
                                    onClick={handleAppend}
                                    size="small"
                                    variant="contained"
                                >
                                    Add
                                </ColorButton>
                                {/* {/ {/ Update Button /} /} */}
                                <Button
                                    style={{ marginRight: '1rem' }}
                                    onClick={handleUpdate}
                                    size="small"
                                    variant="contained"
                                    className={classes.updateButton}
                                >
                                    Update
                                </Button>
                                {/* { {/ Cancel Button /} } */}
                                <ColorButton onClick={handleCancel} size="small" variant="contained" className={classes.cancelButton}>
                                    Cancel
                                </ColorButton>
                            </Box>
                        </Box>
                    </DialogContent>
                </div>
            </Dialog>
            <Dialog open={showConfirmationDialog} onClose={handleConfirmationDialogClose}>
                <DialogTitle>Action Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        By Confirming, you will create a new entry and the action can't be undone. Proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size="small" disableElevation onClick={handleConfirmationDialogClose}>
                        Cancel
                    </Button>
                    <Button size="small" disableElevation onClick={handleConfirmation}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showUpdateConfirmationDialog} onClose={handleUpdateConfirmationDialogClose}>
                <DialogTitle>Action Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to update this hardware record?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size="small" disableElevation onClick={handleUpdateConfirmationDialogClose}>
                        Cancel
                    </Button>
                    <Button size="small" disableElevation onClick={handleUpdateConfirmation}>
                        update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of editgw.js ****/
