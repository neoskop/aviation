import { Schema } from "mongoose";

export const exampleUrlSchema: Schema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    url: String
});

exampleUrlSchema.pre("save", function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }

    this.updatedAt = new Date();
    next();
});