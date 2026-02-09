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

const adminPanel = {
  id: 'group-admin-panel',
  icon: icons.UserOutlined,
  type: 'group',
  children: [
    {
      id: 'admin-panel',
      title: 'Admin Panel',
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'application-setting',
          title: 'Application Setting',
          type: 'item',
          url: '/admin-panel/application-setting',
          breadcrumbs: false
        },
        {
          id: 'approval-allocation',
          title: 'Approval Allocation',
          type: 'item',
          url: '/admin-panel/approval-allocation',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default adminPanel;
