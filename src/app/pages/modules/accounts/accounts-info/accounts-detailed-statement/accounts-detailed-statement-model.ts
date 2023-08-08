export interface DetailedStatementData {
    "START_DATE": any;//   8
    "END_DATE": any;//   8
    "LOW_AMOUNT": any;//   17
    "HIGH_AMOUNT": any;//   17
    "FIRST_CHEQUE_NUMBER": any;//  8
    "LAST_CHEQUE_NUMBER": any;//   8
    "NUMBER_OF_RECORDS_REQUESTED": any;//   2
    "SORT_CRITERIA": any;//   1
    "CRDR_FLAG": any;//    1
    "LAST_TRANSACTION_DATE": any;//   8
    "LAST_TRANSACTION_ID": any;//   9
    "LAST_PART_TRANSACTION_NUMBER": any;//   4
    "LAST_POSTING_DATE": any;//   14
    "LAST_BALANCE": any;//   17
}

export enum detailStatement {
    START_DATE = 8,
    ENDDATE = 8,
    LOW_AMOUNT = 17,
    HIGH_AMOUNT = 17,
    FIRST_CHEQUE_NO = 8,
    LAST_CHEQUE_NO = 8,
    NO_OF_REQ = 2,
    SORT_CRITERIA = 1,
    CR_DR_FLAG = 1,
    LAST_TRANS_DATE = 8,
    LAST_TRANS_ID = 9,
    LAST_APRT_TRANS_NO = 4,
    LAST_POSTING_DATE = 14,
    LAST_BALANCE = 17
}


export enum CERTIFICATECONFIGOBJ {
    STATEMENT_COUNT = 'STATEMENT_COUNT',
    STATEMENT_PERIOD = 'STATEMENT_PERIOD'
}

export const TRANSACTIONTYPEOBJ = [
    { name: 'Both', value: '', checked: false },
    { name: 'Credit', value: 'C', checked: false },
    { name: 'Debit', value: 'D', checked: false }
];

export const FORMTYPES: any = [
    { "fieldName": "selAcc", "required": "Y" },
    { "fieldName": "filtertype1", "required": "Y" },
    { "fieldName": "selectPeriod", "required": "N" },
    { "fieldName": "fromDate", "required": "N" },
    { "fieldName": "toDate", "required": "N" },
    { "fieldName": "transCount", "required": "N" },
    { "fieldName": "minAmount", "required": "N" },
    { "fieldName": "maxAmount", "required": "N" },
    { "fieldName": "transType", "required": "N" },
]