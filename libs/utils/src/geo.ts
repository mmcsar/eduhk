import { Coordinates } from '@tmsa/types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const deltaLat = toRadians(coord2.latitude - coord1.latitude);
  const deltaLng = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate bearing between two points
 * Returns bearing in degrees (0-360)
 */
export function calculateBearing(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);
  
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  
  const bearing = toDegrees(Math.atan2(y, x));
  
  return (bearing + 360) % 360;
}

/**
 * Check if point is within radius
 */
export function isWithinRadius(
  point: Coordinates,
  center: Coordinates,
  radiusKm: number
): boolean {
  const distance = calculateDistance(point, center);
  return distance <= radiusKm;
}

/**
 * Get center point of coordinates array
 */
export function getCenterPoint(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty coordinates array');
  }
  
  let x = 0;
  let y = 0;
  let z = 0;
  
  coordinates.forEach(coord => {
    const lat = toRadians(coord.latitude);
    const lng = toRadians(coord.longitude);
    
    x += Math.cos(lat) * Math.cos(lng);
    y += Math.cos(lat) * Math.sin(lng);
    z += Math.sin(lat);
  });
  
  const total = coordinates.length;
  x = x / total;
  y = y / total;
  z = z / total;
  
  const centralLng = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLat = Math.atan2(z, centralSquareRoot);
  
  return {
    latitude: toDegrees(centralLat),
    longitude: toDegrees(centralLng),
  };
}

/**
 * Calculate total route distance
 */
export function calculateRouteDistance(waypoints: Coordinates[]): number {
  if (waypoints.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  
  return totalDistance;
}

/**
 * Generate bounding box
 */
export function getBoundingBox(
  coordinates: Coordinates[]
): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate bounding box of empty coordinates array');
  }
  
  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;
  
  coordinates.forEach(coord => {
    if (coord.latitude > north) north = coord.latitude;
    if (coord.latitude < south) south = coord.latitude;
    if (coord.longitude > east) east = coord.longitude;
    if (coord.longitude < west) west = coord.longitude;
  });
  
  return { north, south, east, west };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coord: Coordinates, precision: number = 6): string {
  return `${coord.latitude.toFixed(precision)}, ${coord.longitude.toFixed(precision)}`;
}

/**
 * Validate if coordinates are on African continent
 */
export function isInAfrica(coord: Coordinates): boolean {
  // Rough bounding box for Africa
  return (
    coord.latitude >= -35 &&
    coord.latitude <= 37 &&
    coord.longitude >= -18 &&
    coord.longitude <= 52
  );
}
