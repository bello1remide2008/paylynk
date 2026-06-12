import axios from "axios";
import User from "../models/User.js";

export const createPaystackCustomer = async (
  userId
) => {
  const user = await User.findById(userId);

  const response = await axios.post(
    "https://api.paystack.co/customer",
    {
      email: user.email,
      first_name: user.name,
      phone: user.phone,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  user.paystackCustomerCode =
    response.data.data.customer_code;

  await user.save();

  return response.data.data;
};
