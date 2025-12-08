import * as mongoose from 'mongoose';

const FilesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  file_url: {
    type: String,
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const FilesModelProvider = {
  provide: 'FILES_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('files', FilesSchema),
  inject: ['DATABASE_CONNECTION'],
}