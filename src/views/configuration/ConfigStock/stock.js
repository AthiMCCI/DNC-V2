import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import MainCard from './../../../ui-component/cards/MainCard';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function configstock() {
    function handleSave() {
        // Implement your save logic here
        console.log('Save button clicked!');
        // You can add your logic to save the selected radio button value or perform any other actions.
    }
    return (
        <MainCard title="Configuration stock">
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">stock</FormLabel>
                <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
                <ColorButton size="small" variant="contained" onClick={handleSave}>
                    update
                </ColorButton>
            </FormControl>
        </MainCard>
    );
}
