// DataProvider.jsx
import React, { createContext, useReducer } from 'react';
import { type } from '../Utility/action.type';
import { initialState, reducer } from '../Utility/reducer';

export const DataContext = createContext();

// Provider component
    export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    console.log("DataProvider state:", state);
    
    return (
        <DataContext.Provider value={[state, dispatch]}>
            {children}
        </DataContext.Provider>
    );
};
