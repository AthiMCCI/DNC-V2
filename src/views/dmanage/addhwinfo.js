/*

Module: addhwinfo.js

Function:
    Implementation code for SSU Management.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './../../App.css';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../misc/constants';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';

/*

Name:	AddHwInfo()

Function:
    handler for saving hardware serial (HwSl) change, technology change, 
    network change, region change, and remarks change.

Definition:
    AddHwInfo handling state for hardware information, with handlers for saving
    and various input changes.

Description:
	handling changes in hardware serial (HwSl), technology, network, region and
    remark. It interact with the parent component through props, updating state
    and triggering callback functions.

Return:
	Managing hardware information state with handlers, interacting with parent
    component through props.

*/

function AddHwInfo(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const { selTechError, setSelTechError, selNwError, setSelNwError } = props;
    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selRegion, setSelRegion] = useState('');
    const [nwList, setNwList] = useState([]);
    const [doa, setDoA] = React.useState(null);

    const remarkSuggestions = cfgmenu['autooptions']['remarks'] ? cfgmenu['autooptions']['remarks'] : [];
    const bandregions = cfgmenu['autooptions']['bandregions'] ? cfgmenu['autooptions']['bandregions'] : [];

    const nwtechdict = cfgmenu['autooptions']['technology'] ? cfgmenu['autooptions']['technology'] : [];
    const nwtech = Object.keys(nwtechdict);

    const technology = [];
    const network = {};

    for (let i = 0; i < nwtech.length; i++) {
        technology.push({ value: nwtech[i], label: nwtech[i] });
        network[nwtech[i]] = [];
        for (let k = 0; k < nwtechdict[nwtech[i]].length; k++) {
            network[nwtech[i]].push({ value: nwtechdict[nwtech[i]][k], label: nwtechdict[nwtech[i]][k] });
        }
    }

    const bandRegion = [];
    for (let i = 0; i < bandregions.length; i++) {
        bandRegion.push({ value: bandregions[i], label: bandregions[i] });
    }

    const handleSaveClick = () => {
        addStock();
        props.onAddSsuInfoData(mydict); // Call the callback function with data
        props.mydata.cbf(1);
    };
    const handleHwSlChange = (e) => {
        const value = e.target.value;
        props.hw.hwsl(value); // Call the hwsl setter from props
        props.setIsHwSlValid(!!value); // Update isHwSlValid based on the input value
    };
    async function techChange(e) {
        props.hw.tech(e.target.value);
        setSelTech(e.target.value);
        setNwList(network[e.target.value]);
    }
    async function nwChange(e) {
        props.hw.netw(e.target.value);
        setSelNw(e.target.value);
    }
    async function regionChange(e) {
        props.hw.region(e.target.value);
    }
    const remChange = async (e, nv) => {
        props.hw.remarks(nv);
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 3, width: '30ch' }
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    required
                    error={!props.isHwSlValid} // Apply error style if isHwSlValid is false
                    helperText={props.isHwSlValid ? '' : 'Hardware ID is required'} // Show helper text if isHwSlValid is false
                    id="hwSl"
                    size="small"
                    label="Hardware ID"
                    onChange={handleHwSlChange} // Call handleHwSlChange when the input value changes
                    style={{ minWidth: '150px' }}
                />
                <TextField size="small" onChange={(e) => props.hw.brev(e.target.value)} id="boardRev" label="Board Revision" />
                <TextField size="small" onChange={(e) => props.hw.fwver(e.target.value)} id="fwVer" label="Firmware Version" />
            </div>
            <div>
                <TextField
                    style={{ marginTop: ' 1px ' }}
                    id="technology"
                    select
                    size="small"
                    label=" Technology"
                    required
                    helperText={selTechError ? 'Technology is required' : ' '}
                    error={selTechError}
                    defaultValue=""
                    onChange={(e) => {
                        techChange(e);
                        setSelTechError(false); // Reset error state when user makes changes
                    }}
                >
                    {technology.length > 0 &&
                        technology.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
                <TextField
                    style={{ marginTop: ' -2px ' }}
                    id="network"
                    select
                    size="small"
                    required
                    label=" Network"
                    helperText={selNwError ? 'Network is required' : ' '}
                    error={selNwError}
                    defaultValue=""
                    onChange={(e) => {
                        nwChange(e);
                        setSelNwError(false); // Reset error state when user makes changes
                    }}
                >
                    {nwList.length > 0 &&
                        nwList.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
                <TextField
                    style={{ marginTop: ' -3px ' }}
                    id="bandRegion"
                    select
                    size="small"
                    label=" Band/Region"
                    defaultValue=""
                    helperText=" "
                    onChange={regionChange}
                >
                    {bandRegion.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </Box>
    );
}

export default AddHwInfo;

/**** end of addhwinfo.js ****/
