import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Typography, Tooltip } from '@mui/material';
import moment from 'moment-timezone';

const Timerunner = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
    const [timezones, setTimezones] = useState([]);
    const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
    const [timezoneAbbreviation, setTimezoneAbbreviation] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Fetch all time zone names using moment-timezone
        const allTimezones = moment.tz.names();

        setTimezones(allTimezones);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const abbreviation = moment.tz.zone(selectedTimezone)?.abbr(currentDateTime);
        setTimezoneAbbreviation(abbreviation || '');
    }, [selectedTimezone, currentDateTime]);

    const formatTime = (date) => {
        return moment.tz(date, selectedTimezone).format('HH:mm:ss');
    };

    const formatDate = (date) => {
        return moment.tz(date, selectedTimezone).format('MMMM D, YYYY');
    };

    const handleTimezoneChange = (event) => {
        setSelectedTimezone(event.target.value);
        setShowTimezoneSelect(false); // Close the timezone selection box
    };

    const handleDateTimeClick = () => {
        setShowTimezoneSelect(!showTimezoneSelect);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {showTimezoneSelect && (
                <Select size="small" value={selectedTimezone} onChange={handleTimezoneChange} style={{ marginRight: '10px' }}>
                    {timezones.map((timezone) => (
                        <MenuItem key={timezone} value={timezone}>
                            {timezone}
                        </MenuItem>
                    ))}
                </Select>
            )}

            <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                role="button"
                tabIndex="0"
                onClick={handleDateTimeClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleDateTimeClick();
                    }
                }}
            >
                <div style={{ marginRight: '10px' }}>
                    <Tooltip title={`Change Timezone (Click to select)`} arrow onClick={handleDateTimeClick} interactive placement="bottom">
                        <Typography>
                            {formatTime(currentDateTime)} ({timezoneAbbreviation})
                        </Typography>
                    </Tooltip>
                    <Tooltip title={`Change Timezone (Click to select)`} arrow onClick={handleDateTimeClick} interactive placement="bottom">
                        <Typography>{formatDate(currentDateTime)}</Typography>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default Timerunner;
