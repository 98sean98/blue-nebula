from ..bluetooth.service import Characteristic, Descriptor

from ..config import Config

from .. import utilities

CHARACTERISTIC_UUID = Config.UUID['run_idle']

class RunIdleCharacteristic(Characteristic):
    def __init__(self, service):
        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(RunIdleDescriptor(self))

    def WriteValue(self, value, options):
        decoded = utilities.decode_base64(value)
        is_running_int = utilities.parse_string_to_number(decoded)
        self.service.set_is_running(is_running_int == 1)

    def ReadValue(self, options):
        is_running_string = '1' if self.service.get_is_running() else '0'
        return utilities.encode_base64(is_running_string)

class RunIdleDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Run / idle control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
