export enum DropDownMaster {
    MARITAL_STATUS = "CG",
    COMMUNITY = "13",
    CATEGORY = "54",//need to ask
    ANNUAL_INCOME = "AIC",
    GUARDIAN_TYPE = "RL",
    NOMINEE_TYPE = "04",
    OCCUPATION = "21",
    PMJJBY = "PMJJBY",
    PMSBY = "PMSBY",
    APY = "APY",
    GUARDIAN = "Guardian"
}


export const YEARSARRAYOBJ = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

export const MONTHSARRAYOBJ = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];

export const RDMONTHSARRAYOBJ = ['00', '03', '06', '09'];

export const DAYSARRAYOBJ = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];

export const FORMTYPES: any = [
    {
        "formType": "fixed", "formDetails": [
            { "fieldName": "debitAccount", "required": "Y" },
            { "fieldName": "chooseDepositScheme", "required": "Y" },
            { "fieldName": "depositorType", "required": "N" },
            { "fieldName": "amount", "required": "Y" },
            { "fieldName": "interestPayout", "required": "Y" },
            { "fieldName": "selectOption", "required": "N" },
            { "fieldName": "modeOperation", "required": "N" },
            { "fieldName": "maturityInstruction", "required": "Y" },
            { "fieldName": "maturityPayoutAccount", "required": "N" },
            { "fieldName": "fixedRenewalAmount", "required": "N" },
            { "fieldName": "nomineeName", "required": "Y" },
            { "fieldName": "maturityInstruction2", "required": "Y" },
            { "fieldName": "sameAddress", "required": "N" },
            { "fieldName": "datepicker1", "required": "Y" },
            { "fieldName": "guardianName", "required": "N" },
            { "fieldName": "guardianType", "required": "N" },
            { "fieldName": "address1", "required": "N" },
            { "fieldName": "address2", "required": "N" },
            { "fieldName": "state", "required": "N" },
            { "fieldName": "city", "required": "N" },
            { "fieldName": "pincode", "required": "N" },
            { "fieldName": "year", "required": "N" },
            { "fieldName": "month", "required": "N" },
            { "fieldName": "day", "required": "N" },
            { "fieldName": "dayField", "required": "N" },
            { "fieldName": "monthField", "required": "N" },
            { "fieldName": "custaddress1", "required": "Y" },
            { "fieldName": "custaddress2", "required": "Y" },
            { "fieldName": "custstate", "required": "Y" },
            { "fieldName": "custcity", "required": "Y" },
            { "fieldName": "custpincode", "required": "Y" },
            { "fieldName": "termsCondition", "required": "Y" },
        ]
    },
    {
        "formType": "recurring", "formDetails": [
            { "fieldName": "debitAccount", "required": "Y" },
            { "fieldName": "chooseDepositScheme", "required": "Y" },
            { "fieldName": "amount", "required": "Y" },
            { "fieldName": "depositorType", "required": "N" },
            { "fieldName": "year", "required": "Y" },
            { "fieldName": "month", "required": "Y" },
            { "fieldName": "monthlyDebitDate", "required": "N" },
            { "fieldName": "modeOperation", "required": "N" },
            { "fieldName": "maturityPayoutAccount", "required": "N" },
            { "fieldName": "nomineeName", "required": "Y" },
            { "fieldName": "maturityInstruction2", "required": "Y" },
            { "fieldName": "sameAddress", "required": "Y" },
            { "fieldName": "datepicker1", "required": "Y" },
            { "fieldName": "guardianName", "required": "N" },
            { "fieldName": "guardianType", "required": "N" },
            { "fieldName": "address1", "required": "N" },
            { "fieldName": "address2", "required": "N" },
            { "fieldName": "state", "required": "N" },
            { "fieldName": "city", "required": "N" },
            { "fieldName": "pincode", "required": "N" },
            { "fieldName": "custaddress1", "required": "Y" },
            { "fieldName": "custaddress2", "required": "Y" },
            { "fieldName": "custstate", "required": "Y" },
            { "fieldName": "custcity", "required": "Y" },
            { "fieldName": "custpincode", "required": "Y" },
            { "fieldName": "termsCondition", "required": "Y" },
        ]
    },

]
