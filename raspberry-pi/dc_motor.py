from motor import Motor

class DCMotor(Motor):
    '''A dc motor instance connected to the device'''

    def __init__(self, motor_name, multiprocessing_manager):
        super().__init__(motor_name, multiprocessing_manager)

    # todo
