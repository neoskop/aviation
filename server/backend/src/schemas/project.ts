import { Schema } from "mongoose";
import crypto = require('crypto');
import {featureSchema} from "./feature";

export const projectSchema: Schema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        unique: true
    },
    color: {
        type: String,
        default: ''
    },
    features: [featureSchema]
});

projectSchema.pre("save", function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }

    if (!this.token) {
        this.token = crypto.randomBytes(32).toString('hex');
    }

    this.updatedAt = new Date();

    next();
});