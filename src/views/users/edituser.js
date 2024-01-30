/*

Module: edituser.js

Function:
    Implementation code for Users.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

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
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { constobj } from '../../misc/constants';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

/*

Name:	EditUser()

Function:
    The provided code defines a React component using a functional component 
    syntax. The component is named EditUser.

Definition:
    Handling tab value state with a change handler and an empty useEffect.

Description:
	EditUser component appears a modal or form for editing user information.It 
    uses state variables (open, selRole, and statusError) manage the component 
    state. It initializes some state variables using the useState hook and 
    reference (statusRef) using the useRef hook. The component includes a list 
    of roles (myrole) and functions (handleSave and handleClose) handle saving 
    changes and closing the modal.

Return:
	components such as input fields, buttons, and other UI elements

*/
export default function EditUser(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selRole, setSelRole] = useState(props.mydata.sdata.role);
    const [statusError, setStatusError] = useState(false);
    const statusRef = useRef(null);
    const myrole = [
        { id: '1', label: 'Org-User', value: 'Org-User' },
        { id: '2', label: 'Org-Admin', value: 'Org-Admin' },
        { id: '3', label: 'App-User', value: 'App-User' },
        { id: '4', label: 'App-Admin', value: 'App-Admin' }
    ];

    const handleSave = () => {
        if (!statusRef.current.value) {
            setStatusError(true);
            return;
        }
        UpdateUser(); //setOpen(true);
        setStatusError(false);
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    useEffect(() => {
        setSelRole(props.mydata.sdata.role);
    }, []);

    /*

    Name:	UpdateUserData()

    Function:
        UpdateUserData function is designed to update user data by making an 
        asynchronous HTTP PUT request to a specified URL (DNC_URL + '/chrole').

    Definition:
        Defined with parameters and includes logic for constructing headers, 
        setting up request options, making a PUT request using the Fetch API, 
        and handling the response.

    Description:
        he UpdateUserData function is designed to update user data by making an
        asynchronous HTTP PUT request to a specified URL (DNC_URL + '/chrole').
        It includes logic to set up headers, construct the request options, and
        handle the response.The function returns a Promise, indicating it 
        performs an asynchronous operation.

    Return:
        HTTP request is successful, the Promise is resolved with the 'message'
        property from the response data (resolve(data.message)).

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
                    // console.log(error);
                    reject(error);
                });
        });
    }
    async function UpdateUser() {
        let newdict = {};
        let roleidx = 1;
        for (let i = 0; i < myrole.length; i++) {
            if (myrole[i].value == selRole) {
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
        let uresp = await UpdateUserData(newdict);
        handleClose();
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
                            <TextField
                                required
                                label="Status"
                                size="small"
                                defaultValue={props.mydata.sdata.status}
                                inputRef={statusRef}
                                error={statusError} // Add error state for the status field
                                helperText={statusError ? 'This field is required' : ''}
                            />{' '}
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <ColorButton size="small" onClick={handleSave} variant="contained">
                        Save
                    </ColorButton>
                    <ColorButton
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        backgroundColor="Gray"
                        sx={{
                            backgroundColor: 'Gray',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Cancel
                    </ColorButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

/**** end of edituser.js ****/
