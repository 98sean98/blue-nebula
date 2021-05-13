# Control Entities

These provide low level control of hardware devices called control entities. The currently supported types are
- motor
  - stepper motor
  - dc motor
  - bldc motor
- relay
- buzzer

To use them in a micro app, see this [sample](../config/micro_apps/sample.py).

## Control Entities

This section contains details about what kind of hardware is suitable for use, as well as how the software controls the entities at the GPIO level.

Each type of control entity has its own gpio pins that need to be connected, and some software states that maintain various parameters required.

### Motors
The following is a list of supported motors.

#### Stepper motor

A generic stepper motor needs a driver to operate, and a driver usually requires 3 pins connected.

Pins:
- `pulse_pin`: PUL pin on the driver (pulse control)
- `direction_pin`: DIR pin on the driver (direction control)
- `enable_pin`: EN pin on the driver (enable control)

Parameters:
- `pulse_interval`: program wait time between the HIGH and LOW states of one pulse to another
- `revolution`: number of revolutions
- `pulse_per_revolution`: number of pulses per revolution
- `direction`: GPIO state sent to `direction_pin`
- `enable`: GPIO state sent to `enable_pin`

Note:
- single pulse is equivalent to pulling HIGH, then pulling LOW for the `pulse_pin`.
- the program multiplies `revolution` and `pulse_per_revolution` to obtain `total_pulses` which effectively controls how much the stepper motor needs to "step"

#### DC motor

A generic dc motor needs a pwm controller and H-bridge such as an [L298N motor driver module](https://components101.com/modules/l293n-motor-driver-module) to achieve speed and direction control. Most such modules require 3 pins connected.

Pins:
- `pwm_pin`: PWM pin on the driver (speed control)
- `en1_pin`: EN1 pin on the driver (direction control)
- `en2_pin`: EN2 pin on the driver (direction control)

Parameters:
- `pwm_duty_cycle`: pwm duty cycle (0 - 100)
- `pwm_frequency`: pwm frequency (usually around 1000)
- `direction`: software state controlling `en1_pin` and `en2_pin`
- `enable`: software state controlling `en1_pin` and `en2_pin`
- `duration`: program wait time after sending the gpio signals, effectively controlling how long the motor runs for

Note:
- the direction and en pins are implemented based on the table below
| `direction` | `en1_pin` | `en2_pin` |
|:---------:|:---------:|:---------:|
| 0 | HIGH | LOW |
| 1 | LOW | HIGH |
- the `enable` parameter is a software state that implements an `if` conditional block which sends the motor pwm signal, and en states to the gpio hardware; if `enable` is `0`, then the conditional block does not run

#### BLDC motor

A generic BLDC motor needs a driver to operate, and a driver usually requires at least 5 pins connected.

Pins:
- `pwm_pin`: PWM pin on the driver (speed control)
- `direction_pin`: DIR pin on the driver (direction control)
- `enable_pin`: ENABLE pin on the driver
- `brake_pin`: BRAKE pin on the driver (optional for some drivers)
- `speed_pin`: SPEED pin on the driver (speed feedback, optional for all drivers)
- `ground`: non-software pin on the driver for GROUND / COM

Parameters:
- `pwm_duty_cycle`: pwm duty cycle (0 - 100)
- `pwm_frequency`: pwm frequency (usually around 1000)
- `direction`: GPIO state sent to `direction_pin`
- `enable`: GPIO state sent to to `enable_pin`
- `brake`: software state controlling the `brake_pin` to `stop_running()`
- `duration`: program wait time after sending the gpio signals, effectively controlling how long the motor runs for

Note:
- the `enable` parameter is inverted before the GPIO state is set for the `enable_pin`, i.e. `enable = 1` -> `enable_pin GPIO = LOW` to run the motor, `enable = 0` -> `enable_pin GPIO = HIGH` to disable the motor
- the `brake` parameter does not directly control the GPIO state of the `brake_pin` but rather it tells the motor driver through a HIGH GPIO signal through the `brake_pin` whether to *brake*

### Relay

A generic relay reads a low voltage signal to control a high voltage main loop (NO, NC, and COM). Most modules require 1 gpio pin for control, and a pair of 5V and GROUND connection to power the internal logic.

Pins:
- `gpio_pin`: SIGNAL pin on the relay
- `5V_pin`: power terminal on the relay
- `ground_pin`: ground terminal on the relay

*The power and ground terminals on the relay can be connected to a different power source, but it might be necessary to connect a ground pin on the raspberry pi to the ground terminal of the power source. This is to ensure that a common ground can be established between the modules, and that the relay has a reference for the HIGH / LOW nature of GPIO signals.*

Parameters:
- `gpio_state`: GPIO state sent to `gpio_pin`
- `enable`: software state dictating whether the GPIO state should be set
- `permanent_change`: software state dictating whether the GPIO state change should be permanent, i.e. after a setup program has finished running
- `duration`: program wait time after sending the gpio signals, effectively controlling how long the relay stays in that gpio state

Note:
- the `permanent_change` parameter effectively provides a short circuit to set the relay to `stop_running()` after sending the gpio state to the `gpio_pin`
- on `stop_running()`, the gpio state will be inverted relative to what has been set in the parameter if `permanent_change` is false

#### Known bug - GPIO HIGH signal on bootup
On bootup, a raspberry pi sets many of the gpio pins to a pull-up state (equivalent to GPIO HIGH). That means if the blue-nebula main control program is not started, connected relays may receive a HIGH signal, which may cause the relay's NO circuit to be closed. After starting the program, the pins would be set to LOW as dictated by the default relay parameters (barring in mind setting `initial_parameters` can change this behaviour). If you need the relay to receive LOW signals on bootup, you can look at [this thread](https://www.raspberrypi.org/forums/viewtopic.php?t=200601) on the raspberry pi forums to learn more.

### Buzzer

The buzzer is special, it should only be used as a health check indicator.

Pins
- `gpio_pin`: power / signal terminal
- `ground`: ground terminal

There aren't any parameters, but if it is set to running, it will beep twice every 3 seconds.
