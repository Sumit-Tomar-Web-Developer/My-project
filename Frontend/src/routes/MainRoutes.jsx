import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - amc pages
const AdvancePayment = Loadable(lazy(() => import('pages/amc/advancepayment/AdvancePayment')));
const Billbookentry = Loadable(lazy(() => import('pages/amc/billbookentry/BillBookEntry')));
const DefaulterListAmcAccount = Loadable(lazy(() => import('pages/amc/defaulterlistamcaccount/DefaulterListAmcAccount')));

const AmcReportEngine = Loadable(lazy(() => import('pages/amc/reportengine/ReportEngine')));
const SetCustomTax = Loadable(lazy(() => import('pages/amc/setcustomtax/SetCustomTax')));
const SetRemarkForInvoice = Loadable(lazy(() => import('pages/amc/setremarksforinvoice/SetRemarkForInvoice')));
const TaxPayment = Loadable(lazy(() => import('pages/amc/taxpayment/TaxPayment')));

// render - assessment pages
const DataEntry = Loadable(lazy(() => import('pages/assessment/data-entry/DataEntry')));
const TotalValuation = Loadable(lazy(() => import('pages/assessment/total-valuation/TotalValuation')));
const Appeal = Loadable(lazy(() => import('pages/assessment/appeal/Appeal')));
const OldInformation = Loadable(lazy(() => import('pages/assessment/old-information/OldInformation')));
const SocialDetails = Loadable(lazy(() => import('pages/assessment/social-details/SocialDetails')));
const Mutation = Loadable(lazy(() => import('pages/assessment/mutation/Mutation')));
const Zoning = Loadable(lazy(() => import('pages/assessment/zoning/Zoning')));
const RenterMutation = Loadable(lazy(() => import('pages/assessment/renter-mutation/RenterMutation')));
const UpdateRetainTax = Loadable(lazy(() => import('pages/assessment/data-entry/UpdateRetainTax')));
// const SocialDetailsTotalValuation = Loadable(lazy(() => import('pages/assessment/total-valuation/socailDetailsTotalValu')));

// render - report pages
const AdminReport = Loadable(lazy(() => import('pages/report/adminreport/AdminReport')));
const PropertyWise = Loadable(lazy(() => import('pages/report/propertywise/PropertyWise')));
const WardWise = Loadable(lazy(() => import('pages/report/wardwise/WardWise')));
const DailyCollectionReport = Loadable(lazy(() => import('pages/report/dailycollectionreport/DailyCollectionReport')));
const DemandAnalysis = Loadable(lazy(() => import('pages/report/demandanalysis/DemandAnalysis')));
const PropertyClassification = Loadable(lazy(() => import('pages/report/propertycalssification/PropertyClassification')));
const MutationHistory = Loadable(lazy(() => import('pages/report/mutationhistory/MutationHistory')));
const ReportEngine = Loadable(lazy(() => import('pages/report/reportengine/ReportEngine')));
const CollectionReport = Loadable(lazy(() => import('pages/report/collectionreport/CollectionReport')));
const QualityControlReports = Loadable(lazy(() => import('pages/report/qualitycontrolreports/QualityConrolReports')));
const AutoQc = Loadable(lazy(() => import('pages/report/AutoQc/autoQc')));

// render - utility pages
const AddTaxes = Loadable(lazy(() => import('pages/utility/add-taxes/AddTaxes')));
const DataEntrySameAs = Loadable(lazy(() => import('pages/utility/DataEnterySameAS/DataEntrySameAs')));
const AutoWard = Loadable(lazy(() => import('pages/utility/auto-ward/AutoWard')));
const AutoAppeal = Loadable(lazy(() => import('pages/utility/set-policies/SetPolicies')));

const DeleteAccessPropertyFromDatabase = Loadable(
  lazy(() => import('pages/utility/DeleteAccessPropertyFromDataBase/DeleteAccessPropertyFromDatabase'))
);
const ImageDownloader = Loadable(lazy(() => import('pages/utility/ImageDownload/ImageDownloader')));
const OwnerNameSameAs = Loadable(lazy(() => import('pages/utility/owner-name-same-as/OwnerNameSameAs')));
const UpdatePropertyAddress = Loadable(lazy(() => import('pages/utility/UpdatePropertyDetails/UpdatePropertyDetails')));
const WardAllocation = Loadable(lazy(() => import('pages/utility/WardAllocation/WardAllocation')));
const UploadPlanAndPhoto = Loadable(lazy(() => import('pages/utility/upload-plan-and-photo/UploadPlanAndPhoto')));

