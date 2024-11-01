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
