/*

Module: Profile.js

Function:
    Implementation code for User Account and Change Password.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Profile from './Profile.css';
import MainCard from './../../ui-component/cards/MainCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { constobj } from '../../misc/constants';
import ProfileSection from './../../layout/MainLayout/Header/ProfileSection/index';
// import Photo from './uploadphoto';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

/*
| TabPanel for a tab-based interface. It receives properties (props) such as 
| children (content of the tab panel), value (current active tab index).index
| (index of the tab panel), and other properties. It conditionally renders the
| content based on whether the value matches the index.children: PropTypes.node
| index: PropTypes.number (required), value: PropTypes.number (required).
*/
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

/*
| a11yProps function is utility function generates accessibility properties for
| tab. It takes the index of the tab as a parameter and returns an object with 
| id and properties to enhance the accessibility of corresponding tab panel.
*/
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function BasicTabs() {
    const { DNC_URL } = { ...constobj };
    const [value, setValue] = React.useState(0);
    const [pwd, setPassword] = useState();
    const [formData, setFormData] = React.useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    let myuser = sessionStorage.getItem('myUser');
    // console.log('MyUser: ', myuser);
    let myuobj = JSON.parse(myuser);

    const [currentTab, setCurrentTab] = React.useState('Personal Information'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Account');
                break;
            case 1:
                setCurrentTab('Change Password');
                break;
            default:
                setCurrentTab('Account'); // Default to 'User' if newValue is unexpected
                break;
        }
    };

    /*

    Name:	handleProfile()

    Function:
        handleProfile performs validation for profile fields, sets errors the
        state, and calls UpdateProfile if there are no errors.

    Definition:
        validating profile fields, updating state with errors, and invoking
        UpdateProfile on error-free submission.

    Description:
        This function validates first name, last name, user name, and email 
        fields, setting errors in the state. If no errors are present, it calls
        the UpdateProfile function for updating the user profile.

    Return:
        Validates and updates the user profile if there are no errors.

    */

    const handleProfile = () => {
        // Validation logic
        const errors = {};
        if (!formData.firstName) {
            errors.firstName = 'First Name is required';
        }
        if (!formData.lastName) {
            errors.lastName = 'Last Name is required';
        }
        if (!formData.userName) {
            errors.userName = 'User Name is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        // Set errors to display in the UI
        setErrors(errors); // Update the state with errors for all fields
        if (Object.keys(errors).length === 0) {
            // No errors, update profile
            UpdateProfile();
        }
    };
    async function UpdateProfile() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);
        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        // console.log('User Request: ', mydict);
        let udata = {};
        udata['name'] = document.getElementById('uname').value;
        udata['fname'] = document.getElementById('fname').value;
        udata['lname'] = document.getElementById('lname').value;
        udata['email'] = document.getElementById('email').value;
        mydict['udata'] = udata;
        let uresp = await UpdateUserProfile(myuobj.user, mydict);
        toast(uresp);
    }

    /*
    | UpdateUserProfile Updates the user profile for the specified user the 
    | user's authentication token from the session storage.  headers for  API
    | request, including the authorization token specifying the HTTP method,
    | headers, and request body. URL with the user identifier to update user
    | profile. PUT request to the '/user' endpoint with the user identifier.
    */
    function UpdateUserProfile(cuser, mydict) {
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
            var url = new URL(DNC_URL + '/user/' + cuser);
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

        Name:	handlePassword()

        Function:
           handlePassword validates and updates user password, displaying error
        and calling UpdatePwd if criteria are met.

        Definition:
            validating and updating user password, displaying error and invoking
            UpdatePwd on valid criteria.
        
        Description:
            This function extracts current, new, and confirm passwords from the
            DOM, resets previous password-related errors, and display new error
            if required fields are not filled or new password confirm password 
            do not match. If criteria are met, it calls the UpdatePwd function
            for password update.

        Return:
            Validates and updates user password, displaying errors and invoking
            UpdatePwd on valid criteria.

    */

    const handlePassword = () => {
        let currentPwd = document.getElementById('ecpwd').value;
        let npwd = document.getElementById('snpwd').value;
        let cfnpwd = document.getElementById('cfnpwd').value;
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');
        if (!currentPwd || !npwd || !cfnpwd) {
            toast('Please fill out all the required fields', '', 'error');
        } else if (npwd !== cfnpwd) {
            setNewPasswordError('New Password and confirm password not matching\n'); // Add newline character
            setConfirmPasswordError('New Password and confirm password not matching\n'); // Add newline character
        } else {
            UpdatePwd();
        }
    };
    async function UpdatePwd() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);
        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        let udata = {};
        udata['ecpwd'] = document.getElementById('ecpwd').value;
        udata['npwd'] = document.getElementById('snpwd').value;
        mydict['udata'] = udata;
        let uresp = await UpdateUserPwd(mydict);
        toast(uresp);
    }

    /*
    | UpdateUserPwd(mydict) Updates the user's password. authentication token
    | from the session storage. headers for the API request, including the 
    | authorization token. request options, specifying the HTTP method, header,
    | and request body. URL for updating the user password. PUT request to the 
    | '/chpwd' (change password) endpoint. If request successful, resolve with 
    | the message indicating a successful password update.
    */
    function UpdateUserPwd(mydict) {
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
            var url = new URL(DNC_URL + '/chpwd');
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
                    Account Settings
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );

    return (
        <MainCard title="Personal Information" breadcrumbs={breadcrumbs}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '50%' }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab style={{ color: 'darkblue' }} icon={<AccountCircleIcon />} label="ACCOUNT" {...a11yProps(0)} />
                            <Tab style={{ color: 'darkblue' }} icon={<LockResetOutlinedIcon />} label="CHANGE PASSWORD" {...a11yProps(1)} />
                        </Tabs>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TabPanel value={value} index={0}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid style={{ marginTop: '-2%' }} item xs={12} sm={4}>
                                            {/* <Photo /> */}
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <div style={{ marginTop: '5%', marginLeft: '-40%', width: '100%' }} className="centered-box">
                                                <TextField
                                                    className="tab1"
                                                    id="fname"
                                                    size="small"
                                                    defaultValue={myuobj.firstName}
                                                    label="First Name"
                                                    required
                                                    variant="outlined"
                                                    error={!!errors.firstName}
                                                    helperText={errors.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                />
                                                <TextField
                                                    className="tab1"
                                                    defaultValue={myuobj.lastName}
                                                    id="lname"
                                                    size="small"
                                                    label="Last Name"
                                                    variant="outlined"
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                />
                                                <TextField
                                                    className="tab1"
                                                    defaultValue={myuobj.user}
                                                    id="uname"
                                                    label="User Name"
                                                    required
                                                    size="small"
                                                    variant="outlined"
                                                    error={!!errors.userName}
                                                    helperText={errors.userName}
                                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                                />
                                                <TextField
                                                    className="tab1"
                                                    defaultValue={myuobj.email}
                                                    id="email"
                                                    label="Email"
                                                    size="small"
                                                    error={!!errors.email}
                                                    helperText={errors.email}
                                                    required
                                                    variant="outlined"
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />

                                                <ColorButton
                                                    type="submit"
                                                    onClick={handleProfile}
                                                    variant="contained"
                                                    size="small"
                                                    style={{ marginTop: '5%' }}
                                                >
                                                    Save
                                                </ColorButton>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                <TabPanel value={value} index={1}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <div className="centered-box">
                                                <TextField
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="tab1"
                                                    id="ecpwd"
                                                    required
                                                    size="small"
                                                    type="password"
                                                    label="Current password"
                                                    variant="outlined"
                                                    error={Boolean(currentPasswordError)}
                                                    helperText={currentPasswordError}
                                                />
                                                <TextField
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="tab1"
                                                    id="snpwd"
                                                    required
                                                    size="small"
                                                    type="password"
                                                    label="New password"
                                                    variant="outlined"
                                                    error={Boolean(newPasswordError)}
                                                    helperText={newPasswordError}
                                                />
                                                <TextField
                                                    name="password"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="tab1"
                                                    id="cfnpwd"
                                                    size="small"
                                                    required
                                                    type="password"
                                                    label="Confirm New password"
                                                    variant="outlined"
                                                    error={Boolean(confirmPasswordError)}
                                                    helperText={confirmPasswordError}
                                                />
                                                <ColorButton size="small" variant="contained" type="button" onClick={handlePassword}>
                                                    Save
                                                </ColorButton>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
}

/**** end of Profile.js ****/
