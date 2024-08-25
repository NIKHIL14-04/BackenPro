import mongoose,{Schema} from "mongoose";

const SubscriptionSchema = new Schema({
subscriber:{
    type : Schema.Types.ObjectId,
    ref : "userModel"
},
channel:{
    type : Schema.Types.ObjectId,
    ref : "userModel"
}

})

const subscriptionModel = mongoose.model("subscription",SubscriptionSchema)
export default subscriptionModel;