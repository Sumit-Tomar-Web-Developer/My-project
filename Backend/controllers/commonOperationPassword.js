import PasswordMaster from "../models/models/passwordmaster.js";

export const checkLevelPassword = async (req, res) => {
  const { levelname, password } = req.body;

  console.log('Received levelname:', levelname, 'password:', password);
  // Validate request payload
  if (!levelname || !password) {
    console.log('error');
    return res.status(400).json({ error: 'Levelname and password are required' });
  }
const all = await PasswordMaster.findAll();
console.log(all.map(r => ({
  levelname: r.levelname,
  password: r.password,
  lengthLevelname: r.levelname.length,
  lengthPassword: r.password.length
})));
  try {
    // Query the PasswordMaster table to find the matching record
    const record = await PasswordMaster.findOne({
      where: {
      levelname: levelname.trim(),
    password: password.trim(),
      },
    });

    // Check if record exists
    if (record) {
      res.status(200).json({ message: 'Password is valid for the given levelname' });
    } else {
      res.status(401).json({ error: 'Invalid levelname or password' });
    }
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ error: 'An error occurred while checking the password' });
  }
};