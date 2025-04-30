const express = require('express');
const router = express.Router();
const disease = require('../model/disease ');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = "./uploads";
if(!fs.existsSync(uploadDir)){
   fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
   destination: function(req,file,cb){
      cb(null, "uploads/")
   },
   filename: function(req,file,cb){
      cb(null, Date.now() + path.extname(file.originalname));
   }
})

const fileFilter = (req,file,cb) =>{
   if(file.mimetype.startsWith("image/")){
      cb(null, true);
   }else{
      cb(new Error("images are only allowed"), false);
   }
}

const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits:{
      fileSize: 1024 * 1024 * 5
   }
})

router.get('test2', (req,res) => res.send("hiii disease"));
router.post('/adddisease', upload.single("image") ,async (req,res) => {

   try{
      const newdisease = new disease({
        DName: req.body.DName,
        DImage:req.file.filename
        
      })
      await newdisease.save();

      res.json({
        msg: "disease added successfully",
        disease: newdisease,
        imageUrl: `http://localhost:5001/uploads/${req.file.filename}`
      })

   }catch(e){
      res.status(600).json({msg: "disease added failed", error: e.message})
   }

})

module.exports = router;



