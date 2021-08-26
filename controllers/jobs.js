const jobsRouter = require('express').Router();
const Job = require('../models/job');

jobsRouter.get('/', async (request, response) => {
    const jobs = await Job.find({}).populate('user', {
        username: 1,
        name: 1,
    });

    response.json(jobs);
});

jobsRouter.get('/:id', async (request, response) => {
    const job = await Job.findById(request.params.id);
    if (job) {
        response.json(job);
    } else {
        response.status(404).end();
    }
});

jobsRouter.post('/', async (request, response) => {
    const body = request.body;
    const user = request.user;

    const job = new Job({
        date: body.date,
        client: body.client,
        amount: body.amount,
        paid: body.paid,
    });

    const savedJob = await job.save();
    console.log(savedJob);
    user.jobs = user.jobs.concat(savedJob._id);
    await user.save();

    response.status(201).json(savedJob);
});

jobsRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    const job = await Job.findById(request.params.id);

    if (job.user.toString() === user.id.toString()) {
        await Job.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } else {
        return response.status(401).json({ error: 'error' });
    }
});

jobsRouter.put('/:id', async (request, response) => {
    const body = request.body;
    const job = await Job.findByIdAndUpdate(request.params.id, body, {
        new: true,
    });

    if (job) {
        response.json(job);
    } else {
        response.status(404).end();
    }
});

module.exports = jobsRouter;
