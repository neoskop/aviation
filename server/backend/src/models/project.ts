import { Document } from "mongoose";
import { IProject } from "../interfaces/project";

export interface IProjectModel extends IProject, Document {
}