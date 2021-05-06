from .bluetooth.service import Service

from .config.bluetooth_config import BluetoothConfig
from .config.micro_apps.micro_app import MicroApp

from .characteristics.health_check import HealthCheckCharacteristic
from .characteristics.ip_address import IPAddressCharacteristic
from .characteristics.run_idle import RunIdleCharacteristic
from .characteristics.stepper_motor import StepperMotorsCharacteristic
from .characteristics.dc_motor import DCMotorsCharacteristic
from .characteristics.bldc_motor import BLDCMotorsCharacteristic
from .characteristics.relay import RelaysCharacteristic

SERVICE_UUID = BluetoothConfig.UUID['robot_controller_service']

def parse_entities(control_entities, control_entity_type, is_none_allowed = False):
    return control_entities[control_entity_type] if control_entity_type in control_entities and control_entities[control_entity_type] is not None else None if is_none_allowed else {}

class RobotControllerService(Service):
    def __init__(self, index, multiprocessing_manager):
        # get the control entities for the selected micro app
        microApp = MicroApp()
        control_entities = microApp.get_control_entities(multiprocessing_manager)

        self.control_entities = {
            'stepper_motors': parse_entities(control_entities, 'stepper_motors'),
            'dc_motors': parse_entities(control_entities, 'dc_motors'),
            'bldc_motors': parse_entities(control_entities, 'bldc_motors'),
            'relays':
            parse_entities(control_entities, 'relays')
        }

        self.buzzer = parse_entities(control_entities, 'buzzer', True)

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
        self.add_characteristic(RelaysCharacteristic(self))

    def get_is_device_connected(self):
        return self.is_device_connected

    def set_is_device_connected(self, is_device_connected):
        self.is_device_connected = is_device_connected

    def get_is_running(self):
        is_running = False
        all_control_entities = list(self.get_all_control_entities().values())
        for control_entities_of_type in all_control_entities:
            for control_entity in list(control_entities_of_type.values()):
                if control_entity.get_is_running():
                    is_running = True
                    break
        self.is_running = is_running
        return is_running

    def set_is_running(self, is_running):
        print(f"service is_running is now {is_running}")
        self.is_running = is_running
        # set each control entity's is_running states
        all_control_entities = list(self.get_all_control_entities().values())
        for control_entities_of_type in all_control_entities:
            for control_entity in list(control_entities_of_type.values()):
                control_entity.set_is_running(is_running)

    def set_buzzer(self, is_running):
        if self.buzzer is not None:
            self.buzzer.set_is_running(is_running)

    def get_all_control_entities(self):
        return self.control_entities

    def get_control_entity(self, control_entity_type, entity_name):
        control_entities_of_type = self.get_all_control_entities()[control_entity_type]

        if control_entities_of_type is None:
            print(f"{control_entity_type} is not a valid control entity type")
            return None

        if entity_name not in list(control_entities_of_type.keys()):
            print(f"{entity_name} cannot be found in the service")
            return None

        return control_entities_of_type[entity_name]

    def set_control_entity(self, control_entity_type, entity_name, parameters):
        control_entity = self.get_control_entity(control_entity_type, entity_name)
        if control_entity is None:
            return
        control_entity.set_parameters(parameters)
