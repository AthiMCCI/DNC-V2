/*

Module: editspot.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
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

export default function EditSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [tdata, setTdata] = React.useState([]);
    const [odata, setOdata] = React.useState({});

    const handleSave = () => {
        //setOpen(true);
        UpdateSpot();
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        getRowInfo();
    }, []);

    /*
    | getRowInfo retrieve and process information about rows based on provided
    | data in props. It retrieves the keys (tags) of the spot data from props,
    | logs the original tags to the console, and sets the state variable Odata
    | with the original tags. specific tags ('id', 'sid', 'user') from array 
    | and sets the state variable Tdata with the remaining tags.
    */
    async function getRowInfo() {
        let mytags = Object.keys(props.mydata.sdata);
        let otags = [];
        for (let i = 0; i < mytags.length; i++) {
            otags.push(mytags[i]);
        }
        // console.log('My Tags: ', otags);
        let index = mytags.indexOf('id');
        if (index > -1) {
            otags.splice(index, 1);
        }
        setOdata(otags);
        index = mytags.indexOf('id');
        if (index > -1) {
            mytags.splice(index, 1);
        }
        index = mytags.indexOf('sid');
        if (index > -1) {
            mytags.splice(index, 1);
        }
        index = mytags.indexOf('user');
        if (index > -1) {
            mytags.splice(index, 1);
        }
        setTdata(mytags);
    }

    /*

    Name:   UpdateSpotData()

    Function:
        Retrieves the authentication token from the session, initializes header
        with authentication.

    Definition:
        Content type, extracts the spot name and organization from the provided
        data.

    Description:
        Add the organization name to the provided dictionary. It initializes
        request options, constructs the URL for the spot update, and performs
        the fetch request to update the spot data.

    Return:
        message indicating the success of the spot data update or rejects with
        an error in case of failure.

    */
    function UpdateSpotData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            let sname = mydict.data.sname;
            let myorg = sessionStorage.getItem('myOrg');
            mydict['orgname'] = myorg;
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/spot/' + sname);
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
    | UpdateSpot initializes new and old store updated and original spot data.
    | It populates the new dictionary with updated values from the form and the
    | old dictionary with original values from the spot data UpdateSpotData 
    | function to update the spot data. If successful, it closes the dialog and
    | display a success toast notification. In case of failure, it displays an
    | error toast notification.
    */
    async function UpdateSpot() {
        let newdict = {};
        let olddict = {};
        for (let i = 0; i < tdata.length; i++) {
            newdict[tdata[i].toLowerCase()] = document.getElementById(tdata[i]).value;
        }
        for (let i = 0; i < odata.length; i++) {
            olddict[odata[i]] = props.mydata.sdata[odata[i]];
        }
        let uresp = await UpdateSpotData({ data: olddict, new: newdict });
        handleClose();
        try {
            await UpdateSpotData({ data: olddict, new: newdict });
            handleClose();
            toast.success('Spot updated successfully!', {
                position: toast.POSITION.TOP_RIGHT
            });
        } catch (error) {
            // console.error(error);
            toast.error('Failed to update spot. Please try again later.', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'MANAGE SPOT'}
                </DialogTitle>
                <DialogContentText id="alert-dialog-description">
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch', display: 'block' },
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
                            gridTemplateRows: 'repeat(2, 1fr)', // 2 rows
                            gap: '1px'
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        {tdata.map((item) => (
                            <div key={item}>
                                <TextField size="small" style={{}} label={item} id={item} defaultValue={props.mydata.sdata[item]} />
                            </div>
                        ))}
                        <div>
                            <ColorButton style={{ width: '30%', marginTop: '3%' }} onClick={handleSave} variant="contained" size="small">
                                Save
                            </ColorButton>
                            <ColorButton
                                onClick={handleClose}
                                variant="contained"
                                color="error"
                                size="small"
                                style={{ width: '30%', marginLeft: '10%', marginTop: '3%' }}
                                sx={{
                                    backgroundColor: 'Gray'
                                }}
                            >
                                Cancel
                            </ColorButton>
                        </div>
                    </Box>
                </DialogContentText>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of editspot.js ****/
