const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    isNew: {
        type: Boolean,
        default: false
    },
    facilities: {
        type: [String],
        default: []
    },
    openingDate: {
        type: Date,
        default: Date.now
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    images: [String],
    amenities: [String],
    availability: {
        monday: { type: [String], default: ['09:00-22:00'] },
        tuesday: { type: [String], default: ['09:00-22:00'] },
        wednesday: { type: [String], default: ['09:00-22:00'] },
        thursday: { type: [String], default: ['09:00-22:00'] },
        friday: { type: [String], default: ['09:00-22:00'] },
        saturday: { type: [String], default: ['09:00-22:00'] },
        sunday: { type: [String], default: ['09:00-22:00'] }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Court', courtSchema);
