const express = require("express");
const { home, submit, users, updateUser, deleteUser, login } = require("../controllers/auth_controllers");
const router = express.Router();

router.route("/").get(home)
router.route("/submit").post(submit)
router.route("/users").get(users)
router.route("/users/:id").put(updateUser).delete(deleteUser)
router.route("/login").post(login)

module.exports = router;