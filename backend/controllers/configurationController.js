const Configuration = require('../models/Configuration');
const Component = require('../models/Component');
const { createNotification } = require('./notificationController');
const User = require('../models/User');

exports.createConfiguration = async (req, res) => {
  try {
    const configuration = await Configuration.create({
      ...req.body,
      user: req.user.id
    });

    if (req.body.sentToAdmin) {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'configuration',
          'Nova konfiguracija',
          `Korisnik je poslao zahtev za konfiguraciju: ${req.body.name}`,
          '/admin/configurations'
        );
      }
    }

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

    if (!cpus.length || !gpus.length || !rams.length || !storages.length || !psus.length || !cases.length || !motherboards.length) {
      return res.status(404).json({ message: 'Nije pronađena konfiguracija za zadate zahteve' });
    }

    if (budget === 9999) {
      cpus.sort((a, b) => a.price - b.price);
      gpus.sort((a, b) => a.price - b.price);
      rams.sort((a, b) => a.price - b.price);
      storages.sort((a, b) => a.price - b.price);
      psus.sort((a, b) => a.price - b.price);
      cases.sort((a, b) => a.price - b.price);
      motherboards.sort((a, b) => a.price - b.price);

      const cpu = cpus[0];
      const gpu = gpus[0];
      const ram = rams[0];
      const storage = storages[0];
      const psu = psus[0];
      const caseItem = cases[0];
      const motherboard = motherboards[0];
      const totalPrice = cpu.price + gpu.price + ram.price + storage.price + psu.price + caseItem.price + motherboard.price;

      return res.json({ cpu, gpu, ram, storage, psu, case: caseItem, motherboard, totalPrice });
    }

    cpus.sort((a, b) => b.performance - a.performance);
    gpus.sort((a, b) => b.performance - a.performance);
    rams.sort((a, b) => b.performance - a.performance);
    storages.sort((a, b) => b.performance - a.performance);
    psus.sort((a, b) => b.performance - a.performance);
    cases.sort((a, b) => b.performance - a.performance);
    motherboards.sort((a, b) => b.performance - a.performance);

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

exports.sendToAdmin = async (req, res) => {
  try {
    const configuration = await Configuration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { sentToAdmin: true },
      { new: true }
    );
    res.json(configuration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};