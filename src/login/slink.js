/*

Module: slink.js

Function:
    Implementation code for Login Page.

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

export default function Slink() {
    const [semail, setLinkEmail] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    /*

    Name:   onClickSend()

    Function:
        It takes an event (e) as a parameter, presumably representing a click
        event, as the function name suggests that it's meant to be an onClick
        handler.

    Definition:
        The primary purpose of this function is to send a POST request to a
        specified server endpoint, process the response, and provide user 
        feedback accordingly. The function incorporates error handling using 
        a try-catch block and utilizes the SweetAlert (Swal) library to display
        informative messages.

    Description:
        The onClickSend function is a asynchronous JavaScript function designed
        to handle a click event, presumably associated with a form submission.

    Return:
       Function does not explicitly return any value (return;). Its main role 
       is to manage the asynchronous flow of sending a request, 

    */

    async function onClickSend(e) {
        e.preventDefault();
        const inpparam = { fcode: 'nusu', email: semail };
        try {
            const response = await fetch(constobj.DNC_URL + '/slink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inpparam)
            });
            const data = await response.json();
            if (data.hasOwnProperty('message')) {
                Swal.fire({
                    text: data.message,
                    showCloseButton: true
                }).then(() => {
                    // Navigate to the login screen after successful signup
                    navigate('/login');
                });
            } else {
                Swal.fire('Error occurred, try again');
            }
        } catch (error) {
            // console.error('Error:', error);
            Swal.fire('An error occurred, please try again');
        }
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
                                        <h5 class="text-muted mb-4">New User Link</h5>
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

/**** end of slink.js ****/
