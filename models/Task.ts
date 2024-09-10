import mongoose, { Types } from 'mongoose';
import { TaskFields } from '../types';
import User from './User';

// const SALT_WORK_FACTOR = 10;

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

// TaskSchema.methods.checkPassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };
//
// TaskSchema.methods.generateToken = function () {
//   this.token = randomUUID();
// };
//
// TaskSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//
//   const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
//   this.password = await bcrypt.hash(this.password, salt);
//
//   next();
// });

// TaskSchema.set('toJSON', {
//   transform: (_doc, ret) => {
//     delete ret.password;
//     return ret;
//   },
// });

const Task = mongoose.model('Task', TaskSchema);

export default Task;
