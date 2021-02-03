interface ControlEntity extends Record<string, string | number | boolean> {
  name: string;
}

export type ControlEntities = Record<string, ControlEntity>;
