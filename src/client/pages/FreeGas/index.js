import React, {useState} from "react";
import Input from "components/Input/input";
import Button from "components/Button";
import Modal from "components/Modal";
import AppWrapper from "components/UI/AppWrapper";
import classes from "./style.css";
import Typo from "components/UI/Typo";
import {useFormik} from "formik";
import useTranslation from "talons/useTranslation";
import {errorMessage} from "../../conf/consts";
import {firstUpperCase, getUrlParts} from "../../../helper/utils";
import axios from "axios";
import Attention from 'icons/attention.svg';
import Success from 'icons/success.svg';
import {useHistory} from "react-router";
import SearchLocationInput from "components/JobAddresses/input";

const validate = (values) => {
	const errors = {};
	const required = ['license', 'full_name', 'tel', 'full_name', 'email']
	Object.keys(values).forEach((key) => {
		if (required.includes(key)) {
			if (!values[key]) {
				errors[key] = errorMessage(
					`${firstUpperCase(key)}`,
					"is a required value."
				);
			}
		}
	});
	
	if (
		values.email &&
		!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
	) {
		errors.email = "Invalid email";
	}
	
	if (
		values.tel.match(/[a-z]/i)
	) {
		errors.tel = "Invalid phone number";
	}
	return errors;
};

const FreeGas = () => {
	const formik = useFormik({
		initialValues: {
			email: "",
			license: "",
			full_name: "",
			address: "",
			tel: "",
		},
		validate,
		onSubmit: (values) => {
			handleSubmit(values)
		},
	});
	const history = useHistory();
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [message, setMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	
	const handleSubmit = (value) => {
		const newValue = {
			address: document.getElementById('address').value,
			email: value.email,
			full_name: value.full_name,
			license: value.license,
			tel: value.tel,
		}
		setIsSubmitting(true);
		axios.post(`${getUrlParts(process.env.BC_PROMOTION_FORM_URL).path}`, {...newValue}, {
			'headers': {
				'x-api-key': process.env.BC_PROMOTION_FORM_API_KEY
			}
		}).then(() => {
			setIsSubmitting(false)
			setMessage('free_gas_confirmation_message')
			setIsOpen(true)
		}).catch((error) => {
			setErrorMessage('free_gas_params_not_valid')
			try {
				switch (error.response.data.message) {
					case 'User already registered':
						setErrorMessage('free_gas_form_error_user_already_exist');
						break
					case 'License already used':
						setErrorMessage('free_gas_form_error_license_already_used')
				}
			} catch (e) {
				console.log(e);
			}
			
			setIsSubmitting(false)
			setIsOpen(true)
		})
	}
	
	const __ = useTranslation();
	return <AppWrapper>
		<div className={classes.root}>
			<form onSubmit={formik.handleSubmit}>
				<Typo as="h2" variant="h2" font="condensed" className={classes.title}>
					{__("free_gas_form_title")}
					<Typo as="p" variant="pxs" font="regular" className={classes.formHeader}>
						{__('free_gas_form_header')}
					</Typo>
				</Typo>
				
				<div
					className={
						formik.touched.email && formik.errors.email
							? classes.inputErrorDiv
							: classes.inputDiv
					}
				>
					<Input
						id="email"
						name="email"
						type="text"
						placeholder={__("free_gas_form_email")}
						classes={{
							input:
								formik.touched.email && formik.errors.email
									? classes.errorInputComponent
									: classes.inputComponent,
						}}
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.email && formik.errors.email && (
						<div className={classes.error}>
							<Typo as="p" variant="pxs" color="error" font="regular">
								{__(formik.errors.email)}
							</Typo>
							<img className={classes.errorIcon} src="/icons/error.svg"/>
						</div>
					)}
				</div>
				<div
					className={
						formik.touched.license && formik.errors.license
							? classes.inputErrorDiv
							: classes.inputDiv
					}
				>
					<Input
						id="license"
						name="license"
						type="number"
						placeholder={__("free_gas_form_license")}
						classes={{
							input:
								formik.touched.license && formik.errors.license
									? classes.errorInputComponent
									: classes.inputComponent,
						}}
						value={formik.values.license}
						onChange={(e) => {
							if (!isNaN(e.target.value)) {//eslint-disable-line
								formik.handleChange(e)
							}
						}}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.license && formik.errors.license && (
						<div className={classes.error}>
							<Typo as="p" variant="pxs" color="error" font="regular">
								{formik.errors.license}
							</Typo>
							<img className={classes.errorIcon} src="/icons/error.svg"/>
						</div>
					)}
				</div>
				<div className={
					formik.touched.full_name && formik.errors.full_name
						? classes.inputErrorDiv
						: classes.inputDiv
				}>
					<Input
						id="full_name"
						name="full_name"
						type="text"
						placeholder={__("free_gas_form_name")}
						classes={{
							input:
								formik.touched.full_name && formik.errors.full_name
									? classes.errorInputComponent
									: classes.inputComponent,
						}}
						value={formik.values.full_name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.full_name && formik.errors.full_name && (
						<div className={classes.error}>
							<Typo as="p" variant="pxs" color="error" font="regular">
								{formik.errors.full_name.replace('_', ' ')}
							</Typo>
							<img className={classes.errorIcon} src="/icons/error.svg"/>
						</div>
					)}
				</div>
				<div className={
					formik.touched.tel && formik.errors.tel
						? classes.inputErrorDiv
						: classes.inputDiv
				}>
					<Input
						id="tel"
						name="tel"
						type="phone"
						placeholder={__("free_gas_form_phone")}
						classes={{
							input:
								formik.touched.tel && formik.errors.tel
									? classes.errorInputComponent
									: classes.inputComponent,
						}}
						value={formik.values.tel}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{formik.touched.tel && formik.errors.tel && (
						<div className={classes.error}>
							<Typo as="p" variant="pxs" color="error" font="regular">
								Phone number is a required value.
							</Typo>
							<img className={classes.errorIcon} src="/icons/error.svg"/>
						</div>
					)}
				</div>
				<div className={
					formik.touched.address && formik.errors.address
						? classes.inputErrorDiv
						: classes.inputDiv
				}>
					<SearchLocationInput
						classes={
							formik.touched.address && formik.errors.address
								? classes.errorInput
								: classes.inputComponent
						}
						name="address"
						onChange={formik.setFieldValue}
						onTouched={formik.setFieldTouched}
						onError={formik.setFieldError}
						value={formik.values["address"].city}
						onBlur={formik.handleBlur}
						placeholder={__("free_gas_form_address")}
					/>
					{formik.touched.address && formik.errors.address && (
						<div className={classes.error}>
							<Typo as="p" variant="pxs" color="error" font="regular">
								{__(formik.errors.address)}
							</Typo>
							<img className={classes.errorIcon} src="/icons/error.svg"/>
						</div>
					)}
				</div>
				<div />
				<div className={classes.free_gas_form_footer} dangerouslySetInnerHTML={{ __html: `${__('free_gas_form_footer')}` }}/>
				<Button
					isSubmitting={isSubmitting}
					Type="submit"
					label={__("free_gas_form_submit")}
					classes={{button_primary: classes.signUpButton}}
				/>
			</form>
		</div>
		<Modal
			isShown={isOpen}
			onClose={() => {
				setIsOpen(false);
				setErrorMessage('');
				setMessage('');
			}}
			className={classes.dialog}
		>
			<div className={classes.errorContent}>
				{errorMessage ? <img src={Attention} /> : <img src={Success} />}
				<Typo as="h3" font="regular" className={classes.messageText}>
					{__(errorMessage ? errorMessage : message)}
				</Typo>
			</div>
			<Button
				label={__("OK")}
				onClick={() => {
					setIsOpen(false);
					if (message) {
						history.push('/')
					}
					setErrorMessage('');
					setMessage('');
				}}
				classes={{button_primary: classes.buttonComponent}}
			/>
		</Modal>
	</AppWrapper>
}

export default FreeGas;