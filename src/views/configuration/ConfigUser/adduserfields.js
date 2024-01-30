import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Button, IconButton } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MainCard from './../../../ui-component/cards/MainCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

const AddUserfields = ({ onFieldSave }) => {
    const [fieldSettings, setFieldSettings] = useState({
        fieldName: '',
        fieldType: 'text',
        customFieldType: '',
        dropdownOptions1: [],
        dropdownOptions2: [],
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
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFieldSettings({ ...fieldSettings, [name]: value });
    };

    const handleDropdownOptionChange = (event) => {
        const { value } = event.target;
        const optionsArray = value.split(',').map((option) => option.trim());

        setFieldSettings({
            ...fieldSettings,
            dropdownOptions1: optionsArray,
            dropdownOptions2: [optionsArray[0]]
        });
    };

    const handleSaveClick = () => {
        const newField = {
            ...fieldSettings,
            ...checkboxState
        };

        // Invoke the callback function to update the list of fields in ListFields
        onFieldSave(newField);

        // Reset the form after saving
        setFieldSettings({
            fieldName: '',
            fieldType: 'text',
            customFieldType: '',
            dropdownOptions1: [],
            dropdownOptions2: [],
            maxValue: '',
            minValue: '',
            decimalValue: ''
        });
        setCheckboxState({
            required: true,
            enable: false,
            hidden: false
        });
    };

    // useEffect(() => {
    //     // setRows(processedRows);
    // }, [fieldSettings]);

    return (
        <MainCard title="Add User Field">
            <Box maxWidth={400} p={3}>
                <TextField
                    fullWidth
                    size="small"
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    name="fieldName"
                    value={fieldSettings.fieldName}
                    onChange={handleInputChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select size="small" label="Field Type" name="fieldType" value={fieldSettings.fieldType} onChange={handleInputChange}>
                        {['text', 'number', 'date', 'Drop-down', 'Other'].map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {fieldSettings.fieldType === 'Other' && (
                    <TextField
                        size="small"
                        fullWidth
                        label="Custom Type"
                        name="customFieldType"
                        value={fieldSettings.customFieldType}
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
                        rowsMax={6}
                        inputProps={{ style: { whiteSpace: 'pre-line' } }}
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
                        <Select size="small" value={fieldSettings.dropdownOptions2[0]} onChange={() => {}}>
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

export default AddUserfields;
