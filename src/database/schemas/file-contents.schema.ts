import * as mongoose from 'mongoose';

export const FileContentsSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Files',
    required: true
  },
  content: {
    type: String,
    required: true
  }
})