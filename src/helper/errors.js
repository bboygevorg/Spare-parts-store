const { isArray} = require('lodash')

// @api Keep in mind to do not change already used error codes.
const errorCodesMap = {
    "-1": "Server currently can't do the verification. Please try a bit later.",
    "-2": "Incorrect phone number. Please check your input and try again!",
    "-3": "There were too many verification attempts for this phone number. Please try in 20 minutes.",
    "-4": "SMS is not supported by landline phone number.",
    0: [
        'Unauthorized',
        'Incorrect customer token.'
      ],
    1: 'Only US Phone Numbers are allowed.',
    2: 'Wrong number',
    3: 'Telephone Number is mandatory.',
    4: '"Email" is not a valid email address.',
    5: 'The customer email is missing. Enter and try again.',
    6: 'A customer with the same email address already exists in an associated website.',
    7: [
      '"First Name" is a required value.',
      '"firstname" is required. Enter and try again.',
      'Please specify first name'
    ],
    8: [
      '"Last Name" is a required value.',
      '"lastname" is required. Enter and try again.',
      'Please specify last name'
    ],
    9: 'Verification code is incorrect.',
    10: 'Current customer is not the owner of requested order',
 // 11: Moved to 0
    12: [
      'The entity that was requested doesn\'t exist. Verify the entity and try again.',
      'An ID is needed. Set the ID and try again.'
      ],
    13: [
        '"street" is required. Enter and try again.',
        'Please specify street name'
    ],
    14: [
        '"city" is required. Enter and try again.',
        'Please specify city'
    ],
    15: [
        '"postcode" is required. Enter and try again.',
        'Wrong Zip Code, allowed format: XXXXX'
    ],
    16: [
        '"countryId" is required. Enter and try again.',
        'Country is not specified'
    ],
    17: 'Invalid value of provided for the countryId field.',
    18: 'Invalid value of provided for the regionId field.',
    20: 'Wrong Algolia results structure.',
    21: 'Product not found in Algolia.',
    22: 'More than one product found in Algolia.',
    23: 'Product structure is invalid.',
    24: 'Cart Token is not specified or can\'t be acquired',
 // 24: Moved to 31
    25: 'Requested shipment is not related with passed order',
    26: 'Requested invoice is not related with passed order',
    27: 'No invoice to send.',
    31: [ // Requested cart does not exist.
        'No such entity with cartId = null',
        'No such entity with cartId = \\d+',
        'No such entity with customerId = \\d+',
        '"quoteId" is required. Enter and try again.',
        'Current customer does not have an active cart.',
        'Cart is expired.' // is thrown only by guest getCart
      ],
    32: 'Wrong usage of method',
 // 33: Moved to 31
    34: 'The \\d+ Cart doesn\'t contain the [\\d]+ item.',
    35: [
        'Coupon code can not be applied.',
        'The coupon code couldn\'t be applied. Verify the coupon code and try again.'
      ],
    36: 'The "\\d+" Cart doesn\'t contain products.',
    37: 'The coupon code isn\'t valid. Verify the code and try again.',
    38: 'Coupon code can not be deleted.',
    40: 'Could not find Customer for given Email and Telephone Number.',
    41: 'Address does not exist in Customer\'s address book.',
    51: 'Name already used.',
    52: 'Name is too long',
    53: 'Unknown error, please try later.',
    60: 'Number of seconds needs to be positive number.',
    70: 'We\'re unable to deliver package under selected address',
    80: 'The country isn\'t available.',
    81: 'No such region in selected country',

    // Stripe Assign
    90: 'Could not assign Stripe Payment to Order .+',
    91: 'No such Stripe Customer',
    92: 'Order\'s status does not allow to assign Payment Process',
    93: 'Order is not placed with Stripe method',
    94: 'Given StripeCustomer does not match the Customer',
    95: 'No such entity with orderId = \\d+',
    96: 'Stripe Customer and PaymentIntent is mandatory',
    120: 'Customer with provided email already exist.',
    121: 'Invalid invitation link',
    122: 'Invitation email should be the same as registration email.',
    123: 'You order needs company admin approval.',
    124: 'Company name can not be empty',
    // Other
    500: 'Internal Server Error',
    503: 'Maintenance mode',
    999: 'connect ECONNREFUSED [0-9]+' // Magento server unavailable
};

export const getMessage = (code) => {
    if(!code) {
      return "";
    }
    if(code === 31) {
        return errorCodesMap[code][5];
    }
    else 
    if(!isArray(errorCodesMap[code])) {
         return errorCodesMap[code];
    }
    else {
         return errorCodesMap[code][0];
    }
}

