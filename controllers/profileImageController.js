import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { Readable } from "stream";

const storage = multer.memoryStorage();

export const uploadProfileImageMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPEG, PNG, and WebP images are allowed.")
      );
    }

    cb(null, true);
  },
}).single("profileImage");

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a profile picture.",
      });
    }

    // The protect middleware should set req.user.
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Upload the image buffer to Cloudinary.
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "paylynk/profile-images",
          public_id: `user-${user._id}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    // Save the permanent image URL in MongoDB.
    user.profileImage = uploadResult.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully.",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    return res.status(500).json({
      message: "Unable to update profile picture.",
    });
  }
};
