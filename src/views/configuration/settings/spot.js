import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Button } from '@mui/material';
import MainCard from './../../ui-component/cards/MainCard';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CustomFieldSettings = () => {
    const [fieldSettings, setFieldSettings] = useState({
        fieldName: '',
        fieldType: 'text',
        dropdownOptions1: [], // Initialize as an empty array
        dropdownOptions2: [], // Initialize as an empty array
        maxValue: '',
        minValue: '',
        decimalValue: ''
    });
    const [checkboxState, setCheckboxState] = useState({
        required: true,
        enable: false,
        hidden: false
    });

    const handleCheckboxChange = (name) => {
        setCheckboxState((prevState) => ({
            ...Object.keys(prevState).reduce((acc, key) => {
                acc[key] = key === name;
                return acc;
            }, {})
        }));
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFieldSettings({ ...fieldSettings, [name]: value });
    };

    const handleDropdownOptionChange = (event) => {
        const { value } = event.target;
        const optionsArray = value.split(',').map((option) => option.trim());

        // Set dropdownOptions1 with all options and dropdownOptions2 with only the first option
        setFieldSettings({
            ...fieldSettings,
            dropdownOptions1: optionsArray,
            dropdownOptions2: [optionsArray[0]]
        });
    };

    const handleSaveClick = () => {
        // Handle saving field settings logic here
        console.log('Field Settings:', fieldSettings);
        // You can send the fieldSettings object to an API or perform other actions here
    };

    return (
        <MainCard>
            <Box maxWidth={400} p={3}>
                <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    name="fieldName"
                    required
                    value={fieldSettings.fieldName}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select size="small" label="Field Type" name="fieldType" value={fieldSettings.fieldType} onChange={handleInputChange}>
                        {['text', 'number', 'date', 'Drop-down'].map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {fieldSettings.fieldType === 'text' && (
                    <TextField
                        size="small"
                        fullWidth
                        label="Text"
                        name="textFieldValue"
                        value={fieldSettings.textFieldValue}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                )}
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={checkboxState.required} required onChange={() => handleCheckboxChange('required')} />}
                        label="Required"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checkboxState.enable} onChange={() => handleCheckboxChange('enable')} />}
                        label="Enable"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checkboxState.hidden} onChange={() => handleCheckboxChange('hidden')} />}
                        label="Hidden"
                    />
                </FormGroup>
                {fieldSettings.fieldType === 'number' && (
                    <>
                        <TextField
                            size="small"
                            fullWidth
                            label="Max Value"
                            name="maxValue"
                            value={fieldSettings.maxValue}
                            onChange={handleInputChange}
                            margin="normal"
                            type="number"
                        />
                        <TextField
                            size="small"
                            fullWidth
                            label="Min Value"
                            name="minValue"
                            value={fieldSettings.minValue}
                            onChange={handleInputChange}
                            margin="normal"
                            type="number"
                        />
                        <TextField
                            size="small"
                            fullWidth
                            label="Decimal Value"
                            name="decimalValue"
                            value={fieldSettings.decimalValue}
                            onChange={handleInputChange}
                            margin="normal"
                            type="number"
                        />
                    </>
                )}
                {fieldSettings.fieldType === 'Drop-down' && (
                    <TextField
                        size="small"
                        fullWidth
                        label="Options"
                        name="dropdownOptions1"
                        value={fieldSettings.dropdownOptions1.join(', ')}
                        onChange={(event) => handleDropdownOptionChange(event, 'dropdownOptions1')}
                        margin="normal"
                        multiline
                        rowsMax={6} // Limit the number of rows to 6
                        inputProps={{ style: { whiteSpace: 'pre-line' } }} // Preserve whitespace and break lines
                        helperText="Enter options separated by commas (e.g., Option 1, Option 2, Option 3)"
                    />
                )}
                {fieldSettings.fieldType === 'date' && (
                    <div>
                        <TextField size="small" fullWidth type="date" name="fromDate" onChange={handleInputChange} margin="normal" />
                        <TextField size="small" fullWidth type="date" name="toDate" onChange={handleInputChange} margin="normal" />
                    </div>
                )}
                {fieldSettings.fieldType === 'Drop-down' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel style={{ marginTop: '-1.5%' }}>Preview</InputLabel>
                        <Select
                            size="small"
                            value={fieldSettings.dropdownOptions2[0]} // Display the first option as label
                            onChange={() => {}}
                        >
                            {/* Options displayed in the dropdown one by one */}
                            {fieldSettings.dropdownOptions1.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Button variant="contained" size="small" color="primary" onClick={handleSaveClick}>
                    Save
                </Button>
                <Button size="small" style={{ marginLeft: '1%', backgroundColor: 'Gray', color: 'white' }} onClick={handleSaveClick}>
                    Cancel
                </Button>
            </Box>
        </MainCard>
    );
};

export default CustomFieldSettings;
