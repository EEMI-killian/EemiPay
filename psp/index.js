import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3052;

// Middleware pour parser le JSON
app.use(express.json());

app.post('/transaction', (req, res) => {
  console.log('Received transaction request:', req.body);
  
  // Destructure les données reçues depuis req.body
  const {
    merchantIban,
    merchantName,
    amount,
    currency,
    cardInfo: {
      cardNumber,
      cardExpiry,
      cardHolderName,
      cardCvc
    }
  } = req.body;
  
  const randomDelay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 3000;
  
  setTimeout(() => {
    return res.json({
      success: true,
      message: {
        transactionId: `SEPA_WIRE_TRANSFER_${uuidv4()}`,
        status: 'PROCESSED',
        amount: amount,
        currency: currency,
        maskedCardNumber: `****${cardNumber.slice(-4)}`,
        merchantIban: `****${merchantIban.slice(-4)}`,
        createdAt: new Date(),
      }
    });
  }, randomDelay);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});