import { UserGeolocationState } from '@/types';

const DEFAULT_COORDS = {
  lat: 17.3850,
  lng: 78.4867,
  accuracyMeters: 50,
  heading: null,
  speed: null,
};

export const locationService = {
  getStoredLocationPreference: (): 'prompt' | 'granted' | 'denied' | 'demo' => {
    if (typeof window === 'undefined') return 'prompt';
    const val = localStorage.getItem('qroutex_location_mode');
    if (val === 'granted' || val === 'denied' || val === 'demo') {
      return val;
    }
    return 'prompt';
  },

  setStoredLocationPreference: (pref: 'granted' | 'denied' | 'demo') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('qroutex_location_mode', pref);
    }
  },

  requestCurrentLocation: (): Promise<UserGeolocationState> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve({
          coords: DEFAULT_COORDS,
          status: 'unavailable',
          error: 'Geolocation is not supported by your browser.',
          isRealLocation: false,
          cityName: 'Hyderabad (Demo Base)',
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy),
            heading: position.coords.heading,
            speed: position.coords.speed,
          };
          locationService.setStoredLocationPreference('granted');
          resolve({
            coords,
            status: 'granted',
            error: null,
            isRealLocation: true,
            cityName: 'Operator Live GPS Location',
          });
        },
        (error) => {
          let errorMsg = 'Location permission was not granted.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location access is disabled. Showing demo fleet location.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable. Using demo fleet base.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out. Using demo fleet base.';
          }

          locationService.setStoredLocationPreference('denied');
          resolve({
            coords: DEFAULT_COORDS,
            status: 'denied',
            error: errorMsg,
            isRealLocation: false,
            cityName: 'Hyderabad (Demo Fleet HQ)',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  },

  watchLocationUpdates: (
    onUpdate: (state: UserGeolocationState) => void
  ): (() => void) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        onUpdate({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy),
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          status: 'granted',
          error: null,
          isRealLocation: true,
          cityName: 'Operator Live GPS Location',
        });
      },
      () => {
        // Silent error during watch - keep existing location
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  },

  getDemoFallbackState: (): UserGeolocationState => ({
    coords: DEFAULT_COORDS,
    status: 'demo',
    error: null,
    isRealLocation: false,
    cityName: 'Hyderabad Central Logistics Hub',
  }),
};
