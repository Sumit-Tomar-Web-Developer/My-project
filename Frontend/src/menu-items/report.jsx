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

const report = {
  id: 'group-report',
  icon: icons.CustomerServiceOutlined,
  type: 'group',
  children: [
    {
      id: 'report',
      title: 'Report',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      children: [
        {
          id: 'admin-report',
          title: 'Admin Report',
          type: 'item',
          url: '/report/admin-report',
          breadcrumbs: false
        },
        {
          id: 'property-wise',
          title: 'Property Wise',
          type: 'item',
          url: '/report/property-wise',
          breadcrumbs: false
        },
        {
          id: 'ward-wise',
          title: 'Ward Wise',
          type: 'item',
          url: '/report/ward-wise',
          breadcrumbs: false
        },
        {
          id: 'daily-collection-report',
          title: 'Daily Collection Report',
          type: 'item',
          url: '/report/daily-collection-report',
          breadcrumbs: false
        },
        {
          id: 'demand-analysis',
          title: 'Demand Analysis',
          type: 'item',
          url: '/report/demand-analysis',
          breadcrumbs: false
        },
        // {
        //   id: 'property-classification',
        //   title: 'Property Classification',
        //   type: 'item',
        //   url: '/report/property-classification',
        //   breadcrumbs: false
        // },
        {
          id: 'mutation-history',
          title: 'Mutation History',
          type: 'item',
          url: '/report/mutation-history',
          breadcrumbs: false
        },
        {
          id: 'report-engine',
          title: 'Report Engine',
          type: 'item',
          url: '/report/report-engine',
          breadcrumbs: false
        },
        {
          id: 'collection-report',
          title: 'Collection Report',
          type: 'item',
          url: '/report/collection-report',
          breadcrumbs: false
        },
        {
          id: 'quality-control-report',
          title: 'Quality Control Report',
          type: 'item',
          url: '/report/quality-control-report',
          breadcrumbs: false
        },
        {
          id: 'auto-qc',
          title: 'Auto Qc',
          type: 'item',
          url: '/report/auto-qc',
          breadcrumbs: false
        }
      ]
    }
  ]
};
export default report;
