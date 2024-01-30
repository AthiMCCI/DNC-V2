/*

Module: plink.js

Function:
    Implementation code for ForgotPassword.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { constobj } from './../misc/constants';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

/*

Name:   Plink()

Function:
    Start "Plink" with state for email, form submission handling, navigation 
    functions, and an asynchronous function to send a link, including error
    handling with SweetAlert.

Definition:
    React component "Plink" with email state, form submission handling,
    navigation and asynchronous linksending function using fetch and SweetAlert
    for error messages.

Description:
	The function managing an email state, handling form submissions, and using
    fetch to send a link with error messages displayed using SweetAlert, also 
    featuring navigation functions.

Return:
    Asynchronous function (onClickSend) utilizing the Fetch API to send a link,
    with error messages displayed using SweetAlert.

*/

export default function Plink() {
    const [semail, setLinkEmail] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    async function onClickSend(e) {
        e.preventDefault();

        // Check if the email field is empty
        if (!semail || semail.trim() === '') {
            // Show an error toast if the email field is empty
            toast.error('Please provide an email address');
            return;
        }

        const inpparam = { fcode: 'fgpw', email: semail };
        return fetch(constobj.DNC_URL + '/slink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inpparam)
        })
            .then((data) => data.json())
            .then((data) => {
                // console.log('FGPW: ', data);
                if (data.hasOwnProperty('message')) {
                    // Show a success toast
                    toast.success(data.message, {
                        onClose: () => navigate(-1)
                    });
                } else {
                    // Show an error toast for other errors
                    toast.error('Error occurred, try again');
                }
            });
    }

    return (
        <div className="maincontainer">
            <div class="container-fluid">
                <div class="row no-gutter">
                    <div class="col-md-6 d-none d-md-flex bg-image"></div>
                    <div class="col-md-6 bg-light">
                        <div class="login d-flex align-items-center py-5">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-10 col-xl-7 mx-auto">
                                        <h5 class="text-muted mb-4">Forgot Password</h5>
                                        <form onSubmit={handleSubmit}>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setLinkEmail(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="Enter Email"
                                                    label="Username"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>

                                            <button
                                                style={{ width: '120px', marginTop: '20px' }}
                                                type="submit"
                                                onClick={onClickSend}
                                                class="  btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                            >
                                                Send Link
                                            </button>
                                            <button
                                                style={{ width: '120px', marginTop: '20px' }}
                                                onClick={goBack}
                                                type="submit"
                                                class=" float-end .me-4 btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                            >
                                                Back
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**** end of plink.js ****/
