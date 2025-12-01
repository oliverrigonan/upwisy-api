import * as mongoose from 'mongoose';

const CourseUsersSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'dropped'],
    default: 'enrolled'
  },
  enrolled_at: { type: Date, default: Date.now },
});

export const CourseUsersModelProvider = {
  provide: 'COURSE_USERS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('course_users', CourseUsersSchema),
  inject: ['DATABASE_CONNECTION'],
}