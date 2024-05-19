const express = require('express');
const ProductController = require('../../controller/api/productController');
var verifyToken = require('../../middleware/auth/verifyToken');
const router = new express.Router();

const api_url = '/api/v1/product'

// View Product List  
router.get(`${api_url}/list`,verifyToken, ProductController.list);
// Create Product 
router.post(`${api_url}/create`,verifyToken, ProductController.addProducts);
// View Product Detail
router.get(`${api_url}/:slug/get`,verifyToken, ProductController.viewProduct);
// Update Product
router.post(`${api_url}/update`,verifyToken, ProductController.updateProduct);
// Update Product
router.post(`${api_url}/delete`,verifyToken, ProductController.deleteProduct);

module.exports = router