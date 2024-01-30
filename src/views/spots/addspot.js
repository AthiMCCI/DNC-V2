/*

Module: addspot.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation  October 2023

*/

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

export default function AddSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [tdata, setTdata] = useState([]);
    const [spotName, setSpotName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [status, setStatus] = useState('');
    const [dynamicFields, setDynamicFields] = useState({});
    const [tagval, setTagval] = useState({});
    const [spotError, setSpotError] = useState(false);
    const [dfError, setDfError] = useState({});

    useEffect(() => {
        props.asdata.cbftitle('Spots > AddSpot');
        let myorg = sessionStorage.getItem('myOrg');
        getTaginfo(myorg);
        const interval = setInterval(() => {
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getTaginfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    /*
    | getTaginfo asynchronous function retrieves tag information and values for
    | a specified organization (myorg). It utilizes two asynchronous functions,
    | getTagData and get TagValues, to obtain tag data and values respectively.
    | The tag data is logged to the console, and both tag data (mytags) values 
    | (myvals) are set using the state-setting functions. 
    */
    async function getTaginfo(myorg) {
        const mytag = await getTagData(myorg);
        let mytags = mytag;
        // console.log('VSP Tag Data in Spot: ', mytags);
        setTdata(mytags);
        const myvals = await getTagValues(myorg, mytag);
        setTagval(myvals);
        let updt = {};
        for (let i = 0; i < mytags.length; i++) {
            updt[mytags[i]] = false;
        }
        setDfError(updt);
        // console.log('My Tag Values: ', myvals);
    }

    /*
    | getTagData Promise-based utility function that retrieves tag data for a 
    | specified organization (myorg). It makes a GET request to a specified URL
    | (DNC_URL + '/orgtags/' + myorg), processes the response JSON, and resolve
    | with the tag data.
    */
    function getTagData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orgtags/' + myorg);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*

    Name:	getTagValues ()

    Function:
        It makes a GET request to a specified URL (DNC_URL + '/spot/' + myorg.
        

    Definition:
        getTagValues function is a Promise-based utility function that retrieve
        tag value for specified organization (myorg) and array of tags (mytag).

    Description:
        The response JSON, and creates a dictionary (tagvdict) mapping each tag
        to its unique values. The dictionary is resolved when the Promise is 
        fulfilled.

    Return:
        This function assumes the existence of the sessionStorage API and the
        DNC_URL variable. The resolved dictionary has keys corresponding each 
        tag and values as arrays containing unique tag values found the data.

    */
    function getTagValues(myorg, mytag) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/spot/' + myorg);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let tagvdict = {};
                    let lctags = [];
                    for (let i = 0; i < mytag.length; i++) {
                        tagvdict[mytag[i]] = [];
                        lctags.push(mytag[i].toLowerCase());
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < mytag.length; j++) {
                            if (!tagvdict[mytag[j]].includes(data[i][lctags[j]])) {
                                tagvdict[mytag[j]].push(data[i][lctags[j]]);
                            }
                        }
                    }
                    resolve(tagvdict);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleSave = (event) => {
        event.preventDefault();
        // console.log('On Click Add Spot :', spotName);
        let errorMessage = '';
        let false_flg = false;
        if (spotName.length < 3) {
            errorMessage += 'Please fill the spot name.';
            setSpotError(true);
            false_flg = true;
        } else {
            setSpotError(false);
        }
        let updtError = {};
        for (let i = 0; i < tdata.length; i++) {
            const newValue = document.getElementById(tdata[i]).value;
            if (newValue.trim().length < 1) {
                updtError[tdata[i]] = true;
                false_flg = true;
            } else {
                updtError[tdata[i]] = false;
            }
        }

        setDfError(updtError);
        if (false_flg == false) {
            const sdict = {};
            sdict['sname'] = spotName;
            sdict['latitude'] = latitude;
            sdict['longitude'] = longitude;
            sdict['status'] = status;
            onAddSpot(sdict);
        }
    };

    async function resetInputboxes() {
        setLatitude('');
        setLongitude('');
        setStatus('');
        for (let i = 0; i < tdata.length; i++) {
            const newValue = document.getElementById(tdata[i]).value;
            setDynamicFields((prevFields) => ({
                ...prevFields,
                [tdata[i]]: ''
            }));
            if (!tagval[tdata[i]].includes(newValue)) {
                tagval[tdata[i]].push(newValue);
            }
        }
        setTagval({ ...tagval });
    }

    async function onAddSpot(mydict) {
        try {
            let sres = await addNewSpot(mydict);
            toast.success('Spot added successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, // Close the toast after 3 seconds (you can adjust the duration as needed)
                onClose: () => {
                    resetInputboxes();
                    props.asdata.cbfMove(0);
                }
            });
        } catch (error) {
            toast.error(error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false // Don't automatically close the error toast, let the user dismiss it
            });
        }
    }

    /*
    | addNewSpot function is a Promise-based utility function that add new spot
    | using the provided data (mydict). It makes a POST request to a specified 
    | URL (DNC_URL + '/spot/' + myorg), where myorg is retrieved from session 
    | storage. The function resolves with the response JSON if the status is 
    | 200, otherwise, it rejects with the error message from the response.
    */
    function addNewSpot(mydict) {
        return new Promise(async function (resolve, reject) {
            try {
                let myorg = sessionStorage.getItem('myOrg');
                let auth = sessionStorage.getItem('myToken');
                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(mydict)
                };
                var url = new URL(DNC_URL + '/spot/' + myorg);
                fetch(url, requestOptions)
                    .then(async (response) => {
                        if (response.status == '200') {
                            let resp = await response.json();
                            resolve(resp);
                        } else {
                            let data = await response.json();
                            reject(data.message);
                        }
                    })
                    .catch((error) => {
                        // console.log('Error Resp: ', error);
                        reject(error);
                    });
            } catch (error) {
                reject('Invalid Organization');
            }
        });
    }

    const handleDynamicFieldChange = (event) => {
        const { id, value } = event.target;
        setDynamicFields((prevFields) => ({
            ...prevFields,
            [id]: value
        }));
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '100%', maxWidth: '30ch' }, // Set a maximum width for the TextField
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px'
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                size="small"
                required
                id="spotName"
                label="Spot Name"
                value={spotName}
                onChange={(e) => setSpotName(e.target.value)}
                error={spotError}
                helperText={spotError ? 'Spot Name is required.' : ''}
            />

            <TextField size="small" id="latitude" label="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            <TextField size="small" id="longitude" label="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            <TextField size="small" id="status" label="status" value={status} onChange={(e) => setStatus(e.target.value)} />

            {tdata.map((item) => (
                <div key={item}>
                    <TextField
                        label={item}
                        size="small"
                        id={item}
                        required
                        value={dynamicFields[item] || ''}
                        onChange={handleDynamicFieldChange}
                        error={dfError[item]}
                        helperText={dfError[item] ? `${item} is required.` : ''}
                        inputProps={{
                            list: `${item}Suggestions`
                        }}
                    />
                    <datalist id={`${item}Suggestions`}>
                        {Array.isArray(tagval[item]) &&
                            tagval[item].length > 0 &&
                            tagval[item].map((option) => <option key={option} value={option} />)}
                    </datalist>
                </div>
            ))}

            <div>
                <ColorButton stype="submit" onClick={handleSave} variant="contained" size="small" style={{ marginTop: '5%' }}>
                    Save
                </ColorButton>
            </div>
        </Box>
    );
}

/**** end of addspot.js ****/
