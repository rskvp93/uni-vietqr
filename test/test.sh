#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Cleaning npm cache..."
npm cache clean --force

echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "Installing uni-vqr..."
npm install uni-vqr

echo "Testing uni-vqr usage..."
node -e "
const { generateVietQR } = require('uni-vqr');
const qrCode = generateVietQR({
  bankId: '970418',
  accountNumber: '123456789',
  accountName: 'John Doe',
  amount: 1000.5,
  message: 'Payment for invoice #123'
});
console.log('Generated QR Code:', qrCode);
"
