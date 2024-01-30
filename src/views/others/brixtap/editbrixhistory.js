/*

Module: editbrixhistory.js

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

export default function EditBrixHistory(props) {
    const { CPLUGIN_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selectedIDate, setSelectedIDate] = useState(null);
    const statusRef = useRef(null);

    const handleIDateChange = (newDate) => {
        setSelectedIDate(newDate);
    };
    const handleSave = () => {
        //setOpen(true);
        updateBrix();
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        // console.log(props.mydata.sdata);
        setSelectedIDate(props.mydata.sdata.date);
    }, []);

    function converttimestr(bdate) {
        let brixdate = bdate.toISOString();
        let mydate = brixdate.split('T')[0].split('-');
        let mytime = brixdate.split('T')[1].split('.')[0];
        let mybrixdate = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        return mybrixdate;
    }

    /*
    | updateBrix function is called within a try-catch block. If the update is
    | successful, it will close the modal and display toast message. otherwise,
    | it will log the error.
    */
    async function updateBrix() {
        const newdict = {};
        let location = props.mydata.location;
        let brixold = props.mydata.sdata.brix;
        let dateold = props.mydata.sdata.date;
        if (statusRef.current) {
            newdict[location] = statusRef.current.value;
        } else {
            newdict[location] = brixold;
        }
        newdict['rdate'] = converttimestr(new Date(selectedIDate));
        const mydict = {};
        mydict['rdate'] = converttimestr(new Date(dateold));
        mydict[location] = brixold;
        let uresp = await updateOneBrix({ data: mydict, new: newdict });
        handleClose();
        toast(uresp);
    }

    /*

    Name:	updateOneBrix()

    Function:
        updateOneBrix function is asynchronous function that send a PUT request
        to update Brix data. It takes a mydict parameter, which is expected to
        be an object containing the old and new Brix data.

    Definition:
        function  object containing 'data' and 'new' properties representing
        the old and new Brix data. The result is then logged if the update is
        successful, or an error is logged if there's an issue..

    Description:
        The function initializes the necessary headers, including Authorization
        header with a bearer token retrieved from the session storage. It 
        constructs the request options, including the method (PUT), headers, 
        and the request body, which is a JSON string representation of mydict
        object. It sends a PUT request to URL (CPLUGIN_URL + '/brix'). It 
        handles the response by parsing it as JSON.

    Return:
        Request is successful, it resolve the Promise with the message from the
        response data. If there is an error, it logs the error and rejects the
        Promise with the error.

    */
    function updateOneBrix(mydict) {
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
            fetch(CPLUGIN_URL + '/brix', requestOptions)
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
                    {'Edit Brix - ' + props.mydata.location}
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
                                size="small"
                                required
                                label="Brix"
                                defaultValue={props.mydata.sdata.brix}
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
                <DialogActions sx={{ justifyContent: 'center', marginTop: '-1%' }}>
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
/**** end of brixhistory.js ****/
