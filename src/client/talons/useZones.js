import {useCallback, useEffect, useState} from "react";
import getZipCode from "../../helper/getZipCode";
import {
	UPDATE_CART_ZONE_INFO
} from "api/mutation";
import axios from "axios";
import {useMutation} from "@apollo/react-hooks";
import getZoneCode from "../../helper/getZoneCode";
import {useAwaitQuery} from "talons/useAwaitQuery";
import { GET_CART } from "api/query";
import useTranslation from "talons/useTranslation";

const useZones = () => {
	const [loading, setLoading] = useState(true);
	const [autoZone, setAutoZone] = useState(false);
	const [userZone, setUserZone] = useState(null);
	const [allZones, setAllZones] = useState([]);
	const [updateCartZoneInfo] = useMutation(UPDATE_CART_ZONE_INFO);
	const getCartData = useAwaitQuery(GET_CART);
	const __ = useTranslation();
	
	useEffect(() => {
		if (localStorage.getItem("cartToken") ||
			localStorage.getItem("customerToken")
		) {
			const cartToken = localStorage.getItem("cartToken")
			const customerToken = localStorage.getItem("customerToken")
			getCartData({
				variables: {
					cartToken: cartToken ? cartToken : "",
					customerToken: customerToken ? customerToken : "",
				},
				fetchPolicy: "no-cache",
			}).then((res) => {
				getZones(res.data.getCart.zoneCode)
			}).catch((err) => {
				getZones()
				console.log(err);
			})
		} else {
			getZones()
		}
	}, [])
	
	const updateCartZone = async () => {
		const cartToken = localStorage.getItem("cartToken")
		const customerToken = localStorage.getItem("customerToken")
		const response = await updateCartZoneInfo({
			variables: {
				cartToken: cartToken ? cartToken : "",
				customerToken: customerToken ? customerToken : "",
				zoneCode: getZoneCode(),
			}
		});
		if(response && response.data) {
			console.log(response);
		}
	}
	
	const getUserZone = async (zipCode) => {
		return axios.get(`/rest/V1/price-zones/${process.env.ZONE_API_KEY}/zone/${zipCode}`, {data: {}}).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err);
		})
	}
	
	const getAllZones = useCallback( async () => {
		return axios.get(`/rest/V1/price-zones/${process.env.ZONE_API_KEY}/all-zones`, {
			data: {}
		}).then((res) => {
			return res.data;
		}).catch((err) => {
			console.log(err);
		})
	}, [allZones])
	
	const getZones = useCallback(async (cartZone) => {
		
		setLoading(true)
		let zone;
		let allZones = await getAllZones();
		const defaultZone = allZones.find((item) => {
			return item.zone_is_default == 1;
		});
		const otherZone = {
			status: defaultZone.status,
			zone_code: defaultZone.zone_code,
			zone_friendly_name: __('other_locations_title'),
			zone_id: defaultZone.zone_id,
			is_other: true,
			zone_is_default: "0",
			zone_value: defaultZone.zone_value
		}
		
		allZones = [...allZones, otherZone];
		
		if (localStorage.getItem('is_other')) {
			zone = [otherZone];
		} else if (cartZone && !isNaN(cartZone)) {
			zone = allZones.filter((item) => {
				return item.zone_code == cartZone;
			});
			localStorage.setItem('zone_code', zone[0].zone_code)
		} else {
			const userZipcode = await getZipCode();
			if (userZipcode) {
				setAutoZone(true)
				zone = await getUserZone(userZipcode);
			} else {
				setAutoZone(true)
				zone = allZones.filter((item) => {
					return item.zone_is_default == 1;
				});
			}
			if (zone && zone.length > 0) {
				if (!localStorage.getItem('is_zone_changed')) {
					localStorage.setItem('zone_code', zone[0].zone_code)
				} else {
					setAutoZone(false)
					zone = allZones.filter((item) => {
						return item.zone_code == getZoneCode();
					});
				}
			}
		}

		setUserZone(zone)
		setAllZones(allZones ? allZones : [])
		setLoading(false)
	}, []);
	
	return {
		loading,
		userZone,
		autoZone,
		updateCartZone,
		allZones
	}
}

export default useZones;