import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  title: {
    type: Schema.Types.String,
    required: true,
    index: true
  },
  prices: [{
    price: Schema.Types.Number,
    title: Schema.Types.String
  }],
  currency: Schema.Types.String,
  location: Schema.Types.String,
  street: Schema.Types.String,
  zip: Schema.Types.String,
  city: Schema.Types.String,
  country: Schema.Types.String,
  fromDate: Schema.Types.Date,
  toDate: Schema.Types.Date,
  description: {
    type: Schema.Types.String,
    index: true
  },
  remote: {
    type: Schema.Types.Boolean,
    default: false
  },
  certificate: {
    type: Schema.Types.Boolean,
    default: false
  },
  website: {
    type: Schema.Types.String,
    match: /[(http(s)?)://(www.)?a-zA-Z0-9@:%._\-+~#=]{2,256}\.[a-z]{2,6}\b/
  },
  spots: { type: Schema.Types.Number },
  participants: [Schema.Types.ObjectId],
  categories: [{
    type: Schema.Types.ObjectId,
    index: true
  }],
  departments: [{
    type: Schema.Types.ObjectId,
    index: true
  }],
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  }
}, { timestamps: true })

schema.index({ title: 'text', description: 'text' })

schema.plugin(mongoosePaginate)
const Training = model('training', schema)

export default Training
