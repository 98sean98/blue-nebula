from ..bluetooth.service import Characteristic, Descriptor

from ..config import Config

from .. import utilities

GATT_CHRC_IFACE = Config.GATT_CHRC_IFACE
CHARACTERISTIC_UUID = Config.UUID['health_check']

class HealthCheckCharacteristic(Characteristic):
    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(HealthCheckDescriptor(self))

        # start buzzing on initialisation
        service.set_buzzer(True)

    def WriteValue(self, value, options):
        decoded = utilities.decode_base64(value)
        is_device_connected = utilities.parse_string_to_number(decoded) == 1
        self.service.set_is_device_connected(is_device_connected)
        self.service.set_buzzer(not is_device_connected)
        print(f"write health_check.is_device_connected = {is_device_connected}")

    def ReadValue(self, options):
        is_device_connected_string = '1' if self.service.get_is_device_connected() else '0'
        health_string = f"{is_device_connected_string}"
        print("read health check:", health_string)
        return utilities.encode_base64(health_string)

class HealthCheckDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Device health check"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
