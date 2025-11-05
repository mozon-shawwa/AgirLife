const express = require('express');
const {admin,auth} = require('../middlewares/');
const upload = require('../middlewares/multer');

const {
    createProduct,
    updateProduct,
    getProductByID,
    getAllProducts,
    deleteProduct,
    uploadProductImage,
    deleteProductImage }= require('../controllers/product');

const router = express.Router();

router
  .post('/create', auth, admin, createProduct)
  .get('/getAll', getAllProducts)
  .get('/getById/:id', getProductByID)
  .put('/update/:id', auth, admin, updateProduct)
  .delete('/delete/:id', auth, admin, deleteProduct)
  .post('/upload-image/:id', auth, admin, upload.single('image'), uploadProductImage)
  .post('/deleteProductImage/:id/:index', auth, admin, deleteProductImage);

module.exports = router;