/*

Module: editdatasource.js

Function:
    Implementation code for DataSource.
    .

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Swal from 'sweetalert2';
import './datasrc.css';
import MenuItem from '@mui/material/MenuItem';
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

export default function Editdatasource(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [dblist, setDblist] = React.useState([]);
    const [selMmt, setSelMmt] = React.useState('');
    const [mmtlist, setMmtlist] = React.useState([]);
    const [selDb, setSelDb] = React.useState('');

    console.log('Read EDS Props: ', props);
    const handleSave = () => {
        //setOpen(true);
        UpdateDataSource();
    };

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        console.log('My Child Comp: ', props.mydata.sdata);
        props.mydata.hcb();
    };

    useEffect(() => {
        showDsInfo();
    }, []);

    const handleRefershdb = async () => {
        const mydbs = await getDbList();
        let mydblst = [];
        for (let i = 0; i < mydbs.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mydbs[i];
            mydict['label'] = mydbs[i];
            mydblst.push(mydict);
        }
        setDblist(mydblst);
        setSelDb(mydblst[0].value);
        console.log('My DBs ****', mydblst);
    };

    /*

    Name:	getDbLis()

    Function:
        getDbList is an asynchronous function that returns a Promise, handling
        the retrieval of a database list by sending a POST request to specified
        URL with authorization headers and user-inputted database details.

    Definition:
        Asynchronous function getDbList for fetching database list using Fetch
        API, authorization headers, and user-inputted database details.

    Description:
        Asynchronously fetches a list of databases by sending a POST request to
        the server with authorization headers and user-inputted database detail
        extracted from DOM elements. It resolves the Promise with the retrieved
        database list on success or rejects with an error in case of failure.

    Return:
        Asynchronous function for retrieving database list resolving with list
        on success or rejecting with an error.

    */
    function getDbList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['dburl'] = document.getElementById('dsurl').value;
            mydict['dbuname'] = document.getElementById('uname').value;
            mydict['dbpwd'] = document.getElementById('pwd').value;
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getdbl');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.db_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getMmtList function retrieves a list of MMT (Matched Metadata Table) for
    | given database asynchronously and returns a promise. authentication 
    | information, sets request headers, prepares the payload with database
    | information, configures request options, builds the request URL, performs
    | the MMT list retrieval operation, and resolves the promise with the 
    | retrieved MMT list if successful. 
    */
    function getMmtList(dbname) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['dburl'] = document.getElementById('dsurl').value;
            mydict['dbuname'] = document.getElementById('uname').value;
            mydict['dbpwd'] = document.getElementById('pwd').value;
            mydict['dbname'] = dbname;
            console.log('MMT Param: ', mydict);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getmmtl');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('List of MMT: ', data);
                    resolve(data.mmt_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function onchangeDb(e) {
        let mseldb = e.target.value;
        setSelDb(mseldb);
        console.log('Handle Read MMgt');
        if (mseldb !== '') {
            const mymmts = await getMmtList(mseldb);
            let mymmtlst = [];
            for (let i = 0; i < mymmts.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['value'] = mymmts[i];
                mydict['label'] = mymmts[i];
                mymmtlst.push(mydict);
            }
            setMmtlist(mymmtlst);
            setSelMmt(mymmtlst[0].value);
        }
    }
    async function onchangeMmt(e) {
        setSelMmt(e.target.value);
    }

    const handleRefershmmt = async () => {
        const mymmts = await getMmtList(selDb);
        let mymmtlst = [];
        for (let i = 0; i < mymmts.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mymmts[i];
            mydict['label'] = mymmts[i];
            mymmtlst.push(mydict);
        }
        setMmtlist(mymmtlst);
        setSelMmt(mymmtlst[0].value);
    };

    function showDsInfo() {
        setSelDb(props.mydata.sdata.dbname);
        setSelMmt(props.mydata.sdata.mmtname);
        setDblist([
            {
                id: 1,
                value: props.mydata.sdata.dbname,
                label: props.mydata.sdata.dbname
            }
        ]);
        setMmtlist([
            {
                id: 1,
                value: props.mydata.sdata.mmtname,
                label: props.mydata.sdata.mmtname
            }
        ]);
    }

    /*

    Name:	UpdateDataSource()

    Function:
        UpdateDataSource asynchronously updates a data source record, 
        extracting user and data source details, invoking UpdateDSrecord, and
        displaying a success toast after completion.

    Definition:
        Asynchronous function getDbList for fetching a database list using
        Fetch API, authorization headers and user-inputted database detail.

    Description:
        The function gathers user and data source details, constructs a 
        dictionary, calls UpdateDSrecord to update the record, and displays
        a success toast upon completion.

    Return:
        Asynchronous function for updating a data source record, triggering
        toast on success.

    */
    async function UpdateDataSource() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);
        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        console.log('User Request: ', mydict);
        let dbdata = {};
        dbdata['dsname'] = document.getElementById('dsname').value;
        dbdata['dsurl'] = document.getElementById('dsurl').value;
        // dbdata['dbname'] = document.getElementById('dbname').value;
        dbdata['dbname'] = selDb;
        // dbdata['mmtname'] = document.getElementById('mmtname').value;
        dbdata['mmtname'] = selMmt;
        dbdata['uname'] = document.getElementById('uname').value;
        dbdata['pwd'] = document.getElementById('pwd').value;
        mydict['dbdata'] = dbdata;
        let edsname = props.mydata.sdata.dsname;
        let uresp = await UpdateDSrecord(edsname, mydict);
        handleCancel();
        toast.success(uresp);
    }

    /*
    | UpdateDSrecord function update DataSource (DS) record with the given name
    | asynchronously and returns a promise. It retrieves authentication 
    | information, sets request headers, configures request options, builds the
    | request URL, performs the update operation, and resolves the promise with
    | the update message if successful. If any issues occur, the promise is 
    | rejected with an error.
    */
    function UpdateDSrecord(edsname, mydict) {
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
            var url = new URL(DNC_URL + '/dsrc/' + edsname);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'EDIT DATA-SOURCE'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                padding: '10px'
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField size="small" id="dsname" defaultValue={props.mydata.sdata.dsname} label="Name" variant="outlined" />
                            <TextField size="small" id="dsurl" defaultValue={props.mydata.sdata.dburl} label="URL" variant="outlined" />
                            <TextField
                                size="small"
                                id="uname"
                                defaultValue={props.mydata.sdata.uname}
                                label="User-Name"
                                variant="outlined"
                            />
                            <TextField
                                id="pwd"
                                size="small"
                                defaultValue={props.mydata.sdata.pwd}
                                label="Password"
                                variant="outlined"
                                type="password" // Add this line to display the field as a password input
                            />
                            <TextField
                                id="dbname"
                                select
                                size="small"
                                label="Select Database"
                                placeholder="Select Database"
                                value={selDb}
                                onChange={onchangeDb}
                                helperText=" "
                                SelectProps={{
                                    IconComponent: () => (
                                        <IconButton
                                            className="refresh-icon-button" // Apply your CSS class here
                                            onClick={handleRefershdb}
                                            color="primary"
                                            aria-label="Refresh Database"
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    )
                                }}
                            >
                                {dblist.map((option) => (
                                    <MenuItem key={option.value} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="mmtname"
                                select
                                size="small"
                                label="Select Measurement"
                                placeholder="Select Measurement"
                                value={selMmt}
                                onChange={onchangeMmt}
                                helperText=" "
                                SelectProps={{
                                    IconComponent: () => (
                                        <IconButton
                                            className="refresh-icon-button" // Apply your CSS class here
                                            onClick={handleRefershmmt}
                                            color="primary"
                                            aria-label="Refresh Database"
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    )
                                }}
                            >
                                {mmtlist.map((option) => (
                                    <MenuItem key={option.value} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <ColorButton size="small" onClick={handleSave} variant="contained">
                                Save
                            </ColorButton>
                            <ColorButton
                                size="small"
                                backgroundColor="Gray"
                                sx={{
                                    backgroundColor: 'Gray',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                                onClick={handleCancel}
                                variant="contained"
                            >
                                Cancel
                            </ColorButton>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}></DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of editdatasource.js ****/
