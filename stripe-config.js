require('dotenv').config(); // lädt .env-Datei
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Secret Key aus .env
module.exports = stripe;