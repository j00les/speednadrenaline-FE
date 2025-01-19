import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage = () => {
  const redirectURL = `${window.location.origin}/result`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Scan this QR Code</h1>
      <QRCodeSVG
        value={redirectURL}
        size={400}
        level="H"
        includeMargin={true}
        className="border p-4 bg-red-500"
      />
      <p className="mt-4 text-gray-600">Scan the QR code to visit the result page.</p>
    </div>
  );
};

export default QRCodePage;
