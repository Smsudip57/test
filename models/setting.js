import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    loginOn:{
        type: Boolean,
        default: false
    }
  }
);


const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;
