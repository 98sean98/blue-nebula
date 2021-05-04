from ...control_entities.stepper_motor import StepperMotor
from ...control_entities.dc_motor import DCMotor
from ...control_entities.bldc_motor import BLDCMotor
from ...control_entities.buzzer import Buzzer

def get_control_entities(multiprocessing_manager):
    return {
        'stepper_motors': {
            'motor_a': StepperMotor(
                'motor_a', # motor_name
                14, # pulse_pin
                15, # direction_pin
                18, # enable_pin
                multiprocessing_manager
            )
        },
        'dc_motors': {
            'motor_b': DCMotor(
                'motor_b', # motor_name
                10, # pwm_pin
                9, # en1_pin
                8, # en2_pin
                multiprocessing_manager
            )
        },
        'bldc_motors': {
            'motor_c': BLDCMotor(
                'motor_c', # motor_name
                13, # pwm_pin
                6, # direction_pin
                5, # enable_pin
                0, # brake_pin
                1, # speed_pin
                4, # pairs of poles
                1/66, # gear ratio
                0.0003, # sampling_interval
                multiprocessing_manager
            )
        },
        'buzzer': Buzzer(
            'buzzer', # buzzer_name
            23, # gpio_pin
            multiprocessing_manager
        )
    }
