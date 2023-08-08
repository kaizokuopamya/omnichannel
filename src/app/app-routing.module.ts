import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './pages/auth/guards/noAuth.guard';
import { LayoutsComponent } from './pages/layouts/layouts.component';
import { AuthGuard } from './pages/auth/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'termsConditions', loadChildren: () => import('./pages/modules/more-services/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsModule) },
  { path: 'languageChange', loadChildren: () => import('./pages/modules/more-services/language-change/language-change.module').then(m => m.LanguageChangeModule) },
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutsComponent,
    data: {
      layout: 'empty',
      name: 'NoAuthGuard'
    },
    children: [
      { path: 'login', loadChildren: () => import('./pages/modules/login/login.module').then((m) => m.LoginModule) },
      { path: 'registration', loadChildren: () => import('./pages/modules/registration/registration-steps/registration-steps.module').then(m => m.RegistrationStepsModule) },
      { path: 'moreServices', loadChildren: () => import('./pages/modules/more-services/more-services/more-services.module').then(m => m.MoreServicesModule) },
      { path: 'contactUs', loadChildren: () => import('./pages/modules/more-services/contact-us/contact-us.module').then(m => m.ContactUsModule) },
      { path: 'locateUs', loadChildren: () => import('./pages/modules/more-services/locate-us/locate-us.module').then(m => m.LocateUsModule) },
      { path: 'temporaryserviceout', loadChildren: () => import('./pages/modules/temporarily-page/temporarily-page.module').then(m => m.TemporarilyPageModule) },
      { path: 'locateUs', loadChildren: () => import('./pages/modules/more-services/locate-us/locate-us.module').then(m => m.LocateUsModule) },
      { path: 'forgotUsername', loadChildren: () => import('./pages/modules/forgot-username/forgot-username.module').then(m => m.ForgotUsernameModule) },
      { path: 'successPage', loadChildren: () => import('./pages/modules/success/success.module').then(m => m.SuccessModule) },
      { path: 'forgotPassword', loadChildren: () => import('./pages/modules/forgot-password/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
      { path: 'forgotPasswordAuth', loadChildren: () => import('./pages/modules/forgot-password/forgot-password-user-auth/forgot-password-user-auth.module').then(m => m.ForgotPasswordUserAuthModule) },
      { path: 'setPassword', loadChildren: () => import('./pages/modules/forgot-password/forgot-password-set-password/forgot-password-set-password.module').then(m => m.ForgotPasswordSetPasswordModule) },
      { path: 'forgotMpinMob', loadChildren: () => import('./pages/modules/forgot-mpin/forgot-mpin-mob/forgot-mpin-mob.module').then(m => m.ForgotMpinMobModule) },
      { path: 'setForgotMpin', loadChildren: () => import('./pages/modules/forgot-mpin/forgot-mpin/forgot-mpin.module').then(m => m.ForgotMpinModule) },
      { path: 'setForgotMpinUserAuth', loadChildren: () => import('./pages/modules/forgot-mpin/forgot-mpin-user-authentication/forgot-mpin-user-authentication.module').then(m => m.ForgotMpinUserAuthenticationModule) },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutsComponent,
    data: {
      layout: 'classic',
      name: 'AuthGuard'
    },
    children: [
      { path: 'dashboard', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'otpsession', loadChildren: () => import('./pages/modules/common-otpsession/common-otpsession.module').then((m) => m.CommonOtpsessionModule) },
      { path: 'receipt', loadChildren: () => import('./pages/modules/receipt/receipt.module').then((m) => m.ReceiptModule) },
      { path: 'instantPay', loadChildren: () => import('./pages/modules/fund-transfer/instant-pay/instant-pay.module').then((m) => m.InstantPayModule) },
      { path: 'profile', loadChildren: () => import('./pages/modules/my-profile/profile-details/profile-details.module').then((m) => m.ProfileDetailsModule) },
      { path: 'editProfile', loadChildren: () => import('./pages/modules/my-profile/profile-edit/profile-edit.module').then((m) => m.ProfileEditModule) },
      { path: 'securityUpdate', loadChildren: () => import('./pages/modules/my-profile/security-update/security-update.module').then((m) => m.SecurityUpdateModule) },
      { path: 'profileReKyc', loadChildren: () => import('./pages/modules/my-profile/profile-rekyc/profile-rekyc.module').then((m) => m.ProfileRekycModule) },

      { path: 'resetTpin', loadChildren: () => import('./pages/modules/my-profile/reset-tpin/reset-tpin.module').then((m) => m.ResetTpinModule) },
      { path: 'myAccount', loadChildren: () => import('./pages/modules/accounts/my-accounts/my-accounts.module').then((m) => m.MyAccountsModule) },
      { path: 'myDeposits', loadChildren: () => import('./pages/modules/accounts/my-deposit/my-deposit.module').then((m) => m.MyDepositModule) },
      { path: 'myLoans', loadChildren: () => import('./pages/modules/accounts/my-loan/my-loan.module').then((m) => m.MyLoanModule) },
      { path: 'accountMiniStatement', loadChildren: () => import('./pages/modules/accounts/accounts-info/accounts-mini-statement/accounts-mini-statement.module').then((m) => m.AccountsMiniStatementModule) },
      { path: 'loanMiniStatement', loadChildren: () => import('./pages/modules/accounts/accounts-info/loan-mini-statement/loan-mini-statement.module').then((m) => m.LoanMiniStatementModule) },
      { path: 'detailedStatement', loadChildren: () => import('./pages/modules/accounts/accounts-info/accounts-detailed-statement/accounts-detailed-statement.module').then((m) => m.AccountsDetailedStatementModule) },
      { path: 'openDeposit', loadChildren: () => import('./pages/modules/accounts/accounts-info/open-fd-rd/open-fd-rd.module').then((m) => m.OpenFdRdModule) },
      { path: 'closeDeposit', loadChildren: () => import('./pages/modules/accounts/accounts-info/close-fd-rd/close-fd-rd.module').then((m) => m.CloseFdRdModule) },
      { path: 'nomineeDetails', loadChildren: () => import('./pages/modules/accounts/accounts-info/nominee/view-nominee-details/view-nominee-details.module').then((m) => m.ViewNomineeDetailsModule) },
      { path: 'updateNominee', loadChildren: () => import('./pages/modules/accounts/accounts-info/nominee/add-modify-nominee/add-modify-nominee.module').then((m) => m.AddModifyNomineeModule) },


      { path: 'sendMoney', loadChildren: () => import('./pages/modules/fund-transfer/send-money/send-money.module').then((m) => m.SendMoneyModule) },
      { path: 'managePayee', loadChildren: () => import('./pages/modules/beneficiary/manage-payee/manage-payee.module').then((m) => m.ManagePayeeModule) },
      { path: 'favourite', loadChildren: () => import('./pages/modules/beneficiary/favourite-payee/favourite-payee.module').then((m) => m.FavouritePayeeModule) },
      { path: 'addPayee', loadChildren: () => import('./pages/modules/beneficiary/add-payee/add-payee.module').then(m => m.AddPayeeModule) },
      { path: 'chequeStatusEnquiry', loadChildren: () => import('./pages/modules/cheque-book/cheque-status-inquiry/cheque-status-inquiry.module').then(m => m.ChequeStatusInquiryModule)},
      { path: 'donations', loadChildren: () => import('./pages/modules/fund-transfer/donation/donation.module').then(m => m.DonationModule)},
      { path: 'myChequeBook', loadChildren: () => import('./pages/modules/cheque-book/my-cheque-book/my-cheque-book.module').then(m => m.MyChequeBookModule)},
      { path: 'inwardChequeInquiry', loadChildren:() => import('./pages/modules/cheque-book/inward-cheque-inquiry/inward-cheque-inquiry.module').then(m => m.InwardChequeInquiryModule)},
      { path: 'chequeBookRequest', loadChildren:() => import('./pages/modules/cheque-book/cheque-book-request/cheque-book-request.module').then(m => m.ChequeBookRequestModule)},
      { path: 'positivePay', loadChildren:() => import('./pages/modules/cheque-book/positive-pay/positive-pay.module').then(m => m.PositivePayModule)},
      { path: 'stopCheques', loadChildren:() => import('./pages/modules/cheque-book/stop-cheque/stop-cheque.module').then(m => m.StopChequeModule)},
      { path : 'linkAccount', loadChildren: () => import('./pages/modules/services/link-account/link-account.module').then(m => m.LinkAccountModule) },
      { path : 'delinkAccount', loadChildren: () => import('./pages/modules/services/delink-account/delink-account.module').then(m => m.DelinkAccountModule)},
      { path : 'freezeAccount', loadChildren: () => import('./pages/modules/services/freeze-account/freeze-account.module').then(m => m.FreezeAccountModule)},
      //{ path: 'addStandingInstruction',},

      // BBPS Module
      { path: 'retailRechargeBillPay', loadChildren: () => import('./pages/modules/bbps/recharge-billpay/recharge-billpay.module').then(m => m.RechargeBillpayModule) },
      { path: 'retailRegisterNewBiller', loadChildren: () => import('./pages/modules/bbps/register-biller/register-new-biller/register-new-biller.module').then(m => m.RegisterNewBillerModule) },
      { path: 'retailRegisterBillerConfirmation', loadChildren: () => import('./pages/modules/bbps/register-biller/register-biller-confirmation/register-biller-confirmation.module').then(m => m.RegisterBillerConfirmationModule) },
      { path: 'retailRegisterBillerSuccess', loadChildren: () => import('./pages/modules/bbps/register-biller/register-biller-success/register-biller-success.module').then(m => m.RegisterBillerSuccessModule) },
      { path: 'retailPaymentHistory', loadChildren: () => import('./pages/modules/bbps/payment-history/payment-history/payment-history.module').then(m => m.PaymentHistoryModule) },
      { path: 'existingBillPayment', loadChildren: () => import('./pages/modules/bbps/existing-bill/existing-bill-payment/existing-bill-payment/existing-bill-payment.module').then(m => m.ExistingBillPaymentModule) },
      { path: 'retailRaiseComplaint', loadChildren: () => import('./pages/modules/bbps/raise-complaint/raise-complaint/raise-complaint.module').then(m => m.RaiseComplaintModule) },
      { path: 'complaintList', loadChildren: () => import('./pages/modules/bbps/raise-complaint/complaint-list/complaint-list.module').then(m => m.ComplaintListModule) },
      { path: 'complaintDetails', loadChildren: () => import('./pages/modules/bbps/raise-complaint/complaint-details/complaint-details.module').then(m => m.ComplaintDetailsModule) },
      { path: 'retailRaiseComplaintTransactionConfirmation', loadChildren: () => import('./pages/modules/bbps/raise-complaint/raise-complaint-transaction-confirmation/raise-complaint-transaction-confirmation.module').then(m => m.RaiseComplaintTransactionConfirmationModule) },
      { path: 'retailRaiseComplaintTransactionSuccess', loadChildren: () => import('./pages/modules/bbps/raise-complaint/raise-complaint-transaction-success/raise-complaint-transaction-success.module').then(m => m.RaiseComplaintTransactionSuccessModule) },
      { path: 'retailAddBillReminder', loadChildren: () => import('./pages/modules/bbps/add-bill-reminder/add-bill-reminder/add-bill-reminder.module').then(m => m.AddBillReminderModule) },
      { path: 'retailAddBillReminderConfirmation', loadChildren: () => import('./pages/modules/bbps/add-bill-reminder/add-bill-reminder-confirmation/add-bill-reminder-confirmation.module').then(m => m.AddBillReminderConfirmationModule) },
      { path: 'retailAddBillReminderSuccess', loadChildren: () => import('./pages/modules/bbps/add-bill-reminder/add-bill-reminder-success/add-bill-reminder-success.module').then(m => m.AddBillReminderSuccessModule) },
      { path: 'retailPendingBillReminder', loadChildren: () => import('./pages/modules/bbps/pending-bill/pending-bill-reminder/pending-bill-reminder.module').then(m => m.PendingBillReminderModule) },
      { path: 'billReminderList', loadChildren: () => import('./pages/modules/bbps/pending-bill/bill-reminder-list/bill-reminder-list.module').then(m => m.BillReminderListModule) },
      { path: 'pendingBillMoreDetails', loadChildren: () => import('./pages/modules/bbps/pending-bill/pending-bill-more-details/pending-bill-more-details.module').then(m => m.PendingBillMoreDetailsModule) },
      { path: 'editBillReminder', loadChildren: () => import('./pages/modules/bbps/edit-bill-reminder/edit-bill-reminder/edit-bill-reminder.module').then(m => m.EditBillReminderModule) },
      { path: 'editBillReminderConfirmation', loadChildren: () => import('./pages/modules/bbps/edit-bill-reminder/edit-bill-reminder-confirmation/edit-bill-reminder-confirmation.module').then(m => m.EditBillReminderConfirmationModule) },
      { path: 'editBillReminderSuccess', loadChildren: () => import('./pages/modules/bbps/edit-bill-reminder/edit-bill-reminder-success/edit-bill-reminder-success.module').then(m => m.EditBillReminderSuccessModule) },
      { path: 'deleteBillReminderConfirmation', loadChildren: () => import('./pages/modules/bbps/delete-bill-reminder/delete-bill-reminder-confirmation/delete-bill-reminder-confirmation.module').then(m => m.DeleteBillReminderConfirmationModule) },
      { path: 'deleteBillReminderSuccess', loadChildren: () => import('./pages/modules/bbps/delete-bill-reminder/delete-bill-reminder-success/delete-bill-reminder-success.module').then(m => m.DeleteBillReminderSuccessModule) },
      { path: 'retailBillPayment', loadChildren: () => import('./pages/modules/bbps/bill-payment/bill-payment.module').then(m => m.BillPaymentModule) },
      { path: 'mobilePostpaid', loadChildren: () => import('./pages/modules/bbps/mobile/mobile-postpaid/mobile-postpaid.module').then(m => m.MobilePostpaidModule) },
      { path: 'browsePlan', loadChildren: () => import('./pages/modules/bbps/mobile/mobile-prepaid/browse-plan/browse-plan.module').then(m => m.BrowsePlanModule) },
      { path: 'mobilePrepaid', loadChildren: () => import('./pages/modules/bbps/mobile/mobile-prepaid/mobile-prepaid/mobile-prepaid.module').then(m => m.MobilePrepaidModule) },
      { path: 'registerBillerView', loadChildren: () => import('./pages/modules/bbps/register-biller/register-biller-view/register-biller-view.module').then(m => m.RegisterBillerViewModule) },
      { path: 'unpaidBill', loadChildren: () => import('./pages/modules/bbps/unpaid-bill-infos/unpaid-bill-infos.module').then(m => m.UnpaidBillInfosModule) },
      { path: 'billDetails', loadChildren: () => import('./pages/modules/bbps/bill-details/bill-details.module').then(m => m.BillDetailsModule) },
      { path: 'mobbillersearch', loadChildren: () => import('./pages/modules/bbps/mob-biller-list/mob-biller-list.module').then(m => m.MobBillerListModule) },
      { path: 'contactsearchBBPS', loadChildren: () => import('./pages/modules/bbps/mobile/contact-search-bbps/contact-search-bbps.module').then(m => m.ContactSearchBbpsModule) },
      // BBPS Module end

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
