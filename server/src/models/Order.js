// // // new added by soham - Order model for managing user orders and tracking their status
// // const mongoose = require('mongoose');
// // const { Schema } = mongoose;

// // const orderItemSchema = new Schema({
// //   productId: {
// //     type: Schema.Types.ObjectId,
// //     ref: 'Product',
// //     required: true
// //   },
// //   quantity: {
// //     type: Number,
// //     required: true,
// //     min: 1
// //   },
// //   price: {
// //     type: Number,
// //     required: true,
// //     min: 0
// //   }
// // });

// // const orderSchema = new Schema({
// //   userId: {
// //     type: Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   items: [orderItemSchema],
// //   totalAmount: {
// //     type: Number,
// //     required: true,
// //     min: 0
// //   },
// //   shippingAddress: {
// //     street: String,
// //     city: String,
// //     state: String,
// //     pincode: String,
// //     country: { type: String, default: 'India' }
// //   },
// //   paymentMethod: {
// //     type: String,
// //     enum: ['cod', 'online'],
// //     default: 'cod'
// //   },
// //   paymentStatus: {
// //     type: String,
// //     enum: ['pending', 'paid', 'failed'],
// //     default: 'pending'
// //   },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
// //     default: 'pending'
// //   },
// //   trackingNumber: String,
// //   notes: String,
// //   Contact_number:Number,
// //   user_email:String
// // }, {
// //   timestamps: true
// // });

// // // Calculate total amount before saving
// // orderSchema.pre('save', function(next) {
// //   if (this.isModified('items')) {
// //     this.totalAmount = this.items.reduce((total, item) => {
// //       return total + (item.price * item.quantity);
// //     }, 0);
// //   }
// //   next();
// // });

// // const Order = mongoose.model('Order', orderSchema);
// // module.exports = Order; 


// // Order model - Fixed and Enhanced
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const orderItemSchema = new Schema({
//   productId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Products', // Make sure this matches your actual Product model name
//     required: [true, 'Product ID is required']
//   },
//   quantity: {
//     type: Number,
//     required: [true, 'Quantity is required'],
//     min: [1, 'Quantity must be at least 1']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [0, 'Price must be non-negative']
//   }
// });

// const orderSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'User ID is required']
//   },
//   items: {
//     type: [orderItemSchema],
//     required: [true, 'Order items are required'],
//     validate: {
//       validator: function(items) {
//         return items && items.length > 0;
//       },
//       message: 'Order must contain at least one item'
//     }
//   },
//   totalAmount: {
//     type: Number,
//     required: [true, 'Total amount is required'],
//     min: [0, 'Total amount must be non-negative']
//   },
//   shippingAddress: {
//     street: {
//       type: String,
//       required: [true, 'Street address is required']
//     },
//     city: {
//       type: String,
//       required: [true, 'City is required']
//     },
//     state: {
//       type: String,
//       required: [true, 'State is required']
//     },
//     pincode: {
//       type: String,
//       required: [true, 'PIN code is required'],
//       match: [/^\d{6}$/, 'PIN code must be 6 digits']
//     },
//     country: { 
//       type: String, 
//       default: 'India' 
//     }
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cod', 'online'],
//     default: 'cod'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed'],
//     default: 'pending'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   trackingNumber: {
//     type: String,
//     default: null
//   },
//   notes: {
//     type: String,
//     default: null
//   },
//   Contact_number: {
//     type: String, // Changed from Number to String for better handling
//     required: [true, 'Contact number is required'],
//     match: [/^(\+91\s?)?[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
//   },
//   user_email: {
//     type: String,
//     required: [true, 'User email is required'],
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
//   }
// }, {
//   timestamps: true
// });

// // Enhanced pre-save middleware with error handling
// orderSchema.pre('save', function(next) {
//   try {
//     if (this.isModified('items') || this.isNew) {
//       this.totalAmount = this.items.reduce((total, item) => {
//         return total + (item.price * item.quantity);
//       }, 0);
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;






// models/Order.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ---------- sub-schema ---------- */
const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true, min: 0 },
});

/* ---------- main schema ---------- */
const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must contain at least one item"],
    },

    /*  NEW: granular cost breakdown  */
    itemsTotal:     { type: Number, default: 0, min: 0 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    totalAmount:    { type: Number, required: true, min: 0 },

    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true, match: /^\d{6}$/ },
      country: { type: String, default: "India" },
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    /*  UPDATED: add "initiated" state so creation-time save is valid  */
    paymentStatus: {
      type: String,
      enum: ["initiated", "pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "failed"],
      default: "pending",
    },

    /* ---------- Cashfree linkage ---------- */
    cashfreeOrderId:     { type: String, index: true, unique: true, sparse: true },
    paymentId:           { type: String, default: null },
    cashfreeSessionData: { type: Schema.Types.Mixed, default: null },

    trackingNumber: { type: String, default: null },
    notes:          { type: String, default: null },

    Contact_number: {
      type: String,
      required: true,
      match: /^(\+91\s?)?[6-9]\d{9}$/,
    },

    user_email: {
      type: String,
      required: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
  },
  { timestamps: true }
);

/* ---------- middleware ---------- */

// ✅ CRITICAL FIX: Move orderNumber generation to pre('validate')
orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    // Generate orderNumber BEFORE validation runs
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    this.orderNumber = `ORD-${dateStr}-${timeStr}-${random}`;
    console.log('🎯 Generated orderNumber in pre-validate:', this.orderNumber);
  }
  next();
});

orderSchema.pre("save", function (next) {
  // Only recalculate totals if items array changed
  if (this.isModified("items") || this.isNew) {
    this.itemsTotal = this.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    // If deliveryCharge already set by controller, keep it
    if (this.deliveryCharge == null) this.deliveryCharge = 0;
    this.totalAmount = this.itemsTotal + this.deliveryCharge;
  }

  // ✅ REMOVE: Don't set orderNumber here anymore!
  // The pre('validate') hook above handles orderNumber generation
  
  next();
});

module.exports = mongoose.model("Order", orderSchema);

