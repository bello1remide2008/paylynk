import Activity from "../models/Activity.js";



export const logActivity = async ({
  userId,
  title,
  description,
  type,
  icon,
}) => {
  try {
    await Activity.create({
      userId,
      title,
      description,
      type,
      icon,
    });
  } catch (err) {
    console.error(err);
  }
};
