/*

Module: tapentry.js

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
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function TapEntry(props) {
    const { DNC_URL, CPLUGIN_URL } = { ...constobj };
    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    const [location, setLocation] = useState('Arnot');
    const [dcpoints, setDcpoints] = useState([]);
    const [treeCount, setTreeCount] = useState();
    const [tapDate, setTapDate] = useState(moment().format('YYYY-MM-DD'));
    const [selSpot, setSelSpot] = useState('');
    const [selectedToDateTime, setSelectedToDateTime] = useState(new Date());

    useEffect(() => {
        getSpots(); // V1 it was getDcp (Get Data Collection point)
    }, []);

    async function getSpots() {
        let myorg = sessionStorage.getItem('myOrg');
        let mydev = await getDeviceList(myorg, location);
        setDcpoints(mydev);
    }

    /*

    Name:	getDeviceList()

    Function:
        getDeviceList function that fetch a list of devices based on specified
        client and location. It returns a Promise that resolves with the 
        filtered device list.

    Definition:
        client name and location name. The result is then logged if the request
        is successful, or an error is logged if there's an issue.

    Description:
        Request options are set with the GET method and the created headers.
        The function uses the Fetch API to send a GET request to the specified
        URL (DNC_URL + '/spot/' + gclient).

    */
    function getDeviceList(gclient, gloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(DNC_URL + '/spot/' + gclient, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Spot Data: ', data);
                    let cdev = data.filter(function (row) {
                        // return row.Location == gloc && row.rdate == null
                        return row.location == gloc;
                    });
                    // console.log('Filtered Devices: ', cdev);
                    resolve(cdev);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let myorg = sessionStorage.getItem('myOrg');
        let mydev = await getDeviceList(myorg, selloc);
        setDcpoints(mydev);
    }

    function spotChange(e) {
        setSelSpot(e.target.value);
    }

    /*
    | setTapCount function is called with an input dictionary containing a tree
    | ID and tap count. The result is then logged if the request is successful,
    | or an error is logged if there's an issue.
    */
    function setTapCount(inpDict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(inpDict)
            };
            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Update Resp: ', data);
                    if (data.hasOwnProperty('message')) {
                        reject(data.message);
                    }
                    resolve('Tap (Tree) Count update success');
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function showAlert(msg, mtype) {
        toast(mtype === 'success' ? msg : `Error: ${msg}`, {
            type: mtype,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    async function onChangeTree(e) {
        const tval = e.target.value;
        setTreeCount(tval);
    }

    const onDateChange = (value) => {
        var date = new Date(value);
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);
        let year = date.getFullYear();
        let fvalue = `${mnth}-${day}-${year}`;
        setTapDate(fvalue);
    };

    /*
    | onSubmitCount  creates a tapDict dictionary with properties such location
    | dcp, tcount (tree count), tapCount, and edate (tap date). It then tries 
    | to call the setTapCount function with the tapDict as an argument. If the
    | setTapCount function call is successful, it shows a success alert using
    | showAlert function with the success message.
    */
    async function onSubmitCount(e) {
        let loctext = null;
        let dcptext = null;
        try {
            let tapDict = { location: location, dcp: selSpot, tcount: treeCount, tapCount: treeCount, edate: tapDate };
            try {
                let strresp = await setTapCount(tapDict);
                // Display success toast alert here
                toast.success('Tap entry added successfully!');
            } catch (error) {
                showAlert(error, 'error');
            }
        } catch (error) {
            showAlert(error, 'error');
        }
    }

    return (
        <Box
            sx={{
                width: '25%', // Make the component responsive
                maxWidth: '500px', // Limit the maximum width to 500px
                margin: '0 auto', // Center align the component
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px', // Add some padding to the component
                borderRadius: '10px' // Rounded corners
            }}
        >
            <FormControl size="small" fullWidth sx={{ marginBottom: '12%', color: 'black' }}>
                <InputLabel
                    id="category-label"
                    sx={{
                        color: 'black' // Set the label text color to white
                    }}
                >
                    Select Location
                </InputLabel>
                <Select size="small" label="demo-simple-select-label" name="location" id="location" onChange={locationChange}>
                    {locations.map((msgLoc) => (
                        <MenuItem key={msgLoc.id} value={msgLoc.value}>
                            {msgLoc.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" fullWidth sx={{ marginBottom: '12%', color: 'black' }}>
                <InputLabel
                    id="category-label"
                    sx={{
                        color: 'black' // Set the label text color to white
                    }}
                >
                    Select Data Point (DCP)
                </InputLabel>
                <Select name="dcpoint" id="dcpoint" onChange={spotChange}>
                    {dcpoints.map((msgLoc) => (
                        <MenuItem key={msgLoc.sid} value={msgLoc.sname}>
                            {msgLoc.sname}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                size="small"
                label="New Tree(Tap) Count"
                type="number"
                id="treePoint"
                value={treeCount}
                onChange={onChangeTree}
                InputLabelProps={{
                    style: {
                        color: 'black' // Change the label text color to white
                    }
                }}
                sx={{ marginBottom: '12%', color: 'blue' }} // Input text color remains blue
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date/Time Of Action"
                    showSeconds
                    value={selectedToDateTime}
                    onChange={(newValue) => {
                        setSelectedToDateTime(newValue);
                        onDateChange(newValue);
                    }}
                    renderInput={(params) => <TextField size="small" {...params} InputLabelProps={{ style: { color: 'black' } }} />}
                    fullWidth
                    sx={{ marginBottom: '12px', '& .MuiOutlinedInput-root': { color: 'black' } }}
                />
            </LocalizationProvider>
            <ColorButton
                variant="contained"
                color="success"
                size="small"
                style={{ marginTop: '5%' }}
                onClick={onSubmitCount} // Call handleSave when the button is clicked
            >
                Save
            </ColorButton>
        </Box>
    );
}

/**** end of tapentry.js ****/
