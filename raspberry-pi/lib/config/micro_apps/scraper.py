from ...control_entities.stepper_motor import StepperMotor
from ...control_entities.dc_motor import DCMotor
from ...control_entities.bldc_motor import BLDCMotor
from ...control_entities.buzzer import Buzzer

def get_control_entities(multiprocessing_manager):
    return {
        'stepper_motors': {
            'screw_motor': StepperMotor('screw_motor', 14, 15, 18, multiprocessing_manager)
        },
        'dc_motors': {
        },
        'bldc_motors': {
            'bldc_motor': BLDCMotor('bldc_motor', 13, 6, 5, 0, multiprocessing_manager)
        },
        'buzzer': Buzzer('buzzer', 23, multiprocessing_manager)
    }
