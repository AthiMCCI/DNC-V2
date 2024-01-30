import React, { useState } from 'react';
import { TextField, Button, FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import MainCard from './../../../ui-component/cards/MainCard';
import Hwdetails from './hwdetails';
import Configdevice from './configdevice';
import Typography from '@mui/material/Typography';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Device() {
    const [deviceName, setDeviceName] = useState('Default Device');
    const [customTitle, setCustomTitle] = useState('Customized Title');
    const [showDeviceDetails, setShowDeviceDetails] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({
        deviceId: true,
        technology: true,
        network: true,
        batch: false,
        type: false,
        version: false,
        status: false,
        organization: false,
        location: false,
        remarks: false
    });

    function handleSave() {
        // Filter out selected options
        const selectedCheckboxNames = Object.keys(selectedOptions).filter((option) => selectedOptions[option]);

        // Log the names of selected checkboxes
        console.log('Update button clicked! Selected Checkbox Names:', selectedCheckboxNames);

        // If you want to perform additional actions with the selected options,
        // you can do that here, for example, send the selected options to an API.
    }

    function handleSetButton() {
        console.log('Set button clicked! Customized Title:', customTitle);
        setDeviceName(customTitle);
    }

    const handleCheckboxChange = (option) => (event) => {
        setSelectedOptions({ ...selectedOptions, [option]: event.target.checked });
    };

    return (
        <div>
            <MainCard title="Configuration Device Management">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <TextField
                        id="custom-title"
                        label="Device Management"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="normal"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        sx={{ maxWidth: '200px' }} // Set the maximum width of the TextField
                    />
                    <Stack style={{ marginLeft: '18px', marginTop: '9px' }} direction="row" spacing={1}>
                        <ColorButton size="small" variant="contained" color="primary" onClick={handleSetButton}>
                            Set
                        </ColorButton>
                    </Stack>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={16}>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                sx={{ marginTop: '-10px' }}
                                control={<Checkbox checked={showDeviceDetails} onChange={(e) => setShowDeviceDetails(e.target.checked)} />}
                                label={
                                    <Typography style={{ color: 'Gray' }} fontWeight="bold">
                                        Device Details
                                    </Typography>
                                }
                            />
                            {showDeviceDetails && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled
                                                    checked
                                                    checked={selectedOptions.deviceId}
                                                    onChange={handleCheckboxChange('deviceId')}
                                                />
                                            }
                                            label="Device Id"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={<Checkbox checked={selectedOptions.batch} onChange={handleCheckboxChange('batch')} />}
                                            label="Batch"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={selectedOptions.status} onChange={handleCheckboxChange('status')} />
                                            }
                                            label="Status"
                                        />
                                    </Grid>

                                    {/* Second Row: Technology, Type, and Organization */}
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled
                                                    checked
                                                    checked={selectedOptions.technology}
                                                    onChange={handleCheckboxChange('technology')}
                                                />
                                            }
                                            label="Technology"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={<Checkbox checked={selectedOptions.type} onChange={handleCheckboxChange('type')} />}
                                            label="Type"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedOptions.organization}
                                                    onChange={handleCheckboxChange('organization')}
                                                />
                                            }
                                            label="Organization"
                                        />
                                    </Grid>

                                    {/* Third Row: Network, Version, Location, and Remarks */}
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled
                                                    checked
                                                    required
                                                    checked={selectedOptions.network}
                                                    onChange={handleCheckboxChange('network')}
                                                />
                                            }
                                            label="Network"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={selectedOptions.version} onChange={handleCheckboxChange('version')} />
                                            }
                                            label="Version"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={selectedOptions.location} onChange={handleCheckboxChange('location')} />
                                            }
                                            label="Location"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={selectedOptions.remarks} onChange={handleCheckboxChange('remarks')} />
                                            }
                                            label="Remarks"
                                        />
                                        <Stack style={{ marginTop: '4%' }} direction="row" spacing={1}>
                                            <ColorButton size="small" variant="contained" onClick={handleSave}>
                                                Update
                                            </ColorButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Hwdetails />
                <Configdevice />
            </MainCard>
        </div>
    );
}
