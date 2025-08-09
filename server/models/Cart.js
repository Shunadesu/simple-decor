const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedOptions: {
    size: String,
    color: String,
    material: String,
    // Add more options as needed
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'VND'],
      default: 'VND'
    }
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Optional - for guest carts
  },
  guestId: {
    type: String,
    // For guest carts - can be session ID or any unique identifier
  },
  items: [cartItemSchema],
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Cart expires after 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  notes: String,
  appliedCoupons: [{
    code: String,
    discount: {
      type: Number,
      min: 0
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });
cartSchema.index({ status: 1 });
cartSchema.index({ expiresAt: 1 });

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price.amount * item.quantity);
  }, 0);
});

// Virtual for total discount
cartSchema.virtual('totalDiscount').get(function() {
  return this.appliedCoupons.reduce((total, coupon) => {
    return total + (coupon.discount || 0);
  }, 0);
});

// Virtual for total amount
cartSchema.virtual('total').get(function() {
  const subtotal = this.subtotal;
  const discount = this.totalDiscount;
  return Math.max(0, subtotal - discount);
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, options = {}) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedOptions) === JSON.stringify(options.selectedOptions || {})
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      selectedOptions: options.selectedOptions || {},
      price: options.price || { amount: 0, currency: 'USD' }
    });
  }

  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      this.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
    return this.save();
  }
  throw new Error('Item not found in cart');
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupons = [];
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount) {
  // Check if coupon is already applied
  const existingCoupon = this.appliedCoupons.find(coupon => coupon.code === couponCode);
  if (existingCoupon) {
    throw new Error('Coupon already applied');
  }

  this.appliedCoupons.push({
    code: couponCode,
    discount: discount
  });

  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function(couponCode) {
  this.appliedCoupons = this.appliedCoupons.filter(coupon => coupon.code !== couponCode);
  return this.save();
};

// Static method to find or create cart for user or guest
cartSchema.statics.findOrCreateForUser = async function(userId = null, guestId = null) {
  let cart;
  
  if (userId) {
    // User cart
    cart = await this.findOne({ 
      user: userId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
  } else if (guestId) {
    // Guest cart
    cart = await this.findOne({ 
      guestId: guestId, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
  }

  if (!cart) {
    cart = new this({
      user: userId || null,
      guestId: guestId || null,
      items: [],
      status: 'active'
    });
    await cart.save();
  }

  return cart;
};

// Static method to find or create guest cart
cartSchema.statics.findOrCreateGuestCart = async function(guestId) {
  return this.findOrCreateForUser(null, guestId);
};

// Pre-save middleware to update expiresAt
cartSchema.pre('save', function(next) {
  if (this.isNew) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema); 