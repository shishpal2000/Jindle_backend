const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  short_desc: { type: String, required: true },
  blog_image: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
