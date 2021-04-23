import { Arg, Field, Float, InputType, Query, Resolver } from 'type-graphql';
import axios from 'axios';

import { ReverseGeocoding } from './reverseGeocoding.object';

const url = 'http://api.positionstack.com/v1/reverse';
const accessKey = process.env.POSITIION_STACK_API_KEY;

@InputType({ description: 'Latitude and longitude coordinates' })
class ReverseGeocodingInput {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}

@Resolver()
export class ReverseGeocodingResolver {
  @Query(() => ReverseGeocoding)
  async reverseGeocoding(
    @Arg('where') { latitude, longitude }: ReverseGeocodingInput,
  ): Promise<ReverseGeocoding> {
    const query = `${latitude},${longitude}`;

    const response = await axios.get(url, {
      params: { access_key: accessKey, query },
    });

    if (
      typeof response.data === 'undefined' ||
      typeof response.data.data === 'undefined' ||
      !(
        response.data.data.hasOwnProperty('length') &&
        response.data.data.length > 0
      )
    )
      throw new Error('Invalid response data from position stack.');

    const locations: Array<Record<string, any>> = response.data.data;
    // sort locations by descending confidence
    const sortedLocations = locations.sort(
      (a, b) => b.confidence - a.confidence,
    );

    const locationOfHighestConfidence = sortedLocations[0];
    const {
      latitude: _latitude,
      longitude: _longitude,
      label,
      name,
      type,
      distance,
      number,
      street,
      postal_code: postalCode,
      confidence,
      region,
      region_code: regionCode,
      administrative_area: administrativeArea,
      neighbourhood,
      country,
      country_code: countryCode,
      map_url: mapUrl,
    } = locationOfHighestConfidence;

    return {
      latitude: _latitude,
      longitude: _longitude,
      label,
      name,
      type,
      distance,
      number,
      street,
      postalCode,
      confidence,
      region,
      regionCode,
      administrativeArea,
      neighbourhood,
      country,
      countryCode,
      mapUrl,
    };
  }
}
