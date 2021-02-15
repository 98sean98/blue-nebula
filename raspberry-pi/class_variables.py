class Parent:
    def __init__(self, p = None):
        self.param = p
        self.l = []

    def append(self):
        obj = {'a': 10}
        self.l.append(obj)

class KidA(Parent):
    def __init__(self):
        self.param = {
            'p': 1
        }
        super().__init__(self.param)

def printAll(objects):
    for object in objects:
        print(object.param, object.l)

parent = Parent()
a1 = KidA()
a2 = KidA()

printAll([parent, a1, a2])

# KidA.param['p'] = 2
# a1.param['p'] = 3
parent.append()
# a1.append()

printAll([parent, a1, a2])
