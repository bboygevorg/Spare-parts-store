import { gql } from "apollo-boost";

export const ESTIMATE_SHIPPING = gql`
  query getEstimatedCost($zipCode: Int!, $shipmentType: Int!) {
    estimateShippingByZipAndType(
      zipCode: $zipCode 
      shipmentType: $shipmentType
    ) {
      price
      carrierCode
    }
    estimateDeliveryTimeByAddress(address: "90014")
  }
`;

export const ESTIMATE_DELIVERY_TIME = gql`
 query getDeliveryTime($zipCode: String!) {
  estimateDeliveryTimeByAddress(address: $zipCode)
 }
`
export const GET_CART = gql`
    query getCart($cartToken: String, $customerToken: String) {
        getCart(cartToken: $cartToken, customerToken: $customerToken) {
            cartToken,
            id,
            items {
                itemId,
                sku,
                name,
                price,
                qty,
                imageUrl,
		            msku,
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
		        zoneCode
        }
    }
`;

export const GET_COUNTRIES = gql`
    query {
        getCountries {
        id
    }
}
`;

export const GET_REGIONS = gql`
    query getRegions($countryId: String!){
        getRegions(countryId: $countryId) {
            id,
            name
        }
    }
`;

export const GET_CUSTOMER_ADDRESS = gql`
    query getCustomerAddress($customerToken: String!){
        getCustomerAddressBook(customerToken: $customerToken){
            id,
            title,
            defaultBilling,
            defaultShipping,
            country {
                id,
                name
            },
            region {
                id,
                name,
                code
            },
            street,
            city,
            firstname,
            lastname,
            postcode,
            additionalNotes
        }
    }
`;

export const GET_CUSTOMER_DATA = gql`
  query getCustomerData($customerToken: String!) {
    getCustomerInfo(customerToken: $customerToken) {
      customerToken,
      email,
      telephone,
      firstname,
      lastname,
      resellerId,
      companyName,
      hvacLicense,
      epaCertification,
      contractorLicence
      allowedPaymentMethods
      companyRole
    }
  }
`;

export const GET_ORDERS = gql`
  query getOrders($customerToken: String!, $pageSize: Int, $currentPage: Int) {
    getOrdersPaginated(customerToken: $customerToken, pageSize: $pageSize, currentPage: $currentPage) {
      items {
        state
        id
        status
        payment {
          success
          name
          code
        }
        shipping {
          title
          price
          deliveryTime
          sizeCode
        }
        shippingAddress {
          street
          city
          postcode
          country{name}
          region{name}
        }
        billingAddress {
          street
          city
          postcode
          country{name}
          region{name}
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
          couponTitle
        }
        createdAt
        incrementId
        items {
          id
          imageUrl
          name
          qty
          price
          rowTotal
          imageUrl
          sku
        }
        serviceOrderInformation {
          service,
          phoneNumber,
          contactName,
          companyName,
          orderReferenceNumber,
          deliveryTimeRange,
          fromAddress,
          toAddress,
          note,
          attachments {
            id
            name
            size
          }
        }
      }
      totalCount
      pageSize
      currentPage
    }
  }
`;

export const GET_CUSTOMER_DEFAULT_BILLING = gql`
    query getCustomerDefaultBilling($customerToken: String!) {
        getCustomerDefaultBilling(customerToken: $customerToken) {
            id,
            title,
            defaultBilling,
            defaultShipping,
            country {
                id,
                name
            },
            region {
                id,
                name,
                code
            },
            street,
            city,
            firstname,
            lastname,
            postcode,
            additionalNotes 
        }
        
    }
`;

export const CUSTOMER_EXISTS = gql`
    query customerExists($email: String!) {
      customerExists(email: $email)
    }
`;

export const PHONE_EXISTS = gql`
    query phoneExists($phone: String!) {
      phoneExists(phone: $phone)
    }
`;

export const GET_CARDS = gql`
  query getCards($customerToken: String!, $stripeCustomerToken: String!) {
    stripeGetCards(
      customerToken: $customerToken
      stripeCustomerToken: $stripeCustomerToken
    )
  }
`;

