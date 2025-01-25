import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage = () => {
  const redirectURL1 = 'https://speednadrenaline.com/result';
  const redirectURL2 = 'https://speednadrenaline.com/overall-result';

  return (
    <div className="flex items-center justify-center min-h-screen gap-[7rem] bg-gray-100">
      <div className="flex flex-col items-center mx-4">
        <p className="text-[5rem] text-red-500 font-sugo uppercase">best time result</p>
        <QRCodeSVG
          includeMargin={true}
          value={redirectURL1}
          size={600}
          level="H"
          className="border p-4 bg-red-500 "
        />
      </div>

      <div className="flex flex-col items-center mx-4">
        <p className="text-[5rem] text-blue-500 font-sugo uppercase">overall run result</p>
        <QRCodeSVG
          value={redirectURL2}
          size={600}
          level="H"
          includeMargin={true}
          className="border p-4 bg-blue-500"
        />
      </div>
    </div>
  );
};

export default QRCodePage;
