export class RpiDevice {
  name: string = 'scraper-rpi';

  deviceId: string = '';
  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }
}
