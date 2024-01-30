import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import MainCard from './../../ui-component/cards/MainCard';
import { constobj } from './../../misc/constants';
import { ResponsiveContainer } from 'recharts';

const pieParams = { height: 200, margin: { right: 5 } };
const palette = ['yellow', 'blue', 'green'];
const size = {
    width: 420,
    height: 220
};
export default function OrgHome() {
    const { DNC_URL } = { ...constobj };
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [orgReport, setOrgReport] = React.useState({});

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
        getOrgReport();
    }, []);

    async function getOrgReport() {
        const myreport = await getReportData();
        // console.log('Get Org Report: ', myreport);
        setOrgReport(myreport);
        // console.log(myreport);
    }

    function getReportData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            let myorg = sessionStorage.getItem('myOrg');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orgrep/' + myorg);

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
        <MainCard title="Home">
            <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                <MainCard style={{ flex: 1 }}>
                    <Box>
                        <Typography style={{ fontWeight: 'bold' }}>User</Typography>
                        {orgReport.user && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: orgReport.user.Active, label: 'Active' },
                                                { id: 1, value: orgReport.user.Total - orgReport.user.Active, label: 'Non Active' }
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
                        {orgReport.gateway && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => ` ${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: orgReport.gateway.Up, label: 'Active UP' },
                                                { id: 1, value: orgReport.gateway.Dn, label: 'Active Dn' },
                                                { id: 2, value: orgReport.gateway.NIU, label: 'Active NiU' },
                                                {
                                                    id: 3,
                                                    value:
                                                        orgReport.gateway.Total -
                                                        (orgReport.gateway.Up + orgReport.gateway.Dn + orgReport.gateway.NIU),
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
                        {orgReport.user && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: orgReport.stock.Assigned, label: 'Assigned' },
                                                { id: 1, value: orgReport.stock.InUse, label: 'In Use' },
                                                {
                                                    id: 2,
                                                    value: orgReport.stock.Total - (orgReport.stock.Assigned + orgReport.stock.InUse),
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
                        {orgReport.spot && (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart
                                    series={[
                                        {
                                            arcLabel: (item) => `${item.value}`,
                                            arcLabelMinAngle: 45,
                                            data: [
                                                { id: 0, value: orgReport.spot.Assigned, label: 'Assigned' },
                                                { id: 1, value: orgReport.spot.Total - orgReport.spot.Assigned, label: 'Others' }
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
