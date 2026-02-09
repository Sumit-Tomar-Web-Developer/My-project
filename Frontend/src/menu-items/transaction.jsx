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

const transaction = {
  id: 'group-transaction',
  icon: icons.LinkOutlined,
  type: 'group',
  children: [
    {
      id: 'transaction',
      title: 'transaction',
      type: 'collapse',
      icon: icons.MessageOutlined,
      children: [
        {
          id: 'data-entry-approval',
          title: 'Data Entry Approval',
          type: 'item',
          url: '/transaction/data-entry-approval',
          breadcrumbs: false
        },
        {
          id: 'mutation-approval',
          title: 'Mutation Approval',
          type: 'item',
          url: '/transaction/mutation-approval',
          breadcrumbs: false
        },
        // {
        //   id: 'appoval-mutation',
        //   title: 'Approval Mutation',
        //   type: 'item',
        //   url: '/transaction/appoval-mutation',
        //   breadcrumbs: false
        // },
        // {
        //   id: 'pending-mutation',
        //   title: 'Pending Mutation ',
        //   type: 'item',
        //   url: '/transaction/pending-mutation',
        //   breadcrumbs: false
        // },
        {
          id: 'dd-cheque-approval',
          title: 'DD/Cheque Approval',
          type: 'item',
          url: '/transaction/dd-cheque-approval',
          breadcrumbs: false
        },
        {
          id: 'collection-approval',
          title: 'Collections Approval',
          type: 'item',
          url: '/transaction/collection-approval',
          breadcrumbs: false
        },
        {
          id: 'approve-online-approval',
          title: 'Approve Online Transaction',
          type: 'item',
          url: '/transaction/approve-online-approval',
          breadcrumbs: false
        },
        {
          id: 'generate-recipt',
          title: 'Generate Receipt',
          type: 'item',
          url: '/transaction/generate-recipt',
          breadcrumbs: false
        },
        {
          id: 'tax-payment-approval',
          title: 'Tax Payment Approval',
          type: 'item',
          url: '/transaction/tax-payment-approval',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default transaction;
