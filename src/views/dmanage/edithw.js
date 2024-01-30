/*

Module: edithw.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { constobj } from '../../misc/constants';
import { useSelector } from 'react-redux';

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
            backgroundColor: '#4caf50'
        },
        width: '48%'
    },
    appendButton: {
        backgroundColor: '#4ca',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4ca'
        },
        width: '48%'
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#f44336'
        },
        width: '48%'
    }
}));

const action = [
    { value: 'New deployment', label: 'New deployment' },
    { value: 'Firmware Update', label: 'Firmware Update' },
    { value: 'Tech Change', label: 'Tech Change' },
    { value: 'HW Failure', label: 'HW Failure' },
    { value: 'HW Repair', label: 'HW Repair' }
];

const buttonStyles = {
    width: '20%',
    marginTop: '2%',
    marginLeft: '1%',
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'green'
    }
};

export default function EditHw(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [open, setOpen] = useState(true);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selBrev, setSelBrev] = useState(props.mydata.sdata.boardrev);
    const [selFwVer, setSelFwVer] = useState(props.mydata.sdata.fwver);
    const [selTech, setSelTech] = useState(props.mydata.sdata.tech);
    const [selNw, setSelNw] = useState(props.mydata.sdata.network);
    const [selRegion, setSelRegion] = useState(props.mydata.sdata.region);
    const [selRemarks, setSelRemarks] = useState(props.mydata.sdata.remarks);
    const [selDate, setSelDate] = useState(new Date(props.mydata.sdata.adate)); // State for DateTimePicker
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] = useState(false);
    const [selDoA, setSelDoA] = useState(null);
    const [dmdInData, setDmdInData] = useState({});
    const [myorglocs, setMyorglocs] = useState([]);
    const classes = useStyles();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const remarkSuggestions = cfgmenu['autooptions']['remarks'] ? cfgmenu['autooptions']['remarks'] : [];
    const bandregions = cfgmenu['autooptions']['bandregions'] ? cfgmenu['autooptions']['bandregions'] : [];
    const hwaction = cfgmenu['autooptions']['hwactions'] ? cfgmenu['autooptions']['hwactions'] : [];

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

    const bandRegion = [];
    for (let i = 0; i < bandregions.length; i++) {
        bandRegion.push({ value: bandregions[i], label: bandregions[i] });
    }

    const action = [];
    for (let i = 0; i < hwaction.length; i++) {
        action.push({ value: hwaction[i], label: hwaction[i] });
    }

    const handleConfirmationDialogOpen = () => {
        setIsConfirmed(true);
        setShowConfirmationDialog(true);
    };
    const handleConfirmationDialogClose = () => {
        setIsConfirmed(false);
        setShowConfirmationDialog(false);
    };
    const handleConfirmation = async () => {
        setShowConfirmationDialog(false);
        let hwdata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: selBrev,
            fwver: selFwVer,
            tech: selTech,
            network: selNw,
            region: selRegion,
            remarks: selRemarks,
            adate: selDate
        };
        appendHw({ hwdata: hwdata });
        props.mydata.hcb();
        setOpen(false);
    };
    async function appendHw(mydict) {
        try {
            let sresp = await appendHwData(mydict);
            toast.success('HW Appended successfully', {
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

    const handleUpdateConfirmation = () => {
        handleUpdateConfirmationDialogOpen();
        let edata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: props.mydata.sdata.boardrev,
            fwver: props.mydata.sdata.fwver,
            tech: props.mydata.sdata.tech,
            network: props.mydata.sdata.network,
            region: props.mydata.sdata.region,
            remarks: props.mydata.sdata.remarks,
            adate: props.mydata.sdata.adate
        };
        let ndata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: selBrev,
            fwver: selFwVer,
            tech: selTech,
            network: selNw,
            region: selRegion,
            remarks: selRemarks,
            adate: selDate
        };

        updateHw({ edata: edata, ndata: ndata });
        props.mydata.hcb();
        setOpen(false);
    };

    /*
    | appendHw(mydict) asynchronously appends hardware information using the
    | provided data (mydict). If operation is successful, it display success
    | toast; otherwise, it shows an error toast with the error message.
    */
    async function updateHw(mydict) {
        try {
            let sresp = await updateHwData(mydict);
            toast.success('HW Updated successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
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

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };
    const handleAppend = async () => {
        handleConfirmationDialogOpen();
    };
    const handleDateChange = (date) => {
        setSelDate(date);
    };

    /*

    Name:	appendHwData ()

    Function:
        It appends hardware data by making a POST request to a specified URL
        with authorization headers.

    Definition:
        appending hardware data using Fetch API and authorization headers.

    Description:
        This function asynchronously appends hardware data by making a POST 
        request to the server with the provided dictionary (mydict). It returns
        a Promise that resolves with the response data on successful append or
        rejects with an error in case of failure.

    Return:
        Asynchronous function for appending hardware data, returning a Promise
        that resolve with the response data on success or reject with an error.

    */

    function appendHwData(mydict) {
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
            var url = new URL(DNC_URL + '/ahwmr');
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

    Name:	updateHwData ()

    Function:
        It update hardware data by making a PUT request to a specified URL with
        authorization headers.

    Definition:
        updating hardware data using Fetch API and authorization headers.

    Description:
        Asynchronously updates hardware data by making a PUT request to server
        with the provided dictionary (mydict). It return a Promise that resolve
        with the response data on successful update or rejects with an error in
        case of failure.

    Return:
        Asynchronous function for updating hardware data, returning a Promise
        that resolves with the response data on success or rejects with error.

    */

    function updateHwData(mydict) {
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
            var url = new URL(DNC_URL + '/hwmr');
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

    const techChange = (e) => {
        setSelTech(e.target.value);
    };
    const nwChange = (e) => {
        setSelNw(e.target.value);
    };
    const regionChange = (e) => {
        setSelRegion(e.target.value);
    };
    const actionChange = (e) => {
        setSelAction(e.target.value);
    };
    const doaChange = (newDate) => {
        setSelDoA(newDate);
    };
    const remChange = async (e, nv) => {
        setSelRemarks(nv);
    };

    async function updateDmd() {
        setSelBrev(document.getElementById('boardrev').value);
        setSelFwVer(document.getElementById('fwver').value);
        let mydict = {};
        mydict['hwsl'] = props.mydata.sdata.hwsl;
        mydict['boardrev'] = document.getElementById('boardrev').value;
        mydict['fwver'] = document.getElementById('fwver').value;
        mydict['technology'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['region'] = selRegion;
        mydict['remarks'] = selAction;
        mydict['adate'] = selDoA;
        let fdict = {};
        fdict['mdata'] = mydict;
        let edict = {};
        edict['hwsl'] = props.mydata.sdata.hwsl;
        edict['boardrev'] = props.mydata.sdata.boardrev;
        edict['fwver'] = props.mydata.sdata.fwver;
        edict['technology'] = props.mydata.sdata.technology;
        edict['network'] = props.mydata.sdata.network;
        edict['region'] = props.mydata.sdata.region;
        edict['remarks'] = props.mydata.sdata.action;
        edict['adate'] = props.mydata.sdata.doa;
        fdict['edata'] = edict;
        // console.log('Stock Update Dict: ', mydict);
        let usresp = await updateDmdData(fdict);
        handleCancel();
        Swal.fire(usresp);
    }

    const statusChange = async (e, nv) => {
        props.ssu.status1(nv);
    };

    /*

    Name:	updateDmdData()

    Function:
        It update demand data by making either PUT or POST request to specified
        URL with authorization headers based on the mode provided in the props.

    Definition:
        Fetch API and authorization headers. The request method (PUT or POST)
        determined by the mode specified in the props.

    Description:
        Request method is determined by mode in the props (props.mydata.mode).
        It returns a Promise that resolves with the response message successful
        update or rejects with an error. If the response status is 403, return
        a message indicating that the session has expired.

    Return:
        Asynchronous function for updating demand data, returning Promise that
        resolves with the response message on success or rejects with an error.

    */

    function updateDmdData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: props.mydata.mode === 'edit' ? 'PUT' : 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict),
                redirect: 'follow'
            };
            var url = new URL(DNC_URL + '/dmd');
            fetch(url, requestOptions)
                .then((response) => {
                    if (response.status === 403) {
                        return { message: 'Session Expired' };
                    } else {
                        // console.log('Updt-Resp: ', response);
                        return response.json();
                    }
                })
                .then((data) => {
                    // console.log(data);
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    /*
    | showHwInfo function populates state variables with hardware information
    | (boardrev, fwver, tech, network, region, remarks, adate) from provided
    | data (props.mydata.sdata). 
    */
    function showHwInfo() {
        setSelBrev(props.mydata.sdata.boardrev);
        setSelFwVer(props.mydata.sdata.fwver);
        setSelTech(props.mydata.sdata.tech);
        setSelNw(props.mydata.sdata.network);
        setSelRegion(props.mydata.sdata.region);
        setSelRemarks(props.mydata.sdata.remarks);
        setSelDate(props.mydata.sdata.adate);
    }

    useEffect(() => {
        showHwInfo();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px', textAlign: 'center' }}>
                    {`Manage HW Master Record - ${props.mydata.sdata.hwsl}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ textAlign: 'left' }} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '9px',
                                marginTop: '1%'
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField size="small" id="boardrev" label="Board Revision" value={selBrev} variant="outlined" />
                            <TextField
                                size="small"
                                id="fwver"
                                label="Fw Version"
                                value={selFwVer}
                                variant="outlined"
                                onChange={(e) => setSelFwVer(e.target.value)}
                            />
                            <TextField
                                style={{ marginTop: ' 8% ' }}
                                id="technology"
                                select
                                size="small"
                                label=" Technology"
                                helperText=" "
                                value={selTech}
                                onChange={techChange}
                            >
                                {technology.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                style={{ marginTop: ' 8% ' }}
                                id="network"
                                size="small"
                                select
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
                            </TextField>{' '}
                            {/* {/ Network options /} */}
                            <TextField
                                size="small"
                                id="region"
                                select
                                label=" Band/Region"
                                helperText=" "
                                value={selRegion}
                                onChange={regionChange}
                            >
                                {bandRegion.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* {/ Add the dividing line here /} */}
                            <Autocomplete
                                freeSolo
                                options={remarkSuggestions}
                                value={selRemarks}
                                onChange={remChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        style={{ width: '100%' }}
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
                                                width: '90%', // Adjust the width as needed
                                                marginLeft: '55%'
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box display="flex" justifyContent="center" marginTop="30px">
                            {/* {/ Append Button /} */}
                            <Button
                                style={{ marginRight: '1rem' }}
                                onClick={handleAppend}
                                size="small"
                                variant="contained"
                                className={classes.appendButton}
                            >
                                Add
                            </Button>

                            {/* {/ Update Button /} */}
                            <Button
                                style={{ marginRight: '1rem' }}
                                onClick={handleUpdate}
                                size="small"
                                variant="contained"
                                className={classes.updateButton}
                            >
                                Update
                            </Button>

                            {/* {/ Cancel Button /} */}
                            <Button onClick={handleCancel} size="small" variant="contained" className={classes.cancelButton}>
                                Cancel
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
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

/**** end of edithw.js ****/
