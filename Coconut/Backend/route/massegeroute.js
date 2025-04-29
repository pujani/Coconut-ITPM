const express = require('express');
const Message = require('../model/massege');
const router = express.Router();

const authMiddleware = (req, res, next) => {
    if (!req.session.authusern) return res.status(401).json({ error: 'Unauthorized' });
    next();
};



router.get('/test6', (req, res) => res.send("hiii message")); 



router.post('/messages', authMiddleware, async (req, res) => {
  try {
      if (!req.body?.MContent?.trim()) {
          return res.status(400).json({ error: 'Message content is required' });
      }

      const sender = await authuser.findById(req.session.authusern.id);
      if (!sender) return res.status(401).json({ error: 'Invalid sender' });

      const newMessage = {
          MContent: req.body.MContent,
          Muser: sender._id,
          MIsPrivate: req.body.MIsPrivate || false,
          MRecipient: req.body.MRecipient
      };

      if (newMessage.MIsPrivate) {
          if (!newMessage.MRecipient) {
              return res.status(400).json({ error: 'Recipient required for private messages' });
          }
          
          const recipient = await authuser.findById(newMessage.MRecipient);
          if (!recipient) {
              return res.status(400).json({ error: 'Invalid recipient' });
          }

          // Allow admins to message anyone, users can only message admins
          if (sender.Urole !== 'admin' && recipient.Urole !== 'admin') {
              return res.status(403).json({ error: 'You can only message admins privately' });
          }
      }

      const message = new Message(newMessage);
      await message.save();
      const populatedMessage = await message.populate('Muser MRecipient', 'UName');
      
      res.status(201).json(populatedMessage);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
// Edit message
router.patch('/messages/:id', authMiddleware, async (req, res) => {
  try {
      const message = await Message.findOne({
          _id: req.params.id,
          Muser: req.session.authusern.id
      });

      if (!message) return res.status(404).json({ error: 'Message not found' });

      message.MContent = req.body.MContent || message.MContent;
      await message.save();
      
      res.json(await message.populate('Muser MRecipient', 'UName'));
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete message
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  try {
      const message = await Message.findOneAndDelete({
          _id: req.params.id,
          Muser: req.session.authusern.id
      });

      if (!message) return res.status(404).json({ error: 'Message not found' });
      
      res.json({ message: 'Message deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Update the GET /messages route
router.get('/messages', authMiddleware, async (req, res) => {
  try {
      const userId = req.session.authusern.id;
      
      const messages = await Message.find({
          $or: [
              { 
                  MIsPrivate: false,
                  MdeletedAt: { $exists: false }
              },
              { 
                  MIsPrivate: true,
                  $or: [
                      { Muser: userId },
                      { MRecipient: userId }
                  ],
                  MdeletedAt: { $exists: false }
              }
          ]
      })
      .populate({
          path: 'Muser',
          select: 'UName _id'
      })
      .populate({
          path: 'MRecipient',
          select: 'UName _id'
      })
      .sort({ McreatedAt: -1 });

      res.json(messages);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;