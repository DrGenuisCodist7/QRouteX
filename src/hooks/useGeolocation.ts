'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserGeolocationState } from '@/types';
import { locationService } from '@/services/locationService';

export function useGeolocation() {
  const [geoState, setGeoState] = useState<UserGeolocationState>({
    coords: {
      lat: 17.3850,
      lng: 78.4867,
      accuracyMeters: 50,
      heading: null,
      speed: null,
    },
    status: 'prompt',
    error: null,
    isRealLocation: false,
    cityName: 'Hyderabad (Demo Base)',
  });
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    const pref = locationService.getStoredLocationPreference();
    if (pref === 'granted') {
      locationService.requestCurrentLocation().then((state) => {
        setGeoState(state);
      });
    } else if (pref === 'denied' || pref === 'demo') {
      setGeoState(locationService.getDemoFallbackState());
    } else {
      // First visit - open prompt modal
      setIsPromptOpen(true);
    }
  }, []);

  // Listen to continuous live location if permission granted
  useEffect(() => {
    if (geoState.status === 'granted' && geoState.isRealLocation) {
      const cleanup = locationService.watchLocationUpdates((updated) => {
        setGeoState(updated);
      });
      return cleanup;
    }
  }, [geoState.status, geoState.isRealLocation]);

  const requestRealLocation = useCallback(async () => {
    setIsPromptOpen(false);
    const result = await locationService.requestCurrentLocation();
    setGeoState(result);
    return result;
  }, []);

  const useDemoLocation = useCallback(() => {
    setIsPromptOpen(false);
    locationService.setStoredLocationPreference('demo');
    const demo = locationService.getDemoFallbackState();
    setGeoState(demo);
  }, []);

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  return {
    geoState,
    isRealLocation: geoState.isRealLocation,
    isPromptOpen,
    requestRealLocation,
    useDemoLocation,
    dismissPrompt,
    setIsPromptOpen,
  };
}
