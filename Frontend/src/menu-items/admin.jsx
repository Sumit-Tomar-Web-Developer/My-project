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

const admin = {
  id: 'group-admin',
  icon: icons.UserOutlined,
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Admin',
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'page-level-access',
          title: 'Page Level Access',
          type: 'item',
          url: '/admin/page-level-access',
          breadcrumbs: false
        },
        {
          id: 'manage-page-level-access',
          title: 'Manage Page Level Access',
          type: 'item',
          url: '/admin/manage-page-level-access',
          breadcrumbs: false
        },
        {
          id: 'auto-hearing-appeal-comm',
          title: 'Manage Hearing Appeal ',
          type: 'item',
          url: '/admin/auto-hearing-appeal-comm',
          breadcrumbs: false
        },
        {
          id: 'discount-slab-master',
          title: 'Discount Slab Master',
          type: 'item',
          url: '/admin/discount-slab-master',
          breadcrumbs: false
        },
        {
          id: 'lock-property',
          title: 'Lock Property',
          type: 'item',
          url: '/admin/lock-property',
          breadcrumbs: false
        },
        {
          id: 'new-page-name',
          title: 'New Page Name',
          type: 'item',
          url: '/admin/new-page-name',
          breadcrumbs: false
        },
        // {
        //   id: 'new-page-group',
        //   title: 'New Page Group',
        //   type: 'item',
        //   url: '/admin/new-page-group',
        //   breadcrumbs: false
        // },
        {
          id: 'new-user',
          title: 'New User',
          type: 'item',
          url: '/admin/new-user',
          breadcrumbs: false
        },
        {
          id: 'penalty-on-owner-id',
          title: 'Penalty On Owner Id',
          type: 'item',
          url: '/admin/penalty-on-owner-id',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default admin;
