import Users from "../../models/models/users.js";

  
export const getRoleById = async (re, res) => {
  try {
    const getRole = await Users.findAll();
    res.status(200).json(getRole);
  } catch (error) {
    console.error("Error getting role Details:", error);
    res.status(500).json({
      error: "An error occurred while getting Role Details.",
    });
  }
};

