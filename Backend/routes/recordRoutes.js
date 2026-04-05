const express = require("express");
const router = express.Router();

const recordController = require("../controllers/recordController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role(["admin"]), recordController.createRecord);
router.get("/", auth, role(["admin", "analyst", "viewer"]), recordController.getRecords);
router.put("/:id", auth, role(["admin"]), recordController.updateRecord);
router.delete("/:id", auth, role(["admin"]), recordController.deleteRecord);

module.exports = router;