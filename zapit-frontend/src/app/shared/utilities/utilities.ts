import { LocationData } from '../interfaces/location-data';

export class Utilities {
  static getLocationData(): LocationData | undefined {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.info(`Location data obtained. (${latitude}, ${longitude})`);
        return {
          latitude,
          longitude,
        } as LocationData;
      },
      () => {
        console.info('Failed to obtain location data.');
        return undefined;
      },
    );
    return undefined;
  }
}
