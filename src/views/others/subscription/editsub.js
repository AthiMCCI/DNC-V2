/*

Module: editsub.js

Function:
    Implementation code for Subscription.
    .

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../../misc/constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));
const splans = [
    { id: 1, value: 'Free', label: 'Free' },
    { id: 2, value: 'Pro Cloud', label: 'Pro Cloud' }
];

export default function EditSub(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);
    const [selPlan, setSelPlan] = useState('');
    const [selSdate, setSelSdate] = useState(null);
    const [selEdate, setSelEdate] = useState(null);

    const handleSave = () => {
        //setOpen(true);
        updateSubs();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    const planChange = (event) => {
        setSelPlan(event.target.value);
    };

    async function sdateChange(newDate) {
        setSelSdate(newDate);
    }

    async function edateChange(newDate) {
        setSelEdate(newDate);
    }

    /*
    | The `updateSubs` function in a React component collects updated 
    | subscription details, sends them to a server for processing, closes
    | the editing interface, and displays a toast notification with the server
    | response. It combines current and new subscription data into one object
    | before making an asynchronous request to update the subscription.
    */
    async function updateSubs() {
        let edict = {};
        edict['orgid'] = props.mydata.sdata.orgid;
        edict['splan'] = props.mydata.sdata.splan;
        edict['sdate'] = props.mydata.sdata.sdate;
        edict['edate'] = props.mydata.sdata.edate;
        let sdict = {};
        sdict['orgid'] = selOrgId;
        sdict['splan'] = selPlan;
        sdict['sdate'] = selSdate;
        sdict['edate'] = selEdate;
        let fdict = {};
        fdict['edata'] = edict;
        fdict['sdata'] = sdict;
        let usresp = await updateSubsRecord(fdict);
        handleClose();
        toast(usresp);
    }

    /*
    | The `updateSubsRecord` function sends updated subscription data to a 
    | server.It creates a `PUT` request with authorization headers and the
    | data to be updated, then makes a network request to the specified URL.
    | The function returns a promise that resolves with the server's response
    | message or rejects in case of an error.
    */
    function updateSubsRecord(mydict) {
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
            var url = new URL(DNC_URL + '/subs');
            fetch(url, requestOptions)
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

    function showSubsInfo() {
        // console.log('Show Gateway Info: ', props);
        setSelOrg(props.mydata.sdata.orgname);
        setSelOrgId(props.mydata.sdata.orgid);
        setSelPlan(props.mydata.sdata.splan);
        setSelSdate(props.mydata.sdata.sdate);
        setSelEdate(props.mydata.sdata.edate);
    }

    useEffect(() => {
        showSubsInfo();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Subscription'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '30ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                size="small"
                                id="splan"
                                select
                                label="Select Plan"
                                helperText=" "
                                value={selPlan}
                                onChange={planChange}
                            >
                                {splans.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    size="small"
                                    label="Start-Date/Time"
                                    value={selSdate}
                                    onChange={sdateChange}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="In-Date/Time"
                                    value={selEdate}
                                    onChange={edateChange}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </LocalizationProvider>
                            <ColorButton
                                onClick={handleSave}
                                variant="contained"
                                size="small"
                                color="primary" // Change the button color to primary
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    width: '10%',
                                    marginTop: '1%'
                                }}
                            >
                                Save
                            </ColorButton>
                            <ColorButton
                                onClick={handleCancel}
                                variant="contained"
                                size="small"
                                color="error" // Change the button color to error
                                style={{
                                    backgroundColor: 'Gray',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    width: '10%',
                                    marginTop: '1%'
                                }}
                            >
                                Cancel
                            </ColorButton>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/**** end of editsub.js ****/
