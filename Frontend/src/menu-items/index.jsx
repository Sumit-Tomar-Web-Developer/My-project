// // import payment from './payment';
// // import admin from './admin';
// // import amc from './amc';
// // import assessment from './assessment';
// // import master from './master';
// // import report from './report';
// // import transaction from './transaction';
// // import utility from './utility';
// // import adminPanel from './admin-panel';

// // const menuItems = {
// //   items: [amc, assessment, report, utility, admin, master, transaction, adminPanel, payment]
// // };

// // export default menuItems;

import payment from './payment';
import admin from './admin';
import amc from './amc';
import assessment from './assessment';
import master from './master';
import report from './report';
import transaction from './transaction';
import utility from './utility';
import adminPanel from './admin-panel';

const getMenuItems = () => {
  const userData = localStorage.getItem('user');
  const sessionData = userData && userData !== 'undefined' ? JSON.parse(userData) : {};

  const userRole = sessionData?.role || '';

  console.log('Logged in user role:', userRole);

  return {
    items: [
      amc,
      assessment,
      report,
      utility,
      ...(userRole === 'Admin' ? [admin] : []), // only show if admin
      master,
      transaction,
      adminPanel,
      payment
    ]
  };
};

export default getMenuItems;
