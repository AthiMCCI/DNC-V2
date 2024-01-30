import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const OrgSpots = Loadable(lazy(() => import('views/spots/Spots')));
const OrgDevices = Loadable(lazy(() => import('views/utilities/DeviceReport')));
const OrgHome = Loadable(lazy(() => import('views/utilities/OrgHome')));
const OrgUser = Loadable(lazy(() => import('views/utilities/orguser/orguser')));

// configuration routing
const ConfigUser = Loadable(lazy(() => import('views/configuration/ConfigUser/user')));
const ConfigFeat = Loadable(lazy(() => import('views/configuration/ConfigDnc/configdnc')));
const ConfigOrg = Loadable(lazy(() => import('views/configuration/ConfigOrg/organization')));
const ConfigDev = Loadable(lazy(() => import('views/configuration/device/device')));
const ConfigStock = Loadable(lazy(() => import('views/configuration/ConfigStock/stock')));
const ConfigSpot = Loadable(lazy(() => import('views/configuration/spot')));
const ConfigGw = Loadable(lazy(() => import('views/configuration/ConfigGw/gateway')));
//userconfiguration Add field
const AddUserfields = Loadable(lazy(() => import('views/configuration/ConfigUser/adduserfields')));

// sample page routing
const DataDnLoad = Loadable(lazy(() => import('views/others/download/download')));
const DownLink = Loadable(lazy(() => import('views/others/downlink/downlink')));
const Subscription = Loadable(lazy(() => import('views/others/subscription/subscription')));
const BrixTap = Loadable(lazy(() => import('views/others/brixtap/brixtap')));

// ==============================|| MAIN ROUTING ||============================== //

const myplugins = ['subscrip', 'dnload', 'dnlink', 'brixtap'];
//const myplugins = ['subscrip', 'dnlink'];

const splroutes = {
    subscrip: { path: 'other', children: [{ path: 'subscription', element: <Subscription /> }] },
    dnload: { path: 'other', children: [{ path: 'datadnload', element: <DataDnLoad /> }] },
    dnlink: { path: 'other', children: [{ path: 'downlink', element: <DownLink /> }] },
    brixtap: { path: 'other', children: [{ path: 'brixtap', element: <BrixTap /> }] }
};

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: []
};

addOrgRoutes();
addConfigRoutes();
addSelectiveRoutes();

function addOrgRoutes() {
    MainRoutes.children.push({ path: '/', element: <DashboardDefault /> });
    MainRoutes.children.push({ path: 'dashboard', children: [{ path: 'default', element: <DashboardDefault /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'home', element: <OrgHome /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'users', element: <OrgUser /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'spots', element: <OrgSpots /> }] });
}

function addConfigRoutes() {
    MainRoutes.children.push({ path: 'config', children: [{ path: 'user', element: <ConfigUser /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'features', element: <ConfigFeat /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'org', element: <ConfigOrg /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'device', element: <ConfigDev /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'stock', element: <ConfigStock /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'spot', element: <ConfigSpot /> }] });
    MainRoutes.children.push({ path: 'config', children: [{ path: 'gateway', element: <ConfigGw /> }] });
    MainRoutes.children.push({ path: 'config/user', children: [{ path: 'adduf', element: <AddUserfields /> }] });
}

function addSelectiveRoutes() {
    for (let i = 0; i < myplugins.length; i++) {
        MainRoutes.children.push(splroutes[myplugins[i]]);
    }
}

export default MainRoutes;
