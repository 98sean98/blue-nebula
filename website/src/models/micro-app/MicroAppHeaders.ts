import { MicroApp } from './MicroApp';

export type MicroAppHeaders = Pick<MicroApp, 'id' | 'name' | 'activeVersion'>;
