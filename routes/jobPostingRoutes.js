const express=require('express')
const router=express.Router();
const { jobPosting, getAlljob, applyJob, getAllApplyJob, updateJobPost, deleteJobPost, getResume, deleteAppliedJob,getOneJob } = require('../controllers/jobPosting');
const upload = require('../utils/uploads');

router.post('/createjob',jobPosting);
router.get('/getalljob',getAlljob);
router.post('/applyjob',upload, applyJob);
router.get('/getallapplyjob',getAllApplyJob);
router.put('/updatejobpost/:id',updateJobPost);
router.delete('/deletejobpost/:id',deleteJobPost);
router.get('/resume/:userID',getResume)
router.delete('/deleteapplyjob/:id',deleteAppliedJob)
router.get('/job/:id', getOneJob);




module.exports=router;