export const GET_SLIDER_IMAGES = gql`
  query getSlider($sliderId: Int!) {
    getSlider(sliderId: $sliderId) {
      slides {
        id
        title
        imagePath
        imageUrl
        content
      }
    }
  }
`;

export const GET_TRANSLATIONS = gql`
  query getTranslations($phrases: [String], $storeCode: String) {
    getTranslations(phrases: $phrases, storeCode: $storeCode) {
      original
      translation
    }
  }
`;

export const GET_DELIVERY_TIME = gql`
  query getDeliveryDatesByZipCode($zipCode: String!, $customerToken: String!) {
    getDeliveryDatesByZipCodeByCustomerGroup(zipCode: $zipCode, customerToken: $customerToken) {
      range
      dates {
        date
        hours
      }
    }
  }
`;

export const GET_WISHLISTS = gql`
  query getWishlists($customerToken: String!) {
    getWishlists(customerToken: $customerToken) {
      id
      name
      error
      itemsCount
    }
  }
`;

export const GET_WISHLIST_ITEMS = gql`
  query getWishlistItems($customerToken: String!, $wishlistId: ID!) {
    getWishlistItems(customerToken: $customerToken, wishlistId: $wishlistId) {
      itemId
      sku
      qty
    }
  }
`;

export const GET_ALL_WISHLIST_ITEMS = gql`
  query getAllWishlistItems($customerToken: String!) {
    getAllWishlistItems(customerToken: $customerToken) {
      wishlistId
      wishlistName
      itemId
      sku
      qty
    }
  }
`;

export const GET_DELIVERY_DATES = gql`
  query getDeliveryDatesByZipCode($zipCode: String!) {
    getDeliveryDatesByZipCode(zipCode: $zipCode) {
      dates {
        date
      }
    }
  }
`;

export const GET_SERVICE_PRODUCTS = gql`
  query getServiceProducts($serviceType: String!) {
    getServiceProducts(serviceType: $serviceType) {
      sku
      name
      price
      imageUrl
    }
  }
`;

export const GET_SERVICE_ORDER = gql`
  query getServiceOrderInformation($orderId: Int!, $customerToken: String!) {
    getServiceOrderInformation(orderId: $orderId, customerToken: $customerToken) {
      service,
      phoneNumber,
      contactName,
      companyName,
      orderReferenceNumber,
      deliveryTimeRange,
      fromAddress,
      toAddress,
      note,
      attachments {
        id
        name
        size
      }
    }
  }
`;

export const GET_RELATED_CUSTOMERS = gql`
  query companyGetCompanyRelatedCustomers($customerToken: String!) {
    companyGetCompanyRelatedCustomers(customerToken: $customerToken) {
      id
      name
      email
      phone
      role
      status
    }
  }
`;

export const GET_CART_TEMPLATES = gql`
  query companyGetRelatedCartTemplates($customerToken: String!) {
    companyGetRelatedCartTemplates(customerToken: $customerToken) {
      id
      name
      products {
        sku
        qty
        name
        price
        imageUrl
        deliveryOption
      }
    }
  }
`;

export const COMPANY_GET_USER_CART = gql`
  query companyGetCustomerCart($customerToken: String!, $customerId: Int) {
    companyGetCustomerCart(customerToken: $customerToken, customerId: $customerId) {
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
        grandTotal
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

export const GET_PENDING_ORDERS = gql`
  query companyGetShopperOrderRequests(
    $customerToken: String!,
    $pageSize: Int!,
    $currentPage: Int!,
    $sortOrders: [SortOrderInput],
    $orderRequestCustomerId: Int
  ) {
    companyGetShopperOrderRequests(
      customerToken: $customerToken,
      pageSize: $pageSize,
      currentPage: $currentPage,
      sortOrders: $sortOrders,
      orderRequestCustomerId: $orderRequestCustomerId
    ) {
      items {
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
          street
          city
          postcode
          country{name}
          region{name}
        }
        shippingAddress {
          street
          city
          postcode
          country{name}
          region{name}
        }
        customer {
          firstname
          lastname
        }
        expiresAt
        requestStatus
        requestPayment
        requestCreatedAt
        requestServiceOrderInformation {
          service,
          phoneNumber,
          contactName,
          companyName,
          orderReferenceNumber,
          deliveryTimeRange,
          fromAddress,
          toAddress,
          note,
          attachments {
            id
            name
            size
          }
        }
      }
      totalCount
      currentPage
      pageSize
    }
  }
