import mongoose from 'mongoose';
import Service from './service';

const testimonialSchema = new mongoose.Schema(
  {
    Testimonial: {
      type: String,
      required: [true, 'Testimonial is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    postedBy:{
        type:String,
        required: [true, 'Author name is required'],
    },
    role:{
        type:String,
        required: [true, 'Role of the author is required'],
    },
    relatedService:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Service'
    },
    relatedIndustries:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Industry'
    },
    relatedUser:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
}
);

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
