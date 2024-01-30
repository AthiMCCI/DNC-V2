/*

Module: Stocks.js

Function:
    Implementation code for Stocks.

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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PreviewIcon from '@mui/icons-material/Preview';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Addstock from './addstock';
import ListStock from './liststock';
import AssignedStock from './assigned';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useSelector } from 'react-redux';

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

export default function Managestock() {
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [value, setValue] = React.useState(0);
    const [selHwsl, setSelHwSl] = React.useState('');
    const [currentTab, setCurrentTab] = React.useState('Stock'); // Initialize with the default tab

    let snhold = cfgmenu['alias']['Stock'] ? cfgmenu['alias']['Stock'] : 'Stock';

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab(`View ${snhold}`);
                break;
            case 1:
                setCurrentTab('Assigned');
                break;
            default:
                setCurrentTab(`${snhold}`); // Default to 'User' if newValue is unexpected
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
                    Administration
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );
    useEffect(() => {
        // console.log("Use Effect")
        // setValue(1)
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title={`Manage ${snhold}`} breadcrumbs={breadcrumbs}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<Inventory2OutlinedIcon />}
                                    label={`View ${snhold}`}
                                    {...a11yProps(0)}
                                />
                                <Tab style={{ color: 'darkblue' }} icon={<AddCircleRoundedIcon />} label="Assigned" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <div>
                            <TabPanel value={value} index={0}>
                                <ListStock lsdata={{ cbf: setValue, cbfshw: setSelHwSl }} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <AssignedStock asdata={{ cbf: setValue }} />
                            </TabPanel>
                        </div>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}

/**** end of Stocks.js ****/
