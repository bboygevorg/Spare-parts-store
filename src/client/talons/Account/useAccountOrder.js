import { useState, useCallback, useMemo } from 'react'
import { getArrivalDate } from 'helper/utils';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';
import { saveAs } from 'file-saver';

export const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]
export const useAccountOrder = (props) => {
    const { order } = props;
    const { createdAt, items, status, totals, incrementId, payment, shippingAddress, shipping, id, billingAddress, serviceOrderInformation } = order;
    const [ isOpen, setIsOpen ] = useState(false);
    const [ fileLoader, setFileLoader ] = useState(false);
		const customerToken = typeof window !== "undefined" ? localStorage.getItem("customerToken") : "";

    const getExpires = (date) => {
        const newDate = new Date(date.replace(/-/g, "/"));
        const day = newDate.getDate();
        const monthIndex = newDate.getMonth();
        const month = months[monthIndex];
        return `${day} ${month}`;
    }

    const handleOpen = useCallback(() => {
        setIsOpen(!isOpen)
    }, [isOpen, setIsOpen])

	
		const getFile = useCallback((url, name) => {
			setFileLoader(true)
			axios({
				'url':url,
				'method':'GET',
				'responseType': 'blob',
				'headers': {
					'Authorization': 'Bearer '+customerToken,
				}}).then(res => {
				setFileLoader(false)
				if(res) {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					saveAs(url, name)
				}
			}).catch(err => {
				setFileLoader(false)
				console.log('err', err);
			})
		}, [])
    
    const timeFormat = (first) => {
        if(first) {
            const date = new Date((typeof date === "string" ? new Date(first.replace(/-/g, "/")) : first.replace(/-/g, "/")));
            const deliveryDate = getArrivalDate(date);
            if(typeof date !== "string" && first.split(" ").length && first.split(" ")[1] === "00:00:00")  {
                return deliveryDate;
            }
            const time1 = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const sumRange = date.setMinutes(date.getMinutes() + 30); // timestamp
            const time2 = new Date(sumRange).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return `${deliveryDate}, ${time1} - ${time2}`;
        }
        else {
            return ''
        }
    }

    const attachments = useMemo(() => {
        if(!isEmpty(serviceOrderInformation)) {
            let backendUrl = process.env.BACKEND_URL.split("/");
            backendUrl.pop();
            backendUrl = backendUrl.join("/")
            return serviceOrderInformation.attachments.map(file => {
                return {
                    ...file,
                    url: `${backendUrl}/gd-file-download/${id}/${file.id}`
                }
            });
        }
    }, [serviceOrderInformation]);

    return {
        isOpen,
        handleOpen,
        createdAt: getExpires(createdAt),
        totals: totals|| {},
        items: items || [],
        status,
        orderNumber: incrementId,
        payment,
        shippingAddress: shippingAddress || {},
        shipping,
				getFile,
				fileLoader,
        timeFormat,
        billingAddress,
        attachments,
        serviceOrder: serviceOrderInformation
    }
}