const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true }, // Primary index
    name: { type: String, index: true },
    status: { type: String, default: 'available', index: true },
    description: String,
    category: { type: String, index: true },
    user_email: { type: String, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    image: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },

    // Car-Specific Fields (Stored Only If category === "Cars")
    carName: {
      type: String,
      required: function () {
        return this.category === 'Cars'
      }
    },
    carYear: {
      type: Number,
      required: function () {
        return this.category === 'Cars'
      }
    },
    carColor: {
      type: String,
      required: function () {
        return this.category === 'Cars'
      }
    },
    carMileage: {
      type: Number,
      required: function () {
        return this.category === 'Cars'
      }
    }
  },
  { timestamps: true }
)

// 🔹 Pre-Save Hook: Remove car fields if category is NOT "Cars"
itemSchema.pre('save', function (next) {
  if (this.category !== 'Cars') {
    this.carName = undefined
    this.carYear = undefined
    this.carColor = undefined
    this.carMileage = undefined
  }
  next()
})

// 🔹 Indexes
itemSchema.index({ category: 1 })
itemSchema.index({ name: 'text', description: 'text' }) // Full-text search
itemSchema.index(
  { carName: 1, carYear: -1 },
  { partialFilterExpression: { category: 'Cars' } } // Index only for Cars
)

module.exports = mongoose.model('Item', itemSchema)
