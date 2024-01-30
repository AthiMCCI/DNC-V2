/*

Module: edittaphistory.js

Function:
    Implementation code for brixtap.
    .

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';
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

export default function EditTapHistory(props) {
    const { CPLUGIN_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selectedIDate, setSelectedIDate] = useState(null);
    const statusRef = useRef(null);

    const handleIDateChange = (newDate) => {
        setSelectedIDate(newDate);
    };
    const handleSave = () => {
        //setOpen(true);
        updateTap();
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    useEffect(() => {
        // console.log(props.mydata.sdata);
        setSelectedIDate(props.mydata.sdata.edate);
    }, []);

    /*
    | converttimestr function that takes a JavaScript Date object (bdate) as a
    | parameter and converts it into a formatted date and time string. The time
    | is split into an array (mytime) using the 'T' delimiter and further split
    | using the '.' delimiter to remove milliseconds. The function constructs
    | a formatted date and time string (mybrixdate) in the format 
    | 'MM-DD-YYYY,HH:mm:ss'.
    */
    function converttimestr(bdate) {
        let brixdate = bdate.toISOString();
        let mydate = brixdate.split('T')[0].split('-');
        let mytime = brixdate.split('T')[1].split('.')[0];
        let mybrixdate = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        return mybrixdate;
    }

    /*
    | updateBrix function request options, including the method (PUT), headers,
    | and the request body, which is a JSON string representation of the mydict
    | object. It sends a PUT request to specified URL (CPLUGIN_URL + '/tap').
    */
    async function updateTap() {
        const newdict = {};
        let location = props.mydata.sdata.location;
        let dcpold = props.mydata.sdata.dcp;
        let tapold = props.mydata.sdata.tapCount;
        let dateold = props.mydata.sdata.edate;
        if (statusRef.current) {
            newdict['tapCount'] = statusRef.current.value;
        } else {
            newdict['tapCount'] = tapold;
        }
        newdict['edate'] = converttimestr(selectedIDate);
        const mydict = {};
        mydict['edate'] = converttimestr(new Date(dateold));
        mydict['tapCount'] = tapold;
        mydict['dcp'] = dcpold;
        mydict['location'] = location;
        let uresp = await updateOneTap({ data: mydict, new: newdict });
        handleClose();
        toast(uresp);
    }

    /*

    Name:	updateOneTap()

    Function:
        updateOneBrix send a PUT request to update tap-related data. It takes
        mydict parameter, which is expected to be an object containing the old
        and new tap data, and returns

    Definition:
        function is called with an object containing 'data' and 'new' propertie
        representing the old and new tap data. The result is then logged if the
        update is successful, or an error is logged if there's an issue.

    Description:
        creates the request options, specifying the method as PUT, headers, and
        the request body as a JSON string representation of the mydict object. 
        The function uses the Fetch API to send a PUT request to the specified
        URL (CPLUGIN_URL + '/tap').

    Return:
        Request is successful, it resolve the Promise with the message from the
        response data. If there is an error, it logs the error and rejects the
        Promise with the error.

    */
    function updateOneTap(mydict) {
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
            fetch(CPLUGIN_URL + '/tap', requestOptions)
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

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Tap : ' + props.mydata.sdata.location + ' > ' + props.mydata.sdata.dcp}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '50%' }
                            }}
                        >
                            <TextField
                                required
                                size="small"
                                label="Tap count"
                                defaultValue={props.mydata.sdata.tapCount}
                                type="number"
                                inputRef={statusRef}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Select In Date/Time"
                                    value={selectedIDate}
                                    onChange={handleIDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            {...params}
                                            style={{
                                                width: '92%'
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <ColorButton
                        onClick={handleSave}
                        size="small"
                        variant="contained"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Save
                    </ColorButton>
                    <ColorButton
                        onClick={handleClose}
                        variant="contained"
                        ccolor="error"
                        sx={{
                            backgroundColor: 'gray'
                        }}
                    >
                        Cancel
                    </ColorButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of edittaphistory.js ****/
