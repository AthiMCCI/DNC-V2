import React, { useState } from 'react';
import { TextField, Button, FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import { colors } from 'assets/scss/_themes-vars.module.scss';
import MainCard from './../../../ui-component/cards/MainCard';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Gateway() {
    const [selectedOptions, setSelectedOptions] = useState({
        gatewayname: true,
        hardwareid: true,
        simcard: false,
        client: false,
        location: false,
        deviceconnect: false,
        model: false,
        technology: false,
        network: false,
        status: false,
        remarks: false,
        date: false
    });

    function handleSave() {
        const selectedCheckboxNames = Object.keys(selectedOptions).filter((option) => selectedOptions[option]);
        console.log('Update button clicked! Selected Checkbox Names:', selectedCheckboxNames);
    }

    const handleCheckboxChange = (option) => (event) => {
        setSelectedOptions({ ...selectedOptions, [option]: event.target.checked });
    };

    return (
        <MainCard>
            <div style={{ marginTop: '3%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Gateway Details</FormLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled
                                        checked
                                        required
                                        checked={selectedOptions.gatewayname}
                                        onChange={handleCheckboxChange('gatewayname')}
                                    />
                                }
                                label="Gateway Name"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled
                                        checked
                                        required
                                        checked={selectedOptions.hardwareid}
                                        onChange={handleCheckboxChange('hardwareid')}
                                    />
                                }
                                label="Hardware ID"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.simcard} onChange={handleCheckboxChange('simcard')} />}
                                label="SIM card make"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl component="fieldset">
                            <FormLabel style={{ color: 'white' }} component="legend">
                                More DetailFormLabels
                            </FormLabel>
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.client} onChange={handleCheckboxChange('client')} />}
                                label="Client/org"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.location} onChange={handleCheckboxChange('location')} />}
                                label="Location"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={selectedOptions.deviceconnect} onChange={handleCheckboxChange('deviceconnect')} />
                                }
                                label="Device Connected"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl component="fieldset">
                            <FormLabel style={{ color: 'white' }} component="legend">
                                More DetailFormLabels
                            </FormLabel>
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.model} onChange={handleCheckboxChange('model')} />}
                                label="Model"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.technology} onChange={handleCheckboxChange('technology')} />}
                                label="Technology"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.netework} onChange={handleCheckboxChange('netework')} />}
                                label="Network"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl component="fieldset">
                            <FormLabel style={{ color: 'white' }} component="legend">
                                More DetailFormLabels
                            </FormLabel>
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.status} onChange={handleCheckboxChange('status')} />}
                                label="Status"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.remarks} onChange={handleCheckboxChange('remarks')} />}
                                label="Remarks"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={selectedOptions.date} onChange={handleCheckboxChange('date')} />}
                                label="Date/Time"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Stack style={{ marginTop: '3%' }} direction="row" spacing={1}>
                    <ColorButton size="small" variant="contained" onClick={handleSave}>
                        Update
                    </ColorButton>
                </Stack>
            </div>
        </MainCard>
    );
}
