import requests
import math

def get_coordinates(postcode):
    response = requests.get(f"https://api.postcodes.io/postcodes/{postcode}")
    data = response.json()
    if data['status'] == 200:
        return data['result']['latitude'], data['result']['longitude']
    else:
        raise ValueError(f"Postcode {postcode} not found.")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c  # Distance in km

# Example usage
target_postcode = "SW1A 0AA"  # Buckingham Palace
other_postcode = "W1A 1AA"    # BBC Broadcasting House

lat1, lon1 = get_coordinates(target_postcode)
lat2, lon2 = get_coordinates(other_postcode)
distance = haversine(lat1, lon1, lat2, lon2)
print(f"Distance: {distance} km")