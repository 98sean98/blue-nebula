#!/usr/bin/python3

import dbus

from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor

from stepmotor import StepMotor
from dcmotor import DCMotor
import utilities

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"

class RobotControllerAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("Robot Controller")
        self.include_tx_power = True

class RobotControllerService(Service):
    ROBOT_CONTROLLER_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        self.step_motors = {
            'wheel_motor': StepMotor('wheel_motor', 0,1,2),
            'screw_motor': StepMotor('screw_motor', 3,4,5),
        }
        self.dc_motors = {
        }
        self.is_running = False

        Service.__init__(self, index, self.ROBOT_CONTROLLER_SVC_UUID, True)
        self.add_characteristic(RunIdleCharacteristic(self))
        self.add_characteristic(StepMotorsCharacteristic(self))
        self.add_characteristic(DCMotorsCharacteristic(self))

    def get_is_running(self):
        return self.is_running

    def set_is_running(self, is_running):
        self.is_running = is_running
        # set each motor's is_running states
        all_motors = list(self.get_all_motors().values())
        for motors_of_type in all_motors:
            for motor in list(motors_of_type.values()):
                motor.set_is_running(is_running)

    def get_all_motors(self):
        return {'step_motors': self.step_motors, 'dc_motors': self.dc_motors}

    def get_motor(self, motor_type, motor_name):
        motors_of_type = None
        if motor_type == 'step_motor': motors_of_type = self.step_motors
        if motor_type == 'dc_motor': motors_of_type = self.dc_motors

        if motors_of_type is None:
            print(f"{motor_type} is not a valid motor type")
            return None

        if motor_name not in list(motors_of_type.keys()):
            print(f"{motor_name} cannot be found in the service")
            return None

        return motors_of_type[motor_name]

    def set_motor(self, motor_type, motor_name, parameters):
        motor = self.get_motor(motor_type, motor_name)
        if motor is None:
            return
        motor.set_parameters(parameters)

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

class StepMotorsCharacteristic(Characteristic):
    CHARACTERISTIC_UUID = "00000003-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
                self, self.CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(StepMotorsDescriptor(self))

    def WriteValue(self, value, options):
        parameters_keys = list(StepMotor('blank', 0, 0, 0).get_parameters().keys())
        decoded = utilities.decode_motor_info(value, parameters_keys)
        print("Write step motor:", decoded)
        self.service.set_motor('step_motor', decoded['motor_name'], decoded['parameters'])

    def ReadValue(self, options):
        # encode the motor info for each step motor in the service
        all_step_motors = self.service.get_all_motors()['step_motors']
        list_of_motors = list(all_step_motors.items())
        encoded_info_list = [utilities.encode_motor_info(motor.motor_name, motor.get_parameters()) + (utilities.encode_base64(', ') if i < len(list_of_motors) - 1 else []) for i, [motor_name, motor] in enumerate(list_of_motors)]
        # combine motor info into one long list
        combined = [item for sublist in encoded_info_list for item in sublist]
        print("read step motors:", utilities.decode_base64(combined))
        return combined

class StepMotorsDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2902"
    DESCRIPTOR_VALUE = "Step motors control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)

class DCMotorsCharacteristic(Characteristic):
    CHARACTERISTIC_UUID = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(
                self, self.CHARACTERISTIC_UUID,
                ["read", "write"], service)
        self.add_descriptor(DCMotorsDescriptor(self))

    def WriteValue(self, value, options):
        print('write dc motor', 'does nothing for now')

    def ReadValue(self, options):
        # encode the motor info for each step motor in the service
        all_dc_motors = self.service.get_all_motors()['dc_motors']
        list_of_motors = list(all_dc_motors.items())
        # encoded_info_list = [utilities.encode_motor_info(motor.motor_name, motor.get_parameters()) + (utilities.encode_base64(', ') if i < len(list_of_motors) - 1 else []) for i, [motor_name, motor] in enumerate(list_of_motors)]

        # combine motor info into one long list
        # combined = [item for sublist in encoded_info_list for item in sublist]
        # print("read step motors:", utilities.decode_base64(combined))
        # return combined
        return utilities.encode_base64('dc motor string')

class DCMotorsDescriptor(Descriptor):
    DESCRIPTOR_UUID = "2903"
    DESCRIPTOR_VALUE = "DC motors control"

    def __init__(self, characteristic):
        Descriptor.__init__(
                self, self.DESCRIPTOR_UUID,
                ["read"],
                characteristic)

    def ReadValue(self, options):
        desc = self.DESCRIPTOR_VALUE
        return utilities.encode_base64(desc)

app = Application()
app.add_service(RobotControllerService(0))
app.register()

adv = RobotControllerAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()
