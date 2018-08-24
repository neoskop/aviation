import { ExampleUrl } from './example-url.interface';

export interface Feature {
  createdAt?: string;
  name: string;
  title: string;
  description?: string;
  enabled: boolean;
  functionCode?: string;
  functionEnabled?: boolean;
  exampleUrls?: ExampleUrl[];
}
