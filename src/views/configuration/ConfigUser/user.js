import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Button } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MainCard from './../../../ui-component/cards/MainCard';
import AddUserfields from './adduserfields';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import ListFields from './listfields';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function ConfigUser() {
    const navigate = useNavigate();
    const [showAddUserFields, setShowAddUserFields] = useState(false);
    const [userFields, setUserFields] = useState([]);

    function getConfig() {
        return new Promise(async function (resolve, reject) {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/cfgall');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    const defaultFieldSettings = {
        id: 0,
        fieldName: '',
        fieldType: 'text',
        required: false,
        enable: false,
        hidden: false
    };
    const handleAddFieldClick = () => {
        setShowAddUserFields(true);
    };
    const handleFieldSave = (newField) => {
        const newId = userFields.length + 1;
        const newFieldWithId = { id: newId, ...newField };

        // Update the userFields state with the new field
        setUserFields((prevUserFields) => [...prevUserFields, newFieldWithId]);

        // Close the AddUserFields component
        setShowAddUserFields(false);
    };

    return (
        <MainCard title="Device Management" showHomeIcon showBackIcon onBackClick={() => console.log('Go back')}>
            <Button
                variant="contained"
                style={{ color: 'white', backgroundColor: '#512da8' }}
                endIcon={<SendIcon />}
                size="small"
                color="primary"
                onClick={handleAddFieldClick}
            >
                Add field
            </Button>
            {showAddUserFields && <AddUserfields onFieldSave={handleFieldSave} onCancel={() => setShowAddUserFields(false)} />}
            <ListFields userFields={userFields} onUserFieldsUpdate={setUserFields} />
        </MainCard>
    );
}
