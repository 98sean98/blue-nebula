import dbus

def parse_string_to_number(x):
    def is_float(x):
        try: a = float(x)
        except (TypeError, ValueError): return False
        else: return True
    def is_int(x):
        try:
            a = float(x)
            b = int(a)
        except (TypeError, ValueError): return False
        else: return a == b
    if is_int(x): return int(x)
    if is_float(x): return float(x)
    return x

def decode_base64(base64_value):
    return "".join([str(v) for v in base64_value])

# encode string to base64
def encode_base64(string_value):
    value = []
    for c in string_value:
        value.append(dbus.Byte(c.encode()))
    return value

# decodes a base64 string to step motor info
# example decoded: motor_1, ...parameters
def decode_motor_info(encoded, parameters_keys):
    decoded = decode_base64(encoded)
    decoded_list = decoded.split(', ')

    parameters = {}
    for i, parameters_key in enumerate(parameters_keys):
        parameters[parameters_key] = parse_string_to_number(decoded_list[i+1])

    return {'motor_name': decoded_list[0], 'parameters': parameters}

# motor: motor_1
def encode_motor_info(motor_name, parameters, parameters_keys):
    string_value = f"{motor_name}, " + "".join([f"{parameters[key]}{', ' if i < len(parameters_keys) - 1 else ''}" for i, key in enumerate(parameters_keys)])
    return encode_base64(string_value)
