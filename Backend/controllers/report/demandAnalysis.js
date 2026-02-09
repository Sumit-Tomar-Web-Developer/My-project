import sequelize from "../../config/connectionDB.js";


export const getCompareStatementResult = async (req, res) => {
  try {
    const response = await sequelize.query(`call prcDemandAnalysis2`);
    const data = response;

    if (!Array.isArray(data)) {
      return res.status(500).json({ message: 'Unexpected data format from PRC' });
    }

    /* ===================== GROUPING ===================== */

    const propRows = data.filter(r =>
      ['only old properties', 'as per old for new', 'only new properties', 'only zero tax properties']
        .includes(r.Particulars.trim().toLowerCase())
    );

    const opRows = data.filter(r =>
      ['only old op', 'op as per old for new', 'only new op', 'only zero tax op']
        .includes(r.Particulars.trim().toLowerCase())
    );

    const nineRows = data.filter(r => r.Particulars.trim() === '9');

    /* ===================== HELPERS ===================== */

    const sumColumn = (rows, col) =>
      rows.reduce((acc, r) => acc + Number(r[col] || 0), 0);

    const result = [];

    /* ===================== BUILD RESULT ===================== */

    propRows.forEach(r => result.push({ ...r }));
    result.push({
      Particulars: 'drProp subtotal',
      Properties: sumColumn(propRows, 'Properties'),
      BeforAssessDemand: sumColumn(propRows, 'BeforAssessDemand'),
      NewTotalDemand: sumColumn(propRows, 'NewTotalDemand')
    });

    opRows.forEach(r => result.push({ ...r }));
    result.push({
      Particulars: 'drOP subtotal',
      Properties: sumColumn(opRows, 'Properties'),
      BeforAssessDemand: sumColumn(opRows, 'BeforAssessDemand'),
      NewTotalDemand: sumColumn(opRows, 'NewTotalDemand')
    });

    nineRows.forEach(r => result.push({ ...r }));
    result.push({
      Particulars: 'drTOT subtotal',
      Properties: sumColumn(nineRows, 'Properties'),
      BeforAssessDemand: sumColumn(nineRows, 'BeforAssessDemand'),
      NewTotalDemand: sumColumn(nineRows, 'NewTotalDemand')
    });

  
    /* ===================== OPTIMIZED MAPPING ===================== */

    const PARTICULARS_MAP = {
      'only old properties': 'शहरातील जुने मालमत्ता-इमारत',
      'as per old for new': 'अंशतः आकारणी केलेल्या मालमत्ता-इमारत',
      'only new properties': 'वाढीव मालमत्ता-इमारत',
      'only zero tax properties': 'शहरातील एकूण कर निरंक असलेल्या मालमत्ता',

      'only old op': 'शहरातील खुले भुखंड',
      'op as per old for new': 'अंशतः आकारणी केलेले खुले भुखंड',
      'only new op': 'वाढीव खुले भुखंड',
      'only zero tax op': 'शहरातील एकूण कर निरंक असलेले भूखंड'
    };

    const SUBTOTAL_MAP = {
      'drprop subtotal': 'एकूण मालमत्ता-इमारत',
      'drop subtotal': 'एकूण खुले भुखंड',
      'drtot subtotal': 'एकूण मालमत्ता'
    };

    const NINE_MAP = [
      'शहरातील जुने मालमत्ता',
      'अंशतः आकारणी केलेल्या मालमत्ता',
      'वाढीव मालमत्ता',
      'निरंक मालमत्ता'
    ];

    let nineIndex = 0;

    result.forEach(row => {
      const key = row.Particulars?.toString().trim().toLowerCase();
      if (!key) return;

      if (key === '9') {
        row.Particulars = NINE_MAP[nineIndex++] || 'एकूण मालमत्ता';
        return;
      }

      if (SUBTOTAL_MAP[key]) {
        row.Particulars = SUBTOTAL_MAP[key];
        return;
      }

      if (PARTICULARS_MAP[key]) {
        row.Particulars = PARTICULARS_MAP[key];
      }
    });

    /* ===================== RESPONSE ===================== */

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

