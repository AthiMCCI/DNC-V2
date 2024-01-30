import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { constobj } from './../../misc/constants';

export default function Hardwarepop(props) {
    const { DNC_URL } = { ...constobj };
    const [devlist, setDevlist] = React.useState([]);
    const [selDev, setSelDev] = React.useState('');
    const [dictlist, setDictList] = React.useState([]);
    const [open, setOpen] = useState(true);
    const [selectedIDate, setSelectedIDate] = useState(null);
    const handleSave = () => {
        updtDevData();
    };

    async function updtDevData() {
        let selidx = null;
        for (let i = 0; i < dictlist.length; i++) {
            if (dictlist[i].hwsl == selDev) {
                selidx = i;
                break;
            }
        }
        if (selidx != null) {
            let ddict = {};
            ddict['hwsl'] = dictlist[selidx].hwsl;
            ddict['dsid'] = dictlist[selidx].dsid;
            ddict['devid'] = dictlist[selidx].nwIdV;
            ddict['devtype'] = dictlist[selidx].nwIdK;
            ddict['sid'] = props.mydata.sdata.sid;
            ddict['idate'] = selectedIDate;
            ddict['remarks'] = 'New Device';
            let mydict = {};
            mydict['device'] = ddict;
            mydict['orgname'] = sessionStorage.getItem('myOrg');
            mydict['sname'] = props.mydata.sdata.sname;
            let adresp;
            try {
                adresp = updtDevRecord(mydict);
                Swal.fire('Device assign success');
            } catch (err) {
                Swal.fire(adresp);
            }
        }
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    }

    function updtDevRecord(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/device/' + mydict.sname);
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    const handleClose = () => {
        setOpen(false); // Close the dialog when Cancel is clicked
        props.mydata.hcb();
    };

    useEffect(() => {
        getDeviceInfo();
    }, []);

    async function getDeviceInfo() {
        let myorg = sessionStorage.getItem('myOrg');
        let dlist = await getrtadevices(myorg);
        let devList = [];
        for (let i = 0; i < dlist.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = dlist[i].hwsl;
            mydict['label'] = dlist[i].hwsl;
            devList.push(mydict);
        }
        setSelDev(devList[0].value);
        setDevlist(devList);
        setDictList(dlist);
    }

    function getrtadevices(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/rtadev/' + myorg);

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    // console.log(error);
                    reject(error);
                });
        });
    }

    async function onChangeDev(e) {
        let mseldev = e.target.value;
        setSelDev(mseldev);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                    Assign Device to spot
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Stack spacing={3}>
                            <TextField
                                required
                                error={!props.isSsuIdValid}
                                helperText={props.isSsuIdValid ? '' : 'Device ID is required'}
                                id="hwId"
                                size="small"
                                label={`${props.dnhold} ID`}
                                // onChange={(e) => {
                                //     props.setSsuId(e.target.value);
                                //     props.setIsSsuIdValid(!!e.target.value);
                                // }}
                                style={{ minWidth: '150px' }}
                            />

                            <TextField
                                size="small"
                                id="boardRev"
                                label="Batch"
                                // onChange={(e) => props.ssu.batch(e.target.value)}
                                style={{ minWidth: '150px' }}
                            />
                            <TextField
                                freeSolo
                                // options={ssuTypes}
                                // onChange={typeChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Type"
                                        size="small"
                                        // onChange={(e) => {
                                        //     props.ssu.type(e.target.value); // Make sure props.ssu.status is defined and working
                                        // }}
                                        style={{ minWidth: '193px' }}
                                    />
                                )}
                            />
                            <TextField
                                size="small"
                                id="ssuVersion"
                                label="Version"
                                // onChange={(e) => props.ssu.ver(e.target.value)}
                                style={{ minWidth: '150px' }}
                            />
                            <TextField
                                freeSolo
                                // options={statusSuggestions}
                                // onChange={statusChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Status"
                                        size="small"
                                        // onChange={(e) => {
                                        //     props.ssu.status1(e.target.value); // Make sure props.ssu.status is defined and working
                                        // }}
                                        style={{ minWidth: '193px' }}
                                    />
                                )}
                            />
                            <TextField
                                freeSolo
                                // options={myorgs}
                                defaultValue=""
                                // value={selOrg}
                                // onChange={orgChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        // onChange={(e) => props.ssu.org(e.target.value)}
                                        label="Organization/Client"
                                        style={{ minWidth: '193px' }}
                                    />
                                )}
                            />
                            <TextField
                                freeSolo
                                // options={myorglocs}
                                // onChange={locChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Location"
                                        size="small"
                                        // onChange={(e) => props.ssu.loc(e.target.value)}
                                        style={{ minWidth: '193px' }}
                                    />
                                )}
                            />
                            <TextField
                                freeSolo
                                // options={remarkSuggestions}
                                // onChange={remChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Remarks"
                                        size="small"
                                        // onChange={(e) => props.ssu.remarks(e.target.value)}
                                        style={{ minWidth: '193px' }}
                                    />
                                )}
                            />
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" sx={{ backgroundColor: '#4caf50', color: '#fff' }} onClick={handleSave}>
                            Assign
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f44336', color: '#fff' }}>
                            Next
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </div>
    );
}
