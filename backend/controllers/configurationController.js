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
    const { budget, purpose, minGpuPerformance, minCpuPerformance, minRamGB } = req.body;

    const components = await Component.find();

    let cpus = components.filter(c => c.type === 'cpu');
    let gpus = components.filter(c => c.type === 'gpu');
    let rams = components.filter(c => c.type === 'ram');
    let storages = components.filter(c => c.type === 'storage');
    let psus = components.filter(c => c.type === 'psu');
    let cases = components.filter(c => c.type === 'case');
    let motherboards = components.filter(c => c.type === 'motherboard');

    if (minGpuPerformance) gpus = gpus.filter(g => g.performance >= minGpuPerformance);
    if (minCpuPerformance) cpus = cpus.filter(c => c.performance >= minCpuPerformance);
    if (minRamGB) rams = rams.filter(r => r.specs?.capacity >= minRamGB);

    cpus.sort((a, b) => a.price - b.price);
    gpus.sort((a, b) => a.price - b.price);
    rams.sort((a, b) => a.price - b.price);
    storages.sort((a, b) => a.price - b.price);
    psus.sort((a, b) => a.price - b.price);
    cases.sort((a, b) => a.price - b.price);
    motherboards.sort((a, b) => a.price - b.price);

    if (!cpus.length || !gpus.length || !rams.length || !storages.length || !psus.length || !cases.length || !motherboards.length) {
      return res.status(404).json({ message: 'Nije pronađena konfiguracija za zadate zahteve' });
    }

    const cpu = cpus[0];
    const gpu = gpus[0];
    const ram = rams[0];
    const storage = storages[0];
    const psu = psus[0];
    const caseItem = cases[0];
    const motherboard = motherboards[0];

    const totalPrice = cpu.price + gpu.price + ram.price + storage.price + psu.price + caseItem.price + motherboard.price;

    if (budget !== 9999 && totalPrice > budget) {
      return res.status(404).json({ message: 'Nije pronađena konfiguracija za zadati budžet' });
    }

    res.json({ cpu, gpu, ram, storage, psu, case: caseItem, motherboard, totalPrice });
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