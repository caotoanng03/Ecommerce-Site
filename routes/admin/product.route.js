const express = require('express');
const router = express.Router();
const multer = require('multer')

// upload images
const storageMulterHelper = require('../../helpers/storageMulter');
const storage = storageMulterHelper(multer);
const upload = multer({ storage: storage });
// validates
const validate = require('../../validates/admin/product.validate');

const controller = require("../../controllers/admin/product.controller");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMultiStatus);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post('/create',
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost
);



module.exports = router;