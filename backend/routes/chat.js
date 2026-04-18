const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// POST /api/chat/send - Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { text, conversationId } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const userId = String(req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    let conversation;

    if (conversationId) {
      // Existing conversation
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      
      // Security check
      if (!isAdmin && conversation.userId !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    } else {
      // Create new conversation (user only)
      if (isAdmin) {
        return res.status(400).json({ success: false, message: 'Admin must specify conversationId' });
      }

      conversation = await Conversation.findOne({ userId });
      
      if (!conversation) {
        conversation = await Conversation.create({
          userId,
          userName: req.user.name || req.user.email || 'User',
          userEmail: req.user.email || '',
          lastMessage: text.substring(0, 100),
          lastMessageTime: new Date(),
          unreadCount: 0
        });
      }
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: userId,
      senderName: req.user.name || req.user.email || 'User',
      senderRole: isAdmin ? 'admin' : 'user',
      text: text.trim().substring(0, 2000),
      read: false
    });

    // Update conversation
    conversation.lastMessage = text.substring(0, 100);
    conversation.lastMessageTime = new Date();
    
    if (!isAdmin) {
      // User sent message, increment unread for admin
      conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    } else {
      // Admin replied, reset unread
      conversation.unreadCount = 0;
      conversation.adminId = userId;
    }
    
    await conversation.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      const room = `conversation_${conversation._id}`;
      io.to(room).emit('newMessage', {
        _id: message._id,
        conversationId: conversation._id,
        senderId: message.senderId,
        senderName: message.senderName,
        senderRole: message.senderRole,
        text: message.text,
        createdAt: message.createdAt
      });

      // Notify admin of new user message
      if (!isAdmin) {
        io.to('admin_watch').emit('conversationUpdate', {
          _id: conversation._id,
          userId: conversation.userId,
          userName: conversation.userName,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
          unreadCount: conversation.unreadCount
        });
      }
    }

    res.json({ 
      success: true, 
      data: {
        message,
        conversationId: conversation._id
      }
    });
  } catch (e) {
    console.error('Send message error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/chat/conversations - Get all conversations (admin) or user's conversation
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    let conversations;

    if (isAdmin) {
      // Admin sees all conversations
      conversations = await Conversation.find({ status: 'active' })
        .sort({ lastMessageTime: -1 })
        .limit(100)
        .lean();
    } else {
      // User sees only their conversation
      conversations = await Conversation.find({ userId })
        .sort({ lastMessageTime: -1 })
        .limit(1)
        .lean();
    }

    res.json({ success: true, data: conversations });
  } catch (e) {
    console.error('Get conversations error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/chat/messages/:conversationId - Get messages for a conversation
router.get('/messages/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = String(req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Security check
    if (!isAdmin && conversation.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    // Mark messages as read if admin is viewing
    if (isAdmin && conversation.unreadCount > 0) {
      await Message.updateMany(
        { conversationId, senderRole: 'user', read: false },
        { read: true }
      );
      conversation.unreadCount = 0;
      await conversation.save();
    }

    res.json({ success: true, data: messages });
  } catch (e) {
    console.error('Get messages error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/chat/conversation - Get or create user's conversation
router.get('/conversation', auth, async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    
    if (req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin should use /conversations' });
    }

    let conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        userName: req.user.name || req.user.email || 'User',
        userEmail: req.user.email || '',
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0
      });
    }

    res.json({ success: true, data: conversation });
  } catch (e) {
    console.error('Get conversation error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
