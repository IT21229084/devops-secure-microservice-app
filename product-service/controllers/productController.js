import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller, image } = req.body;

    if (!name || !description || !price || !category || !sizes) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let parsedSizes;
    try {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    let imagesUrl = [];

    if (req.files && Object.keys(req.files).length > 0) {
      const image1 = req.files?.image1?.[0];
      const image2 = req.files?.image2?.[0];
      const image3 = req.files?.image3?.[0];
      const image4 = req.files?.image4?.[0];

      const images = [image1, image2, image3, image4].filter(Boolean);

      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
    } else if (image && Array.isArray(image)) {
      imagesUrl = image;
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product Added", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// View All Products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Single Product by ID
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if at least one updatable field is provided
    const { name, price, category, sizes, subCategory, bestseller } = req.body;

    if (!name && !price && !category && !sizes && !subCategory && bestseller === undefined) {
      return res.status(400).json({ success: false, message: "No update fields provided" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update fields only if provided
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (bestseller !== undefined) product.bestseller = bestseller;
    if (sizes !== undefined) product.sizes = sizes;

    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Remove Product by ID
const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct
};
