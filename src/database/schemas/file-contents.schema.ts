import * as mongoose from 'mongoose';

const FileContentsSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Files',
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

export const FileContentsModelProvider = {
  provide: 'FILE_CONTENTS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('file_contents', FileContentsSchema),
  inject: ['DATABASE_CONNECTION'],
}