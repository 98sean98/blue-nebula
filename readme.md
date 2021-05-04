# Blue Nebula
A robot controller built using a raspberry pi, integrating a `react-native` mobile app via bluetooth, supported by a `prisma`-`graphql` server, and a `react` website showing application usage.

### Why Blue Nebula
The controller systems Blue Nebula aims to replace are microcontroller bluetooth solutions that are built specific to the robots they are integrated with. An example for such microcontrollers is Arduino.

The main issue with that is that during the robot testing phase, developers are often required to change parameters related to control entities like stepper motors, and dc motors on the fly. For instance, motor A needs to run faster, while keeping motor B's speed the same during a rapid development cycle. Microcontroller solutions are not flexible enough to cope with such demands as the environment they run in does not make advanced programming paradigms like multiprocessing, and modular code design easily available.

Blue Nebula hopes to solve these issues by providing a high level abstraction of the bluetooth communication interface between a control module (a Raspberry Pi with bluetooth built-in), and a mobile application. The mobile application is able to send commands to update the parameters of control entities, and to start / stop running a setup of control entities; it also provides an interface to control specific entities in real time.

Such setup data can then be sent to a server for storage in a database.

Blue Nebula mobile app also provides a simple control interface for people who are not robot developers to use upon robot deployment. This interface is designed within the app through the AppMaker feature by the robot developers using a zero-code approach.

The same system can easily be incorporated into multiple robotic projects through the abstraction of Micro Apps.

To summarise, Blue Nebula aims to save robot developer time and effort during the rapid development phase, and the deployment phase.

## Project Structure

This repository manages a suite of sub-directories relevant to each area of Blue Nebula.
- docs: documentation
- mobile-app: react-native mobile application
- raspberry-pi: python program on the raspberry pi controller
- server: nodejs server
- website: react website
