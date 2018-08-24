import {IFeature} from "../interfaces/feature";
import { Document } from "mongoose";

export interface IFeatureModel extends IFeature, Document {
}