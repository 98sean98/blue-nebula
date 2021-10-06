import json

with open('data.json', 'r') as j:
    t = json.load(j)
    s = json.dumps(t)
    s_mod = '\\\"'.join(s.split('"'))
    print(s_mod)
    with open('data.txt', 'w') as f:
        f.write(s_mod)

