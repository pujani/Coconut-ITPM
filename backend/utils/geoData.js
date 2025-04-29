// Western Province Sample Data
export const sriLankaGeoData = {
    type: "FeatureCollection",
    features: [
      // Western Province Boundary
      {
        type: "Feature",
        properties: {
          level: "province",
          name: "Western",
          code: "PRO-1",
          parent: null
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [79.6965, 7.2184], // Northwest point
              [80.2533, 6.5533], // Northeast point
              [80.0661, 6.4604], // Southeast point
              [79.7747, 6.7639], // Southwest point
              [79.6965, 7.2184]  // Closing point
            ]
          ]
        }
      },
      // Colombo District Boundary
      {
        type: "Feature",
        properties: {
          level: "district",
          name: "Colombo",
          code: "DIS-11",
          parent: "PRO-1"
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [79.7754, 6.9532], // Fort
              [79.8959, 6.7972], // Dehiwala
              [79.9502, 6.8416], // Kolonnawa
              [79.8810, 6.9837], // Kaduwela
              [79.7754, 6.9532]  // Closing point
            ]
          ]
        }
      },
      // Colombo DS Division
      {
        type: "Feature",
        properties: {
          level: "ds-division",
          name: "Colombo",
          code: "DS-111",
          parent: "DIS-11"
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [79.8441, 6.8862], // Galle Face
              [79.8563, 6.8794], // Fort
              [79.8625, 6.8931], // Pettah
              [79.8578, 6.9108], // Maradana
              [79.8441, 6.8862]  // Closing point
            ]
          ]
        }
      }
      // Add other divisions similarly
    ]
  };
  
  export const provinceCenters = {
    "PRO-1": [79.8612, 6.9271], // Western Province (Colombo)
    "PRO-2": [80.6350, 7.2906], // Central Province (Kandy)
    "PRO-3": [81.6747, 7.8731]  // Southern Province (Galle)
  };
  
  export const districtCenters = {
    "DIS-11": [79.8612, 6.9271], // Colombo
    "DIS-12": [79.9937, 7.1115], // Gampaha
    "DIS-21": [80.6337, 7.2906]  // Kandy
  };