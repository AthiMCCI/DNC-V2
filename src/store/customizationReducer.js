// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    defaultId: 'default',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    myUser: {},
    themeMode: 'light',
    myToken: null,
    myConfig: {}
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    console.log('Action:', action);
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            // console.log("*#*#*# Set Font Family *#*#*#", action.fontFamily)
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SET_MY_TOKEN:
            return {
                ...state,
                myToken: action.myToken
            };
        case actionTypes.SET_MY_USER:
            return {
                ...state,
                myUser: action.myUser
            };
        case actionTypes.SET_MY_CONFIG:
            return {
                ...state,
                myConfig: action.myConfig
            };
        case actionTypes.SET_THEME_MODE: // <-- Corrected the action type
            return {
                ...state,
                themeMode: action.themeMode
            };

        default:
            return state;
    }
};

export default customizationReducer;
