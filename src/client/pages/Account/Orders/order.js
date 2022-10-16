import React, { useMemo } from 'react'
import defaulClasses from './order.css'
import { mergeClasses } from 'helper/mergeClasses'
import OrderItem from './orderItem'
import { useAccountOrder } from 'talons/Account/useAccountOrder'
import Button from 'components/Button/index'
import { useMutation } from "@apollo/react-hooks";
import { RESEND_INVOICE_EMAIL } from 'api/mutation'
import { storage, firstUpperCase, bytesForHuman } from 'helper/utils'
import Typo from 'ui/Typo'
import { STATUSES } from 'conf/consts'
import useTranslation from 'talons/useTranslation';
import isEmpty from 'lodash/isEmpty';
import Pdf from '../pdf.png';
import Img from '../img.png';
import Loading from "components/Loading";

const types = {
  1: "Car",
  2: "Pickup truck",
  3: "SUV",
  4: "flatbed",
  99: "Custom"
}

const Order = props => {
    const { order, inOrderDetails, setView, view, inMobile } = props
    const {
        isOpen,
        handleOpen,
        createdAt,
        totals,
				getFile,
        items,
        status,
        orderNumber,
        payment,
        shippingAddress,
        shipping,
        timeFormat,
        serviceOrder,
        billingAddress,
				fileLoader,
        attachments
     } = useAccountOrder({ order })
    const __ = useTranslation();
    const { grandTotal, subtotal,  shippingAmount, taxAmount, discountAmount } = totals
    const [resendInvoice, { loading }] = useMutation(RESEND_INVOICE_EMAIL);
    const { street, postcode, city,country, region } = shippingAddress
    const findStatus = useMemo(() => STATUSES.findIndex(elem => elem.name === status), [status])
    const classes = mergeClasses(defaulClasses, props.classes)
    const endingOfItemsCount = items.length > 1  ? "items" : "item"

    if(!order.shippingAddress) {
      return (
        <div className={!isOpen ? classes.root : classes.openedRoot}>
          <div className={classes.header}>
            <div className={classes.info}>
              {view !== "orderDetails" && (
                <section className={classes.head}>
                  <div className={classes.price}>
                    <Typo as="p" variant="px" font="condensed">
                      ${grandTotal.toFixed(2)}
                    </Typo>
                  </div>
                  <div className={classes.date}>
                    <Typo as="p" variant="px" font="regular">
                      {createdAt}
                    </Typo>
                  </div>
                  {!isOpen && !inOrderDetails ? 
                    <div className={classes.delivery}>
                      <Typo as="p" variant="px" font="bold" className={classes.deliveryTitle}>{__("Delivery")}:</Typo>
                      <Typo as="p" variant="px" font="regular">{items[0].name}</Typo>
                    </div>
                  :
                    null
                  }
                </section>
              )}
              <section className={classes.footer}>
                <div className={classes.statuses}>
                  {!inMobile ? (
                    findStatus === -1 ? (
                      <span>{__("Status")}: {status}</span>
                    ) : (
                      STATUSES.map((el, index) =>
                        index !== STATUSES.length - 1 ? (
                          <div key={index} className={classes.statusDiv}>
                            <div
                              className={
                                index <= findStatus
                                  ? classes.status
                                  : classes.disabledStatus
                              }
                            >
                              <img
                                src={require(`../../../assets/icons/statuses/${el.icon}`)}
                              />
                            </div>
                            <div className={classes.line}></div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className={
                              index <= findStatus
                                ? classes.status
                                : classes.disabledStatus
                            }
                          >
                            <img
                              src={require(`../../../assets/icons/statuses/${el.icon}`)}
                            />
                          </div>
                        )
                      )
                    )
                  ) : null}
                </div>
                {!inMobile ? <div className={classes.number}>
                  <Typo as="p" variant="pxs" color="code" font="regular">
                    {__("Nr")}: {orderNumber}
                  </Typo>
                </div> : null}
              </section>
            </div>
            <div
              className={!isOpen ? classes.toggleIcon : classes.openToggleIcon}
              onClick={
                inOrderDetails ? () => setView("orders") : () => handleOpen()
              }
            >
              {!inOrderDetails && (
                <span className={classes.downArrowSymbol}></span>
              )}
            </div>
          </div>
          {(isOpen || inOrderDetails) && !isEmpty(serviceOrder) ?
            <div className={classes.main}>
              <div className={classes.courierInfo}>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Delivery"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{items[0].name}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Payment"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{payment.name}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Contact name at pickup location"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.contactName}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Order reference number"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.orderReferenceNumber || "-"}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Phone number at pickup location"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.phoneNumber}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("from"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.fromAddress}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Company name at pickup location"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.companyName || "-"}</Typo>
                </div>
                <div className={classes.row}> 
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("to"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.toAddress || "-"}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Notes"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.note || "-"}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("at"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{serviceOrder.deliveryTimeRange}</Typo>
                </div>
                <div className={classes.row}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Billing address"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">{billingAddress.street && billingAddress.street[0]}, {billingAddress.city}, {billingAddress.postcode}
                    {billingAddress.region && `, ${billingAddress.region.name}`}{billingAddress.country && `, ${billingAddress.country.name}`}
                  </Typo>
                </div>
              </div>
              <div className={classes.totals}>
                <div className={classes.totalRow}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Product Total"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">${subtotal.toFixed(2)}</Typo>
                </div>
                <div className={classes.totalRow}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Discount amount"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">-${totals.discountAmount.toFixed(2)}</Typo>
                </div>
                <div className={classes.totalRow}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Taxes"))}</Typo>
                  <Typo as="p" variant="px" font="regular">${taxAmount.toFixed(2)}</Typo>
                </div>
                <div className={classes.totalRow}>
                  <Typo as="p" variant="px" font="bold" className={classes.title}>{firstUpperCase(__("Total"))}:</Typo>
                  <Typo as="p" variant="px" font="regular">${grandTotal.toFixed(2)}</Typo>
                </div>
              </div>
              {attachments.length ?
                <div className={classes.attachments}>
                  <Typo as="p" variant="px" font="bold">{__("Attached files")}:</Typo>
									{fileLoader ? <Loading classes={{root: classes.attachmentsLoader}}/> :
										<div className={classes.files}>
										{attachments.map((el, i) =>
											<div key={i} className={classes.file}>
												{el.name.includes("pdf") ?
													<div onClick={() => getFile(el.url, el.name)}>
														<div className={classes.pdfFile}>
															<img src={Pdf} className={classes.pdf}/>
															<Typo as="p" variant="pxs" font="bold" className={classes.name}>{el.name}</Typo>
															<Typo as="p" variant="pxs" font="regular" className={classes.size}>{bytesForHuman(el.size)}</Typo>
														</div>
													</div>
													:
													<div onClick={() => getFile(el.url, el.name)}>
														<img src={Img} className={classes.fileImg}/>
														<Typo as="p" variant="pxs" font="bold" className={classes.name}>{el.name}</Typo>
														<Typo as="p" variant="pxs" font="regular" className={classes.size}>{bytesForHuman(el.size)}</Typo>
													</div>
												}
											</div>
										)}
										</div>
									}
                </div>
              :
                null}
            </div>
          : null}
        </div>
      )
    }
  
    return (
      <div className={!isOpen ? classes.root : classes.openedRoot}>
        <div className={classes.header}>
          <div className={classes.info}>
            {view !== "orderDetails" && (
              <section className={classes.head}>
                <div className={classes.price}>
                  <Typo as="p" variant="px" font="condensed">
                    ${grandTotal.toFixed(2)}
                  </Typo>
                </div>
                <div className={classes.date}>
                  <Typo as="p" variant="px" font="regular">
                    {createdAt}
                  </Typo>
                </div>
              </section>
            )}
            {view !== "orderDetails" && (
              <section className={classes.body}>
                <div className={classes.total}>
                  <Typo as="p" variant="pxs" color="code" font="regular">
                    {__("Total")}: {items.length} {__(endingOfItemsCount)}
                  </Typo>
                </div>
                <div className={classes.number}>
                  <Typo as="p" variant="pxs" color="code" font="regular">
                    {__("Nr")}: {orderNumber}
                  </Typo>
                </div>
              </section>
            )}
            <section className={classes.footer}>
              <div className={classes.statuses}>
                {!inMobile ? (
                  findStatus === -1 ? (
                    <span>{__("Status")}: {status}</span>
                  ) : (
                    STATUSES.map((el, index) =>
                      index !== STATUSES.length - 1 ? (
                        <div key={index} className={classes.statusDiv}>
                          <div
                            className={
                              index <= findStatus
                                ? classes.status
                                : classes.disabledStatus
                            }
                          >
                            <img
                              src={require(`../../../assets/icons/statuses/${el.icon}`)}
                            />
                          </div>
                          <div className={classes.line}></div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className={
                            index <= findStatus
                              ? classes.status
                              : classes.disabledStatus
                          }
                        >
                          <img
                            src={require(`../../../assets/icons/statuses/${el.icon}`)}
                          />
                        </div>
                      )
                    )
                  )
                ) : null}
              </div>
            </section>
          </div>
          <div
            className={!isOpen ? classes.toggleIcon : classes.openToggleIcon}
            onClick={
              inOrderDetails ? () => setView("orders") : () => handleOpen()
            }
          >
            {!inOrderDetails && (
              <span className={classes.downArrowSymbol}></span>
            )}
          </div>
        </div>
        {isOpen || inOrderDetails ? (
          <div className={classes.main}>
            <div className={classes.mainInfo}>
            <div className={classes.payment}>
              <p>{__("Status")}</p>
              <span>{status}</span>
            </div>
              <div className={classes.delAddress}>
                <Typo as="p" variant="px" font="condensed">
                  {__("Delivery address")}
                </Typo>
                <Typo
                  as="p"
                  variant="px"
                  font="regular"
                  className={classes.delAddressValue}
                >
                  {street && street[0]}, {city}, {postcode}
                  {region && `, ${region.name}`}{country && `, ${country.name}`}
                </Typo>
              </div>
              {!inOrderDetails && (
                <div className={classes.payment}>
                  <p>{__("Payment method")}</p>
                  <span>{payment.name}</span>
                </div>
              )}
              {shipping && shipping.deliveryTime &&
                <div className={classes.delTime}>
                  <Typo as="p" variant="px" font="condensed">
                    {__("Delivery Time")}
                  </Typo>
                  <Typo
                    as="p"
                    variant="px"
                    font="regular"
                    className={classes.delAddressValue}
                  >
                    {timeFormat(shipping.deliveryTime)}
                  </Typo>
                </div>
                }
              {!inOrderDetails && shipping && shipping.deliveryTime && (
                <div className={classes.orderNumber}>
                  <p>{__("Order number")}</p>
                  <span>{orderNumber}</span>
                </div>
              )}
              <div className={classes.delType}>
                <Typo as="p" variant="px" font="condensed">
                  {__("Delivery type")}
                </Typo>
                <Typo
                  as="p"
                  variant="px"
                  font="regular"
                  className={classes.delAddressValue}
                >
                {shipping && shipping.sizeCode && __(types[shipping.sizeCode])}
                </Typo>
              </div>
              {!inOrderDetails && shipping && !shipping.deliveryTime && (
                <div className={classes.orderNumber}>
                  <p>{__("Order number")}</p>
                  <span>{orderNumber}</span>
                </div>
              )}
            </div>
            <div className={classes.items}>
              <span className={classes.itemCount}>
                {items.length} {__(endingOfItemsCount)}
              </span>
              <div className={classes.mainItems}>
                {items.map((e, i) => (
                  <OrderItem item={e} key={i}/>
                ))}
              </div>
            </div>
            <div className={classes.mainFooter}>
              <div className={classes.orderValue}>
                <p>{__("Product Total")}</p>
                {subtotal && <span>${subtotal.toFixed(2)}</span>}
              </div>
              <div className={classes.footerDel}>
                <p>{__("Delivery")}</p>
                {shippingAmount && <span>${shippingAmount.toFixed(2)}</span>}
              </div>
              {discountAmount ? (
                <div className={classes.footerDel}>
                  <p>{__("Discount amount")}</p>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className={classes.footerDel}>
                <p>{__("Taxes")}</p>
                {taxAmount && <span>${taxAmount.toFixed(2)}</span>}
              </div>
              <div className={classes.footerTotal}>
                <p>{__("Total")}:</p>
                {grandTotal && <span>${grandTotal.toFixed(2)}</span>}
              </div>
            </div>
            {status === "Processing" ?
              <div className={classes.buttons}>
                <Button
                  type="bordered"
                  label={__("Send to email")}
                  onClick={() => {
                    resendInvoice({
                      variables: {
                        customerToken: storage("customerToken"),
                        orderId: order.id,
                      },
                    }).then((res) => console.log("reeees", res));
                  }}
                  isSubmitting={loading}
                />
              </div>
              :
              null
            }
          </div>
        ) : null}
      </div>
    );
}

export default Order