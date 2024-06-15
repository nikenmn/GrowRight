// Mengklasifikasikan status gizi berdasarkan tinggi badan dan berat badan
// Indeks Massa Tubuh (IMT)
const calculateBMI = (number) => {
  const text = 'berdasarkan berat dan tinngi badan.';
  if (number < -3.0) {
    return `Gizi Buruk ${text}`;
  }
  if (number >= -3.0 && number < -2.0) {
    return `Gizi Kurang ${text}`;
  }
  if (number >= -2.0 && number <= 1.0) {
    return `Gizi Baik ${text}`;
  }
  if (number > 1.0 && number <= 2.0) {
    return `Beresiko Gizi Lebih ${text}`;
  }
  if (number > 2.0 && number <= 3.0) {
    return `Gizi Lebih ${text}`;
  }
  if (number > 3.0) {
    return `Obesitas ${text}`;
  }
  return 'Data Tidak Valid';
};

// Mengklasifikasikan status gizi berdasarkan tinggi badan dan umur
const classifyBMI = (number) => {
  const text = 'berdasarkan tinggi badan dan umur.';
  if (number < -3.0) {
    return `Sangat pendek ${text}`;
  }
  if (number >= -3.0 && number < -2.0) {
    return `Pendek ${text}`;
  }
  if (number >= -2.0 && number <= 3.0) {
    return `Normal ${text}`;
  }
  if (number > 3.0) {
    return `Tinggi ${text}`;
  }
  return 'Data Tidak Valid';
};

// mengklasifikasikan status gizi berdasarkan berat badan dan umur
const classifyWeightStatus = (number) => {
  const text = 'berdasarkan berat badan dan umur.';
  if (number < -3.0) {
    return `Sangat kurang ${text}`;
  }
  if (number >= -3.0 && number < -2.0) {
    return `Kurang ${text}`;
  }
  if (number >= -2.0 && number <= 1.0) {
    return `Normal ${text}`;
  }
  if (number > 1.0) {
    return `Berlebihan ${text}`;
  }
  return 'Data Tidak Valid';
};

// Conclusion
const conclusionClassify = (number) => {
  if (number < -3.0) {
    return {
      category: 'Stunting',
      notes: 'Sangat kurang gizi',
    };
  }
  if (number >= -3.0 && number < -2.0) {
    return {
      category: 'Stunting',
      notes: 'Kurang gizi',
    };
  }
  if (number >= -2.0 && number <= -1.0) {
    return {
      category: 'Stunting',
      notes: 'Sedikit kurang gizi',
    };
  }
  if (number >= -1.0 && number <= 0.0) {
    return {
      category: 'Stunting',
      notes: 'Sedikit kurang gizi',
    };
  }
  if (number >= -1.0 && number <= 0.0) {
    return {
      category: 'No Stunting',
      notes: 'Gizi normal',
    };
  }
  if (number >= 0.0 && number <= 1.0) {
    return {
      category: 'No Stunting',
      notes: 'Gizi sedikit berlebih',
    };
  }
  if (number >= 1.0 && number <= 2.0) {
    return {
      category: 'No Stunting',
      notes: 'Gizi berlebih',
    };
  }
  if (number >= 2.0 && number <= 3.0) {
    return {
      category: 'No Stunting',
      notes: 'Gizi sangat berlebih',
    };
  }
  return 'Data Tidak Valid';
};

module.exports = {
  calculateBMI,
  classifyBMI,
  classifyWeightStatus,
  conclusionClassify,
};
