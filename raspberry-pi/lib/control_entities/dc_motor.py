from .motor import Motor

class DCMotor(Motor):
    '''A dc motor instance connected to the device'''

    # class attribute: list of parameters (order is important)
    parameters_keys = ['enable']
    # class attribute: list of tracked parameters (order is important)
    tracked_parameters_keys = ['duration']

    def __init__(self, motor_name, multiprocessing_manager):
        super().__init__(motor_name, multiprocessing_manager)

    # todo