//Admin
const PageLevelAccess = Loadable(lazy(() => import('pages/admin/page-level-access/PageLevelAccess')));
const AutoHearingAppealComm = Loadable(lazy(() => import('pages/admin/auto-hearing-aapeal-comm/AutoHearingAppealComm')));
const DiscountSlabMaster = Loadable(lazy(() => import('pages/admin/discount-slab-master/DiscountSlabMaster')));
const LockProperty = Loadable(lazy(() => import('pages/admin/lock-property/LockProperty')));
const NewPageName = Loadable(lazy(() => import('pages/admin/new-page-name/NewPageName')));
//const NewPageGroup = Loadable(lazy(() => import('pages/admin/new-page-group/NewPageGroup')));
const NewUser = Loadable(lazy(() => import('pages/admin/new-user/NewUser')));
const PenaltyOnOwnerId = Loadable(lazy(() => import('pages/admin/penalty-on-owner/PenaltyOnOwnerId')));
const ManagePageLevelAccess = Loadable(lazy(() => import('pages/admin/manage-page-level-access/ManagePageLevelAcess')));

//Master
const ApplyTax = Loadable(lazy(() => import('pages/Master/apply-tax/ApplyTax')));
const AssessmentRule = Loadable(lazy(() => import('pages/Master/assessment-rule/AssessmentRule')));
const ConstructionType = Loadable(lazy(() => import('pages/Master/construction-type/constructionType')));
const CouncilDetails = Loadable(lazy(() => import('pages/Master/council-details/CouncilDetails')));
const Depreciation = Loadable(lazy(() => import('pages/Master/depreciation/Depreciation')));
const Floor = Loadable(lazy(() => import('pages/Master/floor/Floor')));
const Maintenance = Loadable(lazy(() => import('pages/Master/maintenance/Maintenance')));
const OpenPlotRate = Loadable(lazy(() => import('pages/Master/open-plot-rate/OpenPlotRate')));
const Penalty = Loadable(lazy(() => import('pages/Master/penalty/Penalty')));
const PrimeApplyTaxes = Loadable(lazy(() => import('pages/Master/prime-apply-taxes/PrimeApplyTaxes')));
const PrimeTypeOfUse = Loadable(lazy(() => import('pages/Master/prime-type-of-use/PrimeTypeOfUse')));
const PropertyType = Loadable(lazy(() => import('pages/Master/property-type/PropertyType')));
// const PropertyTypeTax = Loadable(lazy(() => import('pages/Master/property-type-tax/PropertyTypeTax')));
const RateMaster = Loadable(lazy(() => import('pages/Master/rate-master/RateMaster')));
const RetainPolicyFactor = Loadable(lazy(() => import('pages/Master/retain-policy-factor/RetainPolicyFactor')));
const TaxMaster = Loadable(lazy(() => import('pages/Master/tax-master/TaxMaster')));
const TaxName = Loadable(lazy(() => import('pages/Master/tax-name/TaxName')));
const TypeOfUse = Loadable(lazy(() => import('pages/Master/type-of-use/TypeOfUse')));
const YearMaster = Loadable(lazy(() => import('pages/Master/year-master/YearMaster')));
const Zone = Loadable(lazy(() => import('pages/Master/zone/Zone')));
const ZoneSection = Loadable(lazy(() => import('pages/Master/zone-section/ZoneSection')));
const ActiveTaxes = Loadable(lazy(() => import('pages/Master/active-taxes/ActiveTaxes')));
const ActiveYear = Loadable(lazy(() => import('pages/Master/active-year/ActiveYear')));
const BankMaster = Loadable(lazy(() => import('pages/Master/bank-master/BankMaster')));

//admin-panel
const ApplicationSetting = Loadable(lazy(() => import('pages/admin-panel/application-setting/ApplicationSetting')));
const ApprovalAllocation = Loadable(lazy(() => import('pages/admin-panel/approval-allocation/ApprovalAllocation')));

//Transaction
const MutationApproval = Loadable(lazy(() => import('pages/transaction/mutation-approval/MutationApproval')));
const DataEntryApproval = Loadable(lazy(() => import('pages/transaction/data-entry-approval/DataEntryApproval')));
const DdChequeApproval = Loadable(lazy(() => import('pages/transaction/dd-cheque-approval/ddChequeApproval')));
const CollectionApproval = Loadable(lazy(() => import('pages/transaction/collection-approval/collectionApproval')));
const ApproveOnlineTransaction = Loadable(lazy(() => import('pages/transaction/approve-online-transaction/approveOnlineTransaction')));
const GenerateRecipt = Loadable(lazy(() => import('pages/transaction/generate-recipt/generateRecipt')));
const TaxPaymentApproval = Loadable(lazy(() => import('pages/transaction/tax-payment-approval/taxPaymentApproval')));
// const ApprovalMutation = Loadable(lazy(() => import('pages/transaction/mutation-approval/approval-mutation')));
// const PendingMutation = Loadable(lazy(() => import('pages/transaction/mutation-approval/pending-mutation')));

