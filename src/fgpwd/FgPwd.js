/*

Module: FgPwd.js

Function:
    Implementation code for Forgot Password.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation  October 2023

*/
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { constobj } from './../misc/constants';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

/*

    Name:	FgPwd ()

    Function:
        FgPwd that handles the forgot password functionality. It captures user
        input for email, new password, and confirm password. The component
        communicates with the server to update the password.        

    Definition:
        FgPwd that manages the forgot password feature. It includes functions
        for handling form submissions, password resets, and navigation. The
        setNewPwd function sends a request to the server to update the password
        and the component provides a user interface for email, new password,
        and confirm password inputs.

    Description:
        Users to reset their passwords. It validates user input, communicates
        with the server to update the password, and provides visual feedback
        through toasts.

    Return:
        The functions handleSubmit, handleReset, navigate, and goBack have no
        explicit return values. The setNewPwd function returns a promise that
        resolves with a success message or rejects with an error message.

*/

export default function FgPwd() {
    const { DNC_URL } = { ...constobj };
    const [uname, setUserName] = useState();
    const [pwd, setPassword] = useState();
    const [email, setEmail] = useState();
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (pwd !== confirmPassword) {
            // Show an error toast
            toast.error('Password and Confirm Password do not match');
            return;
        }

        try {
            let spresp = await setNewPwd();
            // Show a success toast
            toast.success(spresp);
            navigate('/');
        } catch (error) {
            // Show an error toast
            toast.error(error);
        }
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
    };

    /*
    | updating a user's password on the server. It utilizes the DELETE HTTP
    | method to send a request to the specified endpoint (DNC_URL + '/pwd').
    | The function expects certain inputs, such as searchParams 
    | (URL query parameters), email (user's email address), pwd (new password).
    | The authentication token is retrieved from the session storage (myToken).
    */
    function setNewPwd() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mydict = {};
            mydict['turl'] = searchParams.get('user');
            mydict['email'] = email;
            mydict['pwd'] = pwd;

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/pwd');

            fetch(url, requestOptions)
                .then(async (response) => {
                    if (response.status == '200') {
                        let resp = await response.json();
                        resolve(resp.message);
                    } else {
                        let resp = await response.json();
                        reject(resp.message);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
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
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="Email"
                                                    label="Email"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    type="password"
                                                    placeholder="New Password"
                                                    label="Password"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    label="Confirm Password"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>

                                            <button
                                                style={{ width: '120px', marginTop: '20px' }}
                                                type="submit"
                                                onClick={handleReset}
                                                class="  btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                            >
                                                Reset
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

/**** end of FgPwd.js ****/
