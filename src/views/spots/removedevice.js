/*

Module: removedevice.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { constobj } from './../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function RemoveDevice(props) {
    const { DNC_URL } = { ...constobj };
    const [liveDev, setLiveDev] = React.useState('');
    const [open, setOpen] = useState(true);
    const [selectedRDate, setSelectedRDate] = useState(null);

    const handleRemove = () => {
        let myrdict = {};
        myrdict['orgname'] = sessionStorage.getItem('myOrg');
        myrdict['rdate'] = selectedRDate;
        myrdict['hwsl'] = liveDev;
        myrdict['sid'] = props.mydata.sdata.sid;

        removeDevice(myrdict);
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    };

    /*
    | removeDevice asynchronous function that attempts to remove a device by 
    | updating its record. It call the updtDevRecord function with the provided
    | mydict parameter, which likely contains information about the device be 
    | removed. If the update is successful, a success toast is displayed. If 
    | there's an error during the update, an error toast is displayed.
    */
    async function removeDevice(mydict) {
        let rdresp;
        try {
            rdresp = updtDevRecord(mydict);
            toast('Device remove success');
        } catch (err) {
            toast(rdresp);
        }
    }

    /*

    Name:	updtDevRecord ()

    Function:
        updtDevRecord function is used to update a device record.

    Definition:
        It returns a Promise, allowing asynchronous handling of the operation. 
        The function performs. Retrieves the authentication token from session
        storage.

    Description:
        Configures the request options, specifying the method as 'PUT', headers
        and the JSON-serialized mydict in the request body. The URL for request
        by appending '/remdev' to the DNC_URL. Fetch request using configured 
        options. The message from the response if successful.
        
    Return:
        updtDevRecord returns a Promise. If the update operation is successful,
        the Promise is resolved with the message from the server response. If 
        an error occurs during the request, the Promise is rejected with the 
        error information.

    */
    function updtDevRecord(mydict) {
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
            var url = new URL(DNC_URL + '/remdev');
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

    const handleClose = () => {
        setOpen(false); // Close the dialog when Cancel is clicked
        props.mydata.hcb();
    };

    useEffect(() => {
        getDeviceInfo();
    }, []);

    async function getDeviceInfo() {
        setLiveDev(props.mydata.sdata.ddata.hwsl);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div style={{ width: '400px' }}>
                    <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                        Remove Device from the Spot
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Stack spacing={2}>
                                <TextField size="small" id="hwsl" label="HwId" value={liveDev} variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        size="small"
                                        fullWidth
                                        label="Date of Removal"
                                        value={selectedRDate}
                                        onChange={setSelectedRDate}
                                        renderInput={(params) => <TextField size="small" {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <ColorButton size="small" variant="contained" color="secondary" onClick={handleRemove}>
                                Remove
                            </ColorButton>
                            <ColorButton
                                size="small"
                                sx={{
                                    backgroundColor: 'Gray'
                                }}
                                variant="contained"
                                onClick={handleClose}
                            >
                                Cancel
                            </ColorButton>
                        </Stack>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}

/**** end of removedevice.js ****/
