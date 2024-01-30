/*

Module: index.js

Function:
    Implementation code for Dashboard.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import MainCard from './../../../ui-component/cards/MainCard';
import { constobj } from './../../../misc/constants';
import { ResponsiveContainer } from 'recharts';

const pieParams = { height: 200, margin: { right: 5 } };
const palette = ['red', 'blue', 'green'];

const size = {
    width: 420,
    height: 220
};

/*

Name:	Dashboard()

Function:
    Start Dashboard function handles the state for modal visibility (showModal), 
    selected card (selectedCard), and application reports(appReport). It includes 
    functions to toggle the modal (toggleModal),handle modal key events (handleModalKeydown),
    and fetch application reports(getappReport) on component mount using the useEffect hook.

Definition:
    State for modal visibility, selected card, and application reports, featuring 
    functions for toggling the modal, handling modal key events, and fetching application
    reports on component mount.

Description:
	That maintains state for modal visibility, selected card, and application reports.
    It includes functions to toggle the modal and handle modal key events. The component 
    fetches application reports using the getappReport function upon mounting.

*/

export default function Dashboard() {
    const { DNC_URL } = { ...constobj };
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [appReport, setAppReport] = React.useState({});

    const toggleModal = (index) => {
        setShowModal(!showModal);
        setSelectedCard(index);
    };

    const handleModalKeydown = (event) => {
        if (event.key === 'Escape') {
            toggleModal(null);
        }
    };

    useEffect(() => {
        getappReport();
    }, []);

    async function getappReport() {
        const myreport = await getReportData();
        // console.log('Get Org Report: ', myreport);
        setAppReport(myreport);
        // console.log(myreport);
    }

    /*

    Name:	getReportData()

    Function:
        getReportData retrieves application report data through a Promise, utilizing Fetch API 
        to make a GET request with authorization headers and resolving with the fetched data.

    Definition:
        getReportData retrieves application report data through a Promise, utilizing Fetch API to make a GET request 
        with authorization headers and resolving with the fetched data.

    Description:
       This function asynchronously fetches application report data from the server using a GET request. 
       It includes authorization headers retrieved from sessionStorage and resolves the operation with
       the fetched data or rejects with an error in case of failure.

    */

    function getReportData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/apprep');
            let myulist = [];
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

    return (
        <MainCard title="Dashboard">
            <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                <MainCard style={{ flex: 1 }}>
                    <Box>
                        <Typography style={{ fontWeight: 'bold' }}>User</Typography>
                        {appReport.user && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { value: appReport.user.Active, label: 'Active' },
                                                { value: appReport.user.Total - appReport.user.Active, label: 'Non Active' }
                                            ]
                                        }
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                    {...size}
                                />
                            </ResponsiveContainer>
                        )}
                    </Box>
                </MainCard>
                <MainCard style={{ flex: 1 }}>
                    <Box>
                        <Typography style={{ fontWeight: 'bold' }}>Gateway</Typography>
                        {appReport.user && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => ` ${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: appReport.gateway.Up, label: 'Active-UP' },
                                                { id: 1, value: appReport.gateway.Dn, label: 'Active-Dn' },
                                                { id: 2, value: appReport.gateway.NIU, label: 'Active-NiU' },
                                                {
                                                    id: 3,
                                                    value:
                                                        appReport.gateway.Total -
                                                        (appReport.gateway.Up + appReport.gateway.Dn + appReport.gateway.NIU),
                                                    label: 'No Status'
                                                }
                                            ]
                                        }
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                    {...size}
                                />
                            </ResponsiveContainer>
                        )}
                    </Box>
                </MainCard>
            </Stack>

            <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                <MainCard style={{ flex: 1 }}>
                    <Box>
                        <Typography style={{ fontWeight: 'bold' }}>Stock</Typography>
                        {appReport.user && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: appReport.stock.Assigned, label: 'Assigned' },
                                                { id: 1, value: appReport.stock.InUse, label: 'In-Use' },
                                                {
                                                    id: 2,
                                                    value: appReport.stock.Total - (appReport.stock.Assigned + appReport.stock.InUse),
                                                    label: 'Others'
                                                }
                                            ]
                                        }
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                    {...size}
                                />
                            </ResponsiveContainer>
                        )}
                    </Box>
                </MainCard>

                <MainCard style={{ flex: 1 }}>
                    <Box>
                        <Typography style={{ fontWeight: 'bold' }}>Spot</Typography>
                        {appReport.spot && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: appReport.spot.Assigned, label: 'Assigned' },
                                                { id: 1, value: appReport.spot.Total - appReport.spot.Assigned, label: 'Others' }
                                            ]
                                        }
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                    {...size}
                                />
                            </ResponsiveContainer>
                        )}
                    </Box>
                </MainCard>
            </Stack>
        </MainCard>
    );
}

/**** end of index.js ****/
