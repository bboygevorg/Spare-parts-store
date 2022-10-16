import { actions } from 'actions/firebase'
import { actions as languageActions } from 'actions/language';
import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";
import fetch from 'node-fetch';

const client = new ApolloClient({
    uri: process.env.BACKEND_URL,
    fetch: fetch
});

export const LANGUAGE_KEYS = [
    {code: "default", name: 'en'},
    {code: "es_ES", name: 'es'},
    {code: "ru_RU", name: 'ru'},
    {code: "hy_AM", name: 'hy'},
    {code: "he_IL", name: 'he'},
    {code: "zh_Hans_CN", name: 'zh_Hans_CN'},
    {code: "zh_Hant_TW", name: 'zh_Hant_TW'},
    {code: "ko_KR", name: 'ko'}
];

export const phrases = [
    "SIGN UP", "Sign Up", "SIGN IN", "Sign In", "SIGN OUT", "First name", "Last name", "E-mail address", "Get started now",
    "Verify security code", "Shortly you will receive sms with security code", "If you already have been here before, please",
    "SHOP BY STORE", "Search all stores...", "Search in multiple stores...", "Search in ", 
    "SEARCH", "By category", "For a limited time: FREE 1 hour Car Delivery*", "YOUR FAVORITE BUILDING MATERIALS, DELIVERED IN ABOUT 1 HOUR.",
    "Now Serving Los Angeles County", "Monday - Friday 8:30 AM to 4:30 PM", "Saturday 8:30 AM to 12 PM",
    "ENTER ZIP CODE FOR INSTANT DELIVERY QUOTE", "Los Angeles County addresses only, during Beta", "Enter a ZIP Code",
    "Immediate Delivery", "Building materials delivered in about an hour, starting at $12", "150,000 Items in Stock",
    "Select from over 150,000 items in stock and available for immediate delivery from multiple suppliers, with a single checkout",
    "FREE RETURNS", "The BuildClub does not charge any fees for a return.", "SHOPS", "The Home Depot",
    "Ferguson", "Grainger", "Walters Wholesale Electric", "Lowe's", "Ace West LA", "Ace Culver City", "Heating and Cooling Supply",
    "All Stores", "TOP CATEGORIES", "CHECK OUT OUR MOBILE APPS!", "CONNECT WITH US", "NAVIGATION", "Product categories", "POLICIES & FAQ",
    "Return Policy", "Privacy Policy", "Terms & Conditions", "FAQ", "CUSTOMER SUPPORT", 
    "*Free car delivery promotion is only available for orders of items that fit in a standard car seat or trunk, and may be modified or canceled at any time.",
    "2021 BuildClub. All rights reserved", "See all products", "Product Categories", "By", "View more",
    "View less", "ADD TO CART", "Call or text us!", "Can't find what you need?", "Tell us what you need we will try to find it for you",
    "Contact us", "RESET FILTERS", "READ MORE", "READ LESS", "Results", "Code", "Qty:", "Product description",
    "LAST VIEWED ITEMS", "SHOPPING CART", "Price", "Quantity", "Total", "GO TO CHECKOUT", "Use Coupon Code", "Enter coupon code",
    "APPLY", "Your cart is about to expire", "The cart will be expired in 15 mins, would you like still to keep it?",
    "OK", "EXTEND", "Don't show again", "Your shopping cart is empty.", "TELL US ABOUT YOU", "Delivery type", 
    "Billing address", "Delivery address", "Payment", "Summary", "DELIVERY TYPE", "Car", "Suv", "flatbed", "Pickup truck", "Backseat or trunk of a car",
    "Backseat or trunk of SUV", "Pipe, large appliance, single pallet", "CONFIRM", "DELIVERY ADDRESSES", "ADD NEW DELIVERY ADDRESS",
    "SELECT PAYMENT METHOD", "REVIEW YOUR ORDER", "CHANGE", "Order Summary", "Product Total", "Delivery fee", "Discount amount", "Taxes", "Total",
    "PLACE YOUR ORDER", "Legal notes", "Estimated Arrival Time", "ACCEPT", "CANCEL", "Congratulations!", "Your order is on the way!",
    "Sorry, currently we operate in LA County only.", "Are you sure you want to sign out?", "Yes", "No", "My profile", "My orders", "Payment methods",
    "Profile", "My Orders", "Job Addresses", "Billing Address", "Payment Method", "Sign out", "PROFILE", "Save", "There are no orders yet.",
    "MY ORDERS", "Latest Orders", "JOB ADDRESSES", "ADD NEW ADDRESS", "Title", "Address 1", "Address 2", "City", "ZIP", "Country", "State", 
    "EDIT", "DELETE", "BILLING ADDRESS", "PAYMENT METHODS", "ADD A NEW CARD", "SELECT A PAYMENT METHOD", "ADD A CARD", "Name on card", "Enter name on card",
    "Card number", "Card Cvc", "CVC", "Expiration date", "Cancel", "This is your default payment method", "item", "Status", "Payment method", "Product Total",
    "Delivery", "Taxes", "Total", "Download Invoice", "Send to email", "FAVORITES", "Frequently Asked Questions", "What is the delivery area?",
    "Presently, we are only servicing the greater Los Angeles area, but stay tuned as we roll-out new cities", "How much does delivery cost?",
    "Delivery can be as low as $12 for small items. Please see the cost generator in our app for detailed pricing information.", 
    "How long does delivery take?", "We start shopping your items immediately and deliver once complete, so super fast! We generally leave the store on our way to you in less than 30 minutes.",
    "Can I order items from multiple stores on the app at the same time?", "Absolutely! Fast and easy. We do all the work.", "Delivery fee is per vheicle, so fill it up!", 
    "We don't charge per item for delivery, so you should order lots of stuff and fill the car/truck!", "Returns", "Looking for something?", "RETURN POLICY", "PRIVACY POLICY",
    "PRODUCTS BY CATEGORY", "GET YOUR DELIVERY PRICE", "Los Angeles County addresses only", "ENTER ZIP CODE FOR INSTANT DELIVERY QUOTE", "WHERE WILL YOUR STUFF FIT?",
    "Coming soon", "GET DELIVERY PRICE", "Delivery price to your location", "Estimated arrival time", "Today", "START SHOPPING", "TRY ANOTHER LOCATION",
    "Oops, Currently we operate in LA County only", "Results for  from  ", "Only US Phone Numbers are allowed.", "Wrong number", "Telephone Number is mandatory.",
    "'Email' is not a valid email address.", "The customer email is missing. Enter and try again.", "A customer with the same email address already exists in an associated website.",
    "'First Name' is a required value.", "'Last Name' is a required value.", "Verification code is incorrect.", "Please specify street name",
    "Wrong Zip Code, allowed format: XXXXX", "'countryId' is required. Enter and try again.", "Country is not specified", "Product not found in Algolia.", "More than one product found in Algolia.", "Coupon code can not be applied.", "The coupon code couldn't be applied. Verify the coupon code and try again.",
    "All fields required.", "Zipcode is a required value.", "Wrong usage of method", "The coupon code isn't valid. Verify the code and try again.", "Required", "This phone number doesn't exists in an associated website.",
    "Tel: ", "ADD JOB ADDRESS", "SAVE", "'State' is a required value.", "'Country' is a required value.", "'Firstname' is a required value.","'Address_1' is a required value.","'Lastname' is a required value.",
    "'City' is a required value.", "Type only numbers.", "'Zip' is a required value.", "Invalid email", "Addresses", "Current customer does not have an active cart.", "REMOVE COUPON", "Cart", "Features & Details", "ADD NEW BILLING ADDRESS",
    "DELIVERY ADDRESS", "Accept", "Oops!", "SUV", "Get delivery price", "Nr", "Order number", "Results for", "from", "Are you sure you want to delete the address?", "EDIT JOB ADDRESS", "Email: ", "Stores", 
    "Email is a required value.", "Phone is a required value.","Invalid phone number", "'Email' is a required value.", "'Phone' is a required value.", "Could not find Customer for given Email and Telephone Number.", "CONTINUE", "HVAC License (Optional)", "EPA Certification (Optional)", "Reseller", "Reseller ID",
    "Company Name", "HVAC License required to purchase this product.", "HVAC License", "EPA Certification", "ADD", "Delivery Time", "Please login and try again.", "HVAC License and EPA Certification are required in order to buy this product.", "EPA Certification is required to purchase this product.",
    "Service Off", "We are sorry, but for the moment we are fully booked today. Please try later.", "DELIVERY TIME & DELIVERY ADDRESS", "DELIVERY TIME & DELIVERY ADDRESSES", "DELIVERY TIME", "Your card was declined.", "Extra notes", "items", "Phone number already registered.",
    "This email address doesn't exist in an associated website.", "Sorry, we could not find any results to match your search criteria.", "Please try again with some different keywords.", "The BuildClub does not charge any fees for returns. Returns are subject to the return policies of the sourcing supplier. Please see the following links for additional details.",
    "BuildClub delivery costs (if any) may not be refundable, depending on the reason for the return. Please contact The BuildClub customer service to arrange a return.", "Coupon code", "CALL FOR STOCK", "Floor and decor", "Currently only delivering to Los Angeles County, California", "Safety and PPE", "Estimated Delivery", "Same day", "Instant Delivery",
    "(+1) xxx-xxx-xxxx (supports only mobile numbers)", "FEATURED PRODUCTS", "Max send attempts reached", "OTHERS", "INSTANT DELIVERY", "I want separate delivery for items with Instant delivery", "Estimated delivery time for you products", 'Products with this "Instant" badge can be delivered with in 1 hour', "Instant delivery at", "Other delivery", "Smart phone, smarter experience.",
    "You can install Android application and get better shopping experience.", "You can install iOS application and get better shopping experience.", "Page not found.", "Favorites", "Return", "Privacy", "The Buildclub | Online Shopping | Same Day Delivery", "Your on-Demand Marketplace. Construction Projects & Home Improvement Needs. Lumber, Flooring, Hardware, Lighting & More. Same Day Delivery.",
    "Enter a ZIP Code to your detination", "Verify now", "Unfortunately we currently don't operate in your selected location.", "Ok", "Good news! We have express delivery to your destination.", "Continue shopping", "Check if we deliver to your destination", "CALL OR TEXT US", "Call us", "Text us", "Create a new Wish List", "CREATE WISH LIST", "Enter Wish List Name", "CREATE", "Please choose a Wish List for the selected product",
    "MY WISH LIST", "This wish list is empty.", "Are you sure you want to delete the wish list", 'Name already used.', 'Name is too long', 'Unknown error, please try later.', "Please select the type of vehicle that is most fitting to deliver your items. If your items will fit in the passenger seat or the trunk of a car, select Car. If your item is long, heavy or bulky, select truck/Van. Don't worry, if you get it wrong, our customer service team will contact you and offer further guidance.",
    "ADD TO WISHLIST", "Remove product from list", "REMOVE FROM LIST", "Login to your account to see your favorites.", "Custom", "Are a contractor?", "Contract license", "We have special offers and conditions for contractors", "'Resellerid' is a required value.", "'Contractorlicence' is a required value.", "Products will be delivered during the day.", "Prearranged with BuildClub",
	  "Remove", "Popular Filters", "CAREERS", "Brand", "Your payment was declined. Please check your card details and try again!", "Make sure you gave mobile numbers. Landline numbers not supported",
    "Server currently can't do the verification. Please try a bit later.", "Incorrect phone number. Please check your input and try again!", "There were too many verification attempts for this phone number. Please try in 20 minutes.", "SMS is not supported by landline phone number.", "Search in entire catalog", "Order courier title",
    "Your cart has some products. Please checkout them or clear your card before processing with ordering a courier service.", "Go to cart", "Clear cart and proceed", "PICK UP INFORMATION", "From is a required value.", "Contact name is a required value.", "Phone number is a required value.", "WHEN?", "ORDER COURIER NOW", "Delivery price:", "ORDER NOW", "Contact name at pickup location", "Phone number at pickup location", "Company name at pickup location", "Order reference number", "Notes",
    "WHERE TO DELIVER?", "Skip the trip & get what you need delivered where & when you need it. Discover BuildClub. Shop 150,000+ items available for immediate delivery.", "Book one of our Vans for same day or scheduled delivery of your Building and Construction Materials.", "Book one of our Flatbed Trucks for same day or scheduled delivery of your Building and Construction Materials from any supplier to your job site.", "to", "at", "You can’t checkout delivery service and product order at the same time. Please leave one kind of items in your shopping cart and try again.",
    "ORDER COURIER FLATBED", "ORDER COURIER VAN", "Checkout.confirmation.standard.text.1", "Checkout.confirmation.standard.text.2", "Checkout.confirmation.standard.text.3", "Checkout.confirmation.standard.text.4", "Checkout.confirmation.standard.text.5", "Checkout.confirmation.standard.text.6", "Checkout.confirmation.standard.text.7", "Checkout.confirmation.service.text.1", "Checkout.confirmation.service.text.2", "Checkout.confirmation.service.text.3", "Checkout.confirmation.service.text.4", "Checkout.confirmation.service.text.5", "Checkout.confirmation.service.text.6", 
    "Checkout.confirmation.service.text.7", "Zip code is missing.", "Pay by card", "Invoice payment", "Size is too big. Max allowed 5MB.", "checkout_order_size_flatbed_description", "Attached files", "User management", "Cart management", "Cart templates", "Reports", "Estimations", "Enter email address", "Shopper", "Shop admin", "Admin", "Owner", "Invite new user", "Company field is required. Please update your information.", "Your invitation successfully sent.", "Customer with provided email already exist.", "products", "View template", "Edit template",
    "company.user.name", "company.user.email", "company.user.phone", "company.user.role", "Deactivate user", "Are you sure you want to change role of %s1 from %s2 to %s3?", "Are you sure you want deactivate user %s1 from list of users?", "Attach company card", "Activate user", "Are you sure you want activate user %s1 from list of users?", "deactivate", "activate", "Cart templates", "Delete template", 'Are you sure you want to delete "%s1" template?', "What's the name of your template?", "Type template name", "Delete template", "Save template", "Your template is empty.", "Search products to add them in template.",
    "Search", "Add to template", "Create template", "Remove from template", "Add template to cart", "Search products from entire catalogue", "Total price", "No results.", "Select all", "cart.template.picture", "cart.template.name", "cart.template.price", "cart.template.qty", "Cart management", "Add products to cart", "Add products from templates", "Remove all products", "Remove product", "No items", "Close Cart", "View Cart", "Add template/s to cart", "You order needs company admin approval.", "Pending orders", "No pending orders.", "Placed orders", "No placed orders.", "Orders", "Order date",
    "All orders", "Order status", "Reject order", "Approve order", "Reason of rejection", "Please mention the reason you want reject this order", "Type the reason", "Reject", "Invitation email should be the same as registration email.", "Invalid invitation link", "Company name can not be empty", "Reports", "Job address", "Address", "Date of order", "Date of delivery", "See less", "View details", "Export CSV", "Grand total", "Name", "Van delivery", "Flatbed delivery", "Update", "Update quantity", "Rejected!", "Approved!", "Email", 
    "Edit order", "Save changes", "ADD TO ORDER", "Add products to order", "Are you sure you want to remove this pending order?", "Reorder", "There are items in your cart.", "Merge items", "Clear cart and add", "Back", "3d authentication failed.", "Add company card", "Attach", "Remove card", "Manage payment methods", "Add new card", "Join the next Silicon Valley Unicorn! We are always looking for talent.", "has limited rights. Can see company templates and place orders in the system, but the order will require approval from Admins or Shop admins.",
    "can see user list. Manage their shopping carts. Approve / edit or decline pending orders. Generate company based reports.", "has all above privileges plus full user management including inviting new users, deactivating existing users and attaching company cards to other users.", "Unfortunately we currently don't operate in your selected location. Only for prearranged deliveries choose “custom” and move forward.", "CHANGE BILLING ADDRESS", "Unfortunately we currently don’t operate in your selected location.",
		"Address validation failed. Please make sure that zip code and state in delivery address is correct.", "Your selected delivery location doesn't match with selected store. Please change store or fix delivery address and try again.",
		"You're shopping", 'other_location_info_message', 'other_locations_title', 'automatic_zone_detection_message', 'free_gas_form_submit', 'free_gas_form_footer', 'free_gas_form_address', 'free_gas_form_phone', 'free_gas_form_name', 'free_gas_form_license', 'free_gas_form_email',
		"free_gas_form_title", 'free_gas_apply_button', 'free_gas_form_header', 'free_gas_params_not_valid', 'free_gas_confirmation_message', 'free_gas_form_error_user_already_exist', 'free_gas_form_error_license_already_used', 'Cart was updating during checkout process. Please check you cart and try again.'
]

