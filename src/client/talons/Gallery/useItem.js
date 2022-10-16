import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from "@apollo/react-hooks";
import { actions } from 'store/actions/signIn';
export const useItem = (props) => {
    const { item, addToCartMutation } = props
    const customerData = useSelector(state => state.signin.customerData);
    const cartToken = useSelector(state => state.signin.cartToken);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useDispatch()
    const [addToCart] = useMutation(addToCartMutation);
const handleAddToCart = useCallback(async ({quantity = 1}) => { 
        if(!cartToken) {
            setIsSubmitting(true)
            const response = await addToCart({
                variables: {
                    item: {
                        sku: item.objectID,
                        qty: quantity
                    },
                    customerToken: customerData.customerToken ? customerData.customerToken : '',
                    cartToken: ''
                }
            });
            dispatch(actions.addCartToken(response.data.addToCart.cartToken));
            dispatch(actions.addCart(response.data.addToCart));
            setIsSubmitting(false)
        }
        else {
            setIsSubmitting(true)
            const response = await addToCart({
              variables: {
                item: {
                  sku: item.objectID,
                  qty: quantity,
                },
                customerToken: customerData.customerToken
                  ? customerData.customerToken
                  : "",
                cartToken: cartToken,
              },
            });
            dispatch(actions.addCart(response.data.addToCart));
            setIsSubmitting(false)
        }
    })

    return {
        handleAddToCart,
        isSubmitting
    }
}
