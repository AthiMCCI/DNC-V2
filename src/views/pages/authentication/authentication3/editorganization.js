/*

Module: editorganization.js

Function:
    Implementation code for Organiazation Page.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { constobj } from '../../../../misc/constants';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function EditOrganization(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = useState(true);
    const [tagValue, setTagValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const handleSave = () => {
        UpdateOrg();
    };

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata && props.mydata.hcb && props.mydata.hcb();
    };

    const tagRef = useRef(null);
    // Destructure name and tags from the prop, default to empty object if undefined
    const { name, tags } = props.rowData || {};
    // Set the initial values based on the prop data
    useEffect(() => {
        if (props.mydata.sdata) {
            setNameValue(props.mydata.sdata.name || '');
            setTagValue((props.mydata.sdata.tags || []).join(', '));
        }
    }, [props.mydata.sdata]);

    /*

    Name:	UpdateOrgData()

    Function:
        UpdateOrgData asynchronously updates organization data via PUT request,
        resolving with the response message on success or rejecting with error.

    Definition:
        Asynchronous function UpdateOrgData updating organization data using
        Fetch API and authorization headers.

    Description:
        This function asynchronously updates organization data by sending a PUT
        request to the server with authorization headers, provided organization
        data (mydict), and the existing organization name from prop. It resolve
        the Promise with the response message on successful update or rejects
        with an error in case of failure.

    Return:
        Asynchronous function updating organization data, resolving with the
        response message on success or rejecting with an error.

    */
    function UpdateOrgData(mydict) {
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
            let orgname = props.mydata.sdata.name;
            var url = new URL(DNC_URL + '/torg/' + orgname);
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

    async function UpdateOrg() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);
        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        let odata = {};
        odata['name'] = nameValue;
        odata['tags'] = tagValue.split(',').map((tag) => tag.trim());
        mydict['odata'] = odata;
        let uresp = await UpdateOrgData(mydict);
        handleCancel();
        toast.success(uresp, {
            position: 'top-right',
            autoClose: 3000, // Close the notification after 3 seconds (3000 milliseconds)
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Organization'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '50%', width: '110%' }
                            }}
                        >
                            <TextField
                                style={{ marginLeft: '-3%' }}
                                required
                                size="small"
                                id="oname"
                                label="Name"
                                value={nameValue}
                                onChange={(event) => setNameValue(event.target.value)}
                            />
                            <TextField
                                style={{ marginLeft: '-3%' }}
                                required
                                id="otags"
                                label="Tags"
                                size="small"
                                value={tagValue}
                                inputRef={tagRef}
                                onChange={(event) => setTagValue(event.target.value)}
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>
                    <ColorButton size="small" onClick={handleSave} variant="contained">
                        Save
                    </ColorButton>
                    <Button
                        onClick={handleCancel}
                        size="small"
                        variant="contained"
                        backgroundColor="Gray"
                        sx={{
                            backgroundColor: 'Gray',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of editorganization.js ****/
