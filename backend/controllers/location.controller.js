import Location from '../models/location.model.js';

export const getProvinces = async (req, res) => {
  try {
    const provinces = await Location.find({ type: 'province' })
      .sort('name')
      .select('name code coordinates');
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDistricts = async (req, res) => {
  try {
    const province = await Location.findOne({
      type: 'province',
      code: req.query.provinceCode
    });

    if (!province) return res.status(404).json({ message: 'Province not found' });

    const districts = await Location.find({
      type: 'district',
      parent: province._id
    }).select('name code coordinates parent');

    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDSDivisions = async (req, res) => {
  try {
    const district = await Location.findOne({
      type: 'district',
      code: req.query.districtCode
    });

    if (!district) return res.status(404).json({ message: 'District not found' });

    const dsDivisions = await Location.find({
      type: 'ds-division',
      parent: district._id
    }).select('name code coordinates parent');

    res.json(dsDivisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};