`;

export const GET_COMPANY_ORDERS = gql`
  query companyGetRelatedCustomerOrders(
    $customerToken: String!
    $pageSize: Int!
    $currentPage: Int!
    $sortOrders: [SortOrderInput]
  ) {
    companyGetRelatedCustomerOrders(customerToken: $customerToken, pageSize: $pageSize, currentPage: $currentPage, sortOrders: $sortOrders) {
      items {
        state
        id
        status
        payment {
          success
          name
          code
        }
        shipping {
          title
          price
          deliveryTime
          sizeCode
        }
        shippingAddress {
          street
          city
          postcode
          country{name}
          region{name}
        }
        billingAddress {
          street
          city
          postcode
          country{name}
          region{name}
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
          couponTitle
        }
        createdAt
        incrementId
        items {
          id
          imageUrl
          name
          qty
          price
          rowTotal
          imageUrl
          sku
        }
        serviceOrderInformation {
          service,
          phoneNumber,
          contactName,
          companyName,
          orderReferenceNumber,
          deliveryTimeRange,
          fromAddress,
          toAddress,
          note,
          attachments {
            id
            name
            size
          }
        }
      }
      totalCount
      pageSize
      currentPage
    }
  }
`;

export const GET_PENDING_ORDERS_COUNT = gql`
  query companyGetShopperOrderRequests(
    $customerToken: String!,
    $pageSize: Int!,
    $currentPage: Int!,
    $sortOrders: [SortOrderInput],
    $orderRequestCustomerId: Int
  ) {
    companyGetShopperOrderRequests(
      customerToken: $customerToken,
      pageSize: $pageSize,
      currentPage: $currentPage,
      sortOrders: $sortOrders,
      orderRequestCustomerId: $orderRequestCustomerId
    ) {
      totalCount
    }
  }
`;

export const GET_REPORTS = gql`
  query companyGetOrderReport($customerToken: String!,
    $pageSize: Int,
    $currentPage: Int,
    $dateRange: DateRangeInput,
    $shippingAddressIds: [Int!]
  ) {
    companyGetOrderReport(customerToken: $customerToken, pageSize: $pageSize, currentPage: $currentPage, dateRange: $dateRange, shippingAddressIds: $shippingAddressIds) {
      items {
        state
        id
        status
        payment {
          success
          name
          code
        }
        shipping {
          title
          price
          deliveryTime
          sizeCode
        }
        shippingAddress {
          street
          city
          postcode
          country{name}
          region{name}
        }
        billingAddress {
          street
          city
          postcode
          country{name}
          region{name}
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
          couponTitle
        }
        createdAt
        incrementId
        items {
          id
          imageUrl
          name
          qty
          price
          rowTotal
          imageUrl
          sku
        }
        serviceOrderInformation {
          service,
          phoneNumber,
          contactName,
          companyName,
          orderReferenceNumber,
          deliveryTimeRange,
          fromAddress,
          toAddress,
          note,
          attachments {
            id
            name
            size
          }
        }
        customer {
          firstname
          lastname
        }
      }
      totalCount
      grandTotal
    }
  }
`;

export const COMPANY_GET_ADDRESSES = gql`
  query companyGetAddresses($customerToken: String!) {
    companyGetAddresses(customerToken: $customerToken) {
      id
      address
    }
  }
`;

export const GET_PAYMENT_INTENT = gql`
  query stripeGetPaymentIntent($customerToken: String!, $intentId: String!) {
    stripeGetPaymentIntent(customerToken: $customerToken, intentId: $intentId) {
      id
      clientSecret
      confirmationMethod
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

export const GET_CUSTOMER_CARDS = gql`
  query companyGetRelatedCustomerCards($customerToken: String!, $customerId: Int) {
    companyGetRelatedCustomerCards(customerToken: $customerToken, customerId: $customerId) {
      id
      expMonth
      expYear
      last4
      brand
    }
  }
`;