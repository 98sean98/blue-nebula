from ..bluetooth.service import Characteristic, Descriptor

from ..config import Config

from ..control_entities.bldc_motor import BLDCMotor

from .. import utilities

GATT_CHRC_IFACE = Config.GATT_CHRC_IFACE
CHARACTERISTIC_UUID = Config.UUID['bldc_motors']
# this timeout cannot changed during run time
NOTIFY_TIMEOUT = 50 # in milliseconds

class BLDCMotorsCharacteristic(Characteristic):
    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(BLDCMotorsDescriptor(self))

    def WriteValue(self, value, options):
        decoded = utilities.decode_motor_info(value, BLDCMotor.parameters_keys)
        print("Write bldc motor:", decoded)
        self.service.set_motor('bldc_motor', decoded['motor_name'], decoded['parameters'])

    def get_value(self, get_parameters_method, dictionary_keys):
        # encode the motor info for each bldc motor in the service
        all_bldc_motors = self.service.get_all_motors()['bldc_motors']
        list_of_motors = list(all_bldc_motors.items())
        encoded_info_list = [utilities.encode_motor_info(motor.motor_name, get_parameters_method(motor), dictionary_keys) + (utilities.encode_base64(', ') if i < len(list_of_motors) - 1 else []) for i, [motor_name, motor] in enumerate(list_of_motors)]
        # combine motor info into one long list
        return [item for sublist in encoded_info_list for item in sublist]

    def ReadValue(self, options):
        value = self.get_value(lambda motor: motor.get_parameters(), BLDCMotor.parameters_keys)
        print("read bldc motors:", utilities.decode_base64(value))
        return value

class BLDCMotorsDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "BLDC motors control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
