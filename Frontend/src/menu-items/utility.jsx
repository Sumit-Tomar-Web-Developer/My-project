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



const utility = {
  id: 'group-utility',
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'utility',
      title: 'Utility',
      type: 'collapse',
      icon: icons.CustomerServiceOutlined,
      children: [
        {
          id: 'add-taxes',
          title: 'Add Taxes',
          type: 'item',
          url: '/utility/add-taxes',
          breadcrumbs: false
        },
        {
          id: 'auto-ward',
          title: 'Auto Ward',
          type: 'item',
          url: '/utility/auto-ward',
          breadcrumbs: false
        },  
        {
          id: 'auto-appeal',
          title: 'Set Policies',
          type: 'item',
          url: '/utility/auto-appeal',
          breadcrumbs: false
        }, 

        {
          id: 'ward-allocation',
          title: 'Ward Allocation',
          type: 'item',
          url: '/utility/ward-allocation',
          breadcrumbs: false
        },
        {
          id: 'delete-access-property-from-database',
          title: 'Delete Excess Property ',
          type: 'item',
          url: '/utility/delete-access-property-from-database',
          breadcrumbs: false
        },

        {
          id: 'data-entry-same-as',
          title: 'Data Entry Same As',
          type: 'item',
          url: '/utility/data-entry-same-as',
          breadcrumbs: false
        },
       
        {
          id: 'update-property-address',
          title: 'Update Property Details',
          type: 'item',
          url: '/utility/update-property-address',
          breadcrumbs: false
        },
         
        {
          id: 'upload-plan-and-photo',
          title:  <span style={{ color: 'orange',frontWeight: 'bold' }} >Upload Plan And Photo</span>,
          type: 'item',
          url: '/utility/upload-plan-and-photo',
          breadcrumbs: false
        },
        
       
        {
          id: 'image-downloader',
          title: <span style={{ color: 'orange',frontWeight: 'bold'  }} >Image downloader</span>,
          type: 'item',
          url: '/utility/image-downloader',
          breadcrumbs: false,
        
        },
        // {
        //   id: 'owner-name-same-as',
        //   title: <span style={{ color: 'orange',frontWeight: 'bold'  }} >Owner Name Same As</span>,
        //   type: 'item',
        //   url: '/utility/owner-name-same-as',
        //   breadcrumbs: false
        // },
       
        
      ]
    }
  ]
};
export default utility;
