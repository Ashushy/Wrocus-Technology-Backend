const mongoose = require('mongoose');
const JobPosting = require('./jobPosting');  

const applyJobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    noticeperiod: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required:true
    },

    currentCTC: {
            type: String,
            required: true
    },
    
    expectedCTC: {
        type: String,
        required: true
    },
    currentOrganization: {
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
},{
    timestamps: true
  });

const jobApplyModel = mongoose.model('AppliedJob', applyJobSchema);

module.exports = jobApplyModel;
