const mongoose=require('mongoose')
const schema=mongoose.Schema;

//define thee Schema(structure)
const articaleSchema =new schema({
    title:String,
  content:String,
  createdAt:Date
})
//creat model based on schema
const Mydata=mongoose.model("Mydata",articaleSchema);

 //export the model 
module.exports=Mydata;