/*

Module: Spots.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AddSpot from './addspot';
import ManageSpot from './managespot';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import ManageDevice from './managedevice';
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

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');
    const [mytitle, setMytitle] = React.useState('Spots');
    const [currentTab, setCurrentTab] = React.useState('Manage Spot'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Manage Spot');
                break;
            case 1:
                setCurrentTab('Add Spot');
                break;
            case 2:
                setCurrentTab('Manage Device');
                break;
            default:
                setCurrentTab('Manage Spot'); // Default to 'User' if newValue is unexpected
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
                    Organization
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );

    return (
        <MainCard title="Spot" breadcrumbs={breadcrumbs}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<PinDropOutlinedIcon />} label="Manage Spot" {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label="Add Spot" {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<DoDisturbOnIcon />} label="Manage Device" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ManageSpot lsdata={{ cbf: setValue, cbfsid: setSelSid, cbfsname: setSelSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AddSpot asdata={{ cbftitle: setMytitle, cbfMove: setValue }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ManageDevice mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
            </Box>
        </MainCard>
    );
}

/**** end of Spots.js ****/
