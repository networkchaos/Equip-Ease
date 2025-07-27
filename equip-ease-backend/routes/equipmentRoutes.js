// routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { addNewEquipment, getEquipmentList,getAllEquipmentPublic } = require('../controllers/equipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔧 multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post('/add', authMiddleware, upload.single('image'), addNewEquipment);
router.get('/list', getEquipmentList);
router.get('/all', getAllEquipmentPublic);

module.exports = router;
