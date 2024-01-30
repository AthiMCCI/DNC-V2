/*

Module: inviteuser.js

Function:
    Implementation code for Users.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { constobj } from './../../misc/constants';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function InviteUser() {
    const { DNC_URL } = { ...constobj };
    const [uemail, setUemail] = useState('');
    const [role, setRole] = React.useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [roleError, setRoleError] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const onChangeEmail = (event) => {
        const value = event.target.value;
        setUemail(value);
        setIsEmailValid(validateEmail(value));
    };
    const handleChange = (event) => {
        const selectedRole = event.target.value;
        setRole(selectedRole);
        if (!selectedRole) {
            setRoleError(true);
        } else {
            setRoleError(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
        return emailRegex.test(email);
    };

    const handleInviteLink = async () => {
        setButtonClicked(true);
        let errorMessage = '';
        if (!uemail) {
            errorMessage += 'Please fill out all required fields, ';
            setIsEmailValid(false);
        } else {
            setIsEmailValid(validateEmail(uemail));
        }
        if (!role) {
            errorMessage += 'Please fill out all required fields.';
            setRoleError(true);
        } else {
            setRoleError(false);
        }
        if (!isEmailValid) {
            errorMessage += 'Invalid email address.';
        }
        if (errorMessage) {
            toast.error(errorMessage); // Display error messages in the toast notification
            return;
        }
        try {
            const myresp = await sendInviteLink(uemail);
            toast(myresp);
        } catch (error) {
            toast(error);
        }

        /*

        Name:	sendInviteLink()

        Function:
            sendInviteLink function is designed to send an invite link to  user
            with the provided email address.

        Definition:
            Defined with parameters and includes logic for constructing headers
            preparing user data, making a POST request using the Fetch API, and
            handling the response.
        
        Description:
            sendInviteLink function is designed to send a invite link to user 
            with the provided email address. It makes an asynchronous HTTP POST
            request to a specified URL (DNC_URL + '/slink') .The user data, 
            including the email and a fixed code (fcode), is sent the request
            body.

        Return:
            There is an error during the request, the Promise is rejected with 
            the error (reject(error)).

        */
        function sendInviteLink(userEmail) {
            return new Promise(async function (resolve, reject) {
                let auth = sessionStorage.getItem('myToken');
                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');
                var udata = JSON.stringify({ fcode: 'nusu', email: userEmail, role: role });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: udata
                };
                var url = new URL(DNC_URL + '/slink');
                let myulist = [];
                fetch(url, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data.message);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    const breadcrumbs = (
        <>
            {/* Customize your breadcrumbs here */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <RouterLink color="inherit" to="/">
                    {' '}
                    {/* Use RouterLink instead of Link */}
                    <HomeIcon fontSize="small" />
                </RouterLink>
                <Typography variant="body2" color="text.primary">
                    Administration
                </Typography>
                <Typography variant="body2" color="text.primary">
                    User
                </Typography>
            </Breadcrumbs>
        </>
    );
    return (
        <div>
            <div style={{ display: 'flex', gap: '1%' }}>
                <TextField
                    style={{ width: '30%' }}
                    label="Email"
                    id="linkmail"
                    size="small"
                    value={uemail}
                    onChange={onChangeEmail}
                    required
                    error={!isEmailValid && buttonClicked} // Apply error style if email is not valid and button is clicked
                    helperText={!isEmailValid && buttonClicked ? 'Invalid email address' : ''} // Show helper text for error
                />
                <FormControl sx={{ m: 0, minWidth: '20%' }} size="small">
                    <InputLabel size="small" required id="demo-select-small-label">
                        Roles
                    </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        size="small"
                        value={role}
                        label="role"
                        onChange={handleChange}
                        error={roleError} // Set error state for roles field
                        helperText={roleError ? 'Tags is required' : ''}
                    >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value={4}>App-Admin</MenuItem>
                        <MenuItem value={3}>App-User</MenuItem>
                        <MenuItem value={2}>Org-Admin</MenuItem>
                        <MenuItem value={1}>Org-User</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Box sx={{ '& button': { m: 0 } }}>
                <Stack style={{ marginLeft: '18px', marginTop: '20px' }} direction="row" spacing={1}>
                    <ColorButton size="small" variant="contained" onClick={handleInviteLink}>
                        Send Signup Link
                    </ColorButton>
                </Stack>
            </Box>
        </div>
    );
}

/**** end of inviteuser.js ****/
