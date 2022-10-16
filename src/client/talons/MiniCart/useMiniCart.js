import {useState, useEffect} from 'react';
import { useMutation } from "@apollo/react-hooks";
import { useDispatch, useSelector } from 'react-redux';
import { useAwaitQuery } from 'talons/useAwaitQuery';
import { addCartData, actions } from 'store/actions/signIn';
import { getMessage } from 'helper/errors';
import { isEmpty } from 'lodash';
import { REFRESH_CUSTOMER_TOKEN } from 'api/mutation';
import { SERVICE_OFF_KEY } from 'conf/consts'
import { separateProductTypes } from 'helper/utils';

export const useMiniCart = ( props ) => {
    const dispatch = useDispatch();
    const customerData = useSelector(state => state.signin.customerData);
    const cartData = useSelector(state => state.signin.cartData);
    // const isAuth = useSelector(state => state.signin.isAuth);
    const isActiveCart = useSelector(state => state.signin.isActiveCart);
    const { getCart,
            removeFromCart: removeQuery,
            applyCouponCode,
            removeCouponCode,
        } = props;
    const [couponCode, setCouponCode] = useState('');
    const [graphqlError, setGraphqlError] = useState('');
    const [noActiveCartError, setNoActiveCartError] = useState('');
    const [isOpenServiceoff, setIsOpenServiceOff] = useState(false);
    const [instants, setInstants] = useState([]);
    const [others, setOthers] = useState([]);
    const [virtuals, setVirtuals] = useState([]);
    const [message, setMessage] = useState("");
    const getCartData = useAwaitQuery(getCart);
    const firebaseValues = useSelector(state => state.firebase.config);
    const serviceOff = firebaseValues && firebaseValues[SERVICE_OFF_KEY]
    const [refreshCustomerToken] = useMutation(REFRESH_CUSTOMER_TOKEN);
    const [ removeFromCart, {error: removeItemError, loading: removeItemLoad } ] = useMutation(removeQuery);
    const [ applyCouponToCart, { error: applyCouponError, loading: applyCouponLoad } ] = useMutation(applyCouponCode);
    const [ removeCouponFromCart, { error: removeCouponError, loading: removeCouponLoad } ] = useMutation(removeCouponCode);

    useEffect(() => {
    	dispatch(addCartData(getCartData, isEmpty(cartData), refreshCustomerToken));
    },[]);

    useEffect(() => {
        if(cartData && cartData.items && cartData.items.length) {
          const separated = separateProductTypes(cartData.items);
          setInstants(separated && separated.instants);
          setOthers(separated && separated.others);
          setVirtuals(separated && separated.virtual);
        }
    }, [cartData, separateProductTypes]);

    useEffect(() => {
        if(applyCouponError){
            const parseError = JSON.parse(JSON.stringify(applyCouponError));
            const code = parseError.graphQLErrors[0].code;
            if(code === 31) {
                dispatch(actions.addExpired(true));
                window.scrollTo(0,0);
            }
            else {
                const message = getMessage(code);
                setGraphqlError(message);
            }
        }
    }, [applyCouponError]);

    useEffect(() => {
        if(removeItemError){
            const parseError = JSON.parse(JSON.stringify(removeItemError));
            const code = parseError.graphQLErrors[0].code;
            if(code === 31) {
                dispatch(actions.addExpired(true));
                window.scrollTo(0,0);
            }
        }
    }, [removeItemError]);

    useEffect(() => {
        if(removeCouponError){
            const parseError = JSON.parse(JSON.stringify(removeCouponError));
            const code = parseError.graphQLErrors[0].code;
            if(code === 31) {
                dispatch(actions.addExpired(true));
                window.scrollTo(0,0);
            }
        }
    }, [removeCouponError]);

    useEffect(() => {
        if(!isActiveCart) {
            setNoActiveCartError('Current customer does not have an active cart.');
        }
    }, [isActiveCart]);

    const removeItem = async (itemId) => {
        const response = await removeFromCart({variables: {
                cartToken: cartData.cartToken,
                customerToken: customerData.customerToken,
                itemId: itemId
            }
        });
        if(response && response.data) {
            dispatch(actions.addCart(response.data.removeFromCart));
        }
    };

    const applyCoupon = async () => {
            const res = await applyCouponToCart({variables: {
                cartToken: cartData.cartToken,
                customerToken: customerData.customerToken,
                coupon: couponCode
            }});
            if(res && res.data) {
                dispatch(actions.addCart(res.data.applyCouponToCart));
                setGraphqlError('');
            }
    };

    const removeCoupon = async () => {
        const res = await removeCouponFromCart({variables: {
            cartToken: cartData.cartToken,
            customerToken: customerData.customerToken
        }});
        if(res && res.data) {
            dispatch(actions.addCart(res.data.removeCouponFromCart));
            setCouponCode('');
            setGraphqlError('');
        }
    };
    const closeServiceOffModal = () => {
        setIsOpenServiceOff(false);
    }

    const openServiceOffModal = () => {
        setIsOpenServiceOff(true);
    }

    return {
        couponCode,
        setCouponCode,
        removeItem,
        removeItemLoad,
        applyCoupon,
        applyCouponLoad,
        removeCoupon,
        removeCouponLoad,
        cartData,
        customerData,
        graphqlError,
        noActiveCartError,
        isActiveCart,
        serviceOff,
        isOpenServiceoff,
        openServiceOffModal,
        closeServiceOffModal,
        instants,
        others,
        virtuals,
        message,
        setMessage
    };
};
