const Configuration = require('../models/Configuration');
const Component = require('../models/Component');

exports.createConfiguration = async (req, res) => {
  try {
    const configuration = await Configuration.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(configuration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find({ user: req.user.id })
      .populate('components.cpu components.gpu components.ram components.storage components.psu components.case components.motherboard');
    res.json(configurations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteConfiguration = async (req, res) => {
  try {
    await Configuration.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Konfiguracija obrisana' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateConfiguration = async (req, res) => {
  try {
    const { budget, purpose } = req.body;

    const components = await Component.find();

    const cpus = components.filter(c => c.type === 'cpu').sort((a, b) => b.performance - a.performance);
    const gpus = components.filter(c => c.type === 'gpu').sort((a, b) => b.performance - a.performance);
    const rams = components.filter(c => c.type === 'ram').sort((a, b) => b.performance - a.performance);
    const storages = components.filter(c => c.type === 'storage').sort((a, b) => b.performance - a.performance);
    const psus = components.filter(c => c.type === 'psu');
    const cases = components.filter(c => c.type === 'case');
    const motherboards = components.filter(c => c.type === 'motherboard');

    let bestConfig = null;
    let bestPerformance = 0;

    for (let cpu of cpus) {
      for (let gpu of gpus) {
        for (let ram of rams) {
          for (let storage of storages) {
            for (let psu of psus) {
              for (let caseItem of cases) {
                for (let mb of motherboards) {
                  const total = cpu.price + gpu.price + ram.price + storage.price + psu.price + caseItem.price + mb.price;
                  if (total <= budget) {
                    const performance = cpu.performance + gpu.performance + ram.performance + storage.performance;
                    if (performance > bestPerformance) {
                      bestPerformance = performance;
                      bestConfig = { cpu, gpu, ram, storage, psu, case: caseItem, motherboard: mb, totalPrice: total };
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (!bestConfig) return res.status(404).json({ message: 'Nije pronađena konfiguracija za zadati budžet' });

    res.json(bestConfig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find({ sentToAdmin: true })
      .populate('user', 'name email')
      .populate('components.cpu components.gpu components.ram components.storage components.psu components.case components.motherboard');
    res.json(configurations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};