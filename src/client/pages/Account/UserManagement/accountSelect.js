import React, { useState, useRef } from "react";
import defaultClasses from "./accountSelect.css";
import { mergeClasses } from "helper/mergeClasses";
import useOnClickOutside from 'talons/useOnClickOutside';
import Typo from 'ui/Typo';
import Arrow from 'icons/Arrow';
import Help from "icons/Help";

const AccountSelect = ({
	value,
	onChange,
	onBlur,
	label,
	labelKey,
	classes: cls,
	items,
	setIsOpenRoleInfo,
	inInvite
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const classes = mergeClasses(defaultClasses, cls);
	const rootRef = useRef();
	useOnClickOutside(rootRef, () => {if(isOpen) setIsOpen(!isOpen)});

	return (
		<div ref={rootRef} className={classes.root} onClick = {() => setIsOpen(!isOpen)} onBlur={onBlur}>
			<div className={classes.mainDiv}>
				<Typo as="p" variant="p" font="light" className={classes.selected}>{value ? value.name : label}</Typo>
				<div className={`${classes.arrowIcon} ${isOpen ? classes.arrowOpen : ""}`}>
					<Arrow/>
				</div>
				{inInvite ? 
					<span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpenRoleInfo(true)}} className={classes.info}>
						<Help className={classes.infoIcon}/>
					</span> 
				: null}
			</div>
			<div className={`${classes.options} ${isOpen ? classes.optionsOpen : classes.optionsHidden}`}>
				{items.map((item, index) => (
					<div className={classes.option} key={index} onClick={() => {if(item.value !== value.value) { onChange(item) }}}>
						<Typo as="p" variant="p" font="light">{item[labelKey]}</Typo>
						{value.value == item.value ? <img src="images/check.png"/> : ""}
					</div>
				))}
			</div>
		</div>
	);
};

export default AccountSelect;