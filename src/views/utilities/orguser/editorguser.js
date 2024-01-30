/*

Module: editorguser.js

Function:
    Implementation code for orguser.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';
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

export default function EditOrgUser(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selRole, setSelRole] = useState(props.mydata.sdata.role);
    const statusRef = useRef(null);

    const myrole = [
        { id: '1', label: 'Org-User', value: 'Org-User' },
        { id: '2', label: 'Org-Admin', value: 'Org-Admin' },
        { id: '3', label: 'App-User', value: 'App-User' },
        { id: '4', label: 'App-Admin', value: 'App-Admin' }
    ];

    const handleSave = () => {
        //setOpen(true);
        UpdateUser();
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        setSelRole(props.mydata.sdata.role);
    }, []);

    /*

    Name:   UpdateUserData()

    Function:
        async function UpdateUserData(mydict) function is an asynchronous
        function designed to update user data.

    Definition:
        The UpdateUserData function is an asynchronous function designed to 
        update user data, often used for modifying user roles. It utilizes PUT
        request to a specified server endpoint (/chrole), including 
        authorization headers and the updated user information provided in the
        mydict dictionary.

    Description:
        The function includes the necessary authorization headers and sends the
        updated data to the server. It require a dictionary (mydict) containing
        the updated user information. 

    Return:
       successful execution of the PUT request, the Promise resolves to the
       message from the server response, indicating the success of the update.
       In case of error during the update process is rejected with the error.

    */
    function UpdateUserData(mydict) {
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
            var url = new URL(DNC_URL + '/chrole');
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

    async function UpdateUser() {
        let newdict = {};
        let roleidx = 1;
        for (let i = 0; i < myrole.length; i++) {
            if (myrole[i].value === selRole) {
                roleidx = myrole[i].id;
                break;
            }
        }
        newdict['level'] = roleidx;
        if (statusRef.current) {
            newdict['status'] = statusRef.current.value;
        }
        newdict['email'] = props.mydata.sdata.email;
        newdict['uname'] = props.mydata.sdata.name;
        try {
            let uresp = await UpdateUserData(newdict);
            handleClose();
            toast.success(uresp, {
                position: 'top-right',
                autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (error) {
            // console.error(error);
            toast.error('Failed to update user. Please try again later.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'EDIT USER - ' + props.mydata.sdata.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '40%', width: '100%' }
                            }}
                        >
                            <FormControl>
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="1"
                                    size="small"
                                    value={selRole}
                                    onChange={(event) => setSelRole(event.target.value)}
                                >
                                    {myrole.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField size="small" required label="Status" defaultValue={props.mydata.sdata.status} inputRef={statusRef} />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <ColorButton onClick={handleSave} variant="contained" size="small">
                        Save
                    </ColorButton>

                    <ColorButton
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        sx={{
                            backgroundColor: 'Gray'
                        }}
                    >
                        Cancel
                    </ColorButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of editorguser.js ****/
