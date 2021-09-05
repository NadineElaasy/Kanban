const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    boardList:{
        type:[mongoose.Schema.Types.ObjectId],
        required:false
    }
});
const User= mongoose.model('users', UserSchema)
module.exports = User
