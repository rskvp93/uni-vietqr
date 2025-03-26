# uni-vqr

A utility package for generating and handling VietQR codes.

## Installation

```bash
npm install uni-vqr
```

## Usage

```javascript
const { generateVietQR } = require('uni-vqr');

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
const { decodeVietQR } = require('uni-vqr');

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

### `generateMoMoQR(options)`

Generates a MoMo QR code string based on the provided parameters.

#### Parameters

- `options` (Object): The options for generating the QR code.
  - `partnerCode` (string, required): The MoMo partner code.
  - `partnerRefId` (string, required): The reference ID for the transaction.
  - `amount` (number, required): The transaction amount.
  - `description` (string, optional): The transaction description.

#### Returns

- `string`: The generated MoMo QR code string.

#### Example

```javascript
const qrCode = generateMoMoQR({
  partnerCode: 'MOMO',
  partnerRefId: '123456789',
  amount: 50000,
  description: 'Payment for order #123'
});

console.log(qrCode);
```

### `decodeMoMoQR(qrCode)`

Decodes a MoMo QR code string and extracts its components.

#### Parameters

- `qrCode` (string, required): The MoMo QR code string to decode.

#### Returns

- `Object`: An object containing the decoded components:
  - `partnerCode` (string): The MoMo partner code.
  - `partnerRefId` (string): The reference ID for the transaction.
  - `amount` (number): The transaction amount.
  - `description` (string, optional): The transaction description.

#### Example

```javascript
const result = decodeMoMoQR('0002010102113804MOMO3909123456789545000062Payment for order #1236304');

console.log(result);
// Output:
// {
//   partnerCode: 'MOMO',
//   partnerRefId: '123456789',
//   amount: 50000,
//   description: 'Payment for order #123'
// }
```

### `generateZaloPayQR(options)`

Generates a ZaloPay QR code string based on the provided parameters.

#### Parameters

- `options` (Object): The options for generating the QR code.
  - `appId` (string, required): The ZaloPay app ID.
  - `zpTransId` (string, required): The transaction ID for ZaloPay.
  - `amount` (number, required): The transaction amount.
  - `description` (string, optional): The transaction description.

#### Returns

- `string`: The generated ZaloPay QR code string.

#### Example

```javascript
const qrCode = generateZaloPayQR({
  appId: 'ZALO',
  zpTransId: '123456789',
  amount: 100000,
  description: 'Payment for order #123'
});

console.log(qrCode);
```

### `decodeZaloPayQR(qrCode)`

Decodes a ZaloPay QR code string and extracts its components.

#### Parameters

- `qrCode` (string, required): The ZaloPay QR code string to decode.

#### Returns

- `Object`: An object containing the decoded components:
  - `appId` (string): The ZaloPay app ID.
  - `zpTransId` (string): The transaction ID for ZaloPay.
  - `amount` (number): The transaction amount.
  - `description` (string, optional): The transaction description.

#### Example

```javascript
const result = decodeZaloPayQR('0002010102113804ZALO39091234567895410000062Payment for order #1236304');

console.log(result);
// Output:
// {
//   appId: 'ZALO',
//   zpTransId: '123456789',
//   amount: 100000,
//   description: 'Payment for order #123'
// }
```

## Features

✅ Generate QR codes based on VietQR format  
✅ Parse existing VietQR codes to extract info like bank, account number, amount, message, etc.  
✅ Bank-agnostic — works with many Vietnamese banks  
✅ Follows the EMVCo standard (the global QR payment format used in VietQR)

## Scripts

- `test`: Runs the test suite using Mocha.
- `build`: Placeholder for build steps (not required for this package).
- `publish`: Publishes the package to npm.

## License

MIT
