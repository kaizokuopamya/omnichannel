export const FORMERRORS = {
    fromAccount: '',
    toAccount: '',
    amount: '',
    paymentMethod: '',
    remark: ''
};

export const SECHDULEFORMERRORS = {
    date: '',
    paymentType: '',
    frequency: '',
    noOfInstalment: ''
};

export class SelectedPayee{
    ID?: string | number | any;
    accountNo?:string | number | any;
    beneficiary_account_no?:string | number | any;
    MMID?:string | number | any;
    beneficiary_bank_name?: string | number | any;
    ifsc_code?:string | number | any;
    branch_name?:string | number | any;
}
