const assert = require('assert');
const { generateVietQR, decodeVietQR } = require('../index');

describe('generateVietQR', () => {
  it('should generate a valid VietQR code with required fields', () => {
    const qrCode = generateVietQR({
      bankId: '970418',
      accountNumber: '123456789'
    });
    assert.ok(qrCode.includes('970418'));
    assert.ok(qrCode.includes('123456789'));
  });

  it('should include optional fields like accountName, amount, and message', () => {
    const qrCode = generateVietQR({
      bankId: '970418',
      accountNumber: '123456789',
      accountName: 'John Doe',
      amount: 1000.5,
      message: 'Payment for invoice #123'
    });
    assert.ok(qrCode.includes('John Doe'));
    assert.ok(qrCode.includes('1000.50'));
    assert.ok(qrCode.includes('Payment for invoice #123'));
  });

  it('should throw an error if required fields are missing', () => {
    assert.throws(() => {
      generateVietQR({ accountNumber: '123456789' });
    }, /bankId and accountNumber are required fields/);

    assert.throws(() => {
      generateVietQR({ bankId: '970418' });
    }, /bankId and accountNumber are required fields/);
  });

  it('should calculate the CRC checksum correctly', () => {
    const qrCode = generateVietQR({
      bankId: '970418',
      accountNumber: '123456789'
    });
    assert.ok(qrCode.endsWith('6304')); // CRC field starts with 6304
  });
});

describe('decodeVietQR', () => {
  it('should decode a valid VietQR code string', () => {
    const qrCode = '000201010211260600A0000007279704180112312345678902541000.5062Payment for invoice #1236304';
    const result = decodeVietQR(qrCode);

    assert.strictEqual(result.bankId, '970418');
    assert.strictEqual(result.accountNumber, '123456789');
    assert.strictEqual(result.amount, 1000.5);
    assert.strictEqual(result.message, 'Payment for invoice #123');
  });

  it('should handle missing optional fields gracefully', () => {
    const qrCode = '000201010211260600A000000727970418011231234567896304';
    const result = decodeVietQR(qrCode);

    assert.strictEqual(result.bankId, '970418');
    assert.strictEqual(result.accountNumber, '123456789');
    assert.strictEqual(result.amount, undefined);
    assert.strictEqual(result.message, undefined);
  });

  it('should throw an error for invalid QR code strings', () => {
    assert.throws(() => {
      decodeVietQR('');
    }, /Invalid QR code string/);

    assert.throws(() => {
      decodeVietQR(null);
    }, /Invalid QR code string/);
  });
});
