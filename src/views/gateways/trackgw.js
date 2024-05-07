/*

Module: trackgw.js

Function:
    Implementation code for Gateways.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from '../../misc/constants';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditGw from './editgw';
import { useSelector } from 'react-redux';

export default function TrackGw(props) {
    const { DNC_URL } = { ...constobj };
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditStock, setShowEditStock] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selid, setSelId] = React.useState();

    let snhold = cfgmenu['alias']['Stock'] ? cfgmenu['alias']['Stock'] : 'Stock';

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 40 },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'hwid', headerName: 'HwId', width: 150 },
        { field: 'model', headerName: 'Model', width: 100 },
        { field: 'simmk', headerName: 'SIM', width: 100 },
        { field: 'orgid', headerName: 'Org', width: 110 },
        { field: 'location', headerName: 'Location', width: 100 },
        { field: 'tech', headerName: 'Technology', width: 100 },
        { field: 'network', headerName: 'Network', width: 100 },
        { field: 'ssusc', headerName: 'SSUs', width: 50 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 100 },
        { field: 'adate', headerName: 'Date', width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        title={`Edit ${snhold}`}
                        icon={<EditIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleEditHw(id)}
                    />
                ];
            }
        }
    ];

    const handleEditHw = (id) => () => {
        // console.log('Handle Edit Hw');
        setSelId(id);
        setShowEditStock(true);
    };
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const processRowUpdate = async (newRow) => {
        // console.log('Process Row Update');
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };

    /*

    Name:	getHwTrack()

    Function:
        getHwTrack  performs an asynchronous operation. resolve is a function
        to be called when the asynchronous operation is successful. reject is a
        function to be called when there is an error. The URL for the HTTP
        request is constructed using the URL constructor, combining 
        DNC_URL, '/tgwmr/', and the gateway name from the props.

    Definition:
        Fetching hardware tracking data based on the gateway name from the 
        props. It sets up an asynchronous operation using the Fetch API and
        returns a Promise that provides the ability to handle the asynchronous
        result of the HTTP request.

    Description:
        The fetch function is used to make an asynchronous HTTP GET request to
        specified URL with the given options. The response is processed using
        the Promise chain. The response first parsed as JSON (response.json())
        and the resulting data is logged to the console. The Promise resolved
        with the formatted hardware tracking list if the request successful or
        rejected with an error if there is any issue during the request.
    */
    function getHwTrack() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var url = new URL(DNC_URL + '/tgwmr/' + props.tgdata.gwName);
            // console.log('Get Track GW-1: ', url);
            let myulist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['gwid'] = item['gwid'];
                        myrow['name'] = item['name'];
                        myrow['hwid'] = item['hwid'];
                        myrow['simmk'] = item['simmk'];
                        myrow['orgid'] = item['orgid'];
                        myrow['location'] = item['location'];
                        myrow['ssusc'] = item['ssusc'];
                        myrow['tech'] = item['tech'];
                        myrow['network'] = item['network'];
                        myrow['model'] = item['model'];
                        myrow['status'] = item['status'];
                        myrow['lactive'] = item['lactive'];
                        myrow['remarks'] = item['remarks'];
                        myrow['adate'] = item['adate'];

                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | trackOneHw function calls the getHwTrack function using the await keyword
    | indicating that it wait for the asynchronous operation to complete before
    | proceeding. The result of getHwTrack is stored in the mystock constant. 
    | It uses the setRows function, presumably a state updater function, to 
    | update the state variable rows with the value of mystock. It logs the
    | value of mystock to the console.
    */
    async function trackOneHw() {
        const mystock = await getHwTrack();
        setRows(mystock);
        // console.log(mystock);
    }

    const makeStockEditable = () => {
        setShowEditStock(false);
        // getStockInfo();
    };
    const makeDmdEditable = () => {
        setShowEditDmd(false);
        getStockInfo();
    };

    useEffect(() => {
        trackOneHw();
    }, []);

    return (
        <div>
            {showEditStock ? <EditGw mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable }} /> : null}
            <div style={{ height: 400, width: '100%', marginTop: 10, marginLeft: -20 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={thcolumns}
                    density="compact"
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel }
                    }}
                />
            </div>
        </div>
    );
}

/**** end of trackgw.js ****/
