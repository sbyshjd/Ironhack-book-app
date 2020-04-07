const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    content:{type:String},
    creator:{ type: Schema.Types.ObjectId, ref: 'User' },
    book:String,
    
},{timestamps:true});

const Review = mongoose.model('User',reviewSchema);

module.exports = Review;