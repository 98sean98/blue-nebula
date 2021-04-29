from ..bluetooth.service import Characteristic, Descriptor

from ..config.bluetooth_config import BluetoothConfig

from ..control_entities.dc_motor import DCMotor

from .. import utilities

CHARACTERISTIC_UUID = BluetoothConfig.UUID['dc_motors']

class DCMotorsCharacteristic(Characteristic):
    def __init__(self, service):
        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(DCMotorsDescriptor(self))

    def WriteValue(self, value, options):
        decoded = utilities.decode_motor_info(value, DCMotor.parameters_keys)
        print("Write dc motor:", decoded)
        self.service.set_motor('dc_motor', decoded['motor_name'], decoded['parameters'])

    def get_value(self, get_parameters_method, dictionary_keys):
        # encode the motor info for each dc motor in the service
        all_dc_motors = self.service.get_all_motors()['dc_motors']
        list_of_motors = list(all_dc_motors.items())
        encoded_info_list = [utilities.encode_motor_info(motor.motor_name, get_parameters_method(motor), dictionary_keys) + (utilities.encode_base64(', ') if i < len(list_of_motors) - 1 else []) for i, [motor_name, motor] in enumerate(list_of_motors)]
        # combine motor info into one long list
        return [item for sublist in encoded_info_list for item in sublist]

    def ReadValue(self, options):
        value = self.get_value(lambda motor: motor.get_parameters(), DCMotor.parameters_keys)
        print("read dc motors:", utilities.decode_base64(value))
        return value

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
