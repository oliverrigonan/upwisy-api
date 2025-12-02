import * as mongoose from 'mongoose';

export const SessionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollments',
    required: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const SessionsModelProvider = {
  provide: 'SESSIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('sessions', SessionsSchema),
  inject: ['DATABASE_CONNECTION'],
}