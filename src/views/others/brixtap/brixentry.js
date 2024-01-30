/*

Module: brixentry.js

Function:
    Implementation code for brixtap.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { constobj } from './../../../misc/constants';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

/*
| BrixEntry includes state Variables brixdate, location, brixVal, and 
| selectedToDateTime. There's also an asynchronous function locationChange that
| updates the location state based on the selected value. The locations array
| provides options for the location dropdown.
*/
export default function BrixEntry(props) {
    const { CPLUGIN_URL } = { ...constobj };

    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    const [brixdate, setBrixDate] = useState('YYYY-MM-DD,HH:mm:ss');
    const [location, setLocation] = useState('Arnot');
    const [brixVal, setBrixVal] = useState(0);
    const [selectedToDateTime, setSelectedToDateTime] = useState(new Date());

    async function locationChange(e) {
        const selloc = e.target.value;
        setLocation(selloc); // Update the location state with the selected value
    }

    const onDateChange = (value) => {
        var date = new Date(value);
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);
        let year = date.getFullYear();
        let fvalue = `${year}-${mnth}-${day},${hours}:${minutes}:${seconds}`;
        setBrixDate(fvalue);
    };

    /*
    | onSubmitBrix function is an asynchronous JavaScript function that handles
    | the submission of Brix data. It converts the provided date (brixdate) to
    | formatted date-time string (brixdttime), and invokes the pushBrixData.
    */
    async function onSubmitBrix(e) {
        let brixdttime = null;
        try {
            let isodt = new Date(brixdate).toISOString();
            let mydate = isodt.split('T')[0].split('-');
            let mytime = isodt.split('T')[1].split('.')[0];
            brixdttime = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        } catch (error) {
            console.error('Error formatting date:', error);
        }
        try {
            const myresp = await pushBrixData(brixdttime);
            showAlert(myresp, 'success'); // Show success toast
        } catch (error) {
            showAlert(error.toString(), 'error'); // Show error toast
        }
    }

    function showAlert(msg, mtype) {
        if (mtype === 'success') {
            toast.success(msg);
        } else {
            toast.error(msg);
        }
    }

    /*

    Name:   pushBrixData(brixdttime)()

    Function:
        Asynchronous function pushBrixData that sends a POST request specified
        URL (CPLUGIN_URL + '/brix')

    Definition:
        Send a POST request to a specified URL (CPLUGIN_URL + '/brix') updating
        Brix data. It utilizes the Fetch API to make an HTTP request and return
        a Promise.

    Description:
        The function retrieves the authorization token from the session storage
        (myToken). It constructs the headers for the HTTP request including the
        authorization token and specifying the content type JSON. The request
        body (mybody) is created, containing the Brix value for the specified
        location and the date and time of the Brix data.

    Return:
        Resolving with a success message if the update is successful rejecting
        with an error message if it fails.

    */
    function pushBrixData(brixdttime) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mybody = {};
            mybody[location] = brixVal;
            mybody['rdate'] = brixdttime;
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mybody)
            };
            fetch(CPLUGIN_URL + '/brix', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.hasOwnProperty('message')) {
                        if (data.message.includes('updated successfully')) {
                            resolve(data.message);
                        } else {
                            reject(data.message);
                        }
                    }
                    reject('Brix data update failed');
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    async function onChangeBrix(e) {
        const tval = e.target.value;
        setBrixVal(tval);
    }

    return (
        <Box
            sx={{
                width: '25%',
                maxWidth: '500px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // background: 'linear-gradient(135deg, #d4a7b1 0%, #a25683 100%)',
                background: 'white',
                padding: '20px',
                borderRadius: '10px'
                // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}
        >
            <FormControl size="small" fullWidth sx={{ marginBottom: '10%' }}>
                <InputLabel id="status-label" sx={{ color: 'black' }}>
                    Select Location
                </InputLabel>
                <Select label="demo-simple-select-label" name="location" id="location" onChange={locationChange}>
                    {locations.map((msgLoc) => (
                        <MenuItem key={msgLoc.id} value={msgLoc.value}>
                            {msgLoc.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="New Brix Value"
                type="number"
                id="brixbox"
                size="small"
                value={brixVal}
                onChange={onChangeBrix}
                InputLabelProps={{ style: { color: 'black' } }} // Set the label text color to black
                sx={{ marginBottom: '12%', '& .MuiOutlinedInput-root': { color: 'black' } }} // Set the text field color to black
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date/Time Of Action"
                    // value={selectedDateTime}
                    showSeconds
                    value={selectedToDateTime}
                    onChange={(newValue) => {
                        setSelectedToDateTime(newValue);
                        onDateChange(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} size="small" InputLabelProps={{ style: { color: 'black' } }} />}
                    fullWidth
                    sx={{ marginBottom: '12px', '& .MuiOutlinedInput-root': { color: 'black' } }}
                />
            </LocalizationProvider>
            <ColorButton style={{ marginTop: '5%' }} variant="contained" color="success" size="small" onClick={onSubmitBrix}>
                Save
            </ColorButton>
        </Box>
    );
}

/**** end of brixentry.js ****/
