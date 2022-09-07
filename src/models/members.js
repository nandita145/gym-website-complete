const mongoose = require('mongoose');
const membershipSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    // email:{
    //     type: String,
    //     // required: true,
    //     unique: true,
    // },
    phone:{
        type: String,
        // required: true,
    },
    address:{
        type: String,
        // required: true,
    },
    paymentForInMonths:{
        type: Number,
        // required: true,
        // default: null,
    },
    paymentAmount:{
        type: String
    },
    paymentDate:{
        type: Date,
        // default: Date.now,
        // expires: 
    },
    // isActive:{
    //     default:1,
    //     $cond: { if: { $gte: [ "$qty", 250 ] }, then: 30, else: 20 }
    // }

});

const Membership = new mongoose.model("Membership", membershipSchema);

module.exports = Membership;