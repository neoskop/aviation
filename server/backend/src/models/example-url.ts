import { Document } from "mongoose";
import {IExampleUrl} from "../interfaces/example-url";

export interface IExampleUrlModel extends IExampleUrl, Document {
}