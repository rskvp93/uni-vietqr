# uni-vietqr

A utility package for generating and handling VietQR codes.

## Installation

```bash
npm install uni-vietqr
```

## Usage

```javascript
const { generateVietQR } = require('uni-vietqr');

// Example: Generate a VietQR code
const qrCode = generateVietQR({
  bankId: '970418',
  accountNumber: '123456789',
  accountName: 'John Doe',
  amount: 1000.5,
  message: 'Payment for invoice #123'
});

console.log(qrCode);
```

## API Documentation

### `generateVietQR(options)`

Generates a VietQR code string based on the provided parameters.

#### Parameters

- `options` (Object): The options for generating the QR code.
  - `bankId` (string, required): The bank ID (NAPAS standard).
  - `accountNumber` (string, required): The recipient's account number.
  - `accountName` (string, optional): The recipient's account name.
  - `amount` (number, optional): The transfer amount.
  - `message` (string, optional): The transfer message.

#### Returns

- `string`: The generated VietQR code string.

#### Example

```javascript
const qrCode = generateVietQR({
  bankId: '970418',
  accountNumber: '123456789',
  accountName: 'John Doe',
  amount: 1000.5,
  message: 'Payment for invoice #123'
});

console.log(qrCode);
// Output: A string representing the VietQR code
```

#### Error Handling

Throws an error if required fields (`bankId` or `accountNumber`) are missing.

```javascript
try {
  generateVietQR({ accountNumber: '123456789' });
} catch (error) {
  console.error(error.message); // Output: "bankId and accountNumber are required fields."
}
```

### `decodeVietQR(qrCode)`

Decodes a VietQR code string and extracts its components.

#### Parameters

- `qrCode` (string, required): The VietQR code string to decode.

#### Returns

- `Object`: An object containing the decoded components:
  - `bankId` (string): The bank ID.
  - `accountNumber` (string): The recipient's account number.
  - `accountName` (string, optional): The recipient's account name.
  - `amount` (number, optional): The transfer amount.
  - `message` (string, optional): The transfer message.

#### Example

```javascript
const { decodeVietQR } = require('uni-vietqr');

const qrCode = '000201010211260600A0000007279704180112312345678902541000.5062Payment for invoice #1236304';
const result = decodeVietQR(qrCode);

console.log(result);
// Output:
// {
//   bankId: '970418',
//   accountNumber: '123456789',
//   amount: 1000.5,
//   message: 'Payment for invoice #123'
// }
```

#### Error Handling

Throws an error if the QR code string is invalid.

```javascript
try {
  decodeVietQR('');
} catch (error) {
  console.error(error.message); // Output: "Invalid QR code string."
}
```

## Features

✅ Generate QR codes based on VietQR format  
✅ Parse existing VietQR codes to extract info like bank, account number, amount, message, etc.  
✅ Bank-agnostic — works with many Vietnamese banks  
✅ Follows the EMVCo standard (the global QR payment format used in VietQR)

## License

MIT
