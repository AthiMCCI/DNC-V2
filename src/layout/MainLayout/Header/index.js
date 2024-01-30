import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import OrgSection from './OrgSection/OrgSection';
import { IconMenu2 } from '@tabler/icons';
import { makeStyles } from '@mui/styles';
import useToken from './../../../saveToken';
import Timerunner from './Timerunner';

const useStyles = makeStyles((theme) => ({
    timer: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main
    }
}));

const Header = ({ handleLeftDrawerToggle }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { token, setToken } = useToken();
    const [modalOpen, setModalOpen] = useState(false);
    const [logoutWarningOpen, setLogoutWarningOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // Initial time set to 20 minutes (in seconds)
    let myuser = sessionStorage.getItem('myUser');
    console.log('MyUser: ', myuser);
    let myuobj = JSON.parse(myuser);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    async function UpdateProfile() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);
        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        console.log('User Request: ', mydict);
        let udata = {};
        udata['name'] = document.getElementById('uname').value;
        udata['fname'] = document.getElementById('fname').value;
        udata['lname'] = document.getElementById('lname').value;
        udata['email'] = document.getElementById('email').value;
        mydict['udata'] = udata;
        let uresp = await UpdateUserProfile(myuobj.user, mydict);
        toast(uresp);
    }

    const handleTimeoutLogout = () => {
        clearUserSession();
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            handleTimeoutLogout();
        }
    }, [timeLeft]);

    return (
        <>
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            <OrgSection />
            <Timerunner
                classes={classes}
                onTimeout={handleTimeoutLogout}
                setTimeLeft={setTimeLeft}
                setLogoutWarningOpen={setLogoutWarningOpen}
            />
            <ProfileSection firstName={myuobj.firstName} />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
