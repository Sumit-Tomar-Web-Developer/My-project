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

const master = {
  id: 'group-master',
  icon: icons.LinkOutlined,
  type: 'group',
  children: [
    {
      id: 'master',
      title: 'Master',
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'apply-tax',
          title: 'Apply Tax Master',
          type: 'item',
          url: '/master/apply-tax',
          breadcrumbs: false
        },
        {
          id: 'assessment-rule',
          title: 'Assessment Rule Master',
          type: 'item',
          url: '/master/assessment-rule',
          breadcrumbs: false
        },
        {
          id: 'construction-type',
          title: 'Construction Type Master',
          type: 'item',
          url: '/master/construction-type',
          breadcrumbs: false
        },
        {
          id: 'council-details',
          title: 'Council Master',
          type: 'item',
          url: '/master/council-details',
          breadcrumbs: false
        },
        {
          id: 'depreciation',
          title: 'Depreciation Master',
          type: 'item',
          url: '/master/depreciation',
          breadcrumbs: false
        },
        {
          id: 'floor',
          title: 'Floor Master',
          type: 'item',
          url: '/master/floor',
          breadcrumbs: false
        },
        {
          id: 'maintenance',
          title: 'Maintenance Master',
          type: 'item',
          url: '/master/maintenance',
          breadcrumbs: false
        },
        {
          id: 'open-plot-rate',
          title: 'Open Plot Rate Master',
          type: 'item',
          url: '/master/open-plot-rate',
          breadcrumbs: false
        },
        {
          id: 'penalty',
          title: 'Penalty Master',
          type: 'item',
          url: '/master/penalty',
          breadcrumbs: false
        },
        {
          id: 'prime-apply-taxes',
          title: 'Prime Apply Taxes Master',
          type: 'item',
          url: '/master/prime-apply-taxes',
          breadcrumbs: false
        },
        {
          id: 'prime-type-of-use',
          title: 'Prime Type Of Use Master',
          type: 'item',
          url: '/master/prime-type-of-use',
          breadcrumbs: false
        },
        // {
        //   id: 'property-type-tax',
        //   title: 'Property Type Tax',
        //   type: 'item',
        //   url: '/master/property-type-tax',
        //   breadcrumbs: false
        // },
        //change
        {
          id: 'property-type',
          title: 'Property Description Master',
          type: 'item',
          url: '/master/property-type',
          breadcrumbs: false
        },
        {
          id: 'rate-master',
          title: 'Rate Master',
          type: 'item',
          url: '/master/rate-master',
          breadcrumbs: false
        },
        {
          id: 'retain-policy-factor',
          title: 'Retain Policy Factor Master',
          type: 'item',
          url: '/master/retain-policy-factor',
          breadcrumbs: false
        },
        
        {
          id: 'tax-master',
          title: 'Tax Master',
          type: 'item',
          url: '/master/tax-master',
          breadcrumbs: false
        },
        {
          id: 'tax-name',
          title: 'Tax Name Master',
          type: 'item',
          url: '/master/tax-name',
          breadcrumbs: false
        },
        {
          id: 'type-of-use',
          title: 'Type Of Use Master',
          type: 'item',
          url: '/master/type-of-use',
          breadcrumbs: false
        },
        {
          id: 'year-master',
          title: 'Year Master',
          type: 'item',
          url: '/master/year-master',
          breadcrumbs: false
        },
        {
          id: 'zone',
          title: 'Zone Master',
          type: 'item',
          url: '/master/zone',
          breadcrumbs: false
        },
        {
          id: 'zone-section',
          title: 'Zone Section Master',
          type: 'item',
          url: '/master/zone-section',
          breadcrumbs: false
        },
        {
          id: 'active-taxes',
          title: 'Active Taxes Master',
          type: 'item',
          url: '/master/active-taxes',
          breadcrumbs: false
        },
        {
          id: 'active-year',
          title: 'Active Year Master',
          type: 'item',
          url: '/master/active-year',
          breadcrumbs: false
        },
        {
          id: 'bank-master',
          title: 'Bank Master',
          type: 'item',
          url: '/master/bank-master',
          breadcrumbs: false
        }
      ]
    }
  ]
};
export default master;
