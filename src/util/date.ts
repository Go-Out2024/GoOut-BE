export const amCheck = () => {
  const now = new Date();
  if (
    now.getHours() >= 5 &&
    (now.getHours() < 14 || (now.getHours() === 14 && now.getMinutes() <= 59))
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
