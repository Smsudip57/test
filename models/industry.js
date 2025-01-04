import mongoose from 'mongoose';
import Service from './service';
import { type } from 'os';

const industrySchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    Heading:{
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    detail: {
      type: String,
      required: [true, 'Detail is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    Efficiency:{
        type: Number
    },
    costSaving:{
        type: Number
    },
    customerSatisfaction:{
        type: Number
    },
}
);

const Industry = mongoose.models.Industry || mongoose.model('Industry', industrySchema);

export default Industry;
