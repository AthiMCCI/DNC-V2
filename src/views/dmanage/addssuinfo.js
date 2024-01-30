/*

Module: addssuinfo.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import './../../App.css';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';

import { constobj } from '../../misc/constants';

function AddSsuInfo(props) {
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    let myorg = sessionStorage.getItem('myOrg');

    const handleStatusChange = (event) => {
        props.ssu.status1(event.target.value); // Call the status1 setter from props
    };
    const { DNC_URL } = { ...constobj };

    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selRegion, setSelRegion] = useState('');
    const [selAction, setSelAction] = useState('');
    const [ssuVer, setSsuVer] = useState('');

    const [myorgs, setMyorgs] = useState([]);
    const [selOrg, setSelOrg] = useState('');
    const [myorglocs, setMyorglocs] = useState([]);

    const [doa, setDoA] = React.useState(null);

    let dnhold = cfgmenu['alias']['Device'] ? cfgmenu['alias']['Device'] : 'Device';

    const ssuTypes = cfgmenu['autooptions']['ssutypes'] ? cfgmenu['autooptions']['ssutypes'] : [];
    const statusSuggestions = cfgmenu['autooptions']['gwstatus'] ? cfgmenu['autooptions']['gwstatus'] : [];
    const remarkSuggestions = cfgmenu['autooptions']['remarks'] ? cfgmenu['autooptions']['remarks'] : [];

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
        const myspot = await getSpotData(myorg);
        // console.log('MySpot SSU: ', myspot);
        setMyorglocs(myspot);
    }

    /*

    Name:	getClientData ()

    Function:
        Asynchronous function that returns a Promise. It fetches organization
        data using a GET request to a specified URL with authorization headers
        and extracts organization names.

    Definition:
        Asynchronous function getClientData for fetch organization name using
        Fetch API and authorization headers.

    Description:
        Fetches organization data from the server using a GET request with
        authorization headers. It extracts organization names and resolves the 
        Promise with an array of organization name on successful data retrieval
        or rejects with an error in case of failure.

    Return:
        Asynchronous function for fetching and extracting organization names,
        resolving with an array of names on success or rejecting with an error.

    */

    function getClientData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/org');

            let myslist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Real Data: ', data);
                    let myloc = [];
                    data.forEach((item) => {
                        myloc.push(item.name);
                    });
                    resolve(myloc);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    Name:	getSpotData  ()

    Function:
        It fetches spot data for a specific organization using a GET request to
        a specified URL with authorization headers and extracts spot names.

    Definition:
        Asynchronous function getSpotData for fetching spot names for a given 
        organization using Fetch API and authorization headers.

    Description:
        Fetches spot data for a specific organization from the server using a
        GET request with authorization headers. It extracts spot name resolves
        the Promise with an array of spot name on successful data retrieval or
        rejects with an error in case of failure.

    Return:
        Asynchronous function for fetching and extracting spot names for given
        organization, resolving with an array of names on success or rejecting
        with an error.

    */

    function getSpotData(myorg) {
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

            let myslist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // console.log('Real Data: ', data);
                    let myloc = [];
                    data.forEach((item) => {
                        myloc.push(item.sname);
                    });
                    resolve(myloc);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const typeChange = async (e, nv) => {
        props.ssu.type(nv);
    };

    const statusChange = async (e, nv) => {
        props.ssu.status1(nv);
    };

    const orgChange = async (e, nv) => {
        props.ssu.org(nv);
        setSelOrg(nv);
        const myspot = await getSpotData(nv);
        setMyorglocs(myspot);
    };

    const locChange = async (e, nv) => {
        props.ssu.loc(nv);
    };

    const remChange = async (e, nv) => {
        props.ssu.remarks(nv);
    };

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        // setSelOrg(myorg);
        getSpotInfo(myorg);
    }, []);

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxWidth: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '1rem'
            }}
            noValidate
            autoComplete="off"
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    alignItems: 'center'
                }}
            >
                <TextField
                    size="small"
                    id="hwId"
                    label={`${dnhold} ID`}
                    onChange={(e) => props.ssu.id(e.target.value)}
                    style={{ minWidth: '150px' }}
                />
                <TextField
                    size="small"
                    id="boardRev"
                    label="Batch"
                    onChange={(e) => props.ssu.batch(e.target.value)}
                    style={{ minWidth: '150px' }}
                />
                <Autocomplete
                    freeSolo
                    options={ssuTypes}
                    onChange={typeChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Type"
                            onChange={(e) => {
                                props.ssu.type(e.target.value); // Make sure props.ssu.status is defined and working
                            }}
                            style={{ minWidth: '193px' }}
                        />
                    )}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    alignItems: 'center',
                    marginTop: '1rem' // Add margin between rows
                }}
            >
                <TextField
                    size="small"
                    id="ssuVersion"
                    label="Version"
                    onChange={(e) => props.ssu.ver(e.target.value)}
                    style={{ minWidth: '150px' }}
                />
                <Autocomplete
                    freeSolo
                    options={statusSuggestions}
                    onChange={statusChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Status"
                            onChange={(e) => {
                                props.ssu.status1(e.target.value); // Make sure props.ssu.status is defined and working
                            }}
                            style={{ minWidth: '193px' }}
                        />
                    )}
                />
                <Autocomplete
                    freeSolo
                    options={myorgs}
                    defaultValue=""
                    value={selOrg}
                    onChange={orgChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            onChange={(e) => props.ssu.org(e.target.value)}
                            label="Organization/Client"
                            style={{ minWidth: '193px' }}
                        />
                    )}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    alignItems: 'center',
                    marginTop: '1rem' // Add margin between rows
                }}
            >
                <Autocomplete
                    freeSolo
                    options={myorglocs}
                    onChange={locChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location"
                            size="small"
                            onChange={(e) => props.ssu.loc(e.target.value)}
                            style={{ minWidth: '193px' }}
                        />
                    )}
                />
                <Autocomplete
                    freeSolo
                    options={remarkSuggestions}
                    onChange={remChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Remarks"
                            size="small"
                            onChange={(e) => props.ssu.remarks(e.target.value)}
                            style={{ minWidth: '193px' }}
                        />
                    )}
                />
                {/* Add an empty cell if needed */}
                <div style={{ minWidth: '150px' }}></div>
            </Box>
        </Box>
    );
}

export default AddSsuInfo;

/*** end of addssuinfo.js ***/
