import React, {useEffect, useState} from "react"
import classes from "./zones.css"
import Arrow from "icons/Arrow";
import Typo from "components/UI/Typo";
import useZones from "talons/useZones";
import Modal from "components/Modal";
import Button from "components/Button";
import useTranslation from "talons/useTranslation";

const Zones = () => {
	
	const {allZones, userZone, updateCartZone, autoZone} = useZones()
	const [zone, setZone] = useState(null)
	const [otherZone, setOtherZone] = useState(null)
	const [isModalOpen, setModalIsOpen] = useState(false);
	const __ = useTranslation();
	
	useEffect(() => {
		if (userZone) {
			setZone(userZone[0])
		}
	}, [userZone])
	
	const handleClick = (item) => {
		if (item.is_other) {
			setOtherZone(item)
			setModalIsOpen(true)
		} else {
			localStorage.removeItem('is_other');
			updateZone(item)
		}
	}
	
	const updateZone = (item) => {
		setZone(item);
		localStorage.setItem('zone_code', item.zone_code)
		localStorage.setItem('is_zone_changed', '1');
		if (localStorage.getItem("cartToken")) {
			updateCartZone().then(() => {
				window.location.reload()
			}).catch((err) => {
				console.log(err);
				window.location.reload()
			})
		} else {
			window.location.reload()
		}
	}
	
	return (zone ?
		<div className={classes.menuSelect}>
			<div className={classes.menuSelectHeader}>
				<Typo font={"bold"} className={classes.menuSelectHeaderTitle}>
					{zone.zone_friendly_name}
				</Typo>
				<span className={classes.headerIcon}>
            {" "}
					<Arrow/>
        </span>
				{autoZone &&
					<div className={classes.alertMessage}>
						<span className={classes.zoneArrow}/>
						<span className={classes.text}>{__('automatic_zone_detection_message')}</span>
					</div>
				}
			</div>
			<div className={classes.menuSelectListWrapper}>
				<div className={classes.menuSelectList}>
					<div className={classes.menuSelectItem}>
						{allZones.map((item, key) => {
							return (
								<div key={key} className={classes.storeCats} onClick={() => {
									handleClick(item)
								}}>
									<span className={classes.title}>
										{item.zone_friendly_name}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
			<Modal
				isShown={isModalOpen}
				onClose={() => {
					setModalIsOpen(!isModalOpen);
				}}
				className={classes.dialog}
			>
				<div>
					<div className={classes.messageBlock}>
						<Typo as="p" variant="p" font="regular">{__('other_location_info_message')}</Typo>
					</div>
					<Button
						label={__("OK")}
						onClick={() => {
							localStorage.setItem('is_other', '1');
							updateZone(otherZone)
							setModalIsOpen(!isModalOpen);
						}}
						classes={{button_primary: classes.buttonComponent}}
					/>
				</div>
			</Modal>
		</div> : ''
	);
};
export default Zones
