import bmw from '../../public/bw-logo.png';

const leaderboardData = [
  {
    carName: 'brio merah',
    lapTime: '00:20:222',
    driverName: 'steven ad',
    carType: 'FWD',
    carLogo: bmw,
    gapToFirst: '00:00:000'
  },
  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Pak wiewie',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },
  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'raphael a',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },
  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Yoko',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Yoko',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Yoko',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Yoko',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'ono',
    lapTime: '00:20:222',
    driverName: 'Yoko',
    carType: 'FWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'om agus',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },
  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'hendrik',
    carType: 'RWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',
    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'RWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',
    gapToFirst: '00:00:000'
  },
  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },
  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },
  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  },

  {
    carName: 'adflkj',
    lapTime: '00:20:222',
    driverName: 'alfkj',
    carType: 'AWD',

    gapToFirst: '00:00:000'
  }
];
const popularCarBrands = [
  // Japanese Car Brands
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Subaru',
  'Mitsubishi',
  'Suzuki',
  'Lexus',
  'Infiniti',
  'Acura',
  'Daihatsu',
  'Isuzu',
  'Hino',

  // European Car Brands
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Jaguar',
  'Aston Martin',
  'Ferrari',
  'Lamborghini',
  'Maserati',
  'Renault',
  'Peugeot',
  'Citroën',
  'Volvo',
  'Alfa Romeo',
  'Fiat',
  'Opel',
  'Skoda',
  'Mini',
  'Bentley',
  'Rolls-Royce',
  'Bugatti',
  'McLaren',

  // American Car Brands
  'Ford',
  'Chevrolet',
  'Dodge',
  'Tesla',
  'Jeep',
  'Cadillac',
  'GMC',
  'Lincoln',
  'Buick',
  'Chrysler',
  'Ram',
  'Hummer',

  // Korean Car Brands
  'Hyundai',
  'Kia',
  'Genesis',
  'SsangYong',

  // Chinese Car Brands
  'Geely',
  'Wuling',
  'BYD',
  'Chery',
  'Great Wall',
  'NIO',
  'Xpeng',
  'Li Auto'
];

console.log(popularCarBrands);

export { leaderboardData };
