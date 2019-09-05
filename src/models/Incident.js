const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const IncidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['Created', 'Acknowledged', 'Resolved']
  }
}, { timestamps: true })

IncidentSchema.plugin(mongoosePaginate);
const Incident = mongoose.model('Incident', IncidentSchema)
Incident.paginate().then({})

module.exports = Incident
