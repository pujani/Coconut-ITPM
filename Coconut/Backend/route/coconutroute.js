const express = require('express');
const router = express.Router();
const coconut = require('../model/coconut');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }else{
        cb(new Error("image are only allowed"),false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: 1024 * 1024 * 5
    }
});


router.get('test1', (req,res) => res.send("hiii cocnut"));

router.post("/addcoconut", upload.single("image"), async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(500).json({ msg: "Unauthorized. Please log in." });
        }

        if (!req.file) {
            return res.status(500).json({ msg: "No image uploaded. Please attach an image." });
        }

        const newCoconut = new coconut({
            CName: req.body.CName,
            CImage: req.file.filename,
            CPrice:req.body.CPrice,
            CNote:req.body.CNote,
            CStatus:req.body.CStatus,
            userId: req.session.authusern.id
        });

        await newCoconut.save();

        res.json({
            msg: "coconut added successfully",
            coconut: newCoconut,
            imageUrl: `http://localhost:5001/uploads/${req.file.filename}`,
        });
    } catch (e) {
        res.status(500).json({ msg: "coconut addition failed"});
    }
});
router.get('/dashboard', async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(500).json({ msg: 'unauthorized' });
        }

        console.log("logged in user ID:", req.session.authusern.id);

        const userCoconuts = await coconut.find({ userId: req.session.authusern.id });
        res.json(userCoconuts);
    } catch (e) {
        res.status(500).json({ msg: 'coconut not found' });
    }
});

router.get('/getcoconut', async (req,res) => {
    try{
        const newcoconut = await coconut.find()
        res.json(newcoconut)
    }catch(e){
        res.status(500).json({msg: "coconut not found"})
    }
})

router.get("/getcoconut/:id", async(req,res) => {
    try{
        const newcoconut = await coconut.findById(req.params.id);
        res.json(newcoconut);
    }catch(e){
        res.status(500).json({msg: "a coconut not found"});
    }
})


router.put("/updatecoconut/:id", async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: "Unauthorized. Please log in." });
        }

        const coconutToUpdate = await coconut.findById(req.params.id);

        if (!coconutToUpdate) {
            return res.status(404).json({ msg: "Coconut not found" });
        }

        if (coconutToUpdate.userId.toString() !== req.session.authusern.id) {
            return res.status(403).json({ msg: "Unauthorized to update this coconut" });
        }

      
        const updatedCoconut = await coconut.findByIdAndUpdate(
            req.params.id,
            {
                CName: req.body.CName,
                CPrice: req.body.CPrice,
                CNote: req.body.CNote,
                CStatus:req.body.CStatus
            },
            { new: true }
        );

        res.json({ msg: "Coconut updated successfully", coconut: updatedCoconut });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({ msg: "Failed to update coconut" });
    }
});
router.delete("/deletecoconut/:id", async (req, res) => {
    try {
        if (!req.session.authusern) {
            return res.status(400).json({ msg: "Unauthorized. Please log in." });
        }

        const coconutToDelete = await coconut.findById(req.params.id);

        if (!coconutToDelete) {
            return res.status(404).json({ msg: "Coconut not found" });
        }

        if (coconutToDelete.userId.toString() !== req.session.authusern.id) {
            return res.status(403).json({ msg: "Unauthorized to delete this coconut" });
        }

        await coconut.findByIdAndDelete(req.params.id);
        res.json({ msg: "Coconut deleted successfully" });
    } catch (error) {
        console.error("Delete failed:", error);
        res.status(500).json({ msg: "Failed to delete coconut" });
    }
});

module.exports = router;
