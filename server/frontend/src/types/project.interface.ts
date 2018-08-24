import { Feature } from './feature.interface';

export interface Project {
  createdAt?: string;
  name: string;
  title: string;
  token: string;
  color: string;
  features?: Feature[];
}
