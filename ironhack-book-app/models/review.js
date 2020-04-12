const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    content:{type:String},
    creator:{ type: Schema.Types.ObjectId, ref: 'User' },
    bookID:{type:String},
    
},{timestamps:true});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;