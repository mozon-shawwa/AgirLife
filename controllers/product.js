const Product = require('../models/Product');
const {returnJson}= require('../my-modules/json-response')
const createError = require('http-errors');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

//admin
const createProduct = async (req,res,next)=>{
    try {
         const productData = req.body;
        const product = new Product(productData);
        await product.save();
        returnJson(res,201,true,product,'Product Created Successfully');

    } catch (error) {

        if (error.name === 'ValidationError') {
        return next(createError(400, error.message));
        }
        console.log(error);
        return next(createError(500, 'Error In Create Product.'));

    }

};
//admin
const updateProduct = async(req,res,next)=>{
    try {
        const productId = req.params.id;
        const productData = req.body;

        const product = await Product.findByIdAndUpdate(productId,productData,{new:true,runValidators:true});
        if(!product){
            return next(createError(404,'Product is not found.'))
        }
        returnJson(res,200,true,product,'Product Updated Successfully.')

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Update Product.'))
    }

};

const getAllProducts = async (req, res, next) => {
    try {
        const queryObject = {};

        if (req.query.search) {
            queryObject.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            queryObject.category = req.query.category;
        }


        let query = Product.find(queryObject);

        if (req.query.sort) {
           const [sortBy, order] = req.query.sort.split('-');
           query = query.sort({ [sortBy]: order === 'desc' ? -1 : 1 });
        } else {
           query = query.sort('-createdAt');
        }

        const products = await query;

        if (products.length === 0) {
            return returnJson(res, 200, true, [], 'No products found matching your criteria.');
        }

        returnJson(res, 200, true, products, 'Products fetched successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error in Get All Products.'));
    }
};


const getProductByID = async (req,res,next)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findById({_id:productId});
        if(!product){
            return next(createError(404,'Not Found Any Product.'))
        }
        returnJson(res,200,true,product,'Get Product By Id Successfully');

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get product By Id.'))
    }

};
//admin
const deleteProduct = async (req,res,next)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if(!product){
            return next(createError(404,'Not Found Product.'))
        }
        returnJson(res,200,true,product,'Product Deleted Successfully');

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Delete Product.'))
    }
};

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(createError(400, 'No image file provided.'));
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(createError(404, 'Product not found.'));
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream( {
                 folder: 'agirlife-products',
                 public_id: `product_${product._id}_${Date.now()}`
            },
            (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
            }
        );

       streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
     });


        product.imagesUrl.push(result.secure_url);
        await product.save();
  
        returnJson(res, 200, true, product, 'Image uploaded and product updated successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error uploading product image.'));
    }
};

const deleteProductImage = async (req, res, next) => {
  try {
    const { id, index } = req.params; 
    const product = await Product.findById(id);
    if (!product){
      return next(createError(404, 'Product not found.'));
    } 

    if (index >= product.imagesUrl.length) {
      return next(createError(400, 'Invalid image index.'));
    }

    const imageUrl = product.imagesUrl[index];
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`agirlife-products/${publicId}`);

    product.imagesUrl.splice(index, 1);
    await product.save();

    returnJson(res, 200, true, product, 'Image deleted successfully.');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error deleting product image.'));
  }
};



module.exports = {createProduct,updateProduct,getProductByID,getAllProducts,deleteProduct,uploadProductImage,
    deleteProductImage
};