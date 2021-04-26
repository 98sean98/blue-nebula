import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType({ description: 'A location obtained from reverse geocoding.' })
export class ReverseGeocoding {
  @Field(() => Float, {
    description: 'The latitude coordinate associated with the location result.',
  })
  latitude: number;

  @Field(() => Float, {
    description:
      'The longitude coordinate associated with the location result.',
  })
  longitude: number;

  @Field({ description: 'The formatted place name or address.' })
  label: string;

  @Field({
    description:
      'The name of the location result, which could be a place name, address, postal code, and more.',
  })
  name: string;

  @Field({ description: 'The type of location result.' })
  type: string;

  @Field({
    description:
      'The distance (in meters) between the location result and the coordinates specified.',
  })
  distance: number;

  @Field({ description: 'The street or house number.', nullable: true })
  number?: string;

  @Field({ description: 'The street name.', nullable: true })
  street?: string;

  @Field({ description: 'The postal code', nullable: true })
  postalCode?: string;

  @Field(() => Float, {
    description:
      'A confidence score between 0 (0% confidence) and 1 (100% confidence)',
  })
  confidence: number;

  @Field({ description: 'The name of the region.' })
  region: string;

  @Field({ description: 'The region code.' })
  regionCode: string;

  @Field({
    description: 'The name of the administrative area.',
    nullable: true,
  })
  administrativeArea?: string;

  @Field({ description: 'The name of the neighbourhood.', nullable: true })
  neighbourhood?: string;

  @Field({ description: 'The common name of the country.' })
  country: string;

  @Field({
    description: 'The ISO 3166 Alpha 2 (two letters) code of the country.',
  })
  countryCode: string;

  @Field({
    description: 'An embeddable map associated with the location result.',
    nullable: true,
  })
  mapUrl?: string;
}
