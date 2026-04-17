const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  userName: { 
    type: String, 
    default: 'User' 
  },
  userEmail: { 
    type: String, 
    default: '' 
  },
  adminId: { 
    type: String, 
    default: null 
  },
  lastMessage: { 
    type: String, 
    default: '' 
  },
  lastMessageTime: { 
    type: Date, 
    default: Date.now 
  },
  unreadCount: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: ['active', 'closed'], 
    default: 'active' 
  }
}, { 
  timestamps: true 
});

conversationSchema.index({ userId: 1 });
conversationSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
