import { handleActions } from 'redux-actions'
import { checkoutActions } from '../actions/checkout'

const initialState = {
    step: "delType",
    shipmentType: typeof window !== 'undefined' && localStorage.getItem('shipmentType') || "Pickup truck",
    deliveryAddressId: typeof window !== 'undefined' && Number(localStorage.getItem('deliveryAddressId')),
    billingAddressId: typeof window !== 'undefined' && Number(localStorage.getItem('billingAddressId')),
}

const reducerMap = {
    [checkoutActions.setStep]: (state, {payload}) => {
        return {...state, step: payload}
    },
    [checkoutActions.setShipmentType]: (state, {payload}) => {
        localStorage.setItem('shipmentType', payload)
        return {...state, shipmentType: payload}
    },
    [checkoutActions.setDeliveryAddressId]: (state, {payload}) => {
        localStorage.setItem('deliveryAddressId', payload)
        return {...state, deliveryAddressId: payload}
    },
    [checkoutActions.setBillingAddressId]: (state, {payload}) => {
        localStorage.setItem('billingAddressId', payload)
        return {...state, billingAddressId: payload}
    }   
}

export default handleActions(reducerMap, initialState)