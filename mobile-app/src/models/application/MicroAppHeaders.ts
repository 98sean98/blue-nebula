import { MicroApp } from '@models/application/MicroApp';

export type MicroAppHeaders = Pick<MicroApp, 'id' | 'name' | 'version'>;
