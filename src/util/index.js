const parseLapTime = (rawTime) => {
  const rawTimeString = String(rawTime).padStart(7, '0'); // Ensure consistent 7-character string
  const minutes = parseInt(rawTimeString.slice(0, 2), 10); // First 2 characters for minutes
  const seconds = parseInt(rawTimeString.slice(2, 4), 10); // Next 2 characters for seconds
  const milliseconds = parseInt(rawTimeString.slice(4, 7), 10); // Last 3 characters for milliseconds

  if (seconds >= 60 || milliseconds >= 1000) {
    throw new Error(`Invalid lap time: ${rawTime}`);
  }

  const result = minutes * 60000 + seconds * 1000 + milliseconds;

  return result;
};

// ✅ Corrected Function for Formatting Gaps (no unnecessary padding)
const formatGapToFirstPlace = (gapInMilliseconds) => {
  return (gapInMilliseconds / 1000).toFixed(3); // Convert to seconds with 3 decimal places
};

const formatLapTime = (totalMilliseconds) => {
  const timeMs = parseInt(totalMilliseconds, 10); // Ensure it's a number
  if (isNaN(timeMs) || timeMs < 0) return '00:00.000'; // Handle invalid cases

  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  const milliseconds = timeMs % 1000;

  // Ensure milliseconds are **always** three digits (e.g., "003", "120", "999")
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
    milliseconds
  ).padStart(3, '0')}`;
};

const getColorForCarType = (carType) => {
  const convertToUppercase = carType?.toUpperCase();
  switch (convertToUppercase) {
    case 'FWD':
      return 'rounded-[2px] bg-[rgb(0,0,255)]';
    case 'AWD':
      return 'rounded-[2px] bg-[rgb(255,0,0)]';
    case 'RWD':
      return 'rounded-[2px] bg-[rgb(0,255,0)]';
    default:
      return 'bg-gray-500';
  }
};

export { formatLapTime, getColorForCarType, parseLapTime, formatGapToFirstPlace };
