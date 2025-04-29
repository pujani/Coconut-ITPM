const express = require('express');
const product = require('../model/product');
const router = express.Router(); 
const path = require('path');
const multer = require('multer');
const fs = require('fs');


router.get("/test", (req,res) => res.send("hiii product"));


const uploadDir = "./uploads";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
};

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads/")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }else{
        cb(new Error("only images are allowed"),false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: 1024 * 1024 * 5
    }
})


router.post("/addproduct", upload.single("image"), async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: "Unauthorized. Please log in." });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "No image uploaded. Please attach an image." });
        }

        const newProduct = new product({
            PName: req.body.PName,
            PPrice: req.body.PPrice,
            PNote: req.body.PNote,
            PImage: req.file.filename,
            PStatus:req.body.PStatus,
            userId: req.session.authusern.id
        });

        await newProduct.save();

        res.json({
            msg: "Product added successfully",
            product: newProduct,
            imageUrl: `http://localhost:5001/uploads/${req.file.filename}`,
        });
    } catch (e) {
        res.status(400).json({ msg: "Product addition failed"});
    }
});


router.get('/dashboard', async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: 'Unauthorized' });
        }

        console.log("Logged in user ID:", req.session.authusern.id);

        const userProducts = await product.find({ userId: req.session.authusern.id });
        res.json(userProducts);
    } catch (e) {
        res.status(400).json({ msg: 'Products not found' });
    }
});



router.get("/getproduct", async (req,res) => {
    try{
        const newproduct = await product.find();
        res.json(newproduct);
    }catch(e){
        res.status(400).json({msg: "product not found"})
    }
})

router.get("/getproduct/:id", async(req,res) => {
    try{
        const newproduct = await product.findById(req.params.id);
        res.json(newproduct);
    }catch(e){
        res.status(400).json({msg: "a product not found"});
    }
})

router.put("/updateproduct/:id", async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: "Unauthorized. Please log in." });
        }

        const productToUpdate = await product.findById(req.params.id);

        if (!productToUpdate) {
            return res.status(404).json({ msg: "Product not found" });
        }

        if (productToUpdate.userId.toString() !== req.session.authusern.id) {
            return res.status(403).json({ msg: "Unauthorized to update this product" });
        }

      
        const updatedProduct = await product.findByIdAndUpdate(
            req.params.id,
            {
                PName: req.body.PName,
                PPrice: req.body.PPrice,
                PNote: req.body.PNote,
                PStatus:req.body.PStatus
            },
            { new: true }
        );

        res.json({ msg: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ msg: "Failed to update product" });
    }
});
router.delete("/deleteproduct/:id", async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: "Unauthorized. Please log in." });
        }

        const productToDelete = await product.findById(req.params.id);

        if (!productToDelete) {
            return res.status(404).json({ msg: "Product not found" });
        }

        if (productToDelete.userId.toString() !== req.session.authusern.id) {
            return res.status(403).json({ msg: "Unauthorized to delete this product" });
        }

        await product.findByIdAndDelete(req.params.id);
        res.json({ msg: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete failed:", error);
        res.status(500).json({ msg: "Failed to delete product" });
    }
});

module.exports = router;