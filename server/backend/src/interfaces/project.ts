import {IFeature} from "./feature";

export interface IProject {
    name: string;
    title: string;
    token: string;
    color: string;
    features: Array<IFeature>;
}