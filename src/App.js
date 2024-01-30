/*

Module: App.js

Function:
    Implementation code for App.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Routesn from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import useToken from './saveToken';
import { Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Plink from './login/plink';
import Slink from './login/slink';
import Signup from './signup/Signup';
import FgPwd from './fgpwd/FgPwd';
import { Orgcontext } from './OrgContext';
import React, { useState } from 'react';

// ==============================|| APP ||============================== //
/*

Name:	App()

Function:
    Rendering within the App component checks whether a token is present. 
    If no token is found, it renders a set of routes associated with 
    authentication, such as login, password recovery, and signup. If a token
    exists, it renders main application content. This content includes theming
    provided by Material-UI's ThemeProvider, styling normalization with
    CssBaseline, and navigation handled by nested routing within Routes.

Definition:
    Maintains local state using the useState hook to keep track of the selected
    organization. Additionally, there's a custom function mychange intended for
    handling a custom change event.

Description:
    React Router (Routes and Route components) for navigation, and it also
    incorporates state management using Redux (useSelector) and local state
    (useState). Conditional rendering is employed to display either the login
    screen or the main application content, depending on the availability of 
    a token..

*/

const App = () => {
    const customization = useSelector((state) => state.customization);
    const { token, setToken } = useToken('');
    const [selOrg, setSelOrg] = useState('Select an Org');
    const orgvalue = { selOrg, setSelOrg };

    function mychange() {
        // console.log('My Change called');
    }

    if (!token) {
        // console.log('No Token');
        return (
            <div>
                {/* <Login setToken={setToken} /> */}
                <Routes>
                    <Route path="/" element={<Login setToken={setToken} />} />
                    <Route path="/plink" element={<Plink />} />
                    <Route path="/slink" element={<Slink />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/fgpwd" element={<FgPwd />} />
                    <Route path="/*" element={<Login setToken={setToken} />} />
                </Routes>
            </div>
        );
    } else {
        // console.log('Yes Token');
        return (
            <Orgcontext.Provider orgv={orgvalue}>
                <div>
                    {/* <Home setToken={setToken} /> */}
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={themes(customization)}>
                            <CssBaseline />
                            <NavigationScroll>
                                <Routesn />
                            </NavigationScroll>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </div>
            </Orgcontext.Provider>
        );
    }
};

export default App;

/**** end of App.js ****/
