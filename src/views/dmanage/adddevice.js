/*

Module: adddevice.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import { Button, Collapse, IconButton, Paper } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddSsuInfo from './addssuinfo';
import AddHwInfo from './addhwinfo';
import ConfigDevice from './configdevice';
import TextField from '@mui/material/TextField';
import { constobj } from './../../misc/constants';
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

/*
| AddDevice Manages the state and user input for adding a device This function
| represents a React functional component named AddDevice. It manages the state
| and user input related to adding a device. The state variables include 
| information about hardware, SSU (Software Support Unit) details, data source,
| and date picker. The component also interact with the Redux state to retrieve
| the configuration menu. The deviceFlag state is set based on the availability
| of the 'Device Details' feature in the configuration menu.
*/
function AddDevice() {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [hwExpanded, setHwExpanded] = useState(false);
    const [cfExpanded, setCfExpanded] = useState(false);
    const [selDate, setSelDate] = useState(new Date()); // State for DateTimePicker
    // Ssu Info
    const [ssuId, setSsuId] = useState('');
    const [ssuBatch, setSsuBatch] = useState('');
    const [ssuType, setSsuType] = useState('');
    const [ssuVer, setSsuVer] = useState('');
    const [ssuStatus1, setSsuStatus1] = useState('');
    const [ssuOrg, setSsuOrg] = useState('');
    const [ssuLoc, setSsuLoc] = useState('');
    const [ssuRemarks, setSsuRemarks] = useState('');
    //hwinfo
    const [hwsl, setHwSl] = useState('');
    const [boardRev, setBoardRev] = useState('');
    const [fwVer, setFwVer] = useState('');
    const [tech, setTech] = useState('');
    const [network, setNetwork] = useState('');
    const [region, setRegion] = useState('');
    const [hwRemarks, setHwRemarks] = useState('');
    //data source
    const [dsid, setDsid] = useState('');
    const [dtype, setDtype] = useState('');
    const [devid, setDevid] = useState('');
    const [selTechError, setSelTechError] = useState(false);
    const [selNwError, setSelNwError] = useState(false);
    const [ssuBoardRever, setSsuBoardRver] = useState('');
    const [ssuFirWareVersion, setSsuFirmWareVersion] = useState('');
    const [hwData, setHwData] = useState({});
    const [configData, setConfigData] = useState({});
    const [deviceFlag, setDeviceFlag] = useState(false);

    useEffect(() => {
        let featuresKey = Object.keys(cfgmenu['features']);
        if (featuresKey.includes('Device Details')) {
            setDeviceFlag(cfgmenu['features']['Device Details']);
        }
    }, [cfgmenu]);

    let dnhold = cfgmenu['alias']['Device'] ? cfgmenu['alias']['Device'] : 'Device';

    const handleHwToggle = () => {
        setHwExpanded(!hwExpanded);
    };
    const handlecfToggle = () => {
        setCfExpanded(!cfExpanded);
    };
    const handleDateChange = (date) => {
        setSelDate(date);
    };
    const [isSsuIdValid, setIsSsuIdValid] = useState(true);
    const [isHwSlValid, setIsHwSlValid] = useState(true);
    const handleAddClick = () => {
        // console.log('ssuId:', ssuId);
        // console.log('hwsl:', hwsl);
        // console.log('tech:', tech);
        // console.log('network:', network);
        setIsSsuIdValid(!!ssuId);
        setIsHwSlValid(!!hwsl);
        setSelTechError(!tech);
        setSelNwError(!network);
        if (!ssuId || !hwsl || !tech || !network) {
            return;
        }
        // Handle the logic for adding the device with selected date
        let ssdata = {
            ssuid: ssuId,
            batch: ssuBatch,
            ssutype: ssuType,
            ssuver: ssuVer,
            ssustatus: ssuStatus1,
            client: ssuOrg,
            location: ssuLoc,
            remarks: ssuRemarks,
            adate: selDate
        };
        let hdata = {
            hwsl: hwsl,
            boardrev: boardRev,
            fwver: fwVer,
            tech: tech,
            network: network,
            region: region,
            remarks: hwRemarks,
            adate: selDate
        };
        let sdata = {
            hwsl: hwsl,
            dsid: dsid,
            nwIdV: devid,
            nwIdK: dtype
        };
        ssdata.ssuid = hdata.hwsl;
        // console.log('HW Data to Add:', sdata);
        addSsu({ ssdata: ssdata, hdata: hdata, sdata: sdata });
    };

    /*

    Name:	addSsuData ()

    Function:
        It sends a POST request to a specified URL with authorization headers
        and user-provided data to add SSU.

    Definition:
        Asynchronous function addSsuData for adding SSU information using Fetch
        API and authorization headers.

    Description:
        adds SSU information by sending a POST request to server authorization
        headers and the provided SSU data (mydict). It resolve the Promise with
        the response data on successful or rejects with error case of failure.

    Return:
       Asynchronous function for adding SSU information, resolving response data
       on success or rejecting with an error.

    */

    function addSsuData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/ssu');
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
    async function addSsu(mydict) {
        try {
            let sresp = await addSsuData(mydict);
            toast.success('Stock added successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (err) {
            toast.error(err.message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    return (
        <div>
            <div style={{ padding: '16px', maxWidth: '1000px', marginBottom: '16px' }}>
                {deviceFlag && (
                    <>
                        <span>{`${dnhold} Details`}</span>
                        <AddSsuInfo
                            isSsuIdValid={isSsuIdValid}
                            setIsSsuIdValid={setIsSsuIdValid}
                            setSsuId={setSsuId}
                            dnhold={dnhold}
                            ssu={{
                                ver: setSsuVer,
                                id: setSsuId,
                                type: setSsuType,
                                batch: setSsuBatch,
                                status1: setSsuStatus1,
                                org: setSsuOrg,
                                loc: setSsuLoc,
                                remarks: setSsuRemarks
                            }}
                        />
                    </>
                )}
            </div>

            <Paper elevation={0}>
                <IconButton onClick={handleHwToggle}>{hwExpanded ? <RemoveIcon /> : <AddIcon />}</IconButton>
                <span>Hardware Details</span>
                <Collapse in={hwExpanded}>
                    <AddHwInfo
                        hw={{
                            hwsl: setHwSl,
                            brev: setBoardRev,
                            fwver: setFwVer,
                            tech: setTech,
                            netw: setNetwork,
                            region: setRegion,
                            remarks: setHwRemarks
                        }}
                        isHwSlValid={isHwSlValid}
                        setIsHwSlValid={setIsHwSlValid}
                        selTechError={selTechError}
                        setSelTechError={setSelTechError}
                        selNwError={selNwError}
                        setSelNwError={setSelNwError}
                    />
                </Collapse>
            </Paper>

            <Paper elevation={0}>
                <IconButton onClick={handlecfToggle}>{cfExpanded ? <RemoveIcon /> : <AddIcon />}</IconButton>
                <span>Config Details</span>
                <Collapse in={cfExpanded}>
                    <ConfigDevice ds={{ sid: setDsid, dtype: setDtype, devid: setDevid }} /> {/* Pass the onDataChange prop */}
                </Collapse>
            </Paper>

            <Paper style={{ marginTop: '5%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Select In Date/Time"
                        value={selDate}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <TextField
                                size="small"
                                {...params}
                                style={{
                                    width: '30%', // Adjust the width as needed
                                    marginLeft: '16px' // Add some spacing between DateTimePicker and Button
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>
                <ColorButton
                    size="small"
                    style={{ marginLeft: '2%', marginTop: '0.5%' }}
                    variant="contained"
                    // color="success"
                    onClick={handleAddClick}
                >
                    Add
                </ColorButton>
            </Paper>
        </div>
    );
}

export default AddDevice;

/**** end of adddevice.js ****/
