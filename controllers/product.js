const Product = require('../models/product');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json({ message: 'Product created successfully!', data: newProduct });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ message: 'Products fetched successfully!', data: products });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product fetched successfully!', data: product });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully!', data: product });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

//Bulk Upload
const bulkUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }
    const results = [];
    const file = req.file;
    fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        try {
            await Product.insertMany(results);
            res.status(200).json({ message: 'Products uploaded successfully!' });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        } finally {
            fs.unlinkSync(file.path);
        }
    });
}



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    bulkUpload
};
