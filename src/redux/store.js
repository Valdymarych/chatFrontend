import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import messagesReducer from "./reducers/messagesReducer";
import {thunk as thunkMiddleware} from 'redux-thunk'
import userReducer from "./reducers/userReducer";
import groupsReducer from "./reducers/groupsReducer";
let combinedReducers = combineReducers( 
    {
        messages : messagesReducer,
        user : userReducer,
        groups: groupsReducer
    }
);

let store = createStore(combinedReducers,applyMiddleware(thunkMiddleware))
window.store=store; 
export default store