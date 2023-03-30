import React from 'react';

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./components/user/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));
const LogOut = React.lazy(() => import('./components/logout/Logout'))

// Folder
const Folder = React.lazy(() => import('./components/folder/Folder'));
const FolderDetail = React.lazy(() => import('./components/folder/FolderDetail'));

// Password
const ChangePassword = React.lazy(() => import('./components/changePassword/changePassword'));

// Connect other app
const ConnectCloudinary = React.lazy(() => import('./components/connectOtherApp/connectCloudinary'))

// Project
const Project = React.lazy(() => import('./components/project/Project'))
const ProjectInfo = React.lazy(() => import('./components/project/ProjectInfo'))

// User's table
const UserTable = React.lazy(() => import('./components/user/UsersTable'))

// Pricing
const Pricing = React.lazy(() => import('./components/pricing/Pricing'))
const Invoice = React.lazy(() => import('./components/pricing/Invoice'))
const CreditCard = React.lazy(() => import('./components/pricing/CreditCard'))

// Payment History
const InvoiceHistory = React.lazy(() => import('./components/payment/InvoiceHistory'))

// Terms & Conditions
const TermsAndConditions = React.lazy(() => import('./components/terms&conditions/TermsAndConditions'))

// Notification
const Notification = React.lazy(() => import('./components/notification/Notification'))

const CB = React.lazy(() => import('./components/cb'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/logout', name: 'Logout', component: LogOut },
  { path: '/projectDetail/:projectId/folder', exact: true, name: 'Folders', component: Folder },
  { path: '/projectDetail/:projectId/folderDetail/:folderId', exact: true, name: 'Folder Details', component: FolderDetail },
  { path: '/project', exact: true, name: 'Project', component: Project },
  { path: '/project/:projectId', exact: true, name: 'Project Info', component: ProjectInfo },
  { path: '/user-table', exact: true, name: "User's table", component: UserTable },
  { path: '/pricing', exact: true, name: "Pricing", component: Pricing },
  { path: '/pricing/invoice/:invoiceId', exact: true, name: "Invoice", component: Invoice },
  { path: '/payment/invoices', exact: true, name: "Invoice History", component: InvoiceHistory },
  { path: '/pricing/invoice/payment/:invoiceId', exact: true, name: "Payment", component: CreditCard },
  { path: '/terms-and-conditions', exact: true, name: "Terms and Conditions", component: TermsAndConditions },
  { path: '/changePassword', exact: true, name: "Change Password", component: ChangePassword },
  { path: '/notifications/view', exact: true, name: "Notification", component: Notification },
  { path: '/connectCloudinary', exact: true, name: "Connect Cloudinary", component: ConnectCloudinary },
  { path: '/auth/google/callback', exact: true, name: "Connect Cloudinary", component: CB },
];

export default routes;
