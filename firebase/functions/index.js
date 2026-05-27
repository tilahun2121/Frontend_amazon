const { config } = require("dotenv");
const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const { Message } = require("firebase-functions/pubsub");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Call config correctly
dotenv.config();

// Initialize Stripe correctly
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Initialize express app correctly
const app = express();

// Use cors correctly
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ 
        Message: "success",
    });
});

// FIXED: Added missing slash in route
app.post("/payment/create", async (req, res) => {
    const total = req.query.total;
    
    if (total > 0) {
        // FIXED: Removed the dot after await and fixed spelling
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,//Math.round(total * 100), // Convert to cents/pence
            currency: "usd",
        });
        // console.log(total);
        // res.send(total);
        console.log(paymentIntent);
        res.status(201).json(paymentIntent);
        // FIXED: Moved inside the if block and fixed status code
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } 
    else {
        res.status(403).json({
            Message: "total must be greater than 0"
        });
    }
});

// Export the API
exports.api = onRequest(app);