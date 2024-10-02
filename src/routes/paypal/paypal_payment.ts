import express from "express";
import { capturePayment, createOrder, generateAccessToken } from "../../controllers/paypal/paypal_payment";

const app = express.Router();

app.post('/generate-token', async(req, res) => {
    try {
        const access_Token = await generateAccessToken();
        return res.json({
            token: access_Token
        });
    } catch (error) {
        console.log("error in generate token: ", error);
        return res.send('Error: ' + error)
    }
});
app.post('/create-order', async(req, res) => {
    try {
        console.log("/create-order route called");
        const { amount, currency, token }:any = req.body;
        console.log("amount: ", amount, " currency: ", currency, token);
        const response:any = await createOrder(amount, currency, token);

        console.log("response: ", response.data)
        return res.status(200).json({response: response.data});
    } catch (error) {
        console.log("error in create order: ", error);
        return res.send('Error: ' + error)
    }
});


app.post('/capture-order', async (req, res) => {
    const { id, token } = req.body;
    console.log("/capture-order route called: ", id, token);
    try {
        const response =  await capturePayment(id, token); 
        console.log("response", response.data);
        return res.status(200).json({ status: 'success', response: response.data });
    } catch (error:any) {
        return res.status(500).json({ error: error.message });
    }
});

// Success route
app.get('/paypal-success', (req, res) => {
    const token = req.query.token;
    res.redirect(`dntapp://success?token=${token}`);
});
  
  // Cancel route
app.get('/paypal-cancel', (req, res) => {
    res.redirect('dntapp://cancel');
});

export default app;