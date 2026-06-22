export const linkBankAccount = async ({
  userId,
  bankCode,
  accountNumber,
}) => {
  // Temporary mock response.
  // Replace with the real OnePipe API call later.

  return {
    success: true,
    institutionId: "044",
    bankName: "Access Bank",
    accountNumber,
    accountName: "BELLO IREMIDE",
    linked: true,
  };
};
