import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const schema = new Schema({
  training: {
    type: Schema.Types.ObjectId,
    required: true
  },
  recommendedBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  categories: {
    type: [Schema.Types.ObjectId],
    required: true
  }
}, { timestamps: true })

schema.plugin(mongoosePaginate)
const Recommendations = model('recommendations', schema)

export default Recommendations
