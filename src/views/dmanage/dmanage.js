/*

Module: dmanage.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

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
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AddDevice from './adddevice';
import ListDevice from './listssu';
import ListDmd from './listdmd';
import TrackSsu from './trackssu';
import TrackHw from './trackhw';
import QueryStatsSharpIcon from '@mui/icons-material/QueryStatsSharp';
import TroubleshootSharpIcon from '@mui/icons-material/TroubleshootSharp';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
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

/*

Name:	DeviceManage()

Function:
    Managing device-related information including selected SSU, hardware serial
    (HwSl), selected ID, and selected device name. It also handles tab changes
    and dynamically sets the title based on the user's role.

Definition:
    DeviceManage for managing state related to device, including SSU, HwSl, ID,
    device name, and handling tab changes.

Description:
	It handles tab changes and dynamically sets the title based on the user's
    role. The component is designed for managing, adding, and tracking devices
    or SSUs.

Return:
	Device-related information, handling tab changes, and dynamically setting
    the title based on the user's role.

*/

export default function DeviceManage() {
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [selSsu, setSelSsu] = React.useState('');
    const [selHwsl, setSelHwSl] = React.useState('');
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');

    let dnhold = cfgmenu['alias']['Device'] ? cfgmenu['alias']['Device'] : 'Device';

    const [mytitle, setMytitle] = React.useState(`Manage ${dnhold}`);
    let constn1 = 'Manage ' + dnhold;
    let constn2 = 'Add ' + dnhold;
    let constn3 = 'Track ' + dnhold;

    const [currentTab, setCurrentTab] = React.useState('Manage Device'); // Initialize with the default tab

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // Update the currentTab based on the selected tab
        switch (newValue) {
            case 0:
                setCurrentTab('Manage Device');
                break;
            case 1:
                setCurrentTab('Add Device');
                break;
            case 2:
                setCurrentTab('Track Device');
                break;
            case 3:
                setCurrentTab('Track HW');
                break;
            default:
                setCurrentTab('Device Management'); // Default to 'User' if newValue is unexpected
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

    return (
        <MainCard title={mytitle} breadcrumbs={breadcrumbs}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<PinDropOutlinedIcon />} label={constn1} {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label={constn2} {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<QueryStatsSharpIcon />} label={constn3} {...a11yProps(2)} />
                        <Tab style={{ color: 'darkblue' }} icon={<TroubleshootSharpIcon />} label="Track HW" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <div>
                    <TabPanel value={value} index={0}>
                        <ListDevice lsdata={{ cbf: setValue, cbfshw: setSelSsu }} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AddDevice asdata={{ cbf: setValue }} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <TrackSsu tsdata={{ cbf: setValue, selSsu: selSsu }} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <TrackHw thdata={{ cbf: setValue, selHwsl: selSsu }} />
                    </TabPanel>
                </div>
            </Box>
        </MainCard>
    );
}

/**** end of dmanage.js ****/
