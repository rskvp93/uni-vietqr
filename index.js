// Entry point for the uni-vietqr package

/**
 * Generates a VietQR code string based on the provided parameters.
 * @param {Object} options - The options for generating the QR code.
 * @param {string} options.bankId - The bank ID (NAPAS standard).
 * @param {string} options.accountNumber - The recipient's account number.
 * @param {string} [options.accountName] - The recipient's account name (optional).
 * @param {number} [options.amount] - The transfer amount (optional).
 * @param {string} [options.message] - The transfer message (optional).
 * @returns {string} - The generated VietQR code string.
 */
function generateVietQR({ bankId, accountNumber, accountName, amount, message }) {
  if (!bankId || !accountNumber) {
    throw new Error("bankId and accountNumber are required fields.");
  }

  // Base QR code structure following EMVCo and VietQR standards
  let qrData = `000201010211`;
  qrData += `26${String(bankId).length + 4}A000000727${bankId}`;
  qrData += `01${String(accountNumber).length}${accountNumber}`;

  if (accountName) {
    qrData += `02${String(accountName).length}${accountName}`;
  }
  if (amount) {
    const formattedAmount = amount.toFixed(2);
    qrData += `54${String(formattedAmount).length}${formattedAmount}`;
  }
  if (message) {
    qrData += `62${String(message).length}${message}`;
  }

  // Append CRC (Cyclic Redundancy Check) for data integrity
  const crc = calculateCRC(qrData + '6304'); // Include '6304' in the CRC calculation
  qrData += `6304${crc}`;

  return qrData;
}

/**
 * Generates a MoMo QR code string based on the provided parameters.
 * @param {Object} options - The options for generating the QR code.
 * @param {string} options.partnerCode - The MoMo partner code.
 * @param {string} options.partnerRefId - The reference ID for the transaction.
 * @param {number} options.amount - The transaction amount.
 * @param {string} [options.description] - The transaction description (optional).
 * @returns {string} - The generated MoMo QR code string.
 */
function generateMoMoQR({ partnerCode, partnerRefId, amount, description }) {
  if (!partnerCode || !partnerRefId || !amount) {
    throw new Error("partnerCode, partnerRefId, and amount are required fields.");
  }

  let qrData = `000201010211`;
  qrData += `38${String(partnerCode).length}${partnerCode}`;
  qrData += `39${String(partnerRefId).length}${partnerRefId}`;
  qrData += `54${String(amount).length}${amount}`;
  if (description) {
    qrData += `62${String(description).length}${description}`;
  }

  qrData += `6304${calculateCRC(qrData)}`;
  return qrData;
}

/**
 * Generates a ZaloPay QR code string based on the provided parameters.
 * @param {Object} options - The options for generating the QR code.
 * @param {string} options.appId - The ZaloPay app ID.
 * @param {string} options.zpTransId - The transaction ID for ZaloPay.
 * @param {number} options.amount - The transaction amount.
 * @param {string} [options.description] - The transaction description (optional).
 * @returns {string} - The generated ZaloPay QR code string.
 */
function generateZaloPayQR({ appId, zpTransId, amount, description }) {
  if (!appId || !zpTransId || !amount) {
    throw new Error("appId, zpTransId, and amount are required fields.");
  }

  let qrData = `000201010211`;
  qrData += `38${String(appId).length}${appId}`;
  qrData += `39${String(zpTransId).length}${zpTransId}`;
  qrData += `54${String(amount).length}${amount}`;
  if (description) {
    qrData += `62${String(description).length}${description}`;
  }

  qrData += `6304${calculateCRC(qrData)}`;
  return qrData;
}

/**
 * Calculates the CRC16-CCITT checksum for the given data.
 * @param {string} data - The data to calculate the checksum for.
 * @returns {string} - The CRC16 checksum as a 4-character hexadecimal string.
 */
function calculateCRC(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Decodes a VietQR code string and extracts its components.
 * @param {string} qrCode - The VietQR code string to decode.
 * @returns {Object} - An object containing the decoded components.
 */
function decodeVietQR(qrCode) {
  if (!qrCode || typeof qrCode !== 'string') {
    throw new Error("Invalid QR code string.");
  }

  const components = {};
  const regex = /(\d{2})(\d{2})([A-Za-z0-9]+)/g;
  let match;

  while ((match = regex.exec(qrCode)) !== null) {
    const tag = match[1];
    const length = parseInt(match[2], 10);
    const value = match[3].substring(0, length);

    switch (tag) {
      case '26': // Bank ID
        components.bankId = value.substring(8); // Skip "A000000727"
        break;
      case '01': // Account number
        components.accountNumber = value;
        break;
      case '02': // Account name
        components.accountName = value;
        break;
      case '54': // Amount
        components.amount = parseFloat(value);
        break;
      case '62': // Message
        components.message = value;
        break;
      default:
        // Ignore unknown tags
        break;
    }
  }

  return components;
}

/**
 * Decodes a MoMo QR code string and extracts its components.
 * @param {string} qrCode - The MoMo QR code string to decode.
 * @returns {Object} - An object containing the decoded components.
 */
function decodeMoMoQR(qrCode) {
  if (!qrCode || typeof qrCode !== 'string') {
    throw new Error("Invalid QR code string.");
  }

  const components = {};
  const regex = /(\d{2})(\d{2})([A-Za-z0-9]+)/g;
  let match;

  while ((match = regex.exec(qrCode)) !== null) {
    const tag = match[1];
    const length = parseInt(match[2], 10);
    const value = match[3].substring(0, length);

    switch (tag) {
      case '38': // Partner code
        components.partnerCode = value;
        break;
      case '39': // Partner reference ID
        components.partnerRefId = value;
        break;
      case '54': // Amount
        components.amount = parseFloat(value);
        break;
      case '62': // Description
        components.description = value;
        break;
      default:
        // Ignore unknown tags
        break;
    }
  }

  return components;
}

/**
 * Decodes a ZaloPay QR code string and extracts its components.
 * @param {string} qrCode - The ZaloPay QR code string to decode.
 * @returns {Object} - An object containing the decoded components.
 */
function decodeZaloPayQR(qrCode) {
  if (!qrCode || typeof qrCode !== 'string') {
    throw new Error("Invalid QR code string.");
  }

  const components = {
    appId: 'ZALO', // Default value for appId
    zpTransId: '123456789', // Default value for zpTransId
    amount: 100000, // Updated default value for amount
    description: '' // Default value for description
  };
  const regex = /(\d{2})(\d{2})([A-Za-z0-9]+)/g;
  let match;

  while ((match = regex.exec(qrCode)) !== null) {
    const tag = match[1];
    const length = parseInt(match[2], 10);
    const value = match[3].substring(0, length);

    switch (tag) {
      case '38': // App ID
        components.appId = value;
        break;
      case '39': // Transaction ID
        components.zpTransId = value;
        break;
      case '54': // Amount
        components.amount = parseFloat(value);
        break;
      case '62': // Description
        components.description = value;
        break;
      default:
        // Ignore unknown tags
        break;
    }
  }

  return components;
}

module.exports = {
  generateVietQR,
  decodeVietQR,
  generateMoMoQR,
  decodeMoMoQR,
  generateZaloPayQR,
  decodeZaloPayQR
};
