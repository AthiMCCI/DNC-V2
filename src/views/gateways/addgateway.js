/*

Module: addgateway.js

Function:
    Implementation code for Gateways.

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
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../misc/constants';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

function AddGateway(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [myorgs, setMyorgs] = useState([]);
    const [selOrg, setSelOrg] = useState('');
    const [selLoc, setSelLoc] = useState('');
    const [selModel, setSelModel] = useState('');
    const [selRemarks, setSelRemarks] = useState('');
    const [selStatus, setSelStatus] = useState('');
    const [orgdict, setOrgdict] = React.useState({});
    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selInsDate, setSelInsDate] = useState(null);
    const [gwhwid, setGwhwid] = useState('');
    const [gwhwidValid, setGwhwidValid] = useState(false);
    const [simcardMake, setSimcardMake] = useState('');

    const [formData, setFormData] = useState({
        gatewayName: '',
        location: '',
        technology: '',
        network: '',
        lastUpdateOn: null
    });

    let dnhold = cfgmenu['alias']['Device'] ? cfgmenu['alias']['Device'] : 'Device';
    const locoptions = cfgmenu['autooptions']['locations'] ? cfgmenu['autooptions']['locations'] : [];
    const modeloptions = cfgmenu['autooptions']['gwmodel'] ? cfgmenu['autooptions']['gwmodel'] : [];
    const statusoptions = cfgmenu['autooptions']['gwstatus'] ? cfgmenu['autooptions']['gwstatus'] : [];
    const remarkoptions = cfgmenu['autooptions']['remarks'] ? cfgmenu['autooptions']['remarks'] : [];

    const nwtechdict = cfgmenu['autooptions']['technology'] ? cfgmenu['autooptions']['technology'] : [];
    const nwtech = Object.keys(nwtechdict);

    const technology = [];
    const nwdict = {};

    for (let i = 0; i < nwtech.length; i++) {
        technology.push({ value: nwtech[i], label: nwtech[i] });
        nwdict[nwtech[i]] = [];
        for (let k = 0; k < nwtechdict[nwtech[i]].length; k++) {
            nwdict[nwtech[i]].push({ value: nwtechdict[nwtech[i]][k], label: nwtechdict[nwtech[i]][k] });
        }
    }

    // console.log("Mcci Network dict: ", nwdict)

    const [gwname, setGwname] = useState('');
    const [gwnameValid, setGwnameValid] = useState(false);
    const [insDateValid, setInsDateValid] = useState(false);
    const [simcardMakeValid, setSimcardMakeValid] = useState(false);
    const [techValid, setTechValid] = useState(false);
    const [nwValid, setNwValid] = useState(false);
    const [statusValid, setStatusValid] = useState(false);

    const handleSaveClick = () => {
        let gwnameError = !gwname || gwname.trim() === '';
        let insDateError = !selInsDate;
        let gwhwidError = !gwhwid || gwhwid.trim() === '';
        let simcardMakeError = !simcardMake || simcardMake.trim() === '';
        let modelError = !selModel || selModel.trim() === '';
        let techError = !selTech || selTech.trim() === '';
        let nwError = !selNw || selNw.trim() === '';
        let statusError = !selStatus || selStatus.trim() === '';

        setGwnameValid(gwnameError);
        setInsDateValid(insDateError);
        setGwhwidValid(gwhwidError);
        setSimcardMakeValid(simcardMakeError);
        setTechValid(techError);
        setNwValid(nwError);
        setStatusValid(statusError);

        if (gwnameError || insDateError || gwhwidError || simcardMakeError || modelError || techError || nwError || statusError) {
            return;
        }

        // console.log('Save Clicked!!!');
        addNewGateway();
    };

    const handleRefOrg = () => {
        getOrgInfo();
    };

    async function changeModel(e) {
        setSelModel(e.target.value);
    }
    async function changeTech(e) {
        setSelTech(e.target.value);
    }
    async function changeNw(e) {
        setSelNw(e.target.value);
    }

    const changeInsDate = (newDate) => {
        setSelInsDate(newDate);
        // console.log('Selected Date:', newDate);
    };
    const orgChange = async (e, nv) => {
        setSelOrg(nv);
    };
    const locChange = async (e, nv) => {
        setSelLoc(nv);
    };
    const modelChange = async (e, nv) => {
        setSelModel(nv); // Ensure this updates selModel, not model
    };
    const remChange = async (e, nv) => {
        setSelRemarks(nv);
    };
    const statusChange = async (e, nv) => {
        setSelStatus(nv);
    };

    /*
    | addNewGateway  asynchronous function designed to collect gateway data
    | from HTML input fields, call the addGwData function with the data, and
    | handle success or error scenarios using toast notifications. It appears
    | to be part of a larger component or application dealing with gateway
    | management.
    */
    async function addNewGateway() {
        let mydict = {};
        mydict['name'] = document.getElementById('gwname').value;
        mydict['hwid'] = document.getElementById('gwhwid').value;
        mydict['simmk'] = document.getElementById('simcard').value;
        mydict['ssusc'] = document.getElementById('ssusc').value;
        mydict['tech'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['adate'] = selInsDate;
        mydict['status'] = selStatus;
        mydict['orgid'] = selOrg;
        mydict['location'] = selLoc;
        mydict['model'] = selModel;
        mydict['remarks'] = selRemarks;
        try {
            let sresp = await addGwData(mydict);
            toast.success(sresp.message);
            props.agdata.cbf(0);
        } catch (error) {
            toast.error(error);
        }
    }

    /*

    Name:	addGwData(datadict)()

    Function:
        addGwData(datadict) fetch function is used to make an asynchronous
        HTTP POST request to the specified URL

    Definition:
        Asynchronous is processed using the Promise. If the response status is
        400, the Promise is rejected with the error message from the response.
        Otherwise, it is resolved with the parsed response data..

    Description:
        addGwData function is designed to make an asynchronous POST request to
        a specified URL (DNC_URL + '/gwunit') with the provided data (datadict)
        The function returns a Promise that resolves with the response data if
        the request is successful and rejects with an error if there any issue
        during the request.

    */
    function addGwData(datadict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(datadict)
            };
            var url = new URL(DNC_URL + '/gwunit');
            fetch(url, requestOptions)
                .then(async (response) => {
                    if (response.status == '400') {
                        let resp = await response.json();
                        reject(resp.message);
                    } else {
                        let data = await response.json();
                        resolve(data);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
    }

    /*
    | getClientData function fetches client data asynchronously and returns a
    | promise with the list of client names. It retrieves authentication 
    | information, sets request headers, configures request options, builds the
    | request URL, performs the data fetch operation, extracts client name from
    | the data, and resolves the promise with the list of client names. If any 
    | issues occur, the promise is rejected with an error.
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

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        getSpotInfo(myorg);
    }, []);

    return (
        <Box
            component="form"
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                gridTemplateRows: 'repeat(3, 1fr)', // 3 rows
                gap: '1rem',
                '& .MuiTextField-root, & .MuiAutocomplete-root': {
                    width: '100%' // Make text fields responsive
                }
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="gwname"
                label="Gateway Name"
                value={gwname}
                size="small"
                onChange={(e) => setGwname(e.target.value)}
                required
                error={gwnameValid}
                helperText={gwnameValid ? 'Gateway Name is required.' : ''}
            />
            <TextField
                id="gwhwid"
                label="Hardware ID"
                size="small"
                value={gwhwid}
                onChange={(e) => setGwhwid(e.target.value)}
                required
                error={gwhwidValid}
                helperText={gwhwidValid ? 'Hardware ID is required.' : ''}
            />
            <TextField
                size="small"
                id="simcard"
                label="SIM card make"
                value={simcardMake}
                onChange={(e) => setSimcardMake(e.target.value)}
                required
                error={simcardMakeValid}
                helperText={simcardMakeValid ? 'SIM card make is required.' : ''}
            />{' '}
            <Autocomplete
                freeSolo
                options={myorgs}
                size="small"
                defaultValue=""
                value={selOrg}
                onChange={orgChange}
                renderInput={(params) => <TextField {...params} label="Client/Org" onChange={(e) => setSelOrg(e.target.value)} />}
            />
            <Autocomplete
                freeSolo
                options={locoptions}
                size="small"
                onChange={locChange}
                renderInput={(params) => <TextField {...params} label="Location" onChange={(e) => setSelLoc(e.target.value)} />}
            />
            <TextField size="small" id="ssusc" label={`${dnhold}s connected`} type="number" />
            <Autocomplete
                freeSolo
                options={modeloptions}
                size="small"
                onChange={modelChange}
                renderInput={(params) => <TextField {...params} label="Model" onChange={(e) => setSelModel(e.target.value)} />}
            />
            <TextField
                size="small"
                id="gwtech"
                select
                required
                label="Technology"
                error={techValid}
                helperText={techValid ? 'Technology is required.' : ''}
                value={selTech}
                onChange={changeTech}
            >
                {technology.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                size="small"
                id="gwnw"
                select
                required
                label="Network"
                helperText={nwValid ? 'Network is required.' : ''}
                error={nwValid}
                value={selNw}
                onChange={changeNw}
            >
                {selTech != null > 0 &&
                    nwdict[selTech].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
            </TextField>
            <Autocomplete
                freeSolo
                options={statusoptions}
                size="small"
                onChange={statusChange}
                renderInput={(params) => (
                    <TextField
                        size="small"
                        {...params}
                        label="Status"
                        required
                        onChange={(e) => {
                            setSelStatus(e.target.value);
                        }}
                        style={{ minWidth: '193px' }}
                        helperText={statusValid ? 'Status is required.' : ''}
                        error={statusValid}
                    />
                )}
            />
            <Autocomplete
                freeSolo
                size="small"
                options={remarkoptions}
                onChange={remChange}
                renderInput={(params) => <TextField {...params} label="Remarks" onChange={(e) => setSelRemarks(e.target.value)} />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date"
                    size="small"
                    value={selInsDate}
                    onChange={(newDate) => setSelInsDate(newDate)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            required
                            error={insDateValid}
                            helperText={insDateValid ? 'Date is required.' : ''}
                        />
                    )}
                />
            </LocalizationProvider>
            <ColorButton style={{ marginTop: '1.8%', width: '10%' }} onClick={handleSaveClick} size="small" variant="contained">
                Save
            </ColorButton>
        </Box>
    );
}

export default AddGateway;

/**** end of addgateway.js ****/
