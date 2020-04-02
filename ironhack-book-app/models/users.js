const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{type:String, required:true, unique:true},
    password:{type:String},
    favorites:[{type:String}],
    wishList:[{type:String}],
    role: {
        type:String,
        enum:['GUEST','ADMIN'],
        default:'GUEST',
    },
    reviews:[{ type: Schema.Types.ObjectId, ref: 'Review' }],
    timestamps:true,
});

const User = mongoose.model('User',userSchema);

module.exports = User;