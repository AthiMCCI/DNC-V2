import React, { useState } from 'react';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MainCard from './../../../ui-component/cards/MainCard';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Datasource() {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]); // State to store selected checkboxes
    const [dataconfig, setDataConfig] = useState({
        Gateway: true,
        DataDownload: false,
        Downlink: false,
        Subscription: false,
        DeviceManagement: false,
        Brixtap: false
    });

    function handleCheckboxChange(event) {
        const checkboxValue = event.target.value;
        const isChecked = event.target.checked;

        console.log('Checkbox Value:', checkboxValue);
        console.log('Is Checked:', isChecked);

        setSelectedCheckboxes((prevSelectedCheckboxes) => {
            if (isChecked) {
                return [...prevSelectedCheckboxes, checkboxValue];
            } else {
                return prevSelectedCheckboxes.filter((value) => value !== checkboxValue);
            }
        });

        setDataConfig((prevDataConfig) => ({
            ...prevDataConfig,
            [checkboxValue]: isChecked
        }));
    }

    useEffect(() => {
        getDncConfig();
    }, []);

    async function getDncConfig() {
        let dnccfg = await getConfig();
        dispatch({ type: SET_MY_CONFIG, myConfig: dnccfg });
    }

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

    function handleSave() {
        console.log('Selected Checkboxes:', selectedCheckboxes);
        console.log('Data Config:', dataconfig);
        // Implement your save logic here
    }
    return (
        <MainCard title="Configuration Features">
            <FormGroup>
                <Grid container spacing={1}>
                    {Object.entries(dataconfig).map(([key, value]) => (
                        <Grid item xs={4} key={key}>
                            <Checkbox value={key} onChange={handleCheckboxChange} checked={value} />
                            {key}
                        </Grid>
                    ))}
                </Grid>
            </FormGroup>
            <Stack style={{ marginLeft: '18px', marginTop: '20px' }} direction="row" spacing={1}>
                <ColorButton size="small" variant="contained" onClick={handleSave}>
                    update
                </ColorButton>
            </Stack>
        </MainCard>
    );
}
