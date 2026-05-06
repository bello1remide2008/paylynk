import jwt from "jsonwebtoken";

export const adminProtect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👇 admin check
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
      }

      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};
