import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined
} from '@ant-design/icons';

const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined
};

const amc = {
  id: 'group-amc',
  icon: icons.LinkOutlined,
  type: 'group',
  children: [
    {
      id: 'amc',
      title: 'AMC',
      type: 'collapse',
      icon: icons.MessageOutlined,
      children: [
        {
          id: 'advance-payment',
          title: 'Advance Payment',
          type: 'item',
          url: '/amc/advance-payment',
          breadcrumbs: false
        },
        {
          id: 'bill-book-entry',
          title: 'Bill Book Entry',
          type: 'item',
          url: '/amc/bill-book-entry',
          breadcrumbs: false
        },
        {
          id: 'defaulter-list-amc-account',
          title: 'Defaulter List',
          type: 'item',
          url: '/amc/defaulter-list-amc-account',
          breadcrumbs: false
        },
        // {
        //   id: 'employee-master',
        //   title: 'Employee Master',
        //   type: 'item',
        //   url: '/amc/employee-master',
        //   breadcrumbs: false
        // },
        {
          id: 'report-engine',
          title: 'Report Engine',
          type: 'item',
          url: '/amc/report-engine',
          breadcrumbs: false
        },
        {
          id: 'set-custom-tax',
          title: 'Set Custom Tax',
          type: 'item',
          url: '/amc/set-custom-tax',
          breadcrumbs: false
        },
        {
          id: 'set-remark-for-invoice',
          title: 'Set Remark For Invoice',
          type: 'item',
          url: '/amc/set-remark-for-invoice',
          breadcrumbs: false
        },
        {
          id: 'tax-payment',
          title: 'Tax Payment',
          type: 'item',
          url: '/amc/tax-payment',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default amc;
