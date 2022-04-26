import React, { useEffect, RefObject, MutableRefObject } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import { round } from '$utils/format';

import MapboxStyleOverride from './mapbox-style-override';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN || '';

const SingleMapContainer = styled.div`
  && {
    position: absolute;
    inset: 0;
  }
  ${MapboxStyleOverride}
`;

interface SimpleMapProps {
  [key: string]: unknown;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  containerRef: RefObject<HTMLDivElement>;
  onLoad(e: mapboxgl.EventData): void;
  onMoveEnd?(e: mapboxgl.EventData): void;
  onUnmount?: () => void;
  mapOptions: Partial<Omit<mapboxgl.MapboxOptions, 'container'>>;
  withGeocoder?: boolean;
}

export function SimpleMap(props: SimpleMapProps): JSX.Element {
  const {
    mapRef,
    containerRef,
    onLoad,
    onMoveEnd,
    onUnmount,
    mapOptions,
    withGeocoder,
    ...rest
  } = props;

  useEffect(() => {
    if (!containerRef.current) return;

    const mbMap = new mapboxgl.Map({
      container: containerRef.current,
      attributionControl: false,
      ...mapOptions
    });

    mapRef.current = mbMap;

    // Include attribution.
    mbMap.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

    // Add Geocoder control
    if (withGeocoder) {
      const geocoderControl = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: false,
        collapsed: true
      }) as MapboxGeocoder & { _inputEl: HTMLInputElement };

      // Close the geocoder when the result is selected.
      geocoderControl.on('result', () => {
        geocoderControl.clear();
        geocoderControl._inputEl.blur();
      });

      mbMap.addControl(geocoderControl, 'top-left');
    }

    // Add zoom controls without compass.
    if (mapOptions?.interactive !== false) {
      mbMap.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-left'
      );
    }

    onLoad && mbMap.once('load', onLoad);

    onMoveEnd &&
      mbMap.on('moveend', (e) => {
        onMoveEnd({
          // The existence of originalEvent indicates that it was not caused by
          // a method call.
          userInitiated: Object.prototype.hasOwnProperty.call(
            e,
            'originalEvent'
          ),
          lng: round(mbMap.getCenter().lng, 4),
          lat: round(mbMap.getCenter().lat, 4),
          zoom: round(mbMap.getZoom(), 2)
        });
      });

    // Trigger a resize to handle flex layout quirks.
    setTimeout(() => mbMap.resize(), 1);

    return () => {
      mbMap.remove();
      mapRef.current = null;
      onUnmount?.();
    };
    // Only use the props on mount. We don't want to update the map if they
    // change.
  }, []);

  return <SingleMapContainer ref={containerRef} {...rest} />;
}

SimpleMap.propTypes = {
  mapRef: T.shape({
    current: T.object
  }).isRequired,
  containerRef: T.shape({
    current: T.object
  }).isRequired,
  onLoad: T.func,
  onMoveEnd: T.func,
  mapOptions: T.object.isRequired
};
