export const SHAREDETAILFD = {
    'fdAccNumber': false,
    'accType': false,
    'accScheme': false,
    'interestRate': false,
    'branchAddress': false,
    'custId': false,
    'nomineeName': false
}

export const SHAREDETAILRD = {
    'rdAccNumber': false,
    'maturityDate': false,
    'tenure': false,
    'interestRate': false,
    'modeOdRdOpening': false,
    'maturityPayoutAcc': false
}

export const FORMTYPES: any = [
    {
        "formType": "closeFD", "formDetails": [
            { "fieldName": "fdAccount", "required": "Y" },
            { "fieldName": "depositAccount", "required": "N" },
            { "fieldName": "originalMaturityAmount", "required": "N" },
            { "fieldName": "currentFDAccountBalance", "required": "N" },
            { "fieldName": "maturityPayoutAccount", "required": "N" },
            { "fieldName": "remark", "required": "N" },
            { "fieldName": "fdOpenDate", "required": "N" },
            { "fieldName": "fdMaturityDate", "required": "N" },
            { "fieldName": "termsCondition", "required": "Y" },
        ]
    },
    {
        "formType": "closeRD", "formDetails": [
            { "fieldName": "fdAccount", "required": "Y" },
            { "fieldName": "monthlyInstallment", "required": "N" },
            { "fieldName": "originalMaturityAmount", "required": "N" },
            { "fieldName": "currentRDAccountBalance", "required": "N" },
            { "fieldName": "maturityPayoutAccount", "required": "N" },
            { "fieldName": "remark", "required": "N" },
            { "fieldName": "termsCondition", "required": "Y" },
        ]
    },

]

