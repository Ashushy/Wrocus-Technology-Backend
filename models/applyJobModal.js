const mongoose = require('mongoose');
const JobPosting = require('./jobPosting');  // Assuming JobPosting model is imported

// Define the ApplyJob schema
const applyJobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    noticeperiod: {
        type: String,
        required: true
    },
    resume: {
        secure_url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    },
    jobReference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting',
        required: true
    }
});

// Create the AppliedJob model
const jobApplyModel = mongoose.model('AppliedJob', applyJobSchema);

module.exports = jobApplyModel;
