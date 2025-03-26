const assert = require('assert');
const { generateVietQR, decodeVietQR, generateMoMoQR, decodeMoMoQR, generateZaloPayQR, decodeZaloPayQR } = require('../index');

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

describe('generateMoMoQR', () => {
  it('should generate a valid MoMo QR code with required fields', () => {
    const qrCode = generateMoMoQR({
      partnerCode: 'MOMO',
      partnerRefId: '123456789',
      amount: 50000
    });
    assert.ok(qrCode.includes('MOMO'));
    assert.ok(qrCode.includes('123456789'));
    assert.ok(qrCode.includes('50000'));
  });

  it('should include optional fields like description', () => {
    const qrCode = generateMoMoQR({
      partnerCode: 'MOMO',
      partnerRefId: '123456789',
      amount: 50000,
      description: 'Payment for order #123'
    });
    assert.ok(qrCode.includes('Payment for order #123'));
  });

  it('should throw an error if required fields are missing', () => {
    assert.throws(() => {
      generateMoMoQR({ partnerRefId: '123456789', amount: 50000 });
    }, /partnerCode, partnerRefId, and amount are required fields/);
  });
});

describe('decodeMoMoQR', () => {
  it('should decode a valid MoMo QR code string', () => {
    const qrCode = '0002010102113804MOMO3909123456789545000062Payment for order #1236304';
    const result = decodeMoMoQR(qrCode);

    assert.strictEqual(result.partnerCode, 'MOMO');
    assert.strictEqual(result.partnerRefId, '123456789');
    assert.strictEqual(result.amount, 50000);
    assert.strictEqual(result.description, 'Payment for order #123');
  });

  it('should handle missing optional fields gracefully', () => {
    const qrCode = '0002010102113804MOMO390912345678954500006304';
    const result = decodeMoMoQR(qrCode);

    assert.strictEqual(result.partnerCode, 'MOMO');
    assert.strictEqual(result.partnerRefId, '123456789');
    assert.strictEqual(result.amount, 50000);
    assert.strictEqual(result.description, undefined);
  });

  it('should throw an error for invalid QR code strings', () => {
    assert.throws(() => {
      decodeMoMoQR('');
    }, /Invalid QR code string/);
  });
});

describe('generateZaloPayQR', () => {
  it('should generate a valid ZaloPay QR code with required fields', () => {
    const qrCode = generateZaloPayQR({
      appId: 'ZALO',
      zpTransId: '123456789',
      amount: 100000
    });
    assert.ok(qrCode.includes('ZALO'));
    assert.ok(qrCode.includes('123456789'));
    assert.ok(qrCode.includes('100000'));
  });

  it('should include optional fields like description', () => {
    const qrCode = generateZaloPayQR({
      appId: 'ZALO',
      zpTransId: '123456789',
      amount: 100000,
      description: 'Payment for order #123'
    });
    assert.ok(qrCode.includes('Payment for order #123'));
  });

  it('should throw an error if required fields are missing', () => {
    assert.throws(() => {
      generateZaloPayQR({ zpTransId: '123456789', amount: 100000 });
    }, /appId, zpTransId, and amount are required fields/);
  });
});

describe('decodeZaloPayQR', () => {
  it('should decode a valid ZaloPay QR code string', () => {
    const qrCode = '0002010102113804ZALO39091234567895410000062Payment for order #1236304';
    const result = decodeZaloPayQR(qrCode);

    assert.strictEqual(result.appId, 'ZALO');
    assert.strictEqual(result.zpTransId, '123456789');
    assert.strictEqual(result.amount, 100000);
    assert.strictEqual(result.description, 'Payment for order #123');
  });

  it('should handle missing optional fields gracefully', () => {
    const qrCode = '0002010102113804ZALO3909123456789541000006304';
    const result = decodeZaloPayQR(qrCode);

    assert.strictEqual(result.appId, 'ZALO');
    assert.strictEqual(result.zpTransId, '123456789');
    assert.strictEqual(result.amount, 100000);
    assert.strictEqual(result.description, undefined);
  });

  it('should throw an error for invalid QR code strings', () => {
    assert.throws(() => {
      decodeZaloPayQR('');
    }, /Invalid QR code string/);
  });
});
