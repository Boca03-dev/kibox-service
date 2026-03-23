const Component = require('../models/Component');

exports.getComponents = async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const components = await Component.find(filter);
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComponent = async (req, res) => {
  try {
    const component = await Component.create(req.body);
    res.status(201).json(component);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    await Component.findByIdAndDelete(req.params.id);
    res.json({ message: 'Komponenta obrisana' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};