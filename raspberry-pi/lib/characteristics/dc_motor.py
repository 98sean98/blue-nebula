from ..bluetooth.service import Characteristic, Descriptor

from ..config import Config

from ..control_entities.dc_motor import DCMotor

from .. import utilities

CHARACTERISTIC_UUID = Config.UUID['dc_motors']

class DCMotorsCharacteristic(Characteristic):
    def __init__(self, service):
        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(DCMotorsDescriptor(self))

    def WriteValue(self, value, options):
        print('write dc motor', 'does nothing for now')

    def ReadValue(self, options):
        # encode the motor info for each step motor in the service
        all_dc_motors = self.service.get_all_motors()['dc_motors']
        list_of_motors = list(all_dc_motors.items())
        return utilities.encode_base64('dc motor string')

class DCMotorsDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "DC motors control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
