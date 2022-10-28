import { userTzDate2utcString } from '$utils/date';
import { endOfDay, startOfDay } from 'date-fns';
import { Feature, MultiPolygon, Polygon } from 'geojson';

/**
 * Creates the appropriate filter object to send to STAC.
 *
 * @param {Date} start Start date to request
 * @param {Date} end End date to request
 * @param {string} collection STAC collection to request
 * @returns Object
 */
export function getFilterPayload(
  start: Date,
  end: Date,
  aoiFeature: Feature<Polygon>,
  collections: string[]
) {
  const filterPayload = {
    op: 'and',
    args: [
      {
        op: 't_intersects',
        args: [
          { property: 'datetime' },
          {
            interval: [
              userTzDate2utcString(startOfDay(start)),
              userTzDate2utcString(endOfDay(end))
            ]
          }
        ]
      },
      {
        op: 's_intersects',
        args: [{ property: 'geometry' }, aoiFeature.geometry]
      },
      {
        op: 'in',
        args: [{ property: 'collection' }, collections]
      }
    ]
  };
  return filterPayload;
}

export function multiPolygonToPolygon(
  feature: Feature<MultiPolygon>
): Feature<Polygon> {
  return {
    type: 'Feature',
    properties: { ...feature.properties },
    geometry: {
      type: 'Polygon',
      coordinates: feature.geometry.coordinates[0]
    }
  };
}