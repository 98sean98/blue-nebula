export class RpiDevice {
  name: string = 'scraper-rpi';
  localName: string = 'Robot Controller';

  deviceId: string = '';
  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  robotControllerServiceUUID = '00000001-710e-4a5b-8d75-3e5b444bc3cf';
  pipeDiameterCharacteristicUUID = '00000003-710e-4a5b-8d75-3e5b444bc3cf';
}
