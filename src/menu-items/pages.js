// assets
import { IconKey } from '@tabler/icons';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import AdminPanelSettingsSharpIcon from '@mui/icons-material/AdminPanelSettingsSharp';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import RouterSharpIcon from '@mui/icons-material/RouterSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import SensorsSharpIcon from '@mui/icons-material/SensorsSharp';

// constant
const icons = {
    IconKey,
    Diversity3OutlinedIcon,
    GroupSharpIcon,
    PinDropOutlinedIcon,
    Inventory2OutlinedIcon,
    Inventory2SharpIcon,
    LaptopChromebookOutlinedIcon,
    SensorsSharpIcon,
    RouterSharpIcon,
    AdminPanelSettingsSharpIcon,
    StorageSharpIcon,
    SettingsInputAntennaOutlinedIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    // title: 'Adminstration',
    type: 'group',
    children: [
        {
            id: 'Administration',
            title: 'Adminstration',
            type: 'collapse',
            icon: icons.AdminPanelSettingsSharpIcon,

            children: [
                {
                    // id: 'login3',
                    id: 'Organization',
                    title: 'Organization',
                    type: 'item',
                    url: '/orgs',
                    icon: icons.Diversity3OutlinedIcon
                },
                {
                    // id: 'user',
                    id: 'User',
                    title: 'User',
                    type: 'item',
                    url: '/users',
                    icon: icons.GroupSharpIcon
                },
                {
                    // id: 'stock',
                    id: 'Stock',
                    title: 'Stock',
                    type: 'item',
                    url: '/stocks',
                    icon: icons.Inventory2SharpIcon
                },
                {
                    // id: 'device',
                    id: 'Device Management',
                    title: 'Device Management',
                    type: 'item',
                    url: '/mdev',
                    icon: icons.SensorsSharpIcon
                },
                {
                    // id: 'data sources',
                    id: 'Data Source',
                    title: 'Data Source',
                    type: 'item',
                    url: '/datasources',
                    icon: icons.StorageSharpIcon
                },
                {
                    // id: 'gateway',
                    id: 'Gateway',
                    title: 'Gateway',
                    type: 'item',
                    url: '/gateways',
                    icon: icons.RouterSharpIcon
                }
            ]
        }
    ]
};

export default pages;
