export class RpiDevice {
  name: string = 'blue-nebula-rpi';
  localName: string = 'Robot Controller';

  serviceUUID: string = '00000001-710e-4a5b-8d75-3e5b444bc3cf';

  characteristicUUIDs = {
    healthCheck: '00000002-710e-4a5b-8d75-3e5b444bc3cf',
    ipAddress: '00000003-710e-4a5b-8d75-3e5b444bc3cf',
    runIdle: '00000004-710e-4a5b-8d75-3e5b444bc3cf',

    stepperMotors: '00000005-710e-4a5b-8d75-3e5b444bc3cf',
    dcMotors: '00000006-710e-4a5b-8d75-3e5b444bc3cf',
    bldcMotors: '00000007-710e-4a5b-8d75-3e5b444bc3cf',
    relays: '00000008-710e-4a5b-8d75-3e5b444bc3cf',
  };
}
