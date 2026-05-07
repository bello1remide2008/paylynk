import Account from "../models/Account.js";

export const checkAccountOwnership = async (
  req,
  res,
  next
) => {
  try {

    const { senderAccountId } = req.body;

    const account = await Account.findById(
      senderAccountId
    );

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (
      account.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized account access",
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
