// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import InstallDesktopOutlinedIcon from '@mui/icons-material/InstallDesktopOutlined';
import AddHomeWorkSharpIcon from '@mui/icons-material/AddHomeWorkSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    AirlineStopsOutlinedIcon,
    ManageAccountsOutlinedIcon,
    ManageHistoryOutlinedIcon,
    InstallDesktopOutlinedIcon,
    PeopleAltSharpIcon,
    AddHomeWorkSharpIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Organization',
    type: 'group',
    children: [
        {
            id: 'org-Report',
            title: 'Home',
            type: 'item',
            url: '/org/home',
            icon: icons.AddHomeWorkSharpIcon,
            breadcrumbs: false
        },
        {
            id: 'org-Users',
            title: 'User',
            type: 'item',
            url: '/org/users',
            icon: icons.PeopleAltSharpIcon,
            breadcrumbs: false
        },
        {
            id: 'org-Spots',
            title: 'Spot',
            type: 'item',
            url: '/org/spots',
            icon: icons.AirlineStopsOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default utilities;
