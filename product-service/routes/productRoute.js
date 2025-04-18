import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Add Product (with images or image URLs)
productRouter.post(
  '/add',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// View All Products
productRouter.get('/list', listProducts);

// View Product by ID
productRouter.get('/single/:productId', singleProduct);

// Update Product (without image change)
productRouter.put('/update/:id', updateProduct);

// Remove Product by ID
productRouter.delete('/remove/:productId', removeProduct);

//for testing

export default productRouter;
