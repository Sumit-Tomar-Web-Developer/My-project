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

const payment = {
  id: 'payment-amc',
  icon: icons.LinkOutlined,
  type: 'group',
  children: [
    {
      id: 'payment',
      title: 'payment',
      type: 'collapse',
      icon: icons.BuildOutlined,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/payment/dashboard',
          breadcrumbs: false
        },
        {
          id: 'offline-payment',
          title: 'Offline Payment',
          type: 'item',
          url: '/payment/offline-payment',
          breadcrumbs: false
        },

        {
          id: 'online-payment',
          title: 'Online Payment',
          type: 'item',
          url: '/payment/online-payment',
          breadcrumbs: false
        },
        // {
        //   id: 'get-property-online-payment',
        //   title: 'Get Property Online Payment',
        //   type: 'item',
        //   url: '/payment/get-property-online-payment',
        //   breadcrumbs: false
        // },
        // {
        //   id: 'team-condition',
        //   title: 'Team&Condition',
        //   type: 'item',
        //   url: '/payment/team-condition',
        //   breadcrumbs: false
        // },
        {
          id: 'transfer-fee',
          title: 'Transfer Fee',
          type: 'item',
          url: '/payment/transfer-fee',
          breadcrumbs: false
        },
        // {
        //   id: 'get-property-transfer-fee',
        //   title: 'Get Property Transfer Fee',
        //   type: 'item',
        //   url: '/payment/get-property-transfer-fee',
        //   breadcrumbs: false
        // },
       
      ]
    }
  ]
};

export default payment;
