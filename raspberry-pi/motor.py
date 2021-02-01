class Motor:
    '''This is a generic motor connected to the device.'''

    is_running = False

    def __init__(self, motor_name):
        self.motor_name = motor_name

    def get_is_running(self):
        return self.is_running

    def set_is_running(self, is_running):
        if (type(is_running) is not bool):
            print('is_running is not a boolean, motor control is not changed.')
        elif (is_running == self.is_running):
            print('is_running is the same as before, motor control is not changed.')
        else:
            self.is_running = is_running
            print(f"{self.motor_name} control has been changed, is_running is now {is_running}.")

            # call set_gpio
            self.set_gpio()

    def set_gpio(self):
        print(f"{self.motor_name} control gpio has been set.")
