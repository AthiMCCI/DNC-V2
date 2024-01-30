/*

Module: deletespot.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { constobj } from './../../misc/constants';

export default function DeleteSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);

    const handleDelete = () => {
        deleteSpot();
    };
    const handleCancel = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    /*
    | deleteSpot function is designed to delete a spot based on the spot data
    | provided through props. It retrieves the spot data (sdict) from props, 
    | initializes an empty dictionary (mydict) to store organization and spot
    | information, and populate the organization name, spot name, spot ID. 
    */
    async function deleteSpot() {
        let sdict = props.mydata.sdata;
        let mydict = {};
        let myorg = sessionStorage.getItem('myOrg');
        mydict['org'] = myorg;
        mydict['sname'] = sdict.sname;
        mydict['sid'] = sdict.sid;
        try {
            let dresp = await deleteSpotReq(mydict);
            toast.success(dresp.message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setOpen(false);
            props.mydata.hcb();
        } catch (error) {
            toast.error('Failed to delete spot. Please try again later.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    /*

    Name:	deleteSpotReq()

    Function:
        The deleteSpotReq function is designed to delete a spot record based on
        the provided dictionary (sdict).

    Definition:
        It first checks if the spot status is 'live' if so, it resolves with an
        error message indicating that the spot record cannot be deleted until 
        the status is updated.

    Description:
       Authentication token from sessionStorage, sets the necessary headers, 
       and constructs the request options. It then performs a DELETE request to
       the specified URL and resolves the promise with the data from response
       upon success. In case of error, it rejects the promise with the error.

    Return:
        Resolves with an error message. Otherwise, it resolve the data from the
        response upon successful deletion or rejects with an error in case of 
        failure.

    */
    function deleteSpotReq(sdict) {
        return new Promise(async function (resolve, reject) {
            if (sdict.status === 'live') {
                resolve({ message: "can't delete the spot record, update the status then try again" });
            } else {
                let auth = sessionStorage.getItem('myToken');
                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');
                var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    body: JSON.stringify(sdict)
                };
                var url = new URL(DNC_URL + '/spot/' + sdict.sname);
                fetch(url, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Delete Spot  ' + props.mydata.sdata.sname}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>Are you sure you want to delete the User</Typography>
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/**** end of deletespot.js ****/
