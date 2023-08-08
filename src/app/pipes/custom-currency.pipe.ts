import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import * as _ from 'lodash'; 

declare var OSREC: any;
@Pipe({ name: "customcurrency" })
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: any, type?: any , currency?: any): string {
    var currencySymbol;
    
    if(currency == undefined) currency = 'INR'

    //To handel local parttern in euro
    if(currency == 'INR'){
      currencySymbol = {currency: currency, symbol: getCurrencySymbol( currency , 'narrow') , locale: 'hi', negativePattern: '(! #)', formatWithSymbol: true}
    }
    else{
      currencySymbol = {currency: currency, symbol: getCurrencySymbol( currency , 'narrow') , locale: 'en', negativePattern: '(! #)', formatWithSymbol: true}
    }
    
    

    if (value && type != undefined && type == 'symbol') {
      let formattedINR = " " + OSREC.CurrencyFormatter.format(value,currencySymbol );
      if(formattedINR.indexOf("-") >= 0) {
        formattedINR = formattedINR.trim().substring(1); 
        var firstDigit = formattedINR.match(/\d/)
        formattedINR = [formattedINR.slice(0, formattedINR.indexOf(firstDigit[0])), "-", formattedINR.slice(formattedINR.indexOf(firstDigit[0]))].join('');
      }
      return formattedINR;
    }else if (value && type != undefined && type == 'noDecimal') {
      let inr = value.replace(/[^0-9]+/g,'')
      let formattedINR =" " + OSREC.CurrencyFormatter.format(inr, currencySymbol)
      if(formattedINR.indexOf("-") >= 0) {
        formattedINR = formattedINR.trim().substring(1); 
        var firstDigit = formattedINR.match(/\d/)
        formattedINR = [formattedINR.slice(0, formattedINR.indexOf(firstDigit[0])), "-", formattedINR.slice(formattedINR.indexOf(firstDigit[0]))].join('');
      }
      return formattedINR;
    }else if (value && type != undefined && type == 'decimal') {
      let updatedValue = value.replace(/[^.0-9]+/g,'');
      //let updatedValue = value.replace(/[^-?[0-9]\d*(\.\d+)?$]+/g,'');
      let formattedINR =" " + OSREC.CurrencyFormatter.format(updatedValue, currencySymbol )
      if(formattedINR.indexOf("-") >= 0) {
        formattedINR = formattedINR.trim().substring(1); 
        var firstDigit = formattedINR.match(/\d/)
        formattedINR = [formattedINR.slice(0, formattedINR.indexOf(firstDigit[0])), "-", formattedINR.slice(formattedINR.indexOf(firstDigit[0]))].join('');
      }
      return formattedINR;
    }else if (value && type != undefined && type == 'noSymbol') {
      let updatedValue = value.replace(/[^.0-9]+/g,'');
      //let updatedValue = value.replace(/[^-?[0-9]\d*(\.\d+)?$]+/g,'');
      let formattedINR =" " + OSREC.CurrencyFormatter.format(updatedValue, { currency: 'INR',symbol: '' } )
      if(formattedINR.indexOf("-") >= 0) {
        formattedINR = formattedINR.trim().substring(1); 
        var firstDigit = formattedINR.match(/\d/)
        formattedINR = [formattedINR.slice(0, formattedINR.indexOf(firstDigit[0])), "-", formattedINR.slice(formattedINR.indexOf(firstDigit[0]))].join('');
      }
      return formattedINR;
    } else if (value) {
      let formattedINR = " " + OSREC.CurrencyFormatter.format(value,currencySymbol );
      if(formattedINR.indexOf("-") >= 0) {
        formattedINR = formattedINR.trim().substring(1); 
        var firstDigit = formattedINR.match(/\d/)
        formattedINR = [formattedINR.slice(0, formattedINR.indexOf(firstDigit[0])), "-", formattedINR.slice(formattedINR.indexOf(firstDigit[0]))].join('');
      }
      return formattedINR;
    }
    else {
      return value;
    }
  }

}


@Pipe({
  name: 'unique',
})

export class FilterPipe implements PipeTransform {
    transform(value: any,key): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, key);
        }
        return value;
    }
}

@Pipe({ name: "dynamicurrency" })
export class DynamicCurrencyPipe implements PipeTransform {
  transform(value: any , currency:any ): string {
    if (value) {
      return " " + OSREC.CurrencyFormatter.format(value, { currency: currency, symbol: '₨' });
    }
    return ' ';
  }

}
