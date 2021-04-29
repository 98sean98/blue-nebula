from ...control_entities.stepper_motor import StepperMotor
from ...control_entities.dc_motor import DCMotor
from ...control_entities.bldc_motor import BLDCMotor
from ...control_entities.buzzer import Buzzer

def get_control_entities(multiprocessing_manager):
    return {
        'stepper_motors': {
        },
        'dc_motors': {
        },
        'bldc_motors': {
        },
        'buzzer': Buzzer('buzzer', 23, multiprocessing_manager)
    }
