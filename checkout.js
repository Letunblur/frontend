const express = require('express');
const router = express.Router();
const stripe = require('./stripe-config');

router.post('/create-checkout-session', async (req, res) => {
  const { amount, email, fileId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'LetUnblur – Bild verbessern',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      customer_email: email,
      mode: 'payment',
      success_url: `http://localhost:3000/unlocked.html?file=${fileId}`,
      cancel_url: `http://localhost:3000/index.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Fehler bei Checkout-Session');
  }
});

module.exports = router;
