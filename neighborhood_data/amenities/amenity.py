# Python object for Amenity data point

class Amenity(object):
    # id: unique int, location (lat, long): (float, float), 
    # properties: {type: string, subtype:string || None}
    # other properties definable but these are necessary
    # some examples: name, description, image, rating, wheelchair accesibility
    def __init__(self, id, location, properties):
        self.id = int(id)
        self.location = location
        self.properties = properties.copy()

    def to_json(self):
        return {
            "id": self.id,
            "location": self.location,
            "properties": self.properties
        }
        