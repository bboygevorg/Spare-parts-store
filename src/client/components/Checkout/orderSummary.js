import React, { Fragment } from "react";
import defaultClasses from "./orderSummary.css";
import { mergeClasses } from "helper/mergeClasses";
import Button from "components/Button";
import { firstUpperCase } from "helper/utils";
import OrderModal from "components/OrderModal";
import Modal from "components/Modal";
import ArrivalNotes from "components/ArrivalNotes";
import Coupon from 'components/Coupon';
import { isCourierCheckout } from "pages/Checkout/courierCheckout";
import Typo from "ui/Typo";
import { useOrderSummary } from "talons/Checkout/useOrderSummary";

const OrderSummary = (props) => {
	const { totals, getPlaceOrderLoading, estimateDay, setFormValues, values, setRecoverCartLoading, setIsOrderPlacing, setWith3dSecure, cardValue } = props;
	const {
		__,
		data,
		couponCode,
		setCouponCode,
		graphqlError,
		applyCoupon,
		applyCouponLoad,
		removeCoupon,
		removeCouponLoad,
		setIsOpenPolicyModal,
		isOpenPolicyModal,
		isOpen,
		setIsOpen,
		orderModalAction,
		orderPlaced,
		errorMessage,
		shopperMessage,
		handleOrder,
		isFixed,
		styles,
		notes,
		handleWrongGrandTotalModal,
		grandTotalMessage,
		isCartGrantTotalTrue,
		setNotes,
		history
	} = useOrderSummary({
			values,
			totals,
			getPlaceOrderLoading,
			setFormValues,
			setRecoverCartLoading,
			setIsOrderPlacing,
			setWith3dSecure,
			cardValue
		});
	const classes = mergeClasses(defaultClasses, props.classes);

	if(isCourierCheckout(history.location.pathname)) {
		return (
			<Fragment>
				<div className={classes.courierSummary}>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Delivery"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{values.type.name}</Typo>
					</div>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Contact name at pickup location"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.contactName}</Typo>
					</div>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Phone number at pickup location"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.phoneNumber}</Typo>
					</div>
					{data.companyName ? <div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Company name at pickup location"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.companyName}</Typo>
					</div> : null}
					{data.orderReferenceNumber ? <div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Order reference number"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.orderReferenceNumber}</Typo>
					</div> : null}
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("from"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.fromAddress}</Typo>
					</div>
					{data.toAddress ? <div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("to"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.toAddress}</Typo>
					</div> : null}
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("at"))}:</Typo>
						<Typo as="p" variant="px" font="regular">{data.deliveryTimeRange}</Typo>
					</div>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Product Total"))}:</Typo>
						<Typo as="p" variant="px" font="regular">${totals.subtotal ? totals.subtotal.toFixed(2) : 0}</Typo>
					</div>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{__("Discount amount")}:</Typo>
						<Typo as="p" variant="px" font="regular">
							-${totals.discountAmount ? totals.discountAmount.toFixed(2) : 0}
						</Typo>
					</div>
					<div className={classes.row}>
						<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Taxes"))}:</Typo>
						<Typo as="p" variant="px" font="regular">${totals.taxAmount ? totals.taxAmount.toFixed(2) : 0}</Typo>
					</div>
					{totals.couponCode && (
						<div className={classes.row}>
							<span className={classes.couponTitleService}>{firstUpperCase(__("Coupon code"))}:</span>
							<div>
								<span
									className={classes.removeCouponService}
									onClick={() => removeCoupon()}
								>
									{__("Remove")}
								</span>
								<span className={classes.couponTextService}>{totals.couponCode}</span>
							</div>
						</div>
					)}
					{totals.grandTotal ? <div className={classes.row}>
					<Typo as="p" variant="px" font="bold">{firstUpperCase(__("Total"))}:</Typo>
					<Typo as="p" variant="px" font="bold">${totals.grandTotal.toFixed(2)}</Typo>
					</div> : null}
				</div>
				<Coupon
					couponCode={couponCode}
					onChange={(value) => setCouponCode(value)}
					graphqlError={graphqlError}
					applyCoupon={applyCoupon}
					applyCouponLoad={applyCouponLoad}
					removeCoupon={removeCoupon}
					removeCouponLoad={removeCouponLoad}
				/>
				<div className={classes.courierPlaceOrder}>
					<div
						className={classes.button}
						onClick={() => {
							setIsOpenPolicyModal(!isOpenPolicyModal);
							window.scrollTo(0, 0);
						}}
					>
						<Button label={__("PLACE YOUR ORDER")} />
					</div>
				</div>
				<Modal
					isShown={isOpen}
					hideClose
					onClose={() => {
						setIsOpen(!isOpen);
					}}
					className={classes.dialog}
				>
					<OrderModal action={orderModalAction} orderPlaced={orderPlaced} message={errorMessage} shopperMessage={shopperMessage}/>
				</Modal>
				<Modal
					isShown={isOpenPolicyModal}
					onClose={() => setIsOpenPolicyModal(!isOpenPolicyModal)}
					className={classes.policyDialog}
				>
					<ArrivalNotes
						accept={() => {
							handleOrder();
							setIsOpenPolicyModal(!isOpenPolicyModal);
						}}
						cancel={() => setIsOpenPolicyModal(!isOpenPolicyModal)}
						estimateDay={estimateDay}
					/>
				</Modal>
				<Modal
					isShown={isCartGrantTotalTrue}
					hideClose
					onClose={() => {
						setIsOpen(!isOpen);
					}}
					className={classes.dialog}
				>
					<OrderModal action={handleWrongGrandTotalModal} orderPlaced={orderPlaced} message={grandTotalMessage} shopperMessage={shopperMessage}/>
				</Modal>
			</Fragment>
		);
	}

	return (
		<div>
			<div
				className={`${classes.root} ${isFixed ? classes.fixedRoot : ""}`}
				id="orderSummaryId"
				style={styles}
			>
				<div className={classes.body}>
					<div className={classes.titleWrapper}>
						<h1 className={classes.title}>{__("Order Summary")}</h1>
					</div>
					<div className={classes.priceWrapper}>
						<span className={classes.text}>{__("Product Total")}</span>
						{totals.subtotal && (
							<span className={classes.text}>
								${totals.subtotal.toFixed(2)}
							</span>
						)}
					</div>
					<div className={classes.priceWrapper}>
						<span className={classes.text}>{__("Delivery fee")}</span>
						{totals.shippingAmount && (
							<span className={classes.text}>
								${totals.shippingAmount.toFixed(2)}
							</span>
						)}
					</div>
					<div className={classes.priceWrapper}>
						<span className={classes.text}>{__("Discount amount")}</span>
						{totals.discountAmount && (
							<span className={classes.text}>
								-${totals.discountAmount.toFixed(2)}
							</span>
						)}
					</div>
					<div className={classes.priceWrapper}>
						<span className={classes.text}>{__("Taxes")}</span>
						{totals.taxAmount && (
							<span className={classes.text}>
								${totals.taxAmount.toFixed(2)}
							</span>
						)}
					</div>
					{totals.couponCode && (
						<div className={classes.coupon}>
							<span className={classes.couponCode}>{__("Coupon code")}</span>
							<div>
								<span
									className={classes.removeCoupon}
									onClick={() => removeCoupon()}
								>
									{__("Remove")}
								</span>
								<span className={classes.couponText}>{totals.couponCode}</span>
							</div>
						</div>
					)}
					<div className={classes.line} />
						<div className={classes.total}>
							<strong>{__("Total")}</strong>
							{totals.grandTotal && (
								<strong>${totals.grandTotal.toFixed(2)}</strong>
							)}
						</div>
					</div>
					<div className={classes.extraNotes}>
						<textarea 
							cols="10" 
							rows="4" 
							value={notes}
							onChange={(e) => setNotes(e.target.value)} 
							placeholder={__("Extra notes")} 
							className={classes.notesInput}
						/>
					</div>
					<Coupon 
						couponCode={couponCode} 
						onChange={(value) => setCouponCode(value)}
						graphqlError={graphqlError}
						applyCoupon={applyCoupon}
						applyCouponLoad={applyCouponLoad}
						removeCoupon={removeCoupon}
						removeCouponLoad={removeCouponLoad}
					/>        
					<div className={classes.footer}>
						<div
							className={classes.button}
							onClick={() => {
								setIsOpenPolicyModal(!isOpenPolicyModal);
								window.scrollTo(0, 0);
							}}
						>
							<Button label={__("PLACE YOUR ORDER")} />
						</div>
					</div>
				</div>
				<Modal
					isShown={isOpen}
					hideClose
					onClose={() => {
						setIsOpen(!isOpen);
						// if (orderPlaced) {
						//   setTimeout(() => {
						//     history.replace("/account/orders");
						//     dispatch(setCurrentStep(0));
						//   }, 100);
						// }
					}}
					className={classes.dialog}
				>
					<OrderModal action={orderModalAction} orderPlaced={orderPlaced} message={errorMessage} shopperMessage={shopperMessage}/>
				</Modal>
			<Modal
				isShown={isCartGrantTotalTrue}
				hideClose
				onClose={() => {
					setIsOpen(!isOpen);
				}}
				className={classes.dialog}
			>
				<OrderModal action={handleWrongGrandTotalModal} orderPlaced={orderPlaced} message={grandTotalMessage} shopperMessage={shopperMessage}/>
			</Modal>
				<Modal
					isShown={isOpenPolicyModal}
					onClose={() => setIsOpenPolicyModal(!isOpenPolicyModal)}
					className={classes.policyDialog}
				>
					<ArrivalNotes
						accept={() => {
							handleOrder();
							setIsOpenPolicyModal(!isOpenPolicyModal);
						}}
						cancel={() => setIsOpenPolicyModal(!isOpenPolicyModal)}
						estimateDay={estimateDay}
					/>
			</Modal>
		</div>
	);
};

export default OrderSummary;
