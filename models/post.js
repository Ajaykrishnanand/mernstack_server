import mongoose  from "mongoose";
const {ObjectId} = mongoose.Schema;
const postSchema =new mongoose.Schema({
content :{
    type:{},
    required:true,


},
postedBy:{
    type:ObjectId,
    ref:"user",
},
image:{
    url:String,
    public_id: String,
},
likes:[{type:ObjectId,ref:"user"}],
comments:[
    {
        text:String,
        created:{type:Date,default:Date.now },
        postedBy:{
            type:ObjectId,
            ref:"user",
        },
    },
],
},{timestamps:true}
);
export default mongoose.model("Post",postSchema);