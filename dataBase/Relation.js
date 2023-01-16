const { Schema, model } = require('mongoose');

const RelationSchema = new Schema({
    boss: {
        type: Schema.Types.ObjectId,
        ref: 'User' },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User' }]
}, {
    timestamps:true,
});

module.exports = model('Relation', RelationSchema);