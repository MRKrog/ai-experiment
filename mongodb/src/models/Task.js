import mongoose from 'mongoose';
const { Schema } = mongoose;

const taskSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: () => new Date().getTime().toString()
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['image_generation', 'code_generation', 'text_generation'],
    required: [true, 'Task type is required']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required']
  },
  result: {
    type: Schema.Types.Mixed,
    default: null
  },
  generatedContent: {
    type: {
      type: String,
      default: null
    },
    filename: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  },
  error: {
    type: String,
    default: null
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  }
}, {
  timestamps: true,
  _id: false // Disable auto-generation of ObjectId
});

// Index for faster queries
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);
export default Task; 