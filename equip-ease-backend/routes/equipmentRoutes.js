const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  addNewEquipment,
  getEquipmentList,
  getAllEquipmentPublic,
  deleteEquipmentById
} = require('../controllers/equipmentController');

const authMiddleware = require('../middleware/authMiddleware');

// 🔧 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`) // ✅ FIXED this line
});

const upload = multer({ storage });

// Routes
router.post('/add', authMiddleware, upload.single('image'), addNewEquipment);
router.get('/list', getEquipmentList);
router.get('/all', getAllEquipmentPublic);
router.delete('/delete/:id', authMiddleware, deleteEquipmentById); // ✅ DELETE route

module.exports = router;
