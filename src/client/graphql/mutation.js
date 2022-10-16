import { gql } from "apollo-boost";

export const DELETE_ADDRESS = gql`
  mutation removeAddress($customerToken: String!, $addressId: Int!) {
    removeCustomerAddress(customerToken: $customerToken, addressId: $addressId)
  }
`;

export const ADD_ADDRESS = gql`
  mutation addAddress($customerToken: String!, $address: AddressInput!) {
    addCustomerAddress(customerToken: $customerToken, address: $address) {
      id
      title
      country {
        id
        name
      }
      region {
        id
        name
        code
      }
      street
      city
      firstname
      lastname
      postcode
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation updateAddress(
    $customerToken: String!
    $addressId: Int!
    $address: AddressInput
  ) {
    updateCustomerAddress(
      customerToken: $customerToken
      addressId: $addressId
      address: $address
    ) {
      id
      title
      firstname
      lastname
      street
      city
      postcode
      region {
        code
        id
        name
      }
      country {
        id
        name
      }
    }
  }
`;

export const UPDATE_CART_ZONE_INFO = gql`
	mutation updateCartZoneInfo(
			$cartToken: String!
      $customerToken: String
			$zoneCode: Int!
  ) {
		updateCartZoneInfo(
			cartToken: $cartToken
			customerToken: $customerToken
			zoneCode: $zoneCode
		){
      cartToken
      id
      items {
          itemId
          sku
          name
          price
          qty
          imageUrl
          deliveryOption
      }
      totals {
          subtotal
          shippingAmount
          taxAmount
          discountAmount
          shippingTaxAmount
          grandTotal
          shippingDiscountAmount
          couponCode
      }
      billingAddress {
          id
          title
          city
          firstname
          lastname
          postcode
      }
      shippingAddress {
          id
          title
          city
          firstname
          lastname
          postcode
      }
      expiresAt
    }
	}
`;
export const REMOVE_FROM_CART = gql`
  mutation removeFromCart(
    $cartToken: String
    $customerToken: String
    $itemId: Int!
  ) {
    removeFromCart(
      cartToken: $cartToken
      customerToken: $customerToken
      itemId: $itemId
    ) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;
export const APPLY_COUPON_TO_CART = gql`
  mutation applyCoupon(
    $cartToken: String!
    $customerToken: String
    $coupon: String!
  ) {
    applyCouponToCart(
      cartToken: $cartToken
      customerToken: $customerToken
      coupon: $coupon
    ) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const REMOVE_COUPON = gql`
  mutation removeCoupon($cartToken: String!, $customerToken: String) {
    removeCouponFromCart(cartToken: $cartToken, customerToken: $customerToken) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const UPDATE_CART = gql`
  mutation updateCart(
    $cartToken: String!
    $customerToken: String
    $item: CartItemInput!
  ) {
    updateCart(
      cartToken: $cartToken
      customerToken: $customerToken
      item: $item
    ) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
	      msku
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation addToCart(
    $item: ProductInput!
    $customerToken: String!
    $cartToken: String
		$zoneCode: Int
  ) {
    addToCart(
      item: $item
      customerToken: $customerToken
      cartToken: $cartToken
			zoneCode: $zoneCode
    ) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
	      msku
        imageUrl
        deliveryOption
      }
      customer {
        firstname
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const CUSTOMER_VARIFY = gql`
  mutation sendSMSToNumber($telephone: String!) {
    customerVerify(telephone: $telephone)
  }
`;

export const CUSTOMER_LOGIN = gql`
  mutation getCustomerToken(
    $telephone: String!
    $email: String!
    $secret: String!
    $deviceId: String!
  ) {
    customerLogin(
      telephone: $telephone
      email: $email
      secret: $secret
      deviceId: $deviceId
    ) {
      customerToken
      refreshToken
      email
      telephone
      firstname
      lastname
      resellerId
      companyName
      hvacLicense,
      epaCertification
      contractorLicence
      allowedPaymentMethods
      companyRole
    }
  }
`;

export const CUSTOMER_REGISTER = gql`
  mutation getCustomerToken(
    $customer: CustomerRegisterInput!
    $secret: String!
    $inviteToken: String
  ) {
    customerRegister(customer: $customer, secret: $secret, inviteToken: $inviteToken) {
      customerToken
      refreshToken
      email
      telephone
      firstname
      lastname
      resellerId
      companyName
      hvacLicense
      epaCertification
      contractorLicence
      allowedPaymentMethods
      companyRole
    }
  }
`;

export const MERGE_CARTS = gql`
  mutation mergeCarts($cartToken: String!, $customerToken: String!) {
    assignCustomerToCart(cartToken: $cartToken, customerToken: $customerToken) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation updateCustomer($customerToken: String!, $customer: CustomerInput!) {
    updateCustomer(customer: $customer, customerToken: $customerToken) {
      firstname
      lastname
      email
      customerToken
      telephone,
      hvacLicense,
      epaCertification,
      resellerId,
      companyName
      contractorLicence
      allowedPaymentMethods
      companyRole
    }
  }
`;

export const SET_CUSTOMER_DEFAULT_BILLING = gql`
  mutation setCustomerDefaultBilling(
    $customerToken: String!
    $addressId: Int!
  ) {
    setCustomerDefaultBilling(
      customerToken: $customerToken
      addressId: $addressId
    ) {
      firstname
    }
  }
`;

export const COMPANY_CREATE_SHOPPER_ORDER_REQUEST = gql`
    mutation companyCreateShopperOrderRequest(
        $customerToken: String!
        $paymentMethodCode: String!
        $selectedCardId: String
        $comment: String
        $serviceOrderInformation: ServiceOrderInformationInput
    ) {
        companyCreateShopperOrderRequest(
            customerToken: $customerToken
            paymentMethodCode: $paymentMethodCode
            selectedCardId: $selectedCardId
            comment: $comment
            serviceOrderInformation: $serviceOrderInformation
        )
    }
`;

export const PROLONG_CART_EXPIRATION = gql`
  mutation prolongExpiration(
    $cartToken: String!
    $customerToken: String
    $seconds: Int!
  ) {
    prolongCartExpiration(
      cartToken: $cartToken
      customerToken: $customerToken
      seconds: $seconds
    ) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      customer {
        firstname
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const CREATE_EPHEMERAL_KEY = gql`
  mutation createEphemeralKey($customerToken: String!) {
    stripeCreateEphemeralKey(customerToken: $customerToken)
  }
`;

export const SET_CART_SHIPPING_INFO = gql`
  mutation setCartShippingInfo(
    $cartToken: String
    $customerToken: String!
    $shippingInfo: ShippingInfoInput!
		$zoneCode: Int
  ) {
    setCartShippingInfo(
      cartToken: $cartToken
      customerToken: $customerToken
      shippingInfo: $shippingInfo
			zoneCode: $zoneCode
    ) {
      id
    }
  }
`;

export const SET_CART_BILLING_INFO = gql`
  mutation setCartBillingInfo(
    $cartToken: String
    $customerToken: String!
    $billingInfo: BillingInfoInput!
  ) {
    setCartBillingInfo(
      cartToken: $cartToken
      customerToken: $customerToken
      billingInfo: $billingInfo
    ) {
      id
    }
  }
`;

export const INIT_PAYMENT_INTENT = gql`
  mutation stripeInitPaymentIntent(
    $customerToken: String!
    $paymentIntent: StripePaymentIntentInput
    $paymentMethodId: String!
  ) {
    stripeInitPaymentIntent(
      customerToken: $customerToken
      paymentIntent: $paymentIntent
      paymentMethodId: $paymentMethodId
    ) {
      id
      clientSecret
      amount
      currency
      methodTypes
      customer
      paymentErrorMessage
      status
      nextAction
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation stripePlaceOrder(
    $cartToken: String!
    $customerToken: String!
    $payment: StripePaymentInput!
    $comment: String
    $serviceOrderInformation: ServiceOrderInformationInput
  ) {
    stripePlaceOrder(
      cartToken: $cartToken
      customerToken: $customerToken
      payment: $payment
      comment: $comment
      serviceOrderInformation: $serviceOrderInformation
    ) {
      id
      incrementId
      status
      state
      statusCode
      createdAt
      items {id, name,price, imageUrl, rowTotal, qty, sku}
      totals {shippingAmount, subtotal, taxAmount, shippingAmount, grandTotal}
	    shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
        }
    }
  }
`;

export const BANK_PLACE_ORDER = gql`
  mutation bankTrasferPlaceOrder(
    $cartToken: String!
    $customerToken: String!
    $comment: String
    $serviceOrderInformation: ServiceOrderInformationInput
  ) {
    bankTrasferPlaceOrder(
      cartToken: $cartToken
      customerToken: $customerToken
      comment: $comment
      serviceOrderInformation: $serviceOrderInformation
    ) {
      id
      incrementId
      status
      state
      statusCode
    }
  }
`;

export const RESEND_INVOICE_EMAIL = gql`
  mutation resentInvoice(
    $customerToken: String!
    $orderId: Int!
    $invoiceId: Int
  ) {
    resendInvoiceEmail(
      customerToken: $customerToken
      orderId: $orderId
      invoiceId: $invoiceId
    )
  }
`;
export const SAVE_CARD = gql`
  mutation saveCard(
    $customerToken: String!
    $stripeCustomerToken: String
    $ccStripejsToken: String!
  ) {
    stripeSaveCard(
      customerToken: $customerToken
      stripeCustomerToken: $stripeCustomerToken
      ccStripejsToken: $ccStripejsToken
    )
  }
`;

export const DELETE_CARD = gql`
  mutation deleteCard(
    $customerToken: String!
    $stripeCustomerToken: String
    $token: String!
  ) {
    stripeDeleteCard(
      customerToken: $customerToken
      stripeCustomerToken: $stripeCustomerToken
      token: $token
    )
  }
`;

export const REFRESH_CUSTOMER_TOKEN = gql`
  mutation refreshCustomerToken($refreshToken: String!) {
    refreshCustomerToken(refreshToken: $refreshToken) {
      customerToken
    }
  }
`;

export const SET_DELIVERY_TIME = gql`
  mutation setOrderDeliveryTime($cartToken: String!, $customerToken: String! $deliveryTime: String!) {
    setDeliveryTime(cartToken: $cartToken, customerToken: $customerToken, deliveryTime: $deliveryTime) {
      cartToken
    }
  }
`;

export const CREATE_NEW_CART = gql`
  mutation createNewCartFromOrder($orderId: String!, $customerToken: String!) {
    createNewCartFromOrder(orderId: $orderId, customerToken: $customerToken) {
      cartToken,
      id,
      items {
          itemId,
          sku,
          name,
          price,
          qty,
          imageUrl
          deliveryOption
      },
      totals {
          subtotal,
          shippingAmount,
          taxAmount,
          discountAmount,
          shippingTaxAmount,
          grandTotal,
          shippingDiscountAmount,
          couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const ADD_WISHLIST = gql`
  mutation addWishList($customerToken: String!, $name: String!) {
    addWishlist(customerToken: $customerToken, name: $name)
  }
`;

export const DELETE_WISHLIST = gql`
  mutation deleteWishList($customerToken: String!, $wishlistId: Int!) {
    deleteWishlist(customerToken: $customerToken, wishlistId: $wishlistId)
  }
`;

export const ADD_ITEM_TO_WISHLIST = gql`
  mutation addItemToWishlist($customerToken: String!, $wishlistIds: [Int!], $sku: String!, $qty: Int) {
    addItemToWishlist(customerToken: $customerToken, wishlistIds: $wishlistIds, sku: $sku, qty: $qty)
  }
`;

export const REMOVE_ITEM_FROM_WISHLIST = gql`
  mutation removeItemFromWishlist($customerToken: String!, $wishlistItemIds: [Int!]!) {
    removeItemsFromWishlist(customerToken: $customerToken, wishlistItemIds: $wishlistItemIds)
  }
`;

export const SET_CART_ADDITIONAL_DATA = gql`
  mutation setCartAdditionalData($cartToken: String!, $customerToken: String!, $platform: String!, $locale: String!) {
    setCartAdditionalData(cartToken: $cartToken, customerToken: $customerToken, platform: $platform, locale: $locale) {
      cartToken
      id
      items {
        itemId
        sku
        name
        price
        qty
        imageUrl
        deliveryOption
      }
      totals {
        subtotal
        shippingAmount
        taxAmount
        discountAmount
        shippingTaxAmount
        grandTotal
        shippingDiscountAmount
        couponCode
      }
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const SEND_INVITE = gql`
  mutation companySendInviteRequest($customerToken: String!, $email: String!, $role: Int) {
    companySendInviteRequest(customerToken: $customerToken, email: $email, role: $role)
  }
`;

export const CHANGE_CUSTOMER_ROLE = gql`
  mutation companyChangeRelatedCustomerRole($customerToken: String!, $id: Int!, $role: Int) {
    companyChangeRelatedCustomerRole(customerToken: $customerToken, id: $id, role: $role)
  }
`;

export const CHANGE_ACCOUNT_STATUS = gql`
  mutation companyChangeRelatedCustomerAccountStatus($customerToken: String!, $id: Int!, $status: Int) {
    companyChangeRelatedCustomerAccountStatus(customerToken: $customerToken, id: $id, status: $status)
  }
`;

export const REMOVE_CART_TEMPLATE = gql`
  mutation companyRemoveCartTemplate($customerToken: String!, $id: Int!) {
    companyRemoveCartTemplate(customerToken: $customerToken, id: $id)
  }
`;

export const CREATE_CART_TEMPLATE = gql`
  mutation companyCreateCartTemplate($customerToken: String!, $name: String!, $products: [CompanyCartItemInput]) {
    companyCreateCartTemplate(customerToken: $customerToken, name: $name, products: $products)
  }
`;

export const UPDATE_CART_TEMPLATE = gql`
  mutation companyUpdateCartTemplate($customerToken: String!, $id: Int!, $name: String!, $products: [CompanyCartItemInput]) {
    companyUpdateCartTemplate(customerToken: $customerToken, id: $id, name: $name, products: $products)
  }
`;

export const COMPANY_ADD_ITEM_TO_CART = gql`
  mutation companyAddItemToCustomerCart(
			$customerId: Int!,
			$customerToken: String!,
			$cartToken: String!,
			$cartItems: [ProductInput!]!,
      $zoneCode: Int
  ) {
    companyAddItemToCustomerCart(customerId: $customerId, customerToken: $customerToken, cartToken: $cartToken, cartItems: $cartItems, zoneCode: $zoneCode
    ) {
      cartToken,
      id,
      items {
        itemId,
        sku,
        name,
        price,
        qty,
        imageUrl
        deliveryOption
      },
      totals {
        subtotal,
        shippingAmount,
        taxAmount,
        discountAmount,
        shippingTaxAmount,
        grandTotal,
        shippingDiscountAmount,
        couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const COMPANY_REMOVE_ITEM_FROM_CART = gql`
  mutation companyRemoveItemFromCustomerCart($customerToken: String!, $customerId: Int!, $cartToken: String!, $itemId: Int!) {
    companyRemoveItemFromCustomerCart(customerToken: $customerToken, customerId: $customerId, cartToken: $cartToken, itemId: $itemId) {
      cartToken,
      id,
      items {
        itemId,
        sku,
        name,
        price,
        qty,
        imageUrl
        deliveryOption
      },
      totals {
        subtotal,
        shippingAmount,
        taxAmount,
        discountAmount,
        shippingTaxAmount,
        grandTotal,
        shippingDiscountAmount,
        couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const COMPANY_UPDATE_ITEM_FROM_CART = gql`
  mutation companyUpdateItemFromCustomerCart($customerToken: String!, $customerId: Int!, $cartToken: String!, $cartItem: CartItemInput!, $zoneCode: Int
  ) {
    companyUpdateItemFromCustomerCart(customerToken: $customerToken, customerId: $customerId, cartToken: $cartToken, cartItem: $cartItem,	zoneCode: $zoneCode
    ) {
      cartToken,
      id,
      items {
        itemId,
        sku,
        name,
        price,
        qty,
        imageUrl
        deliveryOption
      },
      totals {
        subtotal,
        shippingAmount,
        taxAmount,
        discountAmount,
        shippingTaxAmount,
        grandTotal,
        shippingDiscountAmount,
        couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const ADD_TEMPLATE_TO_CART = gql`
  mutation companyAddCartTemplateToCustomerCart($customerToken: String!, $templateId: Int!, $cartToken: String!, $cartCustomerId: Int, $zoneCode: Int
  ) {
    companyAddCartTemplateToCustomerCart(customerToken: $customerToken, templateId: $templateId, cartToken: $cartToken, cartCustomerId: $cartCustomerId, zoneCode: $zoneCode
    ) {
      cartToken,
      id,
      items {
        itemId,
        sku,
        name,
        price,
        qty,
        imageUrl
        deliveryOption
      },
      totals {
        subtotal,
        shippingAmount,
        taxAmount,
        discountAmount,
        shippingTaxAmount,
        grandTotal,
        shippingDiscountAmount,
        couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

export const TRUNCATE_CUSTOMER_CART = gql`
  mutation companyTruncateCustomerCart($customerToken: String!, $customerId: Int!, $cartToken: String!) {
    companyTruncateCustomerCart(customerToken: $customerToken, customerId: $customerId, cartToken: $cartToken) {
      cartToken,
      id,
      items {
        itemId,
        sku,
        name,
        price,
        qty,
        imageUrl
        deliveryOption
      },
      totals {
        subtotal,
        shippingAmount,
        taxAmount,
        discountAmount,
        shippingTaxAmount,
        grandTotal,
        shippingDiscountAmount,
        couponCode
      },
      billingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      shippingAddress {
        id
        title
        city
        firstname
        lastname
        postcode
      }
      expiresAt
    }
  }
`;

// ORDER_REQUEST = PENDING_ORDER

export const REJECT_ORDER_REQUEST = gql`
  mutation companyRejectShopperOrderRequest($customerToken: String!, $orderRequestId: Int!, $comment: String) {
    companyRejectShopperOrderRequest(customerToken: $customerToken, orderRequestId: $orderRequestId, comment: $comment)
  }
`;

export const APPROVE_ORDER_REQUEST = gql`
  mutation companyApproveShopperOrderRequest($customerToken: String!, $orderRequestId: Int!, $returnUrl: String, $serviceOrderInformation: ServiceOrderInformationInput) {
    companyApproveShopperOrderRequest(customerToken: $customerToken, orderRequestId: $orderRequestId, returnUrl: $returnUrl, serviceOrderInformation: $serviceOrderInformation) {
      orderId
      orderRequestId
      paymentMethodCode
      paymentData {
        id
        clientSecret
        confirmationMethod
        amount
        currency
        customer
        paymentErrorMessage
        status
        nextAction
        returnUrl
      }
    }
  }
`;

export const UPDATE_ORDER_REQUEST = gql`
  mutation companyUpdateShopperOrderRequest($customerToken: String!, $orderRequestId: Int!, $products: [CompanyCartItemInput]) {
    companyUpdateShopperOrderRequest(customerToken: $customerToken, orderRequestId: $orderRequestId, products: $products)
  }
`;

export const DELETE_ORDER_REQUEST = gql`
  mutation companyDeleteShopperOrderRequest($customerToken: String!, $orderRequestId: Int!) {
    companyDeleteShopperOrderRequest(customerToken: $customerToken, orderRequestId: $orderRequestId)
  }
`;

export const PENDING_REQUEST_REORDER = gql`
  mutation companyRejectedOrderReorder($customerToken: String!, $orderRequestId: Int!) {
    companyRejectedOrderReorder(customerToken: $customerToken, orderRequestId: $orderRequestId)
  }
`;

export const CONFIRM_SHOPPER_ORDER_REQUEST = gql`
  mutation companyConfirmShopperOrderRequest($customerToken: String!, $orderRequestId: Int!, $orderId: Int!, $paymentStatus: String!) {
    companyConfirmShopperOrderRequest(customerToken: $customerToken, orderRequestId: $orderRequestId, orderId: $orderId, paymentStatus: $paymentStatus)
  }
`;

export const ATTACH_USER_CARD = gql`
  mutation companyAttachCardToUser($customerToken: String!, $customerId: Int!, $ccStripejsToken: String!) {
    companyAttachCardToUser(customerToken: $customerToken, customerId: $customerId, ccStripejsToken: $ccStripejsToken)
  }
`;

export const DETACH_USER_CARD = gql`
  mutation companyDetachCardFromUser($customerToken: String!, $cardId: String!) {
    companyDetachCardFromUser(customerToken: $customerToken, cardId: $cardId)
  }
`;