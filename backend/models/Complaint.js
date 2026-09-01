import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['PENDING', 'IN PROGRESS', 'RESOLVED', 'REJECTED'],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedByName: {
      type: String,
      default: 'System',
    },
    note: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    attachments: [
      {
        type: String,
      },
    ],
    adminRemarks: {
      type: String,
      default: '',
    },
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timeline: [timelineEntrySchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique ticketId before saving if not present
complaintSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    this.ticketId = `CMP-${datePrefix}-${randomSuffix}`;
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
