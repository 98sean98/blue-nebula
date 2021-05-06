from ..bluetooth.service import Characteristic, Descriptor

from ..config.bluetooth_config import BluetoothConfig

from ..control_entities.stepper_motor import StepperMotor

from .. import utilities

GATT_CHRC_IFACE = BluetoothConfig.GATT_CHRC_IFACE
CHARACTERISTIC_UUID = BluetoothConfig.UUID['stepper_motors']
# this timeout cannot changed during run time
NOTIFY_TIMEOUT = 50 # in milliseconds

class StepperMotorsCharacteristic(Characteristic):
    def __init__(self, service):
        self.notifying = False

        Characteristic.__init__(
                self, CHARACTERISTIC_UUID,
                ["notify", "read", "write"], service)
        self.add_descriptor(StepperMotorsDescriptor(self))

    def WriteValue(self, value, options):
        decoded = utilities.decode_control_entity_info(value, StepperMotor.parameters_keys)
        print("write stepper motor:", decoded)
        self.service.set_control_entity('stepper_motors', decoded['motor_name'], decoded['parameters'])

    def get_value(self, get_parameters_method, dictionary_keys):
        # encode the motor info for each stepper motor in the service
        all_stepper_motors = self.service.get_all_control_entities()['stepper_motors']
        list_of_motors = list(all_stepper_motors.items())
        encoded_info_list = [utilities.encode_control_entity_info(motor.motor_name, get_parameters_method(motor), dictionary_keys) + (utilities.encode_base64(', ') if i < len(list_of_motors) - 1 else []) for i, [motor_name, motor] in enumerate(list_of_motors)]
        # combine motor info into one long list
        return [item for sublist in encoded_info_list for item in sublist]

    def ReadValue(self, options):
        value = self.get_value(lambda motor: motor.get_parameters(), StepperMotor.parameters_keys)
        print("read stepper motors:", utilities.decode_base64(value))
        return value

    def notify_callback(self):
        if self.notifying:
            value = self.get_value(lambda motor: motor.get_tracked_parameters(), StepperMotor.tracked_parameters_keys)
            self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": value}, [])
        return self.notifying

    def StartNotify(self):
        if self.notifying:
            return

        self.notifying = True
        value = self.get_value(lambda motor: motor.get_tracked_parameters(), StepperMotor.tracked_parameters_keys)
        self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": value}, [])
        self.add_timeout(NOTIFY_TIMEOUT, self.notify_callback)

    def StopNotify(self):
        self.notifying = False

class StepperMotorsDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2901"
    DESCRIPTOR_VALUE = "Stepper motors control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)
