/*

Module: brixtap.js

Function:
    Implementation code for brixtap.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import TapEntry from './tapentry';
import BrixEntry from './brixentry';
import TapHistory from './taphistory';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import StreetviewOutlinedIcon from '@mui/icons-material/StreetviewOutlined';
import BrixHistory from './brixhistory';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

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

export default function BrixTap() {
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');
    const [mytitle, setMytitle] = React.useState('Plugins > Brix & Tap');
    const [currentTab, setCurrentTab] = React.useState('Tap Entry'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Tap Entry');
                break;
            case 1:
                setCurrentTab('Brix Entry');
                break;
            case 2:
                setCurrentTab('Tap History');
                break;
            case 3:
                setCurrentTab('Brix History');
                break;
            default:
                setCurrentTab('Tap Entry'); // Default to 'User' if newValue is unexpected
                break;
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
                    Plugins
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );
    return (
        <MainCard title="Brix & Tap" breadcrumbs={breadcrumbs}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<StreetviewOutlinedIcon />} label="Tap Entry" {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<StreetviewOutlinedIcon />} label="Brix Entry" {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<HistoryOutlinedIcon />} label="Tap History" {...a11yProps(2)} />
                        <Tab style={{ color: 'darkblue' }} icon={<HistoryOutlinedIcon />} label="Brix History" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <TapEntry lsdata={{ cbf: setValue, cbfsid: setSelSid, cbfsname: setSelSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <BrixEntry asdata={{ cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <TapHistory mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <BrixHistory mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
            </Box>
        </MainCard>
    );
}

/**** end of brixtap.js ****/
