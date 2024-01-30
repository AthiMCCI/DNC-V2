/*

Module: Login.js

Function:
    Implementation code for Login Page.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import './Login.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { constobj } from './../misc/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { SET_MY_USER, SET_MY_TOKEN, SET_MY_CONFIG } from 'store/actions';

/*

Name:	loginUser()

Function:
    Start loginUser handles user authentication by sending a POST request

Definition:
    async function loginUser(credentials, setToken)

Description:
	The function `loginUser` handles user authentication by sending a POST
    request with provided credentials to the server's login endpoint.
    The loginUser function sends a POST request to the specified login endpoint
    on the server (constructed from the DNC_URL constant) with the provided user
    credentials.

Return:
	Returns 'error' for invalid credentials or an object with 'success' status,
	authentication token, and user data.

*/

async function loginUser(credentials, setToken) {
    const { DNC_URL } = { ...constobj };
    // console.log('Login Page: ', DNC_URL);
    return fetch(constobj.DNC_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then((data) => data.json())
        .then((data) => {
            if (data.hasOwnProperty('message')) {
                // console.log(data.message);
                return 'error';
            } else {
                // console.log('Login Success');
                // console.log(data.token);
                return { result: 'success', token: data.token, udata: data.udata };
            }
        });
}

function cbloginsuccess() {
    // console.log('Callback of Login success');
}

export default function Login({ setToken }) {
    const [uname, setUserName] = useState();
    const [pwd, setPassword] = useState();
    const dispatch = useDispatch();
    const { DNC_URL } = { ...constobj };
    const [authenticatedUser, setAuthenticatedUser] = useState('');
    const [dncv, setDncv] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false); // New state for login success
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message

    useEffect(() => {
        getDncVersion();
        getDncConfig();
    }, []);

    async function getDncConfig() {
        let dnccfg = await getConfig();
        // console.log('Config Data: ', dnccfg);
        dispatch({ type: SET_MY_CONFIG, myConfig: dnccfg });
    }

    async function getDncConfig_stub() {
        let myconfigs = {};
        myconfigs['features'] = { Gateway: true };
        myconfigs['alias'] = { device: 'SSU' };
        myconfigs['plugins'] = ['downlink', 'subscription'];
        dispatch({ type: SET_MY_CONFIG, myConfig: myconfigs });
    }

    async function getDncVersion() {
        let dver = await getVersion();
        // console.log(dver);
        let dncv2 = dver.split('Server')[1];
        setDncv(dncv2);
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

    function getVersion() {
        return new Promise(async function (resolve, reject) {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/version');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const logresp = await loginUser({
            uname,
            pwd
        });
        if (logresp === 'error') {
            setErrorMessage('Invalid Credentials');
        } else if (logresp.result === 'success') {
            sessionStorage.setItem('myToken', logresp.token);
            sessionStorage.setItem('myUser', JSON.stringify(logresp.udata));
            let mytoken = logresp.token;
            let myuser = logresp.udata;
            dispatch({ type: SET_MY_TOKEN, myToken: mytoken });
            dispatch({ type: SET_MY_USER, myUser: myuser });
            // console.log('Set Client Name');
            setToken(logresp.token);
            setAuthenticatedUser(uname);
            setLoginSuccess(true);
            toast.success('Login Successful!', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    if (loginSuccess) {
        return <div className="maincontainer"></div>;
    } else {
        return (
            <div className="maincontainer">
                <div className="container-fluid">
                    <div class="row no-gutter">
                        <div class="col-md-6 d-none d-md-flex bg-image"></div>
                        <div class="col-md-6 bg-light">
                            <div class="login d-flex align-items-center py-5">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-10 col-xl-7 mx-auto">
                                            <h2 class="display-4">DNC </h2>
                                            <h5 class="text-muted mb-4">Data Normalization Console</h5>
                                            <form onSubmit={handleSubmit}>
                                                <div class="form-group mb-3">
                                                    <input
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        required
                                                        id="outlined-required"
                                                        placeholder="User Name"
                                                        label="Username"
                                                        class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                                                    />
                                                </div>
                                                <div class="form-group mb-3">
                                                    <input
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        id="outlined-required"
                                                        type="password"
                                                        placeholder="Password"
                                                        required=""
                                                        class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                                                    />
                                                </div>
                                                {errorMessage && <div className="text-danger">{errorMessage}</div>}
                                                <div className="form-group mb-2 d-flex justify-content-between">
                                                    <button
                                                        type="submit"
                                                        className="form-control btn btn-primary btn-block text-uppercase rounded-pill shadow-sm btn-smaller"
                                                    >
                                                        Login
                                                    </button>
                                                    <h7 className="float-end">
                                                        <a href="plink">Forgot password?</a>
                                                    </h7>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {authenticatedUser && (
                    <div className="profile-section">
                        <h4>Welcome-123, {authenticatedUser}!</h4>
                    </div>
                )}
                <footer className="footer">
                    DNC {dncv} | Server v{constobj.SW_VER}
                </footer>
            </div>
        );
    }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

/*** end of login.js ***/
