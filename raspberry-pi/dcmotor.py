from motor import Motor

class DCMotor(Motor):
    '''A dc motor instance connected to the device'''

    def __init__(self, motor_name):
        super().__init__(motor_name)

    # todo
