import axios from "axios";

export const resolveAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      accountName: response.data.data.account_name,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.response?.data?.message ||
        "Account verification failed",
    });
  }
}const getBanks = async () => {
  try {
    const response = await paystack.get("/bank");

    return response.data;
  } catch (error) {
    console.error(
      "Paystack bank list error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to retrieve banks");
  }
};
