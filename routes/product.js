const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const productController = require('../controllers/product');
const { authenticateToken, authenticateAdminToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});


// Create a new product
router.post('/addproduct', authenticateAdminToken, productController.createProduct);

// Get all products
router.get('/listproduct', productController.getAllProducts);

// Get a product by ID
router.get('/getproductbyid/:id', productController.getProductById);

// Update a product by ID
router.patch('/updateproduct/:id',authenticateAdminToken, productController.updateProduct);

// Delete a product by ID
router.delete('/deleteproduct/:id',authenticateAdminToken, productController.deleteProduct);

// Bulk Upload
router.post('/bulkupload', upload.single('file'), authenticateAdminToken, productController.bulkUpload);

module.exports = router;
