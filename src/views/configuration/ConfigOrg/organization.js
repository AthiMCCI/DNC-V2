import React, { useState } from 'react';
import { TextField, Button, FormControl, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import MainCard from './../../../ui-component/cards/MainCard';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterIcon from '@mui/icons-material/Filter';
import axios from 'axios';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Organization() {
    const [organizationName, setOrganizationName] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        tags: false
    });

    function handleSave() {
        console.log('Update button clicked! Organization Name:', organizationName);
    }

    const handleOrganizationNameChange = (event) => {
        setOrganizationName(event.target.value);
    };

    const handleSetLogoClick = () => {
        // Trigger the file input when "Set Logo" is clicked
        document.getElementById('logoInput').click();
    };

    const handleLogoChange = (event) => {
        // Handle the selected logo file
        const selectedLogo = event.target.files[0];
        console.log('Selected Logo:', selectedLogo);
    };

    const submitImage = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);

        const result = await axios.post('http://localhost:3000/upload-image', formData, {
            headers: { 'Content-Type': ' multipart/fom-data' }
        });
    };

    return (
        <MainCard title="Configuration Organization">
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl component="fieldset">
                            <TextField
                                label="Organization Name"
                                variant="outlined"
                                size="small"
                                value={organizationName}
                                onChange={handleOrganizationNameChange}
                            />
                            <Stack direction="row" spacing={1} marginTop={2}>
                                <input
                                    type="file"
                                    id="logoInput"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                                <Button size="small" startIcon={<FilterIcon />} variant="outlined" onClick={handleSetLogoClick}>
                                    Set Organization Logo
                                </Button>
                            </Stack>
                        </FormControl>
                    </Grid>
                </Grid>

                <Stack style={{ marginTop: '3%' }} direction="row" spacing={1}>
                    <ColorButton size="small" variant="contained" onSubmit={submitImage}>
                        Update
                    </ColorButton>
                </Stack>
            </div>
        </MainCard>
    );
}
