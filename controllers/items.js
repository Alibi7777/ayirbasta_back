const Counter = require('../models/counterModel')
const User = require('../models/userModel')
const Item = require('../models/itemModel')

// Create a new item
exports.createItem = async (req, res) => {
  const {
    name,
    status = 'available',
    description,
    category,
    carName,
    carYear,
    carColor,
    carMileage
  } = req.body
  const userId = req.user.id

  if (!req.file) {
    return res.status(400).json({ message: 'File upload is required' })
  }
  try {
    const imagePath = `/static/images/${req.file.filename}`
    // Increment the counter to get a new unique ID
    const counterResult = await Counter.findOneAndUpdate(
      { _id: 'items' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )

    if (!counterResult) {
      return res.status(500).json({ message: 'Error generating new item ID' })
    }
    const newItemId = counterResult.seq

    let newItemData = {
      id: newItemId,
      status,
      category,
      user_email: req.user.email,
      userId,
      image: imagePath
    }

    // Store Car-specific details if category is "Cars"
    if (category === 'Cars') {
      if (!carName || !carYear || !carColor || !carMileage) {
        return res.status(400).json({ message: 'All car details are required' })
      }
      newItemData = { ...newItemData, carName, carYear, carColor, carMileage }
    } else {
      if (!name || !description) {
        return res.status(400).json({
          message: 'Name and description are required for non-car items'
        })
      }
      newItemData = { ...newItemData, name, description }
    }

    const newItem = new Item(newItemData)
    await newItem.save()

    await User.findByIdAndUpdate(userId, { $push: { items: newItem._id } })

    res.setHeader('Location', `/v1/items/${newItemId}`)
    res.status(201).json({ item: newItem })
  } catch (err) {
    console.error('Error creating item:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get a specific item by ID (Ensures Car Details are Included)
exports.getItem = async (req, res) => {
  const itemId = req.params.id
  const userId = req.user?.id

  try {
    const item = await Item.findOne({ id: itemId })
      .populate('userId', 'firstname lastname email')
      .select('+carName +carYear +carColor +carMileage')

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    console.log('Fetched Item:', item) // Debugging output

    const responseItem = item.toObject()

    if (userId) {
      responseItem.isLiked = item.likes.some(
        id => id.toString() === userId.toString()
      )
    }

    res.status(200).json({
      item: responseItem,
      likeCount: item.likeCount
    })
  } catch (err) {
    console.error('Error fetching item:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all items (Ensures Car Details are Included)
exports.getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      category = ''
    } = req.query

    const baseQuery = {
      status: 'available',
      userId: { $ne: req.user?.id }
    }

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { carName: { $regex: search, $options: 'i' } }, // Allow searching by Car Name
        { carColor: { $regex: search, $options: 'i' } } // Allow searching by Car Color
      ]
    }

    if (category && category.toLowerCase() !== 'all') {
      baseQuery.category = category
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    let items = await Item.find(baseQuery)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('+carName +carYear +carColor +carMileage')
      .lean()

    // Ensure Car Details are included
    items = items.map(item => {
      if (item.category === 'Cars') {
        return {
          ...item,
          carName: item.carName || 'N/A',
          carYear: item.carYear || 'N/A',
          carColor: item.carColor || 'N/A',
          carMileage: item.carMileage || 'N/A'
        }
      }
      return item
    })

    console.log('Fetched Items:', items) // Debugging output

    const total = await Item.countDocuments(baseQuery)

    res.status(200).json({
      items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (err) {
    console.error('Error fetching items:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getLikedItems = async (req, res) => {
  try {
    const userId = req.user.id

    // Find all items where the user's ID is in the likes array
    const likedItems = await Item.find({
      likes: userId
    }).populate('userId', 'firstname lastname email')

    res.status(200).json(likedItems)
  } catch (error) {
    console.error('Error fetching liked items:', error)
    res.status(500).json({ message: 'Error fetching liked items' })
  }
}

// Update an item
exports.updateItem = async (req, res) => {
  const itemId = req.params.id
  const { name, description, status } = req.body

  try {
    // Construct the update object based on provided data
    const updateData = { name, description, status }

    // Check if a new image is uploaded
    if (req.file) {
      updateData.image = `/static/images/${req.file.filename}`
    }

    // Find and update the item, ensuring only the owner can update
    const updateResult = await Item.findOneAndUpdate(
      { id: itemId, userId: req.user.id },
      updateData,
      { new: true }
    )

    if (!updateResult) {
      return res
        .status(404)
        .json({ message: 'Item not found or not authorized to update' })
    }

    res
      .status(200)
      .json({ message: 'Item updated successfully', item: updateResult })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id

  try {
    const deleteResult = await Item.findOneAndDelete({
      id: itemId,
      userId: req.user.id // Ensure only the item's owner can delete it
    })

    if (!deleteResult) {
      return res
        .status(404)
        .json({ message: 'Item not found or not authorized to delete' })
    }

    // Remove the item reference from the user's items array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { items: deleteResult._id }
    })

    res.status(200).json({ message: 'Item deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.toggleLike = async (req, res) => {
  const itemId = req.params.id
  const userId = req.user.id

  try {
    const item = await Item.findOne({ id: itemId })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    const userLikeIndex = item.likes.findIndex(
      id => id.toString() === userId.toString()
    )

    if (userLikeIndex === -1) {
      item.likes.push(userId)
      item.likeCount += 1
    } else {
      item.likes.splice(userLikeIndex, 1)
      item.likeCount -= 1
    }

    await item.save()

    res.status(200).json({
      likeCount: item.likeCount,
      isLiked: userLikeIndex === -1
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
