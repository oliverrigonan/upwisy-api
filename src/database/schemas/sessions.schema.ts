import * as mongoose from 'mongoose';

export const SessionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enrollments',
    required: true
  },
  start_time: {
    type: Date,
    default: null,
    required: false
  },
  end_time: {
    type: Date,
    default: null,
    required: false
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

SessionsSchema.virtual('user', {
  ref: 'users',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

SessionsSchema.virtual('enrollment', {
  ref: 'enrollments',
  localField: 'enrollment_id',
  foreignField: '_id',
  justOne: true,
});

SessionsSchema.set('toObject', { virtuals: true });
SessionsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      user_id: ret.user_id,
      user: (ret as any).user,
      enrollment_id: ret.enrollment_id,
      enrollment: (ret as any).enrollment,
      start_time: ret.start_time,
      end_time: ret.end_time,
      created_at: ret.created_at,
      updated_at: ret.updated_at,
    };
  },
});

export const SessionsModelProvider = {
  provide: 'SESSIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('sessions', SessionsSchema),
  inject: ['DATABASE_CONNECTION'],
}