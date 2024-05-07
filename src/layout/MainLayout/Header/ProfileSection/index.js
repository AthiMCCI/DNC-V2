import { useState, useRef, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add this line to import PropTypes

import { useSelector } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Switch,
    Typography
} from '@mui/material';
// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';
// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = ({ firstName }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    async function logout(e) {
        console.log('On Click Logout');
        // sessionStorage.removeItem('myToken');
        // setToken(null);
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleNoClick = () => {
        navigate('/profile');
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            {selectedPhoto ? (
                <button
                    type="button"
                    onClick={handleToggle}
                    style={{
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src={URL.createObjectURL(selectedPhoto)}
                        alt="Profile"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                </button>
            ) : (
                <Tooltip title="Account Settings" arrow>
                    <Chip
                        sx={{
                            height: '48px',
                            alignItems: 'center',
                            borderRadius: '27px',
                            transition: 'all .2s ease-in-out',
                            borderColor: theme.palette.primary.light,
                            backgroundColor: theme.palette.primary.light,
                            '&[aria-controls="menu-list-grow"], &:hover': {
                                borderColor: theme.palette.primary.main,
                                background: `${theme.palette.primary.main}!important`,
                                color: theme.palette.primary.light,
                                '& svg': {
                                    stroke: theme.palette.primary.light
                                }
                            },
                            '& .MuiChip-label': {
                                lineHeight: 0
                            }
                        }}
                        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                        variant="outlined"
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="primary"
                    />
                </Tooltip>
            )}
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography style={{ color: 'gray' }} variant="h5">
                                                    WELCOME{' '}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    {/* <Divider /> */}
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 0 }}>
                                            {/* <Divider /> */}
                                            <Card
                                                sx={{
                                                    bgcolor: theme.palette.primary.light,
                                                    my: 3
                                                }}
                                            ></Card>
                                            <Divider />
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '1%',
                                                    marginTop: -8,
                                                    minWidth: 220,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 0}
                                                    onClick={(event) => handleListItemClick(event, 0, '/profile')}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    strict
                                                    to="./"
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.7} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};
ProfileSection.propTypes = {
    firstName: PropTypes.string
};

export default ProfileSection;
