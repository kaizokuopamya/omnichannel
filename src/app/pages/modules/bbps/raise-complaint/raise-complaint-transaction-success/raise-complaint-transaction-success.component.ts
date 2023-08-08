import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { DatePipe, Location } from '@angular/common';
import 'jspdf-autotable';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { CommonMethods } from '../../../../../services/common-methods';
import { pageLoaderService } from 'src/app/services/pageloader.service';
@Component({
  selector: 'app-raise-complaint-transaction-success',
  templateUrl: './raise-complaint-transaction-success.component.html',
  styleUrls: ['./raise-complaint-transaction-success.component.scss']
})
export class RaiseComplaintTransactionSuccessComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,
    
    public DataService: DataService,   
    public constant: AppConstants,  
    public loader: pageLoaderService,
    public commonMethod: CommonMethods,    
    private storage: LocalStorageService,    
    private datepipe: DatePipe,
    private http: HttpRestApiService,) { }
    complainResult:any
    complainStatus:any
    totalAccountList:any;
    accountList:any;
    branchcode:any;
    receiptmsg:any
    newdata:any;
    receiptSubmsg:any;
    todayDateTime:any
    imgColor:any
    refTransJson: any = [
      {
        'key': 'Transaction ID',
        'value': JSON.parse(this.DataService.complainResponse.bbpsResponse).responseParameter.rrn
      }
    ];
    ngOnInit(): void {
      if(this.DataService.complainResponse.opstatus === '00'){
      this.receiptmsg ="Complaint registered successfully"
      this.imgColor = 'success';
      this.receiptSubmsg = ' '
      }
      else{
        this.receiptmsg = "Error while raising complaint"
        this.receiptSubmsg = this.complainResult.msg
        this.imgColor = 'failed';
      }
     
      // this.DataService.setPageSettings('RECEIPT');
      this.todayDateTime = this.datepipe.transform(new Date(), 'ddMMyyyyhhmmss');
      this.complainResult =  JSON.parse(this.DataService.complainResponse.bbpsResponse)
      this.totalAccountList = this.DataService.customerOperativeAccList;
      this.accountList = this.DataService.customerOperativeAccList.filter(
        (obj) =>(obj.accountType!='CAPPI')
      );
      console.log("accountList",this.accountList)
      this.branchcode = this.accountList[0].branchCode;
      if(this.DataService.complainResponse.opstatus == '00'){
        this.complainStatus = "SUCCESS"
      
      }else{
       
        this.complainStatus = "FAILED"
      }
      this.DataService.isbbpsPage = true
    }


    ngOnDestroy() {
      this.DataService.isbbpsPage = false
    }
    goToPage(routeName) {
      this.router.navigateByUrl('/' + routeName);
    }
    downloadReceipt(print?: any) {
      this.loader.showLoader();
      html2canvas(document.getElementById('receiptPDF'))
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jspdf({
            orientation: 'landscape',
          });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.rect(20, 20, pdf.internal.pageSize.width - 40, pdf.internal.pageSize.height - 40, 'S');
          var img = new Image()
          img.src = this.constant.psbNewLogo;
          pdf.addImage(img, 'png', 100, 30, 100, 15);
          pdf.setFontSize(10);
          pdf.setFont('italic');
          pdf.setTextColor(173, 170, 170);
  
          pdf.text("This is a system generated receipt, actual transaction is subject to realization", 147, pdf.internal.pageSize.height - 22, {align :'center'});
          pdf.addImage(imgData, 'PNG', 34, 65, 230, 120);
  
          // pdf.save('download.pdf');
  
          if (print) {
            pdf.autoPrint();
            window.open(pdf.output('bloburl').toString());
          }
          else {
            this.loader.hideLoader();
            this.commonMethod.downloadPDF(pdf, 'Receipt');
          }
        });
    }

    downloadPdf() {
      if (this.DataService.isCordovaAvailable) {
        var self = this;
        //   var options = {
        //     documentSize: 'A4',
        //     type: 'base64'
        // };
        // The name of your file, note that you need to know if is .png,.jpeg etc
        var filename = "complaint" + "_" + Date.now() + '.png';
        console.log('filename', filename);
        let section = document.querySelector('#receiptPDF');
  
        if (self.DataService.platform.toLowerCase() == self.constant.val_android) {
          self.commonMethod.savePDFInDevice(section, filename);
        } else if (self.DataService.platform.toLowerCase() == self.constant.val_ios) {
          self.commonMethod.takeScreenshot();
        } else {
          console.log("Unknown Platform...");
        }
      }
    }
    shareReceipt() {
      if (this.DataService.isCordovaAvailable) {
        var filename = "complaint" + "_" + Date.now();
        let section = document.querySelector('#receiptPDF');
        // if(this.DataService.platform.toLowerCase() == this.constant.val_android) {
        this.commonMethod.shareImageInDevice(section, filename);
        // } else if(this.DataService.platform.toLowerCase() == this.constant.val_ios){
        // this.commonMethod.takeScreenshot();
        // } else {
        // console.log("Unknown Platform...");
        // }
      }
    }
    downloadPdfReceipt(type) {
      this.loader.showLoader();
      var pdfsize = 'a4';
      var doc = new jspdf();
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        console.log("bbpstransfer")
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.DataService.primaryAccountDtl.accountNo);
  
        var bbpsJson = [];      
  
        // for(var i = 0 ;i< this.DataService.bbpsReceiptDetails.length;  i++){
          bbpsJson.push(  
            {
              'key' : "Complaint ID",
              'value' : this.complainResult.responseParameter.result.complaintid
            },
            {
              'key' : "Complaint Reason",
              'value' : this.complainResult.responseParameter.result.disposition
            },
            {
              'key' : "Complaint Description",
              'value' : this.complainResult.responseParameter.result.complaint_desc
            },
            {
              'key' : "Payment ID",
              'value' : this.complainResult.responseParameter.result.paymentid
            },
            {
              'key' : "Date",
              'value' :  moment(new Date()).format('DD MMM YYYY')
            }
           
          )
          if(this.complainResult.responseParameter.result.hasOwnProperty('payment_amount') ){
            bbpsJson.push( 
              {
                'key' : "Payment Amount",
                'value' : "₹" + this.complainResult.responseParameter.result.payment_amount
              },
              )

          } 
          if(this.complainResult.responseParameter.result.hasOwnProperty('complaint_status') ){
            bbpsJson.push( 
              {
                'key' : "Complaint Status",
                'value' : this.complainResult.responseParameter.result.complaint_status
              },
              )

          } 
          if(this.complainResult.responseParameter.result.hasOwnProperty('assigned') ){
            bbpsJson.push( 
              {
                'key' : "Assigned to",
                'value' : this.complainResult.responseParameter.result.assigned
              },
              )

          } 

        // }
  
        var splitTitles = doc.splitTextToSize(" :"+ this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress, 30);
      doc.text(splitTitles, pageWidth - 150, 25, {align :'left'});
      var branchJSON = [
        { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
        { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
        { 'key': 'Branch Address', 'value':  selAccDtl[0].BRANCHADDRESS },
        { 'key': 'Branch Contact', 'value':  selAccDtl[0].branchCode  },
        { 'key': 'IFSC', 'value':  selAccDtl[0].ifscCode },
      ];
        this.loader.hideLoader();
        this.commonMethod.generatePDF(this.imgColor, this.receiptmsg, this.receiptSubmsg, this.refTransJson, bbpsJson, 'complaint', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
      
     
  
    }

    shareDetails() {
      this.shareViaMail();
    }
    shareViaMail() {
      let details = this.getValuesToSend();
      window.open('mailto:?subject=Receipt&body=' + details);
    }
    getValuesToSend() {
      // let selectedFields = "";
      // if (this.receiptResp.type == "vpa") {
      //   selectedFields += "UPI Id :" + this.receiptResp.payerAddr + ", ";
      //   selectedFields += "To Payee :" + this.receiptResp.payeeAddr + ", ";
      // }
      // else if(this.receiptResp.type == "mmid"){
      //   selectedFields += "From Account  :" +this.receiptResp.from_acc + ", ";
      //   selectedFields += "MMID :" + this.receiptResp.payeeMMID + ", ";
      //   selectedFields += "MOBILE NO :"+this.receiptResp.payeeMobile + ", ";
  
      // }
      // else {
      //   selectedFields += "From Account :" + this.receiptResp.from_acc + ", ";
      //   selectedFields += "To Account :" + this.receiptResp.to_acc + ", ";
      // }
  
      // selectedFields += "Payee Name :" + this.receiptResp.payee_name + ", ";
      // selectedFields += "Amount :"   +OSREC.CurrencyFormatter.format( this.receiptResp.amount, { currency: 'INR', symbol: 'INR' });", ";
      // //  OSREC.CurrencyFormatter.format( this.receiptResp.amount, { currency: 'INR', symbol: 'INR' });
      // selectedFields += "Remark :" + this.receiptResp.remarks + ", ";
      // selectedFields += "Schedule Date :" + this.receiptResp.date + ", ";
  
      // return selectedFields.replace(/,\s*$/, "");
    }
}
