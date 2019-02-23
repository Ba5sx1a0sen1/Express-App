const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilePathSchema = new Schema({
  filename: String,
  path: String,
  hidden: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('FilePath', FilePathSchema)