export const loadFirebaseData = async (store, firebase) => {
   const res = await firebase.remoteConfig().getTemplate()
    let firebaseObj = {};
    for (const [, value] of Object.entries(res.parameterGroups)) { 
        for(const [, va] of Object.entries(value)) {
            for(const [k, v] of Object.entries(va)) {
                if(k !== "google_places_api_key" && k !== "aws_secret_key" && k !== "aws_access_key" && k !== "algolia_search_key") {
                    firebaseObj = {...firebaseObj, [k]: v.defaultValue.value}
                }
            }
        }
    }
    return store.dispatch(actions.setFirebaseConfig(firebaseObj))
}

export const setLocaleId = async (store, localeId) => {
    if(localeId) {
        const lang = LANGUAGE_KEYS.find(el => el.name === localeId);
        const fullCode = lang && lang.code;
        store.dispatch(languageActions.setCurrentLanguage(fullCode));
        if(fullCode) {
             const GET_TRANSLATIONS = gql`
                query getTranslations($phrases: [String], $storeCode: String) {
                    getTranslations(phrases: $phrases, storeCode: $storeCode) {
                        original
                        translation
                    }
                }
            `;
            const { data } = await client.query({
                query: GET_TRANSLATIONS,
                variables: {
                    phrases,
                    storeCode: fullCode
                }
            });
            store.dispatch(languageActions.setTranslation(data.getTranslations));
        }
    }
    else {
        store.dispatch(languageActions.setCurrentLanguage("default"));
        const GET_TRANSLATIONS = gql`
        query getTranslations($phrases: [String], $storeCode: String) {
            getTranslations(phrases: $phrases, storeCode: $storeCode) {
                original
                translation
            }
        }
        `;
        const { data } = await client.query({
            query: GET_TRANSLATIONS,
            variables: {
                phrases,
                storeCode: "default"
            }
        });
        store.dispatch(languageActions.setTranslation(data.getTranslations));
    }
}

export const setIsBot = (store, isBot) => {   
    return store.dispatch(actions.setIsGoogleBot(isBot))
}

const dataLoaders = [
    loadFirebaseData,
    setLocaleId,
    setIsBot
];

export default dataLoaders;