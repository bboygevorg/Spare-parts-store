import { useCallback, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../store/actions/user';
import { getMessage } from 'helper/errors';

export const useProfile = (props) => {
    const { updateCustomer } = props
    const [ runUpdateCustomer ] = useMutation(updateCustomer);
    const [ message, setMessage ] = useState('');
    const [errMessage, setErrMessage] = useState("");
    const customerData = useSelector(state => state.signin);
    const Dispatch = useDispatch()
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const handleSubmit = useCallback(async ({ 
        firstname, 
        lastname, 
        email, 
        hvacLicense,
        epaCertification,
        resellerId,
        companyName,
        customerToken,
        contractorLicence
    }) => {
        setIsSubmitting(true)
        setMessage('')
        try {
            const updateResponse = await runUpdateCustomer({
                variables: {
                    customer: {
                        firstname,
                        lastname,
                        email,
                        hvacLicense,
                        epaCertification,
                        resellerId,
                        companyName,
                        contractorLicence
                    },
                    customerToken
                }
            })
            setIsSubmitting(false)
            if(updateResponse && updateResponse.data) {
                Dispatch(userActions.addCustomerData(updateResponse.data.updateCustomer))
                setMessage("Successfully updated")
            }
        } catch (err) {
            const parseError = JSON.parse(JSON.stringify(err));
            const code = parseError && parseError.graphQLErrors[0].code;
            const message = getMessage(code);
            setErrMessage(message);
        }
    })
    return {
        handleSubmit,
        message,
        errMessage,
        isSubmitting,
        customerData
    }
}

