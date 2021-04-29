from .bluetooth.service import Service

from .config.bluetooth_config import BluetoothConfig
from .config.micro_apps.micro_app import MicroApp

from .characteristics.health_check import HealthCheckCharacteristic
from .characteristics.ip_address import IPAddressCharacteristic
from .characteristics.run_idle import RunIdleCharacteristic
from .characteristics.stepper_motor import StepperMotorsCharacteristic
from .characteristics.dc_motor import DCMotorsCharacteristic
from .characteristics.bldc_motor import BLDCMotorsCharacteristic

SERVICE_UUID = BluetoothConfig.UUID['robot_controller_service']

def parse_entities(entity):
    return entity if entity is not None else {}

class RobotControllerService(Service):
    def __init__(self, index, multiprocessing_manager):
        # get the control entities for the selected micro app
        microApp = MicroApp()
        control_entities = microApp.get_control_entities(multiprocessing_manager)

        self.stepper_motors = parse_entities(control_entities['stepper_motors'])
        self.dc_motors = parse_entities(control_entities['dc_motors'])
        self.bldc_motors = parse_entities(control_entities['bldc_motors'])

        self.buzzer = control_entities['buzzer'] # can be None

        # global states
        self.is_device_connected = False
        self.is_running = False

        Service.__init__(self, index, SERVICE_UUID, True)
        self.add_characteristic(HealthCheckCharacteristic(self))
        self.add_characteristic(IPAddressCharacteristic(self))
        self.add_characteristic(RunIdleCharacteristic(self))
        self.add_characteristic(StepperMotorsCharacteristic(self))
        self.add_characteristic(DCMotorsCharacteristic(self))
        self.add_characteristic(BLDCMotorsCharacteristic(self))

    def get_is_device_connected(self):
        return self.is_device_connected

    def set_is_device_connected(self, is_device_connected):
        self.is_device_connected = is_device_connected

    def get_is_running(self):
        is_running = False
        all_motors = list(self.get_all_motors().values())
        for motors_of_type in all_motors:
            for motor in list(motors_of_type.values()):
                if motor.get_is_running():
                    is_running = True
                    break
        self.is_running = is_running
        return is_running

    def set_is_running(self, is_running):
        print(f"service is_running is now {is_running}")
        self.is_running = is_running
        # set each motor's is_running states
        all_motors = list(self.get_all_motors().values())
        for motors_of_type in all_motors:
            for motor in list(motors_of_type.values()):
                motor.set_is_running(is_running)

    def set_buzzer(self, is_running):
        if self.buzzer is not None:
            self.buzzer.set_is_running(is_running)

    def get_all_motors(self):
        return {
            'stepper_motors': self.stepper_motors,
            'dc_motors': self.dc_motors,
            'bldc_motors': self.bldc_motors
        }

    def get_motor(self, motor_type, motor_name):
        motors_of_type = None
        if motor_type == 'stepper_motor': motors_of_type = self.stepper_motors
        if motor_type == 'dc_motor': motors_of_type = self.dc_motors
        if motor_type == 'bldc_motor': motors_of_type = self.bldc_motors

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
