import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { rgba, themeVal } from '@devseed-ui/theme-provider';
import mapboxgl from 'mapbox-gl';
import { Feature, MultiPolygon } from 'geojson';
import bbox from '@turf/bbox';
import { shade } from 'polished';

import { SimpleMap } from '$components/common/mapbox/map';

const WORLD_POLYGON = [
  [180, 90],
  [-180, 90],
  [-180, -90],
  [180, -90],
  [180, 90]
];

const mapOptions: Partial<mapboxgl.MapboxOptions> = {
  style: process.env.MAPBOX_STYLE_URL,
  logoPosition: 'bottom-right',
  interactive: false,
  center: [0, 0],
  zoom: 3
};

interface PageHeroMediaProps {
  feature: Feature<MultiPolygon>;
}

function PageHeroMedia(props: PageHeroMediaProps) {
  const { feature, ...rest } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const aoiSource = mapRef.current?.getSource('aoi');

    // Quick copy.
    const featureInverse = JSON.parse(
      JSON.stringify(feature)
    ) as Feature<MultiPolygon>;
    // Add a full polygon to reverse the feature.
    featureInverse.geometry.coordinates[0].unshift(WORLD_POLYGON);

    if (!aoiSource) {
      mapRef.current.addSource('aoi-inverse', {
        type: 'geojson',
        data: featureInverse
      });

      mapRef.current.addLayer({
        id: 'aoi-fill',
        type: 'fill',
        source: 'aoi-inverse',
        paint: {
          'fill-color': shade(0.8, theme.color.primary),
          'fill-opacity': 0.8
        }
      });
      mapRef.current.addSource('aoi', {
        type: 'geojson',
        data: feature
      });

      mapRef.current.addLayer({
        id: 'aoi-stroke',
        type: 'line',
        source: 'aoi',
        paint: { 'line-color': '#fff', 'line-width': 1 },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
    } else {
      const aoiSource = mapRef.current.getSource(
        'aoi'
      ) as mapboxgl.GeoJSONSource;
      const aoiInverseSource = mapRef.current.getSource(
        'aoi-inverse'
      ) as mapboxgl.GeoJSONSource;
      aoiSource.setData(feature);
      aoiInverseSource.setData(featureInverse);
    }

    mapRef.current.fitBounds(
      bbox(feature) as [number, number, number, number],
      {
        padding: {
          top: 32,
          bottom: 32,
          right: 32,
          left: 12 * 16 // 12rems
        }
      }
    );
    /*
     theme.color.primary will never change. Having it being set once is enough
    */
  }, [isMapLoaded, feature]);

  return (
    <div {...rest}>
      <SimpleMap
        className='root'
        mapRef={mapRef}
        containerRef={mapContainer}
        onLoad={() => setMapLoaded(true)}
        mapOptions={mapOptions}
        attributionPosition='top-left'
      />
    </div>
  );
}

const rgbaFixed = rgba as any;

/**
 * Page Hero media map component
 *
 */
export default styled(PageHeroMedia)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 64%;
  z-index: -1;
  pointer-events: none;

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32%;
    z-index: 1;
    background: linear-gradient(
      90deg,
      ${rgbaFixed(themeVal('color.primary-900'), 1)} 0%,
      ${rgbaFixed(themeVal('color.primary-900'), 0)} 100%
    );
    content: '';
  }

  &::before {
    position: absolute;
    top: 0;
    right: 100%;
    bottom: 0;
    width: 100vw;
    z-index: 1;
    background: ${themeVal('color.primary-900')};
    content: '';
    pointer-events: none;
  }

  .mapboxgl-ctrl-attrib {
    opacity: 0;
  }
`;