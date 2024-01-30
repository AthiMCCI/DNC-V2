import React, { useState } from 'react';
import { TextField, Button, FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import MainCard from './../../../ui-component/cards/MainCard';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Configdevice() {
    const [deviceName, setDeviceName] = useState('Default Device');
    const [customTitle, setCustomTitle] = useState('Customized Title');
    const [selectedOptions, setSelectedOptions] = useState({
        devicedetails: false,
        hardwaredetails: true,
        configdetails: false
    });

    function handleSave() {
        const selectedCheckboxNames = Object.keys(selectedOptions).filter((option) => selectedOptions[option]);
        console.log('Update button clicked! Selected Checkbox Names:', selectedCheckboxNames);
    }

    function handleSetButton() {
        console.log('Set button clicked! Customized Title:', customTitle);
        // Implement logic for the set button click here
        // For example, you can set the device name with the custom title
        setDeviceName(customTitle);
    }

    const handleCheckboxChange = (option) => (event) => {
        setSelectedOptions({ ...selectedOptions, [option]: event.target.checked });
    };

    return (
        <div style={{ marginTop: '3%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" style={{ fontWeight: 'bold' }}>
                            Config Details
                        </FormLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled
                                    checked
                                    required
                                    checked={selectedOptions.hardwaredetails}
                                    onChange={handleCheckboxChange('hardwaredetails')}
                                />
                            }
                            label="Hardware Details"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.devicedetails} onChange={handleCheckboxChange('devicedetails')} />}
                            label="Device details"
                        />

                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.configdetails} onChange={handleCheckboxChange('configdetails')} />}
                            label="Config Details"
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <Stack style={{ marginTop: '1%' }} direction="row" spacing={1}>
                <ColorButton size="small" variant="contained" onClick={handleSave}>
                    Update
                </ColorButton>
            </Stack>
        </div>
    );
}
