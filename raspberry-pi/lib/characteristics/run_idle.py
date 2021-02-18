from ..bluetooth.service import Characteristic, Descriptor

from .. import utilities

class RunIdleCharacteristic(Characteristic):
    CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
                self, self.CHARACTERISTIC_UUID,
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
