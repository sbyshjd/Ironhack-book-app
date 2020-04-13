const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{type:String, required:true, unique:true},
    password:{type:String},
    profileImage:{type:String,default:'/images/default-profile-picture.png'},
    googleID:{type:String},
    friends:[{type:String}],
    favorites:[{type:String}],
    wishList:[{type:String}],
    role: {
        type:String,
        enum:['USER','ADMIN'],
        default:'USER',
    },
    reviews:[{ type: Schema.Types.ObjectId, ref: 'Review' }],
}, {timestamps:true});

const User = mongoose.model('User',userSchema);

module.exports = User;