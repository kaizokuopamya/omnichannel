import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { CustomCurrencyPipe } from '../../../../../pipes/custom-currency.pipe';
import { FormValidationService } from '../../../../../services/form-validation.service';
@Component({
  selector: 'app-edit-bill-reminder',
  templateUrl: './edit-bill-reminder.component.html',
  styleUrls: ['./edit-bill-reminder.component.scss']
})
export class EditBillReminderComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,   private customCurrencyPipe: CustomCurrencyPipe,
    public DataService: DataService,private formValidation: FormValidationService,
    public commonMethod: CommonMethods) { }
    days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
  
  editBillReminderForm: FormGroup
  inputAmt:any;
  ngOnInit(): void {
    this.buildForm();

    
    this.DataService.isbbpsPage = true
    console.log("this.DataService.billReminderValues" + JSON.stringify(this.DataService.billReminderValues))
    if(this.DataService.billReminderValues.consumerDetails.billertype != 'BILLER'){
      this.editBillReminderForm.get('amt' ).setValidators([Validators.required]);
      this.editBillReminderForm.get('amt').updateValueAndValidity(); 
    }else{
      this.editBillReminderForm.get('amt' ).clearValidators();
      this.editBillReminderForm.get('amt').updateValueAndValidity(); 
    }
  
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  buildForm() {
    this.editBillReminderForm = new FormGroup({
      nickName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z ]*$")]),
      reminderDate: new FormControl('', [Validators.required]),
      amt: new FormControl(''),
    })
  }

  validateForm() {
    if (this.editBillReminderForm.invalid) {
      this.editBillReminderForm.get('nickName').markAsTouched();
      this.editBillReminderForm.get('reminderDate').markAsTouched();
      this.editBillReminderForm.get('amt').markAsTouched();
    }
  }
  formatCurrency(amt){
   
    console.log("amt" + amt)
    let amts = this.customCurrencyPipe.transform(amt, 'decimal').replace(/[^.0-9]+/g, '');
    console.log(amts)
    this.inputAmt = amts
    this.formValidation.formatCurrencybbps(amt, this.editBillReminderForm);
  }
  editBillReminderSubmit(routeName){
    if(this.editBillReminderForm.valid){
      this.DataService.billReminderValues.updatedNickName = this.editBillReminderForm.value.nickName
      this.DataService.billReminderValues.updatedReminderDate = this.editBillReminderForm.value.reminderDate
      this.DataService.billReminderValues.updatedamt = this.customCurrencyPipe.transform(this.editBillReminderForm.value.amt, 'decimal').replace(/[^.0-9]+/g, '')
      if(this.DataService.billReminderValues.consumerDetails.billertype != 'BILLER'){
        this.DataService.billReminderValues.updatedamt =  this.customCurrencyPipe.transform(this.editBillReminderForm.value.amt, 'decimal').replace(/[^.0-9]+/g, '')

      }else{
        this.DataService.billReminderValues.updatedamt = '0.0'
      }
      console.log(" this.DataService.billReminderValues" ,  this.DataService.billReminderValues)
       this.goToPage(routeName) ;
    } else{
      this.validateForm() ;
    }
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

}
