import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '@mui/material';

// Define custom icons
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const devices = [
    { id: 1, devEUI: '0002CC0100000E7F', name: 'Arnot-NY', position: [42.4536054, -76.6556546], active: true },
    { id: 2, devEUI: '0002CC0100000E79', name: 'Maine-NY', position: [42.1925895, -76.0713358], active: false },
    { id: 3, devEUI: '0002CC0100000E7E', name: 'Quebec-Canada', position: [53.3495173, -78.963718], active: true },
    { id: 4, devEUI: '0002CC0100000E7A', name: 'Montvillie-Ohio', position: [41.6072907, -81.0606738], active: false },
    { id: 5, devEUI: '0002CC0100000E7B', name: 'Uihlein-Lake-Placid-NY', position: [44.2648464, -73.9933451], active: true },
    { id: 6, devEUI: '0002CC0100000E77', name: 'Wisconsin', position: [44.8742684, -92.2085496], active: false },
    { id: 7, devEUI: '0002CC0100000E7C', name: 'Cornell-University-NY', position: [42.4529076, -76.4800842], active: true },
    { id: 8, devEUI: '0002CC0100000E78', name: 'Cornell-University-NY', position: [42.4529076, -76.4800842], active: false },
    { id: 9, devEUI: '0002CC0100000E76', name: 'Cornell-University-NY', position: [42.4529076, -76.4800842], active: true }
];

const initialCenter = devices.length > 0 ? devices[0].position : [51.505, -0.09];

const DeviceMap = () => {
    return (
        <MapContainer center={initialCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer name="OpenTopoMap" checked>
                    <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri World Imagery">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                </LayersControl.BaseLayer>
            </LayersControl>
            {devices.map((device) => (
                <Marker key={device.id} position={device.position} icon={device.active ? greenIcon : redIcon}>
                    <Popup>
                        <Typography variant="body1">{device.name}</Typography>
                        <Typography variant="body2">DevEUI: {device.devEUI}</Typography>
                        <Typography variant="body2">Status: {device.active ? 'Active' : 'Inactive'}</Typography>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default DeviceMap;