//Payment
const Dashboard = Loadable(lazy(() => import('pages/payment/dashboard/Dashboard')));
const OfflinePayment = Loadable(lazy(() => import('pages/payment/offline-payment/OfflinePayment')));
const OnlinePayment = Loadable(lazy(() => import('pages/payment/online-payment/OnlinePayment')));
const TransferFee = Loadable(lazy(() => import('pages/payment/transfer-fee/TransferFee')));
const GetPropertyTransferFee = Loadable(lazy(() => import('pages/payment/transfer-fee/GetPropertyTransferFee')));
// const GetPropertyOnlinePayment = Loadable(lazy(() => import('pages/payment/online-payment/GetPropertyOnlinePayment')));
// const TeamCondition = Loadable(lazy(() => import('pages/payment/online-payment/Team&Condition')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    //amc routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'amc',
          children: [
            {
              path: 'advance-payment',
              element: <AdvancePayment />
            },
            {
              path: 'bill-book-entry',
              element: <Billbookentry />
            },
            {
              path: 'defaulter-list-amc-account',
              element: <DefaulterListAmcAccount />
            },

            {
              path: 'report-engine',
              element: <AmcReportEngine />
            },
            {
              path: 'set-custom-tax',
              element: <SetCustomTax />
            },
            {
              path: 'set-remark-for-invoice',
              element: <SetRemarkForInvoice />
            },
            {
              path: 'tax-payment',
              element: <TaxPayment />
            }
          ]
        }
      ]
    },

    //assessment routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'assessment',
          children: [
            {
              path: 'data-entry',
              element: <DataEntry />
            },
            {
              path: 'total-valuation',
              element: <TotalValuation />
            },
            {
              path: 'appeal',
              element: <Appeal />
            },
            {
              path: 'old-information',
              element: <OldInformation />
            },
            {
              path: 'social-details',
              element: <SocialDetails />
            },
            {
              path: 'mutation',
              element: <Mutation />
            },
            {
              path: 'zoning',
              element: <Zoning />
            },
            {
              path: 'renter-mutation',
              element: <RenterMutation />
            },
            {
              path: 'update-retain-tax',
              element: <UpdateRetainTax />
            }
            // {
            //   path: 'social-details-total-valuation',
            //   element: <SocialDetailsTotalValuation />
            // }
          ]
        }
      ]
    },

    //report routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'report',
          children: [
            {
              path: 'admin-report',
              element: <AdminReport />
            },
            {
              path: 'property-wise',
              element: <PropertyWise />
            },
            {
              path: 'ward-wise',
              element: <WardWise />
            },
            {
              path: 'daily-collection-report',
              element: <DailyCollectionReport />
            },
            {
              path: 'demand-analysis',
              element: <DemandAnalysis />
            },
            // {
            //   path: 'property-classification',
            //   element: <PropertyClassification />
            // },
            {
              path: 'mutation-history',
              element: <MutationHistory />
            },
            {
              path: 'report-engine',
              element: <ReportEngine />
            },
            {
              path: 'collection-report',
              element: <CollectionReport />
            },
            {
              path: 'quality-control-report',
              element: <QualityControlReports />
            },
            {
              path: 'auto-qc',
              element: <AutoQc />
            }
          ]
        }
      ]
    },

    //Utility routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'utility',
          children: [
            {
              path: 'add-taxes',
              element: <AddTaxes />
            },
            {
              path: 'data-entry-same-as',
              element: <DataEntrySameAs />
            },
            {
              path: 'auto-ward',
              element: <AutoWard />
            },
            {
              path: 'auto-appeal',
              element: <AutoAppeal />
            },

            {
              path: 'delete-access-property-from-database',
              element: <DeleteAccessPropertyFromDatabase />
            },
            {
              path: 'image-downloader',
              element: <ImageDownloader />
            },
            {
              path: 'owner-name-same-as',
              element: <OwnerNameSameAs />
            },
            {
              path: 'update-property-address',
              element: <UpdatePropertyAddress />
            },
            {
              path: 'ward-allocation',
              element: <WardAllocation />
            },
            {
              path: 'upload-plan-and-photo',
              element: <UploadPlanAndPhoto />
            }
          ]
        }
      ]
    },

    //Admin routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'admin',
          children: [
            {
              path: 'page-level-access',
              element: <PageLevelAccess />
            },
            {
              path: 'auto-hearing-appeal-comm',
              element: <AutoHearingAppealComm />
            },
            {
              path: 'discount-slab-master',
              element: <DiscountSlabMaster />
            },
            {
              path: 'lock-property',
              element: <LockProperty />
            },
            {
              path: 'new-page-name',
              element: <NewPageName />
            },
            // {
            //   path: 'new-page-group',
            //   element: <NewPageGroup />
            // },
            {
              path: 'new-user',
              element: <NewUser />
            },
            {
              path: 'penalty-on-owner-id',
              element: <PenaltyOnOwnerId />
            },
            {
              path: 'manage-page-level-access',
              element: <ManagePageLevelAccess />
            }
          ]
        }
      ]
    },
    //Master routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'master',
          children: [
            {
              path: 'apply-tax',
              element: <ApplyTax />
            },
            {
              path: 'assessment-rule',
              element: <AssessmentRule />
            },
            {
              path: 'construction-type',
              element: <ConstructionType />
            },
            {
              path: 'council-details',
              element: <CouncilDetails />
            },
            {
              path: 'depreciation',
              element: <Depreciation />
            },
            {
              path: 'floor',
              element: <Floor />
            },
            {
              path: 'maintenance',
              element: <Maintenance />
            },
            {
              path: 'open-plot-rate',
              element: <OpenPlotRate />
            },
            {
              path: 'Penalty',
              element: <Penalty />
            },
            {
              path: 'prime-apply-taxes',
              element: <PrimeApplyTaxes />
            },
            {
              path: 'prime-type-of-use',
              element: <PrimeTypeOfUse />
            },
            {
              path: 'property-type',
              element: <PropertyType />
            },

            // {
            //   path: 'property-type-tax',
            //   element: <PropertyTypeTax />
            // },
            {
              path: 'rate-master',
              element: <RateMaster />
            },
            {
              path: 'retain-policy-factor',
              element: <RetainPolicyFactor />
            },
            {
              path: 'tax-master',
              element: <TaxMaster />
            },
            {
              path: 'tax-name',
              element: <TaxName />
            },
            {
              path: 'type-of-use',
              element: <TypeOfUse />
            },
            {
              path: 'year-master',
              element: <YearMaster />
            },
            {
              path: 'Zone',
              element: <Zone />
            },
            {
              path: 'zone-section',
              element: <ZoneSection />
            },
            {
              path: 'active-taxes',
              element: <ActiveTaxes />
            },
            {
              path: 'active-year',
              element: <ActiveYear />
            },
            {
              path: 'bank-master',
              element: <BankMaster />
            }
          ]
        }
      ]
    },
    //admin-panel
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'admin-panel',
          children: [
            {
              path: 'application-setting',
              element: <ApplicationSetting />
            },
            {
              path: 'approval-allocation',
              element: <ApprovalAllocation />
            }
          ]
        }
      ]
    },
    //Transaction routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'transaction',
          children: [
            {
              path: 'data-entry-approval',
              element: <DataEntryApproval />
            },
            {
              path: 'mutation-approval',
              element: <MutationApproval />
            },
            // {
            //   path: 'appoval-mutation',
            //   element: <ApprovalMutation />
            // },
            // {
            //   path: 'pending-mutation',
            //   element: <PendingMutation />
            // },
            {
              path: 'dd-cheque-approval',
              element: <DdChequeApproval />
            },
            {
              path: 'collection-approval',
              element: <CollectionApproval />
            },
            {
              path: 'approve-online-approval',
              element: <ApproveOnlineTransaction />
            },
            {
              path: 'generate-recipt',
              element: <GenerateRecipt />
            },
            {
              path: 'tax-payment-approval',
              element: <TaxPaymentApproval />
            }
          ]
        }
      ]
    },

    //dashboard routes
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'payment',
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            {
              path: 'online-payment',
              element: <OnlinePayment />
            },
            // {
            //   path: 'get-property-online-payment',
            //   element: <GetPropertyOnlinePayment />
            // },
            // {
            //   path: 'team-condition',
            //   element: <TeamCondition />
            // },
            {
              path: 'offline-payment',
              element: <OfflinePayment />
            },
            {
              path: 'transfer-fee',
              element: <TransferFee />
            },
            {
              path: 'get-property-transfer-fee',
              element: <GetPropertyTransferFee />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
