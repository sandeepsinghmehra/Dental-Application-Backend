import config from "../../config/config"

const axios = require('axios')

// Fetch PayPal access token
const generateAccessToken = async () => {
    const response = await axios({
        url: config.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: config.PAYPAL_CLIENT_ID,
            password: config.PAYPAL_CLIENT_SECRET
        }
    })

    return response.data.access_token
}

// Create an order PayPal Payment 
const createOrder = async (amount:any, currency:any, token: any) => {
     
    const response = await axios({
        url: config.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            // purchase_units: [
            //     {
            //         items: [
            //             {
            //                 name: 'Node.js Complete Course',
            //                 description: 'Node.js Complete Course with Express and MongoDB',
            //                 quantity: 1,
            //                 unit_amount: {
            //                     currency_code: currency,
            //                     value: amount,
            //                 }
            //             }
            //         ],

            //         amount: {
            //             currency_code: 'USD',
            //             value: '100.00',
            //             breakdown: {
            //                 item_total: {
            //                     currency_code: 'USD',
            //                     value: '100.00'
            //                 }
            //             }
            //         }
            //     }
            // ],

            purchase_units: [
                {
                  amount: {
                    currency_code: currency, // Ensure this is a valid currency code, e.g., "USD"
                    value: amount, // Make sure this is a string and a valid number, e.g., "10.00"
                  },
                },
            ],
            application_context: {
                return_url: config.APP_CLIENT_URL + '/success',
                cancel_url: config.APP_CLIENT_URL + '/cancel',
                // shipping_preference: 'NO_SHIPPING',
                // user_action: 'PAY_NOW',
                // brand_name: 'MyErApp.com'
            }
        })
    });
    console.log("response completed");

    // return response.data.links.find((link:any) => link.rel === 'approve').href
    return response
}
const capturePayment = async (id:any, token:any) => {

    const response = await axios({
        url: config.PAYPAL_BASE_URL + `/v2/checkout/orders/${id}/capture`,
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    // console.log("response method", response.data);
    return response
}

export {
    generateAccessToken,
    createOrder,
    capturePayment,
};