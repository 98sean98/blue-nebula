class Config:
    GATT_SERVICE_IFACE = 'org.bluez.GattService1'
    GATT_CHRC_IFACE = 'org.bluez.GattCharacteristic1'
    GATT_DESC_IFACE = 'org.bluez.GattDescriptor1'

    UUID = {
        'robot_controller_service': '00000001-710e-4a5b-8d75-3e5b444bc3cf',
        'run_idle': '00000002-710e-4a5b-8d75-3e5b444bc3cf',
        'stepper_motors': '00000003-710e-4a5b-8d75-3e5b444bc3cf',
        'dc_motors': '00000004-710e-4a5b-8d75-3e5b444bc3cf'
    }
