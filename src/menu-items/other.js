// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import NetworkPingOutlinedIcon from '@mui/icons-material/NetworkPingOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SellSharpIcon from '@mui/icons-material/SellSharp';

// constant
const icons = {
    IconBrandChrome,
    SellSharpIcon,
    IconHelp,
    PollOutlinedIcon,
    DownloadSharpIcon,
    NetworkPingOutlinedIcon,
    CurrencyExchangeOutlinedIcon
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'other',
    title: 'Plugins',
    type: 'group',
    children: [
        {
            id: 'Data Download',
            title: 'Data Download',
            type: 'item',
            url: '/other/datadnload',
            icon: icons.DownloadSharpIcon,
            breadcrumbs: false
        },
        {
            id: 'Downlink',
            title: 'Downlink',
            type: 'item',
            url: '/other/downlink',
            icon: icons.NetworkPingOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'Subscription',
            title: 'Subscription',
            type: 'item',
            url: '/other/subscription',
            icon: icons.CurrencyExchangeOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'BrixTap',
            title: 'Brix & Tap',
            type: 'item',
            url: '/other/brixtap',
            icon: icons.SellSharpIcon,
            breadcrumbs: false
        }
    ]
};

export default other;
