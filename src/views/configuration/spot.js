import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import MainCard from './../../ui-component/cards/MainCard';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import SensorsSharpIcon from '@mui/icons-material/SensorsSharp';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import RouterSharpIcon from '@mui/icons-material/RouterSharp';
import { useNavigate } from 'react-router-dom';
import Device from './device/device';
import ConfigUser from './ConfigUser/user';
import Datasource from './ConfigDnc/configdnc';
import Gateway from './ConfigGw/gateway';
import configstock from './ConfigStock/stock';
import Organization from './ConfigOrg/organization';

const buttonStyle = { color: 'black' };
const iconStyle = { color: '#512da8' };

const CustomFieldSettings = () => {
    const navigate = useNavigate();
    const handleClickUser = () => navigate('/config/user');
    const handleClickData = () => navigate('/config/features');
    const handleClickOrg = () => navigate('/config/org');
    return (
        <MainCard title="Configurations">
            <Box style={{ marginTop: '2%' }}>
                <Grid container spacing={2}>
                    {/* First Row */}

                    <Grid item xs={4}>
                        <Button
                            variant="text"
                            onClick={handleClickData}
                            endIcon={<StorageSharpIcon style={iconStyle} />}
                            fullWidth
                            style={buttonStyle}
                        >
                            Feature
                        </Button>
                    </Grid>
                    {/* <Grid item xs={4}>
                        <Button
                            variant="text"
                            onClick={handleClickUser}
                            endIcon={<AccessibilityIcon style={iconStyle} />}
                            fullWidth
                            style={buttonStyle}
                        >
                            Device Management
                        </Button>
                    </Grid> */}
                    {/* <Grid item xs={4}>
                        <Button
                            onClick={handleClickOrg}
                            variant="text"
                            endIcon={<Diversity3OutlinedIcon style={iconStyle} />}
                            fullWidth
                            style={buttonStyle}
                        >
                            Organization
                        </Button>
                    </Grid> */}
                </Grid>
            </Box>
        </MainCard>
    );
};

export default CustomFieldSettings;
