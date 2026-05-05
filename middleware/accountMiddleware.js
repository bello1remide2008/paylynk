import Account from "../models/Account.js";

export const checkAccountOwnership = async (req, res, next) => {
  const { accountId } = req.body;

  const account = await Account.findById(accountId);

  if (!account || account.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized account access" });
  }

  next();
};