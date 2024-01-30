// assets
import { IconDashboard } from '@tabler/icons';
import DashboardCustomizeSharpIcon from '@mui/icons-material/DashboardCustomizeSharp';
// constant
const icons = { DashboardCustomizeSharpIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardCustomizeSharpIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
