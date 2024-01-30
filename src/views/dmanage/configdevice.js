/*

Module: configdevice.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './../../App.css';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import { constobj } from './../../misc/constants';
import { useSelector } from 'react-redux';

function ConfigDevice(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [dslist, setDslist] = React.useState([]);
    const [dsdict, setDsdict] = React.useState({});
    const [selDs, setSelDs] = useState('');
    const [selDsId, setSelDsId] = useState(null);
    const [selDtype, setSelDtype] = useState('devEUI');
    const [dlist, setDlist] = React.useState([]);
    const [selDev, setSelDev] = useState('');
    const [isDsValid, setIsDsValid] = useState(true);
    const [isDtypeValid, setIsDtypeValid] = useState(true);
    const [isDevValid, setIsDevValid] = useState(true);
    const [isConfigValid, setIsConfigValid] = useState(true);

    const devnwtype = cfgmenu['autooptions']['devnwtype'] ? cfgmenu['autooptions']['devnwtype'] : [];

    const devtype = [];
    for (let i = 0; i < devnwtype.length; i++) {
        devtype.push({ value: devnwtype[i], label: devnwtype[i] });
    }

    props.ds.dtype(selDtype);
    async function dsrcChange(e) {
        const value = e.target.value;
        setIsDsValid(!!value);
        if (value) {
            props.ds.sid(dsdict[value]);
            setSelDs(value);
            setSelDsId(dsdict[value]);
            getDevices(value, selDtype);
        } else {
            props.ds.sid('');
            setSelDev('');
            setDlist([]);
        }
    }

    async function dtypeChange(e) {
        const value = e.target.value;
        setIsDtypeValid(!!value);
        if (value) {
            props.ds.dtype(value);
            setSelDtype(value);
            getDevices(selDs, value);
        } else {
            props.ds.dtype('');
            setSelDev('');
            setDlist([]);
        }
    }

    async function deviceChange(e) {
        const value = e.target.value;
        setIsDevValid(!!value);
        if (value) {
            props.ds.devid(value);
            setSelDev(value);
        } else {
            props.ds.devid('');
        }
    }

    /*

    Name:	getDsList ()

    Function:
        getDsList is an asynchronous function that returns a Promise. It fetche
        data source names and IDs using a GET request to a specified URL with
        authorization headers.

    Definition:
        Asynchronous function getDsList for fetching data source names and IDs
        using Fetch API and authorization headers.
    
    Description:
        Fetches data source names and IDs from the server using a GET request
        with authorization headers. It constructs an array of objects with name
        and id properties based on the retrieved data and resolves the Promise
        with this array on successful data retrieval or rejects with an error
        case of failure.

    Return:
        Fetching and constructing an array data source name and ID, resolving
        with the array on success or rejecting with an error.

    */

    function getDsList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(DNC_URL + '/dsrc', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let olist = [];
                    if (data != null) {
                        for (let i = 0; i < data.length; i++) {
                            olist.push({ name: data[i].dsname, id: data[i].dsid });
                        }
                    }
                    resolve(olist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getDevData(mydict) fetche device data based on the provided mydict
    | dictionary using a POST request. The function uses the fetch API to make
    | the HTTP request, and the result is logged to the console. The Promise is
    | resolved with the data if the request is successful and rejected with an
    | error if there's an issue with the request.
    */
    function getDevData(mydict) {
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
            var url = new URL(DNC_URL + '/dlist');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Dev Req Resp: ', data);
                    if (data.hasOwnProperty('error')) {
                        reject(data.error);
                    }
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    /*

    Name:	getDevices ()

    Function:
        Asynchronous function that retrieves device data based on the selected
        data source and device type, transforming the response into a formatted
        list of objects.

    Definition:
        Asynchronous function getDevice for fetching and formatting device data
        based on the selected data source and device type.

    Description:
        Device data using data source (dsrc) and device type (dtype). It format
        the response into an array of objects with id, label, value properties,
        sets the formatted list and selects the first device as the default. It
        also updates the selected device in the parent component through props.

    Return:
        Asynchronous function for fetching and formatting device data, updating
        the formatted list, selecting a default device, and updating the parent
        component with the selected device.

    */

    async function getDevices(dsrc, dtype) {
        let mydict = {};
        mydict['dsn'] = dsrc; //selDs;
        mydict['dtype'] = dtype; //selDtype;
        try {
            let dresp = await getDevData(mydict);
            // console.log('resp: ', dresp);
            let mynewd = [];
            for (let i = 0; i < dresp.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['label'] = dresp[i];
                mydict['value'] = dresp[i];
                mynewd.push(mydict);
            }
            setDlist(mynewd);
            setSelDev(mynewd[0].value);
            props.ds.devid(mynewd[0].value);
        } catch (error) {
            Swal.fire(error);
        }
    }

    async function getDsInfo() {
        const myds = await getDsList();
        let mynewo = [];
        let dsdict = {};
        for (let i = 0; i < myds.length; i++) {
            let mydict = {};
            mydict['id'] = myds[i].id;
            mydict['label'] = myds[i].name;
            mydict['value'] = myds[i].name;
            mynewo.push(mydict);

            dsdict[myds[i].name] = myds[i].id;
        }
        setDslist(mynewo);
        setDsdict(dsdict);
        setSelDs(mynewo[0].value);
        setSelDsId(mynewo[0].id);
        props.ds.sid(mynewo[0].id);
        getDevices(mynewo[0].value, selDtype);
    }

    // 2024 Jan removed
    useEffect(() => {
        getDsInfo();
    }, []);

    /*
    | validateConfigFields validates configuration field related to data source
    | (selDs), data type (selDtype), and device (selDev). It set state variable
    | (isDsValid, isDtypeValid, isDevValid) based on whether each field value.
    | The combined validation result is stored in the isValid variable. State
    | variable (setIsDsValid, setIsDtypeValid, setIsDevValid, setIsConfigValid)
    | are updated accordingly. If any field is missing, error toast displayed.
    */
    function validateConfigFields() {
        const isDsValid = !!selDs;
        const isDtypeValid = !!selDtype;
        const isDevValid = !!selDev;
        setIsDsValid(isDsValid);
        setIsDtypeValid(isDtypeValid);
        setIsDevValid(isDevValid);
        const isValid = isDsValid && isDtypeValid && isDevValid;
        setIsConfigValid(isValid);
        // Show alert if any field is missing
        if (!isValid) {
            toast.error('Please fill out all required fields Athi.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    // 2024 Jan removed
    // useEffect(() => {
    //     validateConfigFields(); // Validate fields whenever any field changes
    // }, [selDs, selDtype, selDev]); // Add state variables that you want track

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 3, width: '30ch' }
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    size="small"
                    id="dsrc"
                    select
                    label=" Select Data Source"
                    required
                    helperText={isDsValid ? '' : 'Data Source is  required'}
                    error={!isDsValid}
                    defaultValue=""
                    value={selDs}
                    onChange={dsrcChange}
                >
                    {dslist.length > 0 &&
                        dslist.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>

                <TextField size="small" id="idtype" select label=" Device Id Type" value={selDtype} onChange={dtypeChange}>
                    {devtype.map((option) => (
                        <MenuItem key={option.id} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField size="small" id="device" select label=" Select Device" value={selDev} onChange={deviceChange}>
                    {dlist.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </Box>
    );
}

export default ConfigDevice;

/**** end of configdevice.js ****/
