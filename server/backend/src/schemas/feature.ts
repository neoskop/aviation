import { Schema } from "mongoose";
import {exampleUrlSchema} from "./example-url";

export const featureSchema: Schema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    exampleUrls: [exampleUrlSchema],
    functionEnabled: {
        type: Boolean,
        default: false
    },
    functionCode: String
});

featureSchema.pre("save", function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }

    this.updatedAt = new Date();

    next();
});