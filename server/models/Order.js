const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedOptions: {
    size: String,
    color: String,
    material: String,
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'VND'],
      default: 'USD'
    }
  },
  total: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'Vietnam'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Optional - for guest orders
  },
  guestInfo: {
    email: String,
    phone: String
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  billingAddress: {
    // Same as shipping address by default
    type: shippingAddressSchema,
    default: function() {
      return this.shippingAddress;
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'bank_transfer', 'credit_card', 'paypal'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentAmount: Number,
    paymentCurrency: {
      type: String,
      enum: ['USD', 'EUR', 'VND'],
      default: 'VND'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'VND'],
    default: 'VND'
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  refundAmount: Number,
  refundDate: Date,
  refundReason: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.email': 1 });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });
    
    const sequence = (orderCount + 1).toString().padStart(4, '0');
    this.orderNumber = `ORD${year}${month}${day}${sequence}`;
  }
  next();
});

// Virtual for full name
orderSchema.virtual('customerName').get(function() {
  if (this.shippingAddress) {
    return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
  }
  return '';
});

// Virtual for order status display
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đã gửi hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
orderSchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => total + item.total, 0);
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount;
  return this.total;
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, userId = null) {
  this.status = newStatus;
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
    this.cancelledBy = userId;
  }
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function(newStatus, paymentDetails = {}) {
  this.paymentStatus = newStatus;
  if (newStatus === 'paid') {
    this.paymentDetails = {
      ...this.paymentDetails,
      ...paymentDetails,
      paymentDate: new Date()
    };
  }
  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user: userId };
  if (options.status) {
    query.status = options.status;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to find orders by guest email
orderSchema.statics.findByGuestEmail = function(email, options = {}) {
  const query = { 'shippingAddress.email': email };
  if (options.status) {
    query.status = options.status;
  }
  return this.find(query).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema); 