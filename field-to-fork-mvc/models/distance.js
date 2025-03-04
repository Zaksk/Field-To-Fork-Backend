// Function to get coordinates (latitude and longitude) for a given postcode
async function getCoordinates(postcode) {
  const response = await fetch(
    `https://api.postcodes.io/postcodes/${postcode}`
  );
  const data = await response.json();
  if (data.status === 200) {
    return {
      latitude: data.result.latitude,
      longitude: data.result.longitude,
    };
  } else {
    throw new Error(`Postcode ${postcode} not found.`);
  }
}

// Haversine formula to calculate the distance between two coordinates
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const toRad = (angle) => (angle * Math.PI) / 180; // Function to convert degrees to radians

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = R * c; // Distance in kilometers
  const distanceInMiles = distanceInKm * 0.621371; // Convert kilometers to miles
  return distanceInMiles;
}

// Function to get the distance between the postcodes
async function getDistance(targetPostcode, productPostcode) {
  // Getting the coordinates for the postcodes
  try {
    const coordsTarget = await getCoordinates(targetPostcode);
    console.log(coordsTarget)
    const coordsProduct = await getCoordinates(productPostcode);
    console.log(coordsProduct);
    const distance = haversine(
      coordsTarget.latitude,
      coordsTarget.longitude,
      coordsProduct.latitude,
      coordsProduct.longitude
    );
    return distance; // Return the calculated distance
  } catch (error) {
    console.error(error.message);
    return null; // Return null in case of error
  }
}

// Example usage

async function exampleUsage() {
  const testDistance = await getDistance("SG8 5HX", "CB23 5FX");
  console.log(`The distance is: ${testDistance} miles`);
}
exampleUsage();


module.exports = { getDistance };