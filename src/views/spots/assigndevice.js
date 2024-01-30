/*

Module: assigndevice.js

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

export default function AssignDevice(props) {
    const { DNC_URL } = { ...constobj };
    const [devlist, setDevlist] = React.useState([]);
    const [selDev, setSelDev] = React.useState('');
    const [dictlist, setDictList] = React.useState([]);
    const [open, setOpen] = useState(true);
    const [selectedIDate, setSelectedIDate] = useState(null);

    const handleSave = () => {
        updtDevData();
    };

    /*

    Name:	updtDevData()

    Function:
        Asynchronous function that updates device data. It first determines the 
        index the selected device (selDev) in the dictlist array.

    Definition:
        If the device is found, constructs a dictionary (mydict) containing device
        information, organization name, and spot name.


    Description:
        The function then calls the updtDevRecord function update device record.
        If successful, a success toast notification is displayed; otherwise, error
        toast shown. Finally, the function closes the dialog and invokes the 
        callback function (hcb) from the parent component.

    */
    async function updtDevData() {
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
            ddict['remarks'] = 'New Device';
            let mydict = {};
            mydict['device'] = ddict;
            mydict['orgname'] = sessionStorage.getItem('myOrg');
            mydict['sname'] = props.mydata.sdata.sname;
            let adresp;
            try {
                await updtDevRecord(mydict);
                toast.success('Device assigned successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000 // Close the toast after 3 seconds (you can adjust the duration as needed)
                });
            } catch (err) {
                toast.error(err, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: false // Don't automatically close the error toast, let the user dismiss it
                });
            }
        }
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    }

    /*
    | updtDevRecord update device record by sending POST request to appropriate
    | API endpoint. It extracts the authentication token from sessionStorage,
    | sets the necessary headers, and construct request option. The function 
    | then performs a POST request to the specified URL and resolve promise the
    | message from the response upon success. In case of an error, it logs the 
    | error and rejects the promise with the error.
    */
    function updtDevRecord(mydict) {
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
    | getrtadevices  retrieve real-time devices for given organization sending
    | a GET request to the appropriate API endpoint. The function then performs
    | a GET request to the specified URL and resolve promise with the message 
    | from the response upon success. In case of an error, it log the error and
    | rejects the promise with the error.
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
                <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                    Assign Device to spot
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack spacing={3}>
                            <TextField
                                size="small"
                                fullWidth
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
                                    renderInput={(params) => <TextField size="small" {...params} style={{ width: '102%' }} />}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Stack spacing={2} direction="row">
                        <ColorButton size="small" variant="contained" onClick={handleSave}>
                            Assign
                        </ColorButton>
                        <ColorButton size="small" variant="contained" sx={{ backgroundColor: 'Gray' }} onClick={handleClose}>
                            Cancel
                        </ColorButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of assigndevice.js ****/
