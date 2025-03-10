const mongoose = require('mongoose')

const jobPostingSchema = new mongoose.Schema({
    job_title: {
        type: String,
        required: true

    },
    job_description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    job_type: {
        type: String,
        required: true
    },

    salary: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    application_deadline: {
        type: Date,
        required: true
    },

    skill: {
        type: String,
        required: true
    },
    experience_level: {
        type: String,
        required: true
    },
    job_category: {
        type: String,
        required: true,

    },
    benefit: {
        type: String,
        // required: true
    }
},
    {
        timestamps: true
    }

)

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = JobPosting;