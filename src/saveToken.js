/*

Module: saveToken.js

Function:
    Implementation code for getToken.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import { useState } from 'react';

/*

Name:	useToken()

Function:
    It provides functions to read the token from local storage (getToken) and save the token to 
    local storage (saveToken).

Definition:
    The useToken hook is defined to encapsulate the logic related to reading and saving a user token.

Description:
	The useToken hook is designed to manage a user token in a React application.It provides functions to 
    read the token from local storage (getToken) and save the token to local storage (saveToken).The token
    state is managed using the useState hook.

Return:
	The useToken hook doesn't explicitly return anything. Instead, it defines two functions 
    (getToken and saveToken) and manages the token state using the useState hook.

*/

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        // console.log('UseToken, Read Token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };
    const [token, setToken] = useState(getToken());
    const saveToken = (userToken) => {
        // console.log('Store Token');
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };
    return {
        setToken: saveToken,
        token
    };
}

/**** end of saveToken.js ****/
