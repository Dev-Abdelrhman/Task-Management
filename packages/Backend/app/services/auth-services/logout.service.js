const blacklist = new Set();

const logout = (req, res) => {
  const token = req.cookies.accessToken;
  const rToken = req.cookies.refreshToken;

  if (!token || !rToken) {
    return res.status(400).json({ message: "You are not logged in" });
  }

  blacklist.add(token);
  blacklist.add(rToken);

  res.cookie("accessToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
  });
  res.cookie("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
module.exports = { logout };
