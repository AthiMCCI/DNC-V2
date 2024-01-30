/*

Module: replacedevice.js

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
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { constobj } from './../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));
export default function ReplaceDevice(props) {
    const { DNC_URL } = { ...constobj };
    const [devlist, setDevlist] = React.useState([]);
    const [selDev, setSelDev] = React.useState('');
    const [dictlist, setDictList] = React.useState([]);
    const [open, setOpen] = useState(true);
    const [liveDev, setLiveDev] = React.useState('');
    const [selectedIDate, setSelectedIDate] = useState(null);

    const handleReplace = () => {
        replaceDev();
    };

    /*

    Name:	replaceDev()

    Function:
        process of replacing a device in the context of a spot.

    Definition:
        The function finds the selected device, creates dictionarie removal and
        replacement, performs removal and replacement operations, and provides
        toast notifications.

    Description:
        The selected device in the 'dictlist' array. If the device is found,
        creates dictionaries for removal and replacement. Calls 'updtRemove' to
        handle the device removal operation. Calls 'updtReplace' to handle the
        device replacement operation. Displays toast notifications for success 
        or failure of removal and replacement. Closes the dialog and invoke the
        callback function from the parent component.

    Return:
        It performs asynchronous operations, and the result is communicated
        through toast notifications.

    */
    async function replaceDev() {
        let selidx = null;
        for (let i = 0; i < dictlist.length; i++) {
            if (dictlist[i].hwsl == selDev) {
                selidx = i;
                break;
            }
        }
        if (selidx != null) {
            let ddict = {};
            ddict['hwsl'] = dictlist[selidx].hwsl;
            ddict['dsid'] = dictlist[selidx].dsid;
            ddict['devid'] = dictlist[selidx].nwIdV;
            ddict['devtype'] = dictlist[selidx].nwIdK;
            ddict['sid'] = props.mydata.sdata.sid;
            ddict['idate'] = selectedIDate;
            ddict['remarks'] = 'Replace Device';
            let rmdict = {};
            rmdict['orgname'] = sessionStorage.getItem('myOrg');
            rmdict['rdate'] = selectedIDate;
            rmdict['hwsl'] = liveDev;
            rmdict['sid'] = props.mydata.sdata.sid;
            let rdresp;
            try {
                rdresp = await updtRemove(rmdict);
                let rpresp;
                try {
                    let mydict = {};
                    mydict['device'] = ddict;
                    mydict['orgname'] = sessionStorage.getItem('myOrg');
                    mydict['sname'] = props.mydata.sdata.sname;

                    rpresp = updtReplace(mydict);
                    toast('Device replace success');
                } catch (err) {
                    toast(rpresp);
                }
            } catch (err) {
                toast(rdresp);
            }
        }
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    }

    /*
    | updtRemove Updates or removes a device record in the system Construct the
    | necessary headers for the API request. Request option, including the HTTP
    | method, headers, and request body. PUT request to the '/remdev' endpoint
    | with the provided data is successful, resolves with the message from the
    | server. And rejects with an error if there's an issue with the request.
    */
    function updtRemove(mydict) {
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

    /*
    | updtReplace Updates or replaces a device record in the system request 
    | options, including the HTTP method, headers, and request body. POST 
    | request to the '/device' endpoint with the provided data. request is 
    | successful, resolves with the message from the server. If there's error
    | during the request, logs the error and rejects with the error.
    */
    function updtReplace(mydict) {
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
            var url = new URL(DNC_URL + '/device/' + mydict.sname);
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
        let myorg = sessionStorage.getItem('myOrg');
        let dlist = await getrtadevices(myorg);
        let devList = [];
        for (let i = 0; i < dlist.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = dlist[i].hwsl;
            mydict['label'] = dlist[i].hwsl;
            devList.push(mydict);
        }
        setSelDev(devList[0].value);
        setDevlist(devList);
        setDictList(dlist);
    }

    /*
    | getrtadevices user's authentication token from the session storage. user
    | authentication token from the session storage. request option, specifying
    | the HTTP method and headers. GET request to the '/rtadev' endpoint with 
    | the organization identifier. Request is successful, resolves with message
    | containing RTA devices. If there's an error during the request, logs the
    | error and rejects with the error.
    */
    function getrtadevices(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/rtadev/' + myorg);
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

    async function onChangeDev(e) {
        let mseldev = e.target.value;
        setSelDev(mseldev);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div style={{ width: '400px' }}>
                    <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                        Replace Device to Spot
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Stack spacing={2}>
                                <TextField size="small" id="hwsl" label="HwId" value={liveDev} variant="outlined" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    id="demo-select-small"
                                    select
                                    label="Select Devices"
                                    value={selDev}
                                    onChange={onChangeDev}
                                >
                                    {devlist.map((option) => (
                                        <MenuItem key={option.value} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        fullWidth
                                        label="Installed Date"
                                        value={selectedIDate}
                                        onChange={setSelectedIDate}
                                        renderInput={(params) => <TextField size="small" {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <ColorButton size="small" variant="contained" onClick={handleReplace}>
                                Replace
                            </ColorButton>
                            <ColorButton
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: 'Gray',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
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

/**** end of replacedevice.js ****/
