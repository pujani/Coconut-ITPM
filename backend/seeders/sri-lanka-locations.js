import mongoose from 'mongoose';
import Location from '../models/location.model.js';
import { sriLankaGeoData, provinceCenters, districtCenters } from '../utils/geoData.js';

const seedLocations = async () => {
  await mongoose.connect('mongodb://localhost:27017/diseasedetect');
  await Location.deleteMany();

  // Create hierarchy: Province → District → DS Division
  const features = sriLankaGeoData.features.sort((a, b) => {
    const levels = { province: 1, district: 2, 'ds-division': 3 };
    return levels[a.properties.level] - levels[b.properties.level];
  });

  const locationMap = new Map();

  for (const feature of features) {
    const { properties, geometry } = feature;
    
    const locationData = {
      name: properties.name,
      code: properties.code,
      type: properties.level.replace('-', ''),
      coordinates: {
        type: geometry.type,
        coordinates: geometry.coordinates
      }
    };

    if (properties.parent) {
      locationData.parent = locationMap.get(properties.parent)._id;
    }

    const location = await Location.create(locationData);
    locationMap.set(properties.code, location);
    
    // Add administrative centers
    if (properties.level === 'province') {
      await Location.create({
        name: `${properties.name} Center`,
        code: `${properties.code}-CTR`,
        type: 'center',
        coordinates: {
          type: "Point",
          coordinates: provinceCenters[properties.code]
        },
        parent: location._id
      });
    }
    
    if (properties.level === 'district') {
      await Location.create({
        name: `${properties.name} Center`,
        code: `${properties.code}-CTR`,
        type: 'center',
        coordinates: {
          type: "Point",
          coordinates: districtCenters[properties.code]
        },
        parent: location._id
      });
    }
  }

  console.log('Successfully seeded Sri Lankan administrative divisions!');
  process.exit();
};

seedLocations().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});