import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { constobj } from './../../../misc/constants';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function OrgAddUser() {
    const { DNC_URL } = { ...constobj };
    const [value, setValue] = React.useState(0);
    const [uemail, setUemail] = React.useState('');
    const [emailError, setEmailError] = useState(false);
    const [myalert, setMyalert] = useState(false);
    const [myalertmsg, setMyalertMsg] = useState('');
    const [msgtype, setMsgtype] = useState('error');
    const [isEmptyEmail, setIsEmptyEmail] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);

    useEffect(() => {
        let myOrg = sessionStorage.getItem('myOrg');
        getUserInfo();
    }, []);

    async function getUserInfo() {
        const myuser = await getUserData();
        setData(myuser);
    }

    // get User data
    function getUserData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/user');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['name'] = item['name'];
                        myrow['email'] = item['email'];
                        myrow['firstname'] = item['firstName'];
                        myrow['lastname'] = item['lastName'];
                        myrow['role'] = item['role'];
                        myrow['status'] = item['status'];
                        myrow['lastlogin'] = item['lastLogin']['login'];
                        myrow['logout'] = item['lastLogin']['logout'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // Request for sending signup link to the given email ID
    function sendInviteLink(userEmail) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var udata = JSON.stringify({ fcode: 'nusu', email: userEmail });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: udata
            };

            var url = new URL(DNC_URL + '/slink');

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

    const onChangeEmail = (event) => {
        const emailValue = event.target.value;
        // Validate email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(emailValue);

        setUemail(emailValue);
        setEmailError(!isValidEmail);
        setIsEmptyEmail(emailValue === '');

        // Reset emailError state when the email is valid
        if (isValidEmail) {
            setEmailError(false);
        }
    };

    const handleInviteLink = async () => {
        if (isEmptyEmail || emailError) {
            showAlert('error', 'Invalid email address. Please enter a valid email.');
        } else if (!uemail) {
            showAlert('error', 'Please enter an email address.');
        } else {
            setIsEmptyEmail(false); // Reset isEmptyEmail state if email is not empty
            try {
                const myresp = await sendInviteLink(uemail);
                showAlert('success', myresp);
            } catch (error) {
                showAlert('error', error);
            }
        }
    };

    const showAlert = (type, message) => {
        if (type === 'success') {
            toast.success(message, {
                position: 'top-right',
                autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else if (type === 'error') {
            toast.error(message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <TextField
                    style={{ width: '30%' }}
                    label="Email"
                    id="linkmail"
                    size="small"
                    required
                    onChange={onChangeEmail}
                    error={emailError || isEmptyEmail} // Apply red border style if email is empty
                    helperText={emailError ? 'Invalid email format' : ''}
                />{' '}
                <Box sx={{ '& button': { m: 0 } }}>
                    <Stack style={{ marginLeft: '18px' }} direction="row" spacing={1}>
                        <ColorButton size="small" variant="contained" onClick={handleInviteLink}>
                            Send Signup Link
                        </ColorButton>
                    </Stack>
                </Box>
                <div>
                    {myalert && (
                        <Stack className="alertbrix" spacing={2}>
                            <Alert variant="outlined" severity={msgtype}>
                                {myalertmsg}
                            </Alert>
                        </Stack>
                    )}
                </div>
            </div>
        </div>
    );
}
