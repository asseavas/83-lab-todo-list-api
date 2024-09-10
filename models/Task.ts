import mongoose, { Types } from 'mongoose';
import { TaskFields } from '../types';
import User from './User';

const Schema = mongoose.Schema;

const TaskSchema = new Schema<TaskFields>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist!',
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
