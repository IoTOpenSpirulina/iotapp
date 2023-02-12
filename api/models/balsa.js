import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const balsaSchema = new Schema({
    userId: { type: String, required: [true] },
    name: { type: String, required: [true] },
    description: {type: String},
    selected: { type: Boolean, required: [true], default: false },
    createdTime: { type: Number, required: [true] },
    // widgets: {type: Array, default: []}
});


// Schema to model.
const Balsa = mongoose.model('Balsa', balsaSchema);

export default Balsa;
