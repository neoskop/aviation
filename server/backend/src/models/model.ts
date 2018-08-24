import { Model } from "mongoose";
import { IProjectModel } from "./project";

export interface IModel {
    project: Model<IProjectModel>;
}