/*

Module: Users.js

Function:
    Implementation code for users,inviteuser,addremuser.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import InviteUser from './inviteuser';
import ListUser from './listuser';
import AddRemUser from './addremuser';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

/*

Name:	ManageUser()

Function:
    Start  managing state for a tab value, featuring handler for value changes
    and an empty useEffect.

Definition:
    Handling tab value state with a change handler and an empty useEffect.

Description:
	State for a tab value using the value state variable and a change handler
    (handleChange). It includes an empty useEffect hook, which currently has
    specific functionality.

Return:
	Managing tab value with a change handler and an empty useEffect.

*/
export default function ManageUser() {
    const [value, setValue] = React.useState(0);
    const [currentTab, setCurrentTab] = React.useState('User'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('User');
                break;
            case 1:
                setCurrentTab('Invite User');
                break;
            case 2:
                setCurrentTab('Add Remove User');
                break;
            default:
                setCurrentTab('User'); // Default to 'User' if newValue is unexpected
                break;
        }
    };

    useEffect(() => {
        // console.log("Use Effect")
    }, []);

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
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );
    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="Manage User" breadcrumbs={breadcrumbs}>
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab style={{ color: 'darkblue' }} icon={<GroupSharpIcon />} label="User" {...a11yProps(0)} />
                                <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label="Invite User" {...a11yProps(1)} />
                                <Tab style={{ color: 'darkblue' }} icon={<DoDisturbOnIcon />} label="Add Remove User" {...a11yProps(2)} />
                            </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                            <ListUser ludata={{ cbf: setValue }} />
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <InviteUser iudata={{ cbf: setValue }} />
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <AddRemUser arudata={{ cbf: setValue }} />
                        </TabPanel>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}

/**** end of Users.js ****/
