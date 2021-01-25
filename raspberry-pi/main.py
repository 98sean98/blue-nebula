#!/usr/bin/python3

import dbus

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

class RobotControllerAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("Robot Controller")
        self.include_tx_power = True

class RobotControllerService(Service):
    ROBOT_CONTROLLER_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        self.pipe_diameter = 400

        Service.__init__(self, index, self.ROBOT_CONTROLLER_SVC_UUID, True)
        self.add_characteristic(PipeDiameterCharacteristic(self))

    def get_pipe_diameter(self):
        return self.pipe_diameter

    def set_pipe_diameter(self, pipe_diameter):
        self.pipe_diameter = pipe_diameter

class PipeDiameterCharacteristic(Characteristic):
    CHARACTERISTIC_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
                self, self.CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(PipeDiameterDescriptor(self))

    def WriteValue(self, value, options):
        val = int(value[0])
        print("Pipe diameter write value:", val)
        # self.service.set_pipe_diameter(val)

    def ReadValue(self, options):
        value = []
        strval = str(self.service.get_pipe_diameter())
        
        for c in strval:
            value.append(dbus.Byte(c.encode()))

        return value

class PipeDiameterDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Pipe diameter in millimeters"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.DESCRIPTOR_VALUE

        for c in desc:
            value.append(dbus.Byte(c.encode()))

        return value

app = Application()
app.add_service(RobotControllerService(0))
app.register()

adv = RobotControllerAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()
