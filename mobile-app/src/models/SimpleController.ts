export enum Diameter {
  DN400 = 'DN400',
  DN315 = 'DN315',
  DN250 = 'DN250',
  DN200 = 'DN200',
}

export enum SDR {
  TypeA = '17.6',
  TypeB = '11',
}

export type SimpleControllerOptionType = {
  id: string;
  diameter: Diameter;
  sdr: SDR;
  optionText: string;
  onPress: () => void;
};
