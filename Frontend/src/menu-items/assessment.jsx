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

const assessment = {
  id: 'group-assessment',
  icon: icons.UserOutlined,
  type: 'group',
  children: [
    {
      id: 'assessment',
      title: 'Assessment',
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'data-entry',
          title: 'Data Entry',
          type: 'item',
          url: '/assessment/data-entry',
          breadcrumbs: false
        },
        {
          id: 'total-valuation',
          title: 'Total Valuation',
          type: 'item',
          url: '/assessment/total-valuation',
          breadcrumbs: false
        },
        {
          id: 'appeal',
          title: 'Appeal',
          type: 'item',
          url: '/assessment/appeal',
          breadcrumbs: false
        },
      
        // {
        //   id: 'social-details-total-valuation',
        //   title: 'Social Details Total valution',
        //   type: 'item',
        //   url: '/assessment/social-details-total-valuation',
        //   breadcrumbs: false
        // },
        {
          id: 'mutation',
          title: 'Mutation',
          type: 'item',
          url: '/assessment/mutation',
          breadcrumbs: false
        },
        {
          id: 'zoning',
          title: 'Zoning',
          type: 'item',
          url: '/assessment/zoning',
          breadcrumbs: false
        },

        {
          id: 'renter-mutation',
          title: 'Renter Mutation',
          type: 'item',
          url: '/assessment/renter-mutation',
          breadcrumbs: false
        }
      ]
    }
  ]
};
export default assessment;
