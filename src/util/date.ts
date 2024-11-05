export const amCheck = () => {
  const now = new Date();
  if (
    now.getHours() >= 5 &&
    (now.getHours() < 11 || (now.getHours() === 11 && now.getMinutes() <= 59))
  ) {
    return true;
  } else {
    return false;
  }
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const weatherTime = () => {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  switch (true) {
    case hours >= 0 && hours < 3:
      return "2300";
    case hours >= 3 && hours < 6:
      return "0200";
    case hours >= 6 && hours < 9:
      return "0500";
    case hours >= 9 && hours < 11:
      return "0800";
    case hours >= 11 && hours < 15:
      return "1100";
    case hours >= 15 && hours < 18:
      return "1400";
    case hours >= 18 && hours < 21:
      return "1700";
    case hours >= 21 || hours < 9:
      return "2000";
    default:
      return "N/A";
  }
};

export const mappingTodayWeatherDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};
