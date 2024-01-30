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

export default function Hwdetails() {
    const [deviceName, setDeviceName] = useState('Default Device');
    const [customTitle, setCustomTitle] = useState('Customized Title');
    const [selectedOptions, setSelectedOptions] = useState({
        hardwareId: true,
        boardName: false,
        boardRevision: false,
        firmwareversion: false,
        boardregion: false,
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

    const handleCheckboxChange = (option) => (event) => {
        setSelectedOptions({ ...selectedOptions, [option]: event.target.checked });
    };

    return (
        <div style={{ marginTop: '3%' }}>
            <Grid container spacing={2} sx={{ marginTop: 2, '& > *': { marginBottom: 2 } }}>
                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <FormLabel style={{ fontWeight: 'bold' }} component="legend">
                            Hardware Details
                        </FormLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled
                                    checked
                                    checked={selectedOptions.hardwareId}
                                    onChange={handleCheckboxChange('hardwareId')}
                                />
                            }
                            label="Hardware Id"
                            required
                        />
                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.boardName} onChange={handleCheckboxChange('boardName')} />}
                            label="Board Name"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.boardRevision} onChange={handleCheckboxChange('boardRevision')} />}
                            label="Board Revision"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                        <FormLabel style={{ color: 'white' }} component="legend">
                            More DetailFormLabels
                        </FormLabel>
                        <FormControlLabel
                            control={
                                <Checkbox checked={selectedOptions.firmwareversion} onChange={handleCheckboxChange('firmwareversion')} />
                            }
                            label="Firmware Version"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.boardregion} onChange={handleCheckboxChange('boardregion')} />}
                            label="Board Region"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={selectedOptions.remarks} onChange={handleCheckboxChange('remarks')} />}
                            label="Remarks"
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
