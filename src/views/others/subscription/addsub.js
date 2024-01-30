/*

Module: addsub.js

Function:
    Implementation code for Subscription.
    .

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { constobj } from './../../../misc/constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
const splans = [
    { id: 1, value: 'Free', label: 'Free' },
    { id: 2, value: 'Pro Cloud', label: 'Pro Cloud' }
];

/*

    Name:	AddSub ()

    Function:
        function managing the state and interactions related to adding or
        subscribing to an organization.

    Definition:
        AddSub function managing subscriptions. It includes state variables for
        organization lists, selected organization, plan, dates, and functions
        to handle changes in these selections

    Description:
        The AddSub function is a React component for managing subscriptions.
        It includes state variables for organization list, selected organization
        plan, and dates, and functions to handle changes in these selections.
        It's used in a user interface for choosing and managing organization
        subscriptions.

    */
export default function AddSub() {
    const { DNC_URL } = { ...constobj };
    const [orglist, setOrglist] = React.useState([]);
    const [orgdict, setOrgdict] = React.useState({});
    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);
    const [selPlan, setSelPlan] = useState('');
    const [selSdate, setSelSdate] = useState(null);
    const [selEdate, setSelEdate] = useState(null);

    const orgChange = (e) => {
        setSelOrg(e.target.value);
        setSelOrgId(orgdict[e.target.value]);
    };

    const planChange = (event) => {
        setSelPlan(event.target.value);
    };

    const sdateChange = (newDate) => {
        setSelSdate(newDate);
    };

    const edateChange = (newDate) => {
        setSelEdate(newDate);
    };

    const handleAddSubs = async () => {
        const mydict = { orgid: selOrgId, splan: selPlan, sdate: selSdate, edate: selEdate };
        try {
            const myresp = await sendNewSubs(mydict);
            toast.success(myresp.message);
        } catch (error) {
            toast.error('Error: ' + (error.message || error.toString()));
        }
    };

    async function getOrgInfo() {
        const myorg = await getOrgList();
        console.log('Org list under subs: ', myorg);
        let mynewo = [];
        let orgdict = {};
        for (let i = 0; i < myorg.length; i++) {
            let mydict = {};
            mydict['id'] = myorg[i].id;
            mydict['label'] = myorg[i].name;
            mydict['value'] = myorg[i].name;
            mynewo.push(mydict);
            orgdict[myorg[i].name] = myorg[i].id;
        }
        setOrglist(mynewo);
        setOrgdict(orgdict);
        // setSelOrg(mynewo[0].value);
        // setSelOrgId(mynewo[0].id);
    }

    /*
    | The `getOrgList` function is an asynchronous function that fetches a list
    | organizations from a server using a `GET` request. It retrieves an 
    | authentication token, sends a request with appropriate headers, processes
    | the response to form a list of organizations, and handles any errors. The
    | function returns a promise that resolves with the organization list or
    | rejects with an error..
    */
    function getOrgList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(DNC_URL + '/org', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let orglist = data.message;
                    let olist = [];
                    if (orglist != null) {
                        for (let i = 0; i < orglist.length; i++) {
                            olist.push({ name: orglist[i].name, id: orglist[i].id });
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
    | The `sendNewSubs` function is an asynchronous function that sends
    | subscription data to a server. It constructs a `POST` request with an
    | authorization token and the provided subscription data, then processes
    | the server's response. The function returns a promise that resolves with
    | success message from the server or rejects with an error.
    */
    function sendNewSubs(mydict) {
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
            var url = new URL(DNC_URL + '/subs');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Add Subs Success: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    useEffect(() => {
        getOrgInfo();
    }, []);

    return (
        <Box
            sx={{
                width: '25%',
                maxWidth: '500px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                padding: '20px',
                borderRadius: '10px'
            }}
        >
            <FormControl sx={{ minWidth: '20%', marginBottom: '10px', width: '110%' }}>
                <TextField size="small" id="selectOrg" select label="Select Org" value={selOrg} onChange={orgChange}>
                    {orglist.length > 0 &&
                        orglist.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
            </FormControl>
            <FormControl sx={{ minWidth: '20%', marginBottom: '10px', width: '110%' }}>
                <TextField size="small" id="selectPlan" select label="Select Plan" value={selPlan} onChange={planChange}>
                    {splans.map((option) => (
                        <MenuItem key={option.id} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            <Box sx={{ marginTop: '10px', marginBottom: '10px', width: '110%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        renderInput={(props) => <TextField size="small" {...props} />}
                        label="Start Date/Time"
                        value={selSdate}
                        onChange={sdateChange}
                        sx={{ marginTop: '10px', marginBottom: '20px', width: ['100%', '50%', '30%'] }}
                    />
                </LocalizationProvider>
            </Box>
            <Box sx={{ marginTop: '10px', marginBottom: '20px', width: '110%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        renderInput={(props) => <TextField size="small" {...props} />}
                        label="End Date/Time"
                        value={selEdate}
                        onChange={edateChange}
                        sx={{ width: '100%' }}
                    />
                </LocalizationProvider>
            </Box>
            <ColorButton
                onClick={handleAddSubs}
                size="small"
                variant="contained"
                sx={{
                    fontWeight: 'bold'
                    // fontSize: '15px'
                }}
            >
                Add
            </ColorButton>
        </Box>
    );
}

/**** end of addsub.js ****/
