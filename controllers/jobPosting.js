const JobPosting = require("../models/jobPosting")
const jobApplyModel = require("../models/applyJobModal");
const path = require('path');
const { uploadFile } = require('../utils/cloudinary')

// create job 
exports.jobPosting = async (req, res) => {
    console.log(req.body)
    const {
        jobTitle,
        jobDescription,
        location,
        workMode,
        salary,
        company,
        email,
        applicationDeadLine,
        skill,
        experience,
        jobCategory,
        benefit,
    } = req.body

    try {
        const createJobs = await JobPosting({
            job_title: jobTitle,
            job_description: jobDescription,
            location,
            job_type: workMode,
            salary,
            company,
            contact_email: email,
            application_deadline: applicationDeadLine,
            skill,
            experience_level: experience,
            job_category: jobCategory,
            benefit: benefit
        })
        await createJobs.save()

        return res.status(201).json({
            success: true,
            message: "Job created successfuly",
            data: createJobs

        })

    } catch (error) {
        console.error('error occured', error)
        return res.status(500).json({
            success: false,
            message: error.message,


        })
    }

}

// get all job
exports.getAlljob = async (req, res) => {
    try {
        // Extract query parameters
        const { location, experience_level, job_category, job_title } = req.query;

        const filters = {};
        if (location) {
            filters.location = { $regex: location, $options: 'i' };//case insensitive
        }
        if (experience_level) {
            filters.experience_level = { $regex: experience_level, $options: 'i' };
        }
        if (job_category) {
            filters.job_category = { $regex: job_category, $options: 'i' }
        }
        if (job_title) {
            filters.job_title = { $regex: job_title, $options: 'i' }
        }


        // Query the database with filters
        const getAllJobData = await JobPosting.find(filters).sort({ createdAt: -1 });

        // Check if data is available
        if (!getAllJobData || getAllJobData.length === 0) {
            return res.status(202).json({
                message: "No Data Available",
                jobData: getAllJobData,
            });
        }

        // Return the filtered data
        return res.status(200).json({
            message: 'Data fetched successfully',
            jobData: getAllJobData,
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


exports.applyJob = async (req, res) => {
    try {
        const { name, email, noticeperiod, selectedJobId } = req.body;
        const file = req.file.path; // File from multer middleware
        
        // Check if all fields are present
        if (!name || !email || !noticeperiod || !file || !selectedJobId) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Upload the file to Cloudinary
        const fileResult = await uploadFile(file);

        // Create a new job application record
        const applyData = new jobApplyModel({
            name,
            email,
            noticeperiod,
            resume: {
                secure_url: fileResult.url ?? '', // Link to view/download 
                public_id: fileResult.public_id, // Cloudinary identifier
            },
            jobReference: selectedJobId,
        });

        // Save the application to the database
        await applyData.save();

        return res.status(201).json({
            message: "Applied successfully",
            data: {
                id: applyData._id,
                name: applyData.name,
                email: applyData.email,
                noticeperiod: applyData.noticeperiod,
                resume: applyData.resume,
                jobReference: applyData.jobReference,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


exports.getAllApplyJob = async (req, res) => {
    try {
        // Fetch all applied jobs and populate the jobReference field
        const allApplyJob = await jobApplyModel
            .find()
            .populate('jobReference');

        return res.status(200).json({
            message: 'Successfully retrieved all applied job data',
            data: allApplyJob,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.updateJobPost = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            jobtitle,
            jobdescription,
            location,
            jobtype,
            salary,
            company,
            email,
            applicationdeadline,
            skill,
            experience,
            jobcategory,
            benefits
        } = req.body;

        // Find and update the job post by ID with the new data from req.body
        const updatedJobPost = await JobPosting.findByIdAndUpdate(id,
            {
                job_title: jobtitle,
                job_description: jobdescription,
                location,
                job_type: jobtype,
                salary,
                company,
                contact_email: email,
                application_deadline: applicationdeadline,
                skill,
                experience_level: experience,
                job_category: jobcategory,
                benefit: benefits
            },

            { new: true });

        // Check if the job post was found
        if (!updatedJobPost) {
            return res.status(404).json({ message: "Job post not found" });
        }

        // Send the updated job post in the response
        res.status(200).json(updatedJobPost);
    } catch (error) {
        // Handle errors during the update process
        res.status(500).json({ message: "Error updating job post", error });
    }
};

exports.deleteJobPost = async (req, res) => {
    try {
        const jobId = req.params.id
        const deletedJob = await JobPosting.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        res.status(200).json({
            message: "Job deleted successfully",
            deletedJob
        });

    } catch (error) {

        console.error(`Error deleting job:`, error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}
exports.getResume = async (req, res) => {
    try {
        const { userID } = req.params || {}
        // Fetch all applied jobs and populate the jobReference field
        const resumeData = await jobApplyModel
            .findOne({_id: userID})
        console.log('resumeData', resumeData);
        
        return res.status(200).json({
            isSuccess: true,
            data: resumeData.resume,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.deleteAppliedJob=async(req,res)=>{
try {
    const {id}=req.params
    if(!id)
    {
        return res.status(404).json({
            message:"id not found"
        })
    }
    const response=await jobApplyModel.findByIdAndUpdate(id)
    return res.status(200).json({
        isSuccess:true,
        message:"Applied job deleted successfully"
    })
    
} catch (error) {
    res.status(500).json({
        isSuccess:false,
        error:error.message
    })
}
   

}


