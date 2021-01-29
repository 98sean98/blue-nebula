export class RpiDevice {
  name: string = 'scraper-rpi';
  localName: string = 'Robot Controller';

  serviceUUID: string = '00000001-710e-4a5b-8d75-3e5b444bc3cf';

  characteristicUUIDs = {
    motorSpeed1: '00000003-710e-4a5b-8d75-3e5b444bc3cf',
    motorSpeed2: '00000003-710e-4a5b-8d75-3e5b444bc3cf',
  };
}
