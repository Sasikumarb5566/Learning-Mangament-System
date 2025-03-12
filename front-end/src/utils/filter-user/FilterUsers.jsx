export const FilterUsers = (list, searchTerm) => {
  if (!Array.isArray(list)) {
    console.error('Expected an array for the list parameter.');
    return [];
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return list.filter((user) => {
    if (!user) {
      console.warn('Encountered an undefined or null user object.');
      return false;
    }

    const username = user.username || "";
    const userPosition = user.position !== undefined ? String(user.position) : "";
    const userReferrals = user.referrals !== undefined ? String(user.referrals) : "";

    return (
      username.toLowerCase().includes(lowerCaseSearchTerm) ||
      userPosition.includes(lowerCaseSearchTerm) ||
      userReferrals.includes(lowerCaseSearchTerm)
    );
  });
};
