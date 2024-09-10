import express from 'express';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import Task from '../models/Task';
import { TaskMutation } from '../types';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const TaskMutation: TaskMutation = new Task({
      user: req.user?._id,
      title: req.body.title,
      description: req.body.description || null,
      status: req.body.status,
    });

    if (!req.body.title || !req.body.status) {
      return res.status(400).send({ error: 'User, title and status are required!' });
    }

    const validStatuses = ['new', 'in_progress', 'complete'];

    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).send({ error: 'Status can only be new, in_progress or complete!' });
    }

    if (!req.user) {
      return res.status(401).send({ error: 'User not found' });
    }

    const task = new Task(TaskMutation);
    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({ error: 'User not found' });
    }

    const tasks = await Task.find({ user: req.user._id });

    return res.send(tasks);
  } catch (error) {
    next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({ error: 'User not found' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    if (!task.user.equals(req.user._id)) {
      return res.status(403).send({ error: "You don't have permission to edit this task!" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const validStatuses = ['new', 'in_progress', 'complete'];
    if (!validStatuses.includes(task.status)) {
      return res.status(400).send({ error: 'Status can only be new, in_progress or complete!' });
    }

    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Invalid Task ID' });
    }

    if (!req.user) {
      return res.status(401).send({ error: 'User not found' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    if (!task.user.equals(req.user._id)) {
      return res.status(403).send({ error: "You don't have permission to delete this task!" });
    }

    await Task.findByIdAndDelete(id);

    return res.send({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

export default tasksRouter;
