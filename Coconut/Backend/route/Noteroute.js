const express = require('express');
const router = express.Router();
const note = require('../model/note');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = "./uploads";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads/");
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

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
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

router.get('/test4', (req,res) => res.send("hiii note"));

router.post('/addnote', upload.single("image"), async (req,res) => {

    try{
        const newnote = new note({
            NName:req.body.NName,
            NNote:req.body.NNote,
            NImage:req.file.filename
        })

        await newnote.save();

        res.json({
            msg: "note added successfully",
            note: newnote,
            imageUrl: `http://localhost:5001/uploads/${req.file.filename}`
        })

    }catch(e){
        res.status(800).json({msg: "note added failed", error: e.message});
    }
})

router.get("/getnote", async(req,res) => {
    try{
        const newnote = await note.find();
        res.json(newnote)
    }catch(e){
        res.status(800).json({msg: "not found the note"})
    }
})



module.exports = router;