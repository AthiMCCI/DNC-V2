/*

Module: editstock.js

Function:
    Implementation code for Stocks.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation  October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { constobj } from './../../misc/constants';
import { useSelector } from 'react-redux';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

const useStyles = makeStyles((theme) => ({
    dialogWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
    },
    dialogCard: {
        width: '100%',
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2),
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        [theme.breakpoints.down('sm')]: {
            width: '80%'
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1)
    }
}));

export default function Editgateway(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [open, setOpen] = React.useState(true);
    const [orglist, setOrglist] = React.useState([]);
    const [orgdict, setOrgdict] = React.useState({});
    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);
    const [dslist, setDslist] = React.useState([]);
    const [dsdict, setDsdict] = React.useState({});
    const [selDs, setSelDs] = useState('');
    const [selDsId, setSelDsId] = useState(null);
    const [selDtype, setSelDtype] = useState('');
    const [dlist, setDlist] = React.useState([]);
    const [selDev, setSelDev] = useState('');
    const [selectedIDate, setSelectedIDate] = useState(null);
    const [selectedODate, setSelectedODate] = useState(null);
    const [selStatus, setSelStatus] = useState('');
    const classes = useStyles();

    const devnwtype = cfgmenu['autooptions']['devnwtype'] ? cfgmenu['autooptions']['devnwtype'] : [];
    const stockflow = cfgmenu['autooptions']['stockstatus'] ? cfgmenu['autooptions']['stockstatus'] : [];

    let snhold = cfgmenu['alias']['Stock'] ? cfgmenu['alias']['Stock'] : 'Stock';

    const devtype = [];

    for (let i = 0; i < devnwtype.length; i++) {
        devtype.push({ value: devnwtype[i], label: devnwtype[i] });
    }

    const stockstatus = [];

    for (let i = 0; i < stockflow.length; i++) {
        stockstatus.push({ value: stockflow[i], label: stockflow[i] });
    }

    const handleRefreshOrg = () => {
        getOrgInfo();
    };

    const handleRefreshDs = () => {
        getDsInfo();
    };
    const handleGetDevices = () => {
        getDevices();
    };
    const handleSave = () => {
        updateStock();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    const handleIDateChange = (newDate) => {
        setSelectedIDate(newDate);
    };
    const handleODateChange = (newDate) => {
        setSelectedODate(newDate);
    };

    async function dsChange(e) {
        setSelDs(e.target.value);
        setSelDsId(dsdict[e.target.value]);
    }
    async function orgChange(e) {
        setSelOrg(e.target.value);
        setSelOrgId(orgdict[e.target.value]);
    }
    async function dtChange(e) {
        setSelDtype(e.target.value);
    }
    async function devChange(e) {
        setSelDev(e.target.value);
    }
    async function handleStatus(e) {
        setSelStatus(e.target.value);
    }

    async function getOrgInfo() {
        const myorg = await getOrgList();
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
        setSelOrg(mynewo[0].value);
        setSelOrgId(mynewo[0].id);
    }

    /*

    Name:	getOrgList()

    Function:
        The getOrgList function is a utility function that retrieves a list of
        organizations from the server

    Definition:
        It makes a GET request with authentication headers, processes the 
        response JSON, and extracts organization names and IDs.

    Description:
        It makes a GET request authentication headers, processes the response 
        JSON, and extracts organization names and IDs. The function constructs
        an array of objects (olist) organizations with their names and IDs.

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
                    data = data.message;
                    let olist = [];
                    if (data != null) {
                        for (let i = 0; i < data.length; i++) {
                            olist.push({ name: data[i].name, id: data[i].id });
                        }
                    }
                    resolve(olist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
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
    }

    /*
    | The getDsList function is a utility function that retrieves a list of
    | data sources from the server. It makes a GET request with authentication
    | headers, processes the response JSON, and extracts data source names and
    | IDs. The function constructs an array of objects (olist) data sources
    | with their names and IDs
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
    | The getDevData function is a utility function that retrieves device data 
    | from the server. It takes a data dictionary (mydict) as a constructs the
    | request headers and body for a POST request, sends the request to server.
    | The function logs resolves with the server's response message.
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
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    async function getDevices() {
        let mydict = {};
        mydict['dsn'] = selDs;
        mydict['dtype'] = selDtype;
        try {
            let dresp = await getDevData(mydict);
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
        } catch (error) {
            Swal.fire(error);
        }
    }

    // Send request to backend to update the stock (device record)
    async function updateStock() {
        let mydict = {};
        mydict['hwsl'] = props.mydata.sdata.hwsl;
        mydict['nwIdV'] = selDev;
        mydict['nwIdK'] = selDtype;
        mydict['orgid'] = selOrgId || '';
        mydict['dsid'] = selDsId || '';
        mydict['idate'] = selectedIDate;
        mydict['odate'] = selectedODate;
        mydict['status'] = selStatus;
        mydict['remarks'] = document.getElementById('remarks').value;
        let fdict = {};
        fdict['sdata'] = mydict;
        // console.log('Stock Update Dict: ', mydict);
        let usresp = await updateStockRecord(fdict);
        handleCancel();
        toast.success(usresp, {
            position: 'top-right',
            autoClose: 3000, // Close the notification after 3 seconds (3000 milliseconds)
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    /*
    | The updateStockRecord function is a utility function that updates a stock
    | record on the server. It takes a data dictionary (mydict) as a parameter,
    | constructs the request headers and body for a PUT request, and sends the
    | request to the server. The function resolves with the server's response
    | message upon success or rejects The function resolves the server response
    | upon success or rejects with an error in case of failure.
    */
    function updateStockRecord(mydict) {
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
            var url = new URL(DNC_URL + '/stock');
            fetch(url, requestOptions)
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

    /*
    | The showStockInfo function for updating state variables based on the data
    | provided through props.mydata.sdata. It sets various state variables such
    | as organization (selOrg and selOrgId), data source (selDs and selDsId), 
    | device type (selDtype), device (selDev), selected dates (selectedIDate 
    | selectedODate) , status (selStatus), and more. Additionally, it updates
    | lists (dslist, orglist, dlist) and dictionaries (orgdict, dsdict) with 
    | relevant information.  
    */
    function showStockInfo() {
        setSelOrg(props.mydata.sdata.orgn);
        setSelOrgId(props.mydata.sdata.orgid);
        setSelDs(props.mydata.sdata.dsn);
        setSelDsId(props.mydata.sdata.dsid);
        setSelDtype(props.mydata.sdata.Type);
        setSelDev(props.mydata.sdata.nwId);
        setSelectedIDate(props.mydata.sdata.idate);
        setSelectedODate(props.mydata.sdata.odate);
        setSelStatus(props.mydata.sdata.status);
        setDslist([
            {
                id: props.mydata.sdata.dsid,
                value: props.mydata.sdata.dsn,
                label: props.mydata.sdata.dsn
            }
        ]);
        setOrglist([
            {
                id: props.mydata.sdata.orgid,
                value: props.mydata.sdata.orgn,
                label: props.mydata.sdata.orgn
            }
        ]);
        let selorgn = props.mydata.sdata.orgn;
        let selorgid = props.mydata.sdata.orgid;
        setOrgdict({ selorgn: selorgid });
        let seldsn = props.mydata.sdata.dsn;
        let seldsid = props.mydata.sdata.dsid;
        setDsdict({ seldsn: seldsid });
        let seldevid = props.mydata.sdata.nwId;
        setDlist([
            {
                id: 1,
                value: seldevid,
                label: seldevid
            }
        ]);
    }
    useEffect(() => {
        showStockInfo();
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.dialogWrapper}
            >
                <div className={classes.dialogCard}>
                    <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                        {`Edit ${snhold} - ` + props.mydata.sdata.hwsl}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '90%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                size="small"
                                id="selectOrg"
                                select
                                label="Select Organization"
                                value={selOrg}
                                onChange={orgChange}
                                SelectProps={{
                                    IconComponent: () => (
                                        <IconButton onClick={handleRefreshOrg} color="primary" aria-label="Refresh Organization">
                                            <RefreshIcon />
                                        </IconButton>
                                    )
                                }}
                            >
                                {orglist.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                size="small"
                                id="selectDs"
                                select
                                label="Select Data Source"
                                value={selDs}
                                onChange={dsChange}
                                SelectProps={{
                                    IconComponent: () => (
                                        <IconButton onClick={handleRefreshDs} color="primary" aria-label="Refresh Data Source">
                                            <RefreshIcon />
                                        </IconButton>
                                    )
                                }}
                            >
                                {dslist.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField size="small" id="selectDtype" select label="Device Id Type" value={selDtype} onChange={dtChange}>
                                {devtype.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                size="small"
                                id="outlined-select-Main Org"
                                select
                                label="Select Device"
                                value={selDev}
                                onChange={devChange}
                            >
                                {dlist.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Button size="small" onClick={handleGetDevices} variant="contained" color="primary">
                                Get Devices
                            </Button>

                            <TextField
                                id="remarks"
                                size="small"
                                defaultValue={props.mydata.sdata.remarks}
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                            />

                            <TextField size="small" id="selstatus" select label="Status" value={selStatus} onChange={handleStatus}>
                                {stockstatus.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="16px">
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
                                                    width: '50%'
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Select Out Date/Time"
                                        value={selectedODate}
                                        onChange={handleODateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                size="small"
                                                {...params}
                                                style={{
                                                    width: '51%'
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box size="small" display="flex" justifyContent="space-between" marginTop="16px">
                                <ColorButton
                                    sx={{
                                        width: '30%'
                                    }}
                                    onClick={handleSave}
                                    variant="contained"
                                >
                                    Save
                                </ColorButton>
                                <ColorButton
                                    sx={{
                                        backgroundColor: 'Gray',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        width: '30%'
                                    }}
                                    onClick={handleCancel}
                                    variant="contained"
                                >
                                    Cancel
                                </ColorButton>
                            </Box>
                        </Box>
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
}

/**** end of editstock.js ****/
