/*

Module: addstock.js

Function:
    Implementation code for Stock.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

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
import { constobj } from './../../misc/constants';
import { useSelector } from 'react-redux';

/*

Name:	AddStock()

Function:
    Manages uses state variables for various input fields and invokes the
    addStock function upon the save button click. The component includes event
    handlers for changes in technology, network, region, and action input.

Definition:
    The component includes event handlers for changes in technology, network, 
    region, and action inputs.

Description:
	The addStock function constructs a dictionary (mydict) with input values 
    and makes an asynchronous request to add stock data. A success message is 
    displayed using Swal.fire.

Return:
    The function does not explicitly return a value, but it updates the stock
    information and invokes a callback function (props.mydata.cbf(1)).

*/
function Addstock(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selRegion, setSelRegion] = useState('');
    const [selAction, setSelAction] = useState('');
    const [doa, setDoA] = React.useState(null);

    const bandregions = cfgmenu['autooptions']['bandregions'] ? cfgmenu['autooptions']['bandregions'] : [];

    const hwaction = cfgmenu['autooptions']['hwactions'] ? cfgmenu['autooptions']['hwactions'] : [];

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

    const bandRegion = [];
    for (let i = 0; i < bandregions.length; i++) {
        bandRegion.push({ value: bandregions[i], label: bandregions[i] });
    }

    const action = [];
    for (let i = 0; i < hwaction.length; i++) {
        action.push({ value: hwaction[i], label: hwaction[i] });
    }

    const handleSaveClick = () => {
        addStock();
        props.mydata.cbf(1);
    };
    async function techChange(e) {
        setSelTech(e.target.value);
    }
    async function nwChange(e) {
        setSelNw(e.target.value);
    }
    async function regionChange(e) {
        setSelRegion(e.target.value);
    }
    async function actionChange(e) {
        setSelAction(e.target.value);
    }
    async function addStock(props) {
        let mydict = {};
        mydict['hwsl'] = document.getElementById('hwId').value;
        mydict['nwIdV'] = '';
        mydict['nwIdK'] = '';
        mydict['boardrev'] = document.getElementById('boardRev').value || '';
        mydict['fwver'] = document.getElementById('fwVer').value || '';
        mydict['technology'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['region'] = selRegion || '';
        mydict['action'] = selAction || '';
        mydict['remarks'] = '';
        mydict['doa'] = doa || '';
        // console.log('Before Request: ', selNw, selAction);
        // console.log('Final Dict: ', mydict);
        let sresp = await addStockData(mydict);
        Swal.fire({
            title: 'Stock Added',
            html: `
                <div>
                    <p><strong>Hardware Id:</strong> ${mydict.hwsl}</p>
                    <p><strong>Board Revision:</strong> ${mydict.boardrev}</p>
                    <p><strong>Firmware Version:</strong> ${mydict.fwver}</p>
                    <p><strong>Technology:</strong> ${mydict.technology}</p>
                    <p><strong>Network:</strong> ${mydict.network}</p>
                    <p><strong>Region:</strong> ${mydict.region}</p>
                    <p><strong>Action:</strong> ${mydict.action}</p>
                    <p><strong>Date/Time Of Action:</strong> ${mydict.doa}</p>
                </div>
            `,
            icon: 'success'
        });
        props.mydata.cbf(1);
    }

    /*
    | addStockData is a utility function that sends a POST request to add stock
    | data to a server. It takes a data dictionary (datadict) as a parameter,
    | constructs the request headers and body, and returns a Promise.
    | The function resolves with the server response upon success or rejects
    | with an error in case of failure.
    */
    function addStockData(datadict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            let mydict = {};
            mydict['sdata'] = datadict;
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/stock');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

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
                <TextField id="hwId" label="Hardware Id" />
                <TextField id="boardRev" label="Board Revision" />
                <TextField id="fwVer" label="Firmware Version" />
            </div>
            <div>
                <TextField
                    style={{ marginTop: ' 1px ' }}
                    id="technology"
                    select
                    label=" Technology"
                    helperText=" "
                    value={selTech}
                    onChange={techChange}
                >
                    {technology.length > 0 &&
                        technology.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
                <TextField
                    style={{ marginTop: ' -2px ' }}
                    id="network"
                    select
                    label=" Network"
                    helperText=" "
                    value={selNw}
                    onChange={nwChange}
                >
                    {selTech != null > 0 &&
                        nwdict[selTech].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
                <TextField
                    style={{ marginTop: ' -3px ' }}
                    id="bandRegion"
                    select
                    label=" Band/Region"
                    helperText=" "
                    value={selRegion}
                    onChange={regionChange}
                >
                    {bandRegion.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="fields">
                <TextField
                    style={{ marginTop: ' 1px ' }}
                    id="action"
                    select
                    label=" Action"
                    helperText=" "
                    value={selAction}
                    onChange={actionChange}
                >
                    {action.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Date/Time Of Action"
                        value={doa}
                        onChange={(newValue) => {
                            setDoA(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                style={{
                                    // Add your desired styles here
                                    width: '235px',
                                    fontSize: '16px',
                                    marginTop: '1px' // ... more styles
                                }}
                            />
                        )}
                    />
                    <Button style={{ marginTop: '1%' }} variant="contained" color="info" onClick={handleSaveClick}>
                        Save
                    </Button>
                </LocalizationProvider>
            </div>
        </Box>
    );
}

export default Addstock;

/**** end of addstock.js ****/
