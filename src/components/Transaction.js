export const saveTransaction = (tx) => {
  const existing = JSON.parse(localStorage.getItem("transactions")) || [];

  const updated = [tx, ...existing];

  localStorage.setItem("transactions", JSON.stringify(updated));
};

export const getTransactions = () => {
  return JSON.parse(localStorage.getItem("transactions")) || [];
};
