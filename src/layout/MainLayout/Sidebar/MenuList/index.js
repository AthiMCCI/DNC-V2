// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const optmenuItem = menuItem.items;

    // For menu configuration based on backend input
    const cfgmenu = useSelector((state) => state.customization.myConfig);
    const myuobj = useSelector((state) => state.customization.myUser);
    console.log('VSP User Details: ', myuobj);
    console.log('VSP CFG menu Details: ', cfgmenu);

    let newmenuitem = [];
    if (myuobj.level != '3' && myuobj.level != '4' && optmenuItem.length >= 4) {
        for (let i = 0; i < optmenuItem.length; i++) {
            if (optmenuItem[i]['id'] !== 'dashboard' && optmenuItem[i]['id'] !== 'pages' && optmenuItem[i]['id'] !== 'configuration') {
                newmenuitem.push(optmenuItem[i]);
            }
        }
    } else {
        for (let i = 0; i < optmenuItem.length; i++) {
            newmenuitem.push(optmenuItem[i]);
        }
    }

    let adminidx = null;
    let otheridx = null;

    for (let i = 0; i < newmenuitem.length; i++) {
        if (newmenuitem[i]['id'] === 'pages') {
            adminidx = i;
        } else if (newmenuitem[i]['id'] === 'other') {
            otheridx = i;
        }
    }

    if (adminidx !== null) {
        // Configuring Administration Menu Names
        let admindict = newmenuitem[adminidx].children[0];

        let featuresKey = Object.keys(cfgmenu['features']);
        if (featuresKey.includes('Gateway')) {
            if (cfgmenu['features']['Gateway'] == false) {
                for (let i = 0; i < admindict['children'].length; i++) {
                    if (admindict['children'][i]['id'] === 'Gateway') {
                        admindict['children'].splice(i, 1);
                    }
                }
            }
        }

        // console.log("MCCI Admin Dict: ", admindict)

        let aliasKeys = Object.keys(cfgmenu['alias']);

        if (aliasKeys.includes(admindict['id'])) {
            admindict['title'] = cfgmenu['alias'][admindict['id']];
        }

        for (let i = 0; i < admindict['children'].length; i++) {
            if (aliasKeys.includes(admindict['children'][i]['id'])) {
                admindict['children'][i]['title'] = cfgmenu['alias'][admindict['children'][i]['id']];
            }
        }
    }

    if (otheridx !== null) {
        // Organizing Other (Plugins) Menu

        let otherdict = newmenuitem[otheridx].children;
        let pluginKeys = Object.keys(cfgmenu['plugins']);

        let newplugins = [];

        for (let i = 0; i < otherdict.length; i++) {
            if (pluginKeys.includes(otherdict[i]['id']) && cfgmenu['plugins'][otherdict[i]['id']] == true) {
                newplugins.push(otherdict[i]);
            }
        }

        newmenuitem[otheridx].children = newplugins;
    }

    const navItems = newmenuitem.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
            // return (
            //     <Typography key={item.id} variant="h6" color="error" align="center">
            //         Menu Items Error
            //     </Typography>
            // );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
