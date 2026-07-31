import { onePipe } from "../services/onePipeService.js";

export const getBanks = async (req, res) => {
  try {
    const response = await onePipe.get("/banks");

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data);

    res.status(500).json({
      message: "Unable to fetch banks",
    });
  }
};
