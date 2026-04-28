const express = require("express");
const router = express.Router();
const {
  signIn,
  signUp,
  signOut,
  verifyOTP,
  auth,
} = require("../controllers/user.controller");
const { validateToken } = require("../middleware/validateToken");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verify-otp", verifyOTP);
router.get("/check-auth", validateToken, auth)

router.post("/forgot-password", (req, res) => {
  res.send("Forgot Password");
});
router.put("/update-profile", (req, res) => {
  res.send("Updating Profile");
});

module.exports = router;
