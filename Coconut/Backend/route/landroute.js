const express = require('express');
const router = express.Router();
const Land = require('../model/land');

const coconutData = {
    "Tall": 8,  
    "Dwarf": 6, 
    "Hybrid": 7  
};

const PERCH_TO_M2 = 25.2929;

router.get('/test3', (req, res) => res.send("hiii land"));

router.post('/addland', async (req, res) => {
    try {
        const { Landsize, Coconuttype } = req.body;

       
        const landSizeM2 = Landsize * PERCH_TO_M2;

      
        const distanceBetweenTrees = coconutData[Coconuttype] || 7;

     
        const treeSpacingArea = distanceBetweenTrees ** 2; 
        const estimatedTrees = Math.floor(landSizeM2 / treeSpacingArea);

       
        const newLand = new Land({
            Landsize,
            Coconuttype
        });

        await newLand.save();

        res.json({
            msg: "Enter successfully",
            treeSpacingArea,
            estimatedTrees,
            land: newLand
        });
    } catch (e) {
        res.status(700).json({ msg: "Enter failed", error: e.message });
    }
});



module.exports = router;
