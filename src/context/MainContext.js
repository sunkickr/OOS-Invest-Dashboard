import React, { useReducer, createContext } from 'react';
import MainReducer from './MainReducer';
import axios from 'axios';

const initialState = { 
    address: "",
      form:{
          purchaseprice: 100000,
          rentalincome: 1200,
          downpayment: 20000,
          interestrate: 4,
          loanterm: 30
      },
      expenses:{},
      financials:{}
};

// Create context
export const MainContext = createContext(initialState);
// Provider component
export const MainContextProvider = props => {
    const [state, dispatch] = useReducer(MainReducer, initialState);

    // Actions
    function calculate(form1) {
        var pp = 0;
        var ri = 0;
        var la = 0;
        var ir = 0;
        var lt = 0;
        var mo = 0;
        var dp = form1.downpayment
        if (form1.purchaseprice){
            pp = form1.purchaseprice;
        }else{

        }
        if (form1.rentalincome){
            ri = form1.rentalincome;
        }
        if (form1.downpayment && form1.downpayment<form1.purchaseprice){
            la = pp - form1.downpayment;
        }else {
            la = pp;
        }
        ir = form1.interestrate/100/12;
        lt = form1.loanterm*12;
        mo = la*((ir*(1+ir)**lt)/(((1+ir)**lt)-1));
        console.log(form1.interestrate)
        if (isNaN(form1.interestrate) || isNaN(form1.loanterm)){
            mo = 0
            dp = 0
        }

        if (form1.loanterm === 0 || form1.interestrate === 0){
            mo = 0
            dp = 0
        } ;
        const expenses = {
                mortage: mo,
                taxes: ri*.15,
                insurance: ri*.03,
                capex: ri*.05,
                vacancy: ri*.03,
                repairs: ri*.04,
                propertymanagement:ri*.1,
        };
        const et = Object
            .values(expenses)
            .reduce((acc, item) => (acc += item), 0);

        var dproi = ((ri-et)*12)/(pp-la)*100

        if (isNaN(form1.interestrate) || isNaN(form1.loanterm)){
            dproi = ((ri-et)*12)/(pp)*100
        }

        if (form1.loanterm === 0 || form1.interestrate === 0){
            dproi = ((ri-et)*12)/(pp)*100
        } ;

        const financials = {
            expensetotal : et,
            mcashflow: ri - et,
            ycashflow: 12*(ri-et),
            dproi: dproi,
            hvroi: ((ri-et)*12)/(pp)*100
        };
        const newForm = {
            purchaseprice: pp,
            rentalincome: ri,
            downpayment: dp,
            interestrate: ir,
            loanterm: lt
        }

        dispatch({
            type: 'CALCULATE',
            payload:{
                newForm,
                expenses,
                financials,
            }
        });
    }

    function changeAddress(address) {
        dispatch({
            type: 'CHANGEADDRESS',
            payload:{
                address
            }
        });
    }

    function load() {
        return
    }

    function save() {
        return
    }

    return (
        <MainContext.Provider value={{
            changeAddress,
            calculate,
            load,
            save,
            state
        }}>
            {props.children}
        </MainContext.Provider>
    )
}

