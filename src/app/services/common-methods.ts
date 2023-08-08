import { Observable, Subject } from 'rxjs';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { FontBase64 } from '../enum/app-enum';
import { AppConstants } from '../app.constant';



declare var $: any;
declare var device: any;
declare var window: any;
declare var cordova: any;
declare var pdf: any;
declare var navigator: any;
declare var html2canvas: any;
declare var qrcode: any;
declare var showToastMessage: any;
declare var FileTransfer: any;


@Injectable({
  providedIn: 'root'
})
export class CommonMethods {
 
  channelKey: any /*** Remove after impementation* */
  /**
* @function validateEmpty
* @param {string} validateText - The string to be tested for blank value.
* description - This function returns true if the string is not having a value.
*/
  @Output() termAcceptedEvent = new EventEmitter<boolean>();

  constructor(private constant: AppConstants) { }

  disableBack;
  validateEmpty(validateText) {
    return (validateText == undefined || validateText == "undefined" || validateText == '' || validateText == null || validateText == ' ' || validateText == "null")
  }

  validateNullAndUndefined(validateText) {
    return (validateText == undefined || validateText == "undefined" || validateText == null || validateText == "null")
  }

  /**
   * @function validateNonEmpty
   * @param {string} validateText - The string to be tested for non blank value.
   * description - This function returns true if the string is having a value.
   */

  validateNonEmpty(validateText) {
    return (validateText != undefined || validateText != '' || validateText != null || validateText != ' ')
  }

  /**
   * @function validateEmptyArray
   * @param {string} arr - The array to be tested for null value.
   * description - This function returns true if the array is null.
   */

  validateEmptyArray(arr) {
    return (arr.length == 0);
  }

  /**
   * @function emptyFieldbyID
   * @param {string} arr - The ID of the html element to be nullified.
   * description - This function clears the value of the HTML element.
   */
  emptyFieldbyID(id) {
    document.getElementById(id).innerHTML = "";
  }

  /**
   * @function emptyValuebyID
   * @param {string} arr - The ID of the html element to be nullified.
   * description - This function clears the value of the HTML element.
   */
  emptyValuebyID(id) {
    document.getElementById(id).innerText = "";
  }

  /**
   * @function validateEmptywithZero
   * @param {string} validateText - The string to be tested for blank value.
   * description - This function returns true if the string is not having a value or has a zero value.
   */

  validateEmptywithZero(validateText) {
    return (validateText == undefined || validateText == '' || validateText == null || validateText == 0 || validateText == ' ')
  }

  /**
   * @function validateMultipleEmpty
   * @param {strings} - Any number of params can be passed to validate for empty value.
   * description - This function returns true if any of the string is not having a value or has a zero value.
   */
  validateMultipleEmpty() {
    if (arguments.length > 0) {
      for (var i = 0; i < arguments.length; i++) {
        var validateText = arguments[i];
        if (this.validateEmpty(validateText)) {
          return true;
          // break;
        }
        else {
          continue;
        }

      }
    }
    return true;
  }

  /**
   * @function assignInnerHTMLByID
   * @param {string} - id of the element which is to be assigned with the value.
   * @param {string} - value which is to be assigned.
   * description - This function assigns value to the HTML element.
   */
  assignInnerHTMLByID(id, value) {
    document.getElementById(id).innerHTML = value;
  }

  /**
   * @function assignValueByID
   * @param {string} - id of the element which is to be assigned with the value.
   * @param {string} - value which is to be assigned.
   * description - This function assigns value to the HTML element.
   */
  assignValueByID(id, value) {
    document.getElementById(id).innerText = value;
  }

  /**
   * @function EmptyMultipleVariables
   * @param {strings} - Any number of params can be passed to initialized with empty value.
   * description - This function initializes all variables with blank value
    */
  EmptyMultipleVariables() {
    if (arguments.length > 0) {
      for (var i = 0; i < arguments.length; i++) {
        var validateText = arguments[i];
        validateText = '';
      }
    }
  }

  /**
   * @function validate2EmptyFieldswithAND
   * @param {string} validateText1 - The first string to be tested for blank value.
   * @param {string} validateText2 - The second string to be tested for blank value.
   * description - This function returns true if the string is not having a value.
   */

  validate2EmptyFieldswithAND(validateText1, validateText2) {
    if (this.validateEmpty(validateText1)) {
      if (this.validateEmpty(validateText2)) {
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }

  /**
   * @function validate3EmptyFieldswithAND
   * @param {string} validateText1 - The first string to be tested for blank value.
   * @param {string} validateText2 - The second string to be tested for blank value.
   * @param {string} validateText3 - The second string to be tested for blank value.
   * description - This function returns true if all the strings are not having a value.
   */

  validate3EmptyFieldswithAND(validateText1, validateText2, validateText3) {
    if (this.validateEmpty(validateText1)) {
      if (this.validateEmpty(validateText2)) {
        if (this.validateEmpty(validateText3)) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    return true;
  }


  /**
   * @function validate2EmptyFieldswithNAND
   * @param {string} validateText1 - The first string to be tested for blank value.
   * @param {string} validateText2 - The second string to be tested for non blank value.
   * description - This function returns true if one string is empty and other has a value.
   */

  validate2EmptyFieldswithNAND(validateText1, validateText2) {
    if (this.validateEmpty(validateText1)) {
      if (this.validateEmpty(validateText2)) {
        return false;
      }
      else {
        return true;
      }
    }
    return true;
  }


  /**
   * @function EmptyMultipleHTMLElementsByID
   * @param {strings} - Any number of params can be passed to initialized with empty value.
   * description - This function initializes all variables with blank value
  */
  EmptyMultipleHTMLElementsByID() {
    if (arguments.length > 0) {
      for (var i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).innerHTML = '';
      }
    }
  }

  /**
   * @function EmptyMultipleHTMLElementValuesByID
   * @param {strings} - Any number of params can be passed to initialized with empty value.
   * description - This function initializes all variables with blank value
  */
  EmptyMultipleHTMLElementValuesByID() {
    if (arguments.length > 0) {
      for (var i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).innerText = '';
      }
    }
  }

  /**
   * @function EmptyMultipleHTMLElementValuesByID
   * @param {strings} - Any number of params can be passed to initialized with empty value.
   * description - This function initializes all variables with blank value
  */
  getElementValueByID(id) {
    return (document.getElementById(id).innerText);
  }

  monthNameIDConversion() {
    /**Month Name array*/
    var monthNameArray = [];
    monthNameArray.push({
      monthId: 1,
      monthName: 'January',
      shortMonthName: 'jan'
    },
      {
        monthId: 2,
        monthName: 'February',
        shortMonthName: 'feb'
      },
      {
        monthId: 3,
        monthName: 'March',
        shortMonthName: 'mar'
      },
      {
        monthId: 4,
        monthName: 'April',
        shortMonthName: 'apr'
      },
      {
        monthId: 5,
        monthName: 'May',
        shortMonthName: 'may'
      },
      {
        monthId: 6,
        monthName: 'June',
        shortMonthName: 'jun'
      },
      {
        monthId: 7,
        monthName: 'July',
        shortMonthName: 'jul'
      },
      {
        monthId: 8,
        monthName: 'August',
        shortMonthName: 'aug'
      },
      {
        monthId: 9,
        monthName: 'September',
        shortMonthName: 'sep'
      },
      {
        monthId: 10,
        monthName: 'October',
        shortMonthName: 'oct'
      },
      {
        monthId: 11,
        monthName: 'November',
        shortMonthName: 'nov'
      },
      {
        monthId: 12,
        monthName: 'December',
        shortMonthName: 'dec'
      });
    return monthNameArray;
  }
  /**
   * @function getMonthName
   * @param {int} - month id to be passed
   * description - it will return the name of month corresponding to the month id passed in function as param.
  */
  getMonthName(id) {
    for (var i = 0; i <= 11; i++) {
      var monthNameArray = this.monthNameIDConversion();
      if (id == monthNameArray[i].monthId) {
        return monthNameArray[i].shortMonthName + " " + monthNameArray[i].monthName;
      }
      return id;
    }
  }

  
  
  /**
   * @function isFloat
   * @param {value} - parameter to be checked for Float
   * description - This function checks if the paramter is a float value.
  */
  isFloat(n) {
    return Number(n) == n && n % 1 != 0;
  }

  /**
   * @function isInt
   * @param {value} - parameter to be checked for Integer
   * description - This function checks if the paramter is an Integer value.
  */
  isInt(n) {
    return Number(n) == n && n % 1 == 0;
  }

  /**
   * @function validateEmail
   * @param {value} - parameter to be checked for Email Format
   * description - This function checks if the paramter is a validated Email Format.
  */
  validateEmail(validateString) {
    var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return (reg.test(validateString));
  }

  /**
   * @function validateNumber
   * @param {value} - parameter to be checked for Number Format
   * description - This function checks if the parameter is a validated Number Format.
  */
  validateNumber(validateString) {
    var checkNumber = /^[1-9]{1}[0-9]+/;
    return (checkNumber.test(validateString));
  }

  /**
     * @function checkForAndroid
     * @param {value} - parameter to be checked for Android Platform
     * description - This function checks if the parameter is Android
  */
  checkForAndroid(platform) {
    return (platform == "android" || platform == "Android" || platform == "ANDROID")
  }

  /**
     * @function checkForioS
     * @param {value} - parameter to be checked for ioS Platform
     * description - This function checks if the parameter is ioS
  */
  checkForioS(platform) {
    return (platform == 'iOS' || platform == 'ios' || platform == 'IOS')
  }

  /**
   * @function assignClassByID
   * @param {string} - id of the element which is to be assigned with the class.
   * @param {string} - value which is to be assigned.
   * description - This function assigns Class to the HTML element.
   */
  assignClassByID(id, value) {
    document.getElementById(id).className = value;
  }

  /**
   * @function numberWithCommas
   * @param {int} -  Parameter to be converted into comma separated number
   * description - This function will return the comma separated number at interval of 3
   */

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
 * @function consoleWrite
 * @param {boolean} -  decides whether to display the console messages or not
 * @param {string} -  Message to be be displayed on console
 * description - This function will write the messaeg on console depending upon the todisplay parameter
 */

  consoleWrite(toDisplay, msg) {
    if (toDisplay) {
      console.log(msg);
    }
  }

  /**
* @function sleep
* @param {int} -  milliseconds of time
* description - This function will send the process to sleep for the specific miliseconds
*/

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  /**
  * @function genRandomDigit
  * @param {int} - length of random number to be generated.
  * description - This function returns the random number of specified length.
  */

  genRandomDigit(length) {
    var minValue = "1";
    var maxValue = "9";
    for (var i = 0; i < length - 1; i++) {
      minValue = minValue + "0";
      maxValue = maxValue + "9";
    }
    return Math.floor((Math.random() * parseInt(maxValue)) + parseInt(minValue));
  }


  /**
  * @function addZero
  * @param {int} - parameter to check for adding the zero.
  * description - This function will return the value prefixed with zero if the provided number is less than 10.
  */
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  /**
  * @function startTime
  * description - This function will return the current time in 24-hrs format.
  */

  startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var pmam = "";

    m = this.addZero(m);
    s = this.addZero(s);

    var t = h + ":" + m;
    return t;
  }

  /**
   * @function getTimeIn12
   * description - This function will return the current time in 12-hrs format.
   */

  getTimeIn12() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var pmam = "";

    m = this.addZero(m);
    s = this.addZero(s);
    var nh = h;
    if (h >= 12) {
      nh = h - 12;
      pmam = " PM";
    } else {
      pmam = " AM";
    }

    var t = nh + ":" + m + pmam;
    return t;
  }

  maskMobileNumber(mobNumber) {
    var temp = "x";
    var num = mobNumber.toString().length - 4;
    for (var i = 1; i < num; i++) {
      temp = temp + "x";
    }
    temp = mobNumber.toString().substring(0, 2) + temp + mobNumber.toString().substring((mobNumber).toString().length - 2, (mobNumber).toString().length);
    return temp;
  }

  getAmountFormatWithZero(amount) {
    console.log("inisede getAmountFormatWithZero");
    if (amount.includes(".")) {
      var splitAmt = amount;
      if (splitAmt.split(".")[1].length == 1) {
        amount = amount + '0';
        amount = amount.trim().replace(/[^0-9]+/g, '');
      }
      else {
        amount = amount.trim().replace(/[^0-9]+/g, '');
      }
    }
    else {
      amount = amount + '.00';
      amount = amount.trim().replace(/[^0-9]+/g, '');
    }
    return amount;
  }

  maskAccNo(accNo) {
    var temp = "X";
    var num = accNo.toString().length - 4;
    for (var i = 1; i < num; i++) {
      temp = temp + "X";
    }
    //temp = accNo.toString().substring(0, 2) + temp + accNo.toString().substring((accNo).toString().length - 2, (accNo).toString().length);
    temp = temp + accNo.toString().substring((accNo).toString().length - 4, (accNo).toString().length);
    return temp;
  }

  maskCardNo(cardNo) {
    var temp = "x";
    var num = cardNo.toString().length - 4;
    for (var i = 1; i < num; i++) {
      temp = temp + "x";
    }
    //temp = accNo.toString().substring(0, 2) + temp + accNo.toString().substring((accNo).toString().length - 2, (accNo).toString().length);
    temp = temp + cardNo.toString().substring((cardNo).toString().length - 4, (cardNo).toString().length);
    return temp;
  }

  maskBalance(balAmount) {
    console.log("Inside balAmount");
    balAmount = Number(balAmount.trim()).toFixed(2);
    var temp = "";
    var bal = [];
    let num = balAmount.replace(",", "");
    if (num.includes(".")) {
      bal = num.split(".");
    }
    else bal[0] = num;
    bal.forEach((element, index) => {
      for (let i = 0; i < element.length; i++) {
        temp = temp + "X"
      }
      bal[index] = temp;
      temp = "";
    });

    return temp = bal.length > 1 ? " " + bal[0] + "." + bal[1] : " " + bal[0];
  }

  _maskBalance(balAmount) {
    console.log("Inside balAmount");
    balAmount = balAmount.trim()
    let num = balAmount.replace(",", "");
    var _balAmount = Number(num).toFixed(2);
    var temp = "";
    var bal = [];
    if (_balAmount.toString().includes(".")) {
      bal = num.split(".");
    }
    else bal[0] = num;
    bal.forEach((element, index) => {
      for (let i = 0; i < element.length; i++) {
        temp = temp + "X"
      }
      bal[index] = temp;
      temp = "";
    });

    return temp = bal.length > 1 ? " " + bal[0] + "." + bal[1] : " " + bal[0];
  }

  getCurrentDateTime() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return str;
  }

  getMessageID(deviceID) {
    var date = new Date();
    var timestamp = date.getTime();
    var msgID;
    if (this.validateEmpty(deviceID)) {
      msgID = this.genRandomDigit(7).toString() + timestamp.toString();
    }
    else {
      msgID = this.genRandomDigit(4).toString() + deviceID.toString();
    }
    return msgID;
  }

  getMobileOperatingSystem() {

    if (typeof device == "undefined") {
      return "browser";
    }
    else {
      var userAgent = navigator.userAgent;
      if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
      }

      else if (/Android/i.test(userAgent)) {
        return "Android";
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      else if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "iOS";
      }

      else return "browser"
    }


  }

  closeAnyModal() {
    ($('.modal') as any).modal('hide');
    ($('body') as any).removeClass('modal-open');
    ($('.modal-backdrop') as any).remove();
  }

  showLoader() {
    this.disableBack = true;
    //$("#appLoader").show();
  }

  hideLoader() {
    this.disableBack = false;
    //$("#appLoader").hide();
  }

  exitApp() {
    navigator['app'].exitApp();
  }

  removeLeadingZero(value) {
    var parsedString;
    parsedString = Number(value).toString();
    return parsedString;
  }

  removeLineBreaksFromBase64(imageString) {
    var parsedBase64String;
    parsedBase64String = imageString.replace(/[\r\n]/g, '');
    return parsedBase64String;
  }

  getBackButtonEventMobile() {
    document.addEventListener("backbutton", function (e) {
      // alert("back btn called");
    }, true);
  }

  getBase64FromFile(file): Observable<any> {
    var subject = new Subject<any>();
    var fr = new FileReader();

    fr.onload = (e: any) => {
      subject.next(e.target.result);
      subject.complete();
    };

    fr.readAsDataURL(file);
    return subject.asObservable();
  }

  getMonths(monthVal) {
    var months = [
      { id: "01", name: "January" },
      { id: "02", name: "February" },
      { id: "03", name: "March" },
      { id: "04", name: "April" },
      { id: "05", name: "May" },
      { id: "06", name: "June" },
      { id: "07", name: "July" },
      { id: "08", name: "August" },
      { id: "09", name: "September" },
      { id: "10", name: "October" },
      { id: "11", name: "November" },
      { id: "12", name: "December" },
    ];

    return months.slice(0, monthVal + 1);
  }

  // add 91 before mobile no
  processPhoneNo(mobileno) {
    console.log(mobileno);
    if (mobileno.length == 10)
      return "91" + mobileno
    if (mobileno.length == 12)
      return mobileno
    if (mobileno.length == 13)
      return mobileno.replace("+", "");
    if (mobileno.length == 11 && mobileno.charAt(0) == '0') {
      mobileno = mobileno.replace("0", "")
      return "91" + mobileno
    }
  }

  getYears(backYears) {
    var years = [];
    var year = new Date();

    years.push(year.getFullYear());
    for (var i = 1; i < backYears; i++) {
      year.setFullYear(new Date().getFullYear() - i);
      years.push(year.getFullYear());
    }

    return years;
  }

  /**
   * common function to access Dailler window
   */
  openDailler(mobileNo) {
    window.open('tel:' + mobileNo);
  }

  convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    amount = amount.replace('₨', '');
    amount = amount.trim();

    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var decimals = atemp[1];
    var n_length = number.length;
    var d_length = atemp.length == 2 ? decimals.length : 0;
    var words_string = "";
    var decimal_string = "";
    if (n_length <= 11) {
      var n_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 11 - n_length, j = 0; i < 11; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 11; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7 || i == 9 || i == 11) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      var value: any = "";
      for (var i = 0; i < 11; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7 || i == 9) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Billion ";
        }
        if ((i == 3 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Coror ";
        }
        if ((i == 5 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 7 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 8 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 8 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    if (d_length <= 9 && d_length != 0) {
      var d_array: any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_d_array = new Array();
      for (var i = 0; i < d_length; i++) {
        received_d_array[i] = decimals.substr(i, 1);
      }
      for (var i = 9 - d_length, j = 0; i < 9; i++, j++) {
        d_array[i] = received_d_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (d_array[i] == 1) {
            d_array[j] = 10 + parseInt(d_array[j]);
            d_array[i] = 0;
          }
        }
      }
      var _value: any = "";
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          _value = d_array[i] * 10;
        } else {
          _value = d_array[i];
        }
        if (_value != 0) {
          decimal_string += words[_value] + " ";
        }
        if ((i == 1 && _value != 0) || (i == 0 && _value != 0 && d_array[i + 1] == 0)) {
          decimal_string += "Crores ";
        }
        if ((i == 3 && _value != 0) || (i == 2 && _value != 0 && d_array[i + 1] == 0)) {
          decimal_string += "Lakhs ";
        }
        if ((i == 5 && _value != 0) || (i == 4 && _value != 0 && d_array[i + 1] == 0)) {
          decimal_string += "Thousand ";
        }
        if (i == 6 && _value != 0 && (d_array[i + 1] != 0 && d_array[i + 2] != 0)) {
          decimal_string += "Hundred and ";
        } else if (i == 6 && _value != 0) {
          decimal_string += "Hundred ";
        }
      }
      decimal_string = decimal_string.split("  ").join(" ");
    }
    if (words_string.trim() == "One") {
      return words_string + "Rupee Only";
    } else {
      if (d_length != 0) {
        return words_string + "Rupees " + decimal_string + " paisa Only";
      }
      else {
        return words_string + "Rupees Only";
      }
    }
  }

  /**
     * common function to initiallize data table
     */
  setDataTable() {
    setTimeout(function () {
      $('table.display').DataTable({
        responsive: true,
        pageLength: "5"
      })
      $('.dataTables_paginate').css({ "width": "50%", "float": "right" })
      $('.dataTables_length').css({ "float": "left", "margin-top": "10px" })
      $('.dataTables_info').css("float", "left")
      $(".dataTables_filter input").focus(function () {
        $('.dataTables_filter input').attr('type', 'text');
      });
    })
  }


  shareDownloadedPDF(doc, fileName) {
    if (window.hasOwnProperty('cordova')) {
      fileName = fileName.replaceAll(' ', '_');
      var out = doc.output();
      // var url = 'data:application/pdf;base64,' + Base64.encode(out);
      //console.log(" btoa(out) ", base64);
      // window.plugins.socialsharing.share(null, Date.now(), base64, null);
      // window.open("data:application/pdf;base64," + btoa(out));
      var storageLocation
      if (device.platform.toLowerCase() == "ios") {
        storageLocation = cordova.file.documentsDirectory;
      }
      else {
        storageLocation = 'file:///storage/emulated/0/';
      }

      var folderPath = storageLocation;
      var folderName = "product";
      var contentType = "application/pdf";
      let base64 = this.b64toBlob(btoa(out), contentType);

      window.resolveLocalFileSystemURL(folderPath, function (fileSystem) {
        fileSystem.getDirectory(folderName, { create: true, exclusive: false }, function (dir) {
          console.log("Access to the directory granted succesfully");
          dir.getFile(fileName + ".pdf", { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
              console.log("Writing content to file");
              fileWriter.write(base64);
              fileWriter.onwriteend = function () {
                var url = file.toURL();
                console.log("url to share =======>" + url);
                window['plugins'].socialsharing.share(null, fileName, url);
              };

              fileWriter.onerror = function (err) {
                // alert("Unable to download");
                console.error(err);
              };
            }, function (err) {
              // alert('Unable to save file in path ' + folderpath);
              console.error(err);
            });
          });
        }, function (err) { console.error(err); });
      }, function (err) { console.error(err); });

    } else {
      doc.save(fileName + '.pdf');
    }
  }

  downloadPDF(doc, fileName) {
    if (window.hasOwnProperty('cordova')) {
      var out = doc.output();
      var storageLocation
      if (device.platform.toLowerCase() == "ios") {
        storageLocation = cordova.file.documentsDirectory;
      }
      else {
        storageLocation = 'file:///storage/emulated/0/Download';
      }

      var folderPath = storageLocation;
      console.log("folderPath ====>");
      console.log(JSON.stringify(folderPath));
      var folderName = "product";
      var contentType = "application/pdf";
      let base64 = this.b64toBlob(btoa(out), contentType);

      window.resolveLocalFileSystemURL(folderPath, function (fileSystem) {
        fileSystem.getDirectory(folderName, { create: true, exclusive: false }, function (dir) {
          console.log("Access to the directory granted succesfully");
          dir.getFile(fileName + ".pdf", { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
              console.log("Writing content to file");
              fileWriter.write(base64);
              fileWriter.onwriteend = function () {
                var url = file.toURL();
                cordova.plugins.fileOpener2.open(url, contentType, {
                  error: function error(err) {
                    console.error(err);
                    // alert("Unable to open");
                  },
                  success: function success() {
                    console.log("success with opening the file");
                  }
                });
              };

              fileWriter.onerror = function (err) {
                // alert("Unable to download");
                console.error(err);
              };
            }, function (err) {
              // alert('Unable to save file in path ' + folderpath);
              console.error(err);
            });
          });
        }, function (err) { console.error(err); });
      }, function (err) { console.error(err); });

    } else {
      doc.save(fileName + '.pdf');
    }
  }

  downloadExcel(blob, fileName) {
    if (window.hasOwnProperty('cordova')) {
      var contentType = "";
      var storageLocation
      if (device.platform.toLowerCase() == "ios") {
        storageLocation = cordova.file.documentsDirectory;
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }
      else {
        storageLocation = 'file:///storage/emulated/0/Download';
        contentType = "application/xlsx";
      }
      var folderPath = storageLocation;
      var folderName = "product";
      var self = this;
      window.resolveLocalFileSystemURL(folderPath, function (fileSystem) {
        fileSystem.getDirectory(folderName, { create: true, exclusive: false }, function (dir) {
          console.log("Access to the directory granted succesfully");
          dir.getFile(fileName + ".xlsx", { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
              console.log("Writing content to file");
              fileWriter.write(blob);
              fileWriter.onwriteend = function () {
                var url = file.toURL();
                cordova.plugins.fileOpener2.open(url, contentType, {
                  error: function error(err) {
                    self.openPopup('div.popup-bottom.no-app-available');
                    console.error(err);
                    // alert("Unable to open");
                  },
                  success: function success() {
                    console.log("success with opening the file");
                  }
                });
              };
              fileWriter.onerror = function (err) {
                // alert("Unable to download");
                console.error(err);
              };
            }, function (err) {
              // alert('Unable to save file in path ' + folderpath);
              console.error(err);
            });
          });
        }, function (err) { console.error(err); });
      }, function (err) { console.error(err); });

    } else {

    }
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  /**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  savePDFInDevice(section, filename) {
    var self = this;
    if (device.platform.toLowerCase() == "android") {
      self.convertHtmlToImage(section).subscribe((base64Image) => {
        var block = base64Image.split(";");
        var dataType = block[0].split(":")[1];// In this case "image/png"
        var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
        self.savebase64AsImageFile(filename, realData, dataType);
      });
    }
    else {
      self.convertHtmlToImageIos(section).subscribe((blob) => {
        console.log("blob success");
        console.log(blob);
        self.savebase64AsImageFileIos(filename, blob, 'image/png');
      });
    }
  }



  shareImageInDevice(section, filename) {
    this.convertHtmlToImage(section).subscribe((base64Image) => {
      window['plugins'].socialsharing.share(null, filename, base64Image);
    });

  }

  takeScreenshot() {
    navigator.screenshot.save(function (error, res) {
      let self = this;
      if (error) {
        console.error(error);
      } else {
        console.log('ok', res.filePath);
        cordova.plugins.fileOpener2.open("file://" + res.filePath, 'image/jpeg', {
          error: function error(err) {
            console.error(err);
            // alert("Unable to open");
          },
          success: function success() {
            console.log("success with opening the file");
          }
        });
      }
    }, 'jpg', 50);
  }

  downloadReceiptIos(filename) {
    var self = this;
    navigator.screenshot.save(function (error, res) {
      if (error) {
        console.error(error);
      } else {
        console.log('ok', res.filePath);
        var contentType = "application/pdf";
        self._getFileContentAsBase64("file://" + res.filePath).then((base64) => {
          console.log('base64', base64);
          //window.open(base64Image);
          console.log(base64);
          var base64Image = base64.split(',')[1];
          // Then you'll be able to handle the myimage.png file as base64
          var storageLocation = "";
          console.log('device.platform', device.platform);
          if (device.platform.toLowerCase() == "ios") {
            storageLocation = cordova.file.documentsDirectory;
            console.log('storageLocation', storageLocation);
          }
          // Convert the base64 string in a Blob
          var DataBlob = self.b64toBlob(base64Image, contentType);
          console.log("Starting to write the file :3");

          window.resolveLocalFileSystemURL(storageLocation, function (dir) {
            console.log("Access to the directory granted succesfully");
            dir.getFile(filename, { create: true }, function (file) {
              console.log("File created succesfully.");
              file.createWriter(function (fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
                // showToastMessage("FILE_DOWNLOADED","success");
                fileWriter.onwriteend = function () {
                  var url = file.toURL();
                  cordova.plugins.fileOpener2.open(url, contentType, {
                    error: function error(err) {
                      console.error(err);
                      // alert("Unable to open");
                    },
                    success: function success() {
                      console.log("success with opening the file");
                    }
                  });
                };

                fileWriter.onerror = function (err) {
                  console.log("Unable to download");
                  console.error(err);
                };
              }, function (err) {
                console.error('Unable to save file in path ' + storageLocation);
                console.error(err);
              });
            });
          });
        });
      }
    });
  }

  /**
 * This function will handle the conversion from a file to base64 format
 *
 * @path string
 * @callback function receives as first parameter the content of the image
 */
  getFileContentAsBase64(path, callback) {
    console.log("path");
    console.log(path);

    window.resolveLocalFileSystemURL(path, gotFile, fail);

    function fail(e) {
      console.error('error getting filepath ', e)
      // alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {

      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          var content = this.result;
          callback(content);
        };
        // The most important point, use the readAsDatURL Method from the file plugin
        reader.readAsDataURL(file);
      });
    }
  }


  _getFileContentAsBase64(path): Promise<any> {

    return new Promise((resolve, reject) => {
      console.log("path");
      console.log(path);
      window.resolveLocalFileSystemURL(path, gotFile, fail);

      function fail(e) {
        console.error('error getting filepath ', e)
        // alert('Cannot found requested file');
        reject(e);
      }

      function gotFile(fileEntry) {
        console.log("fileEntry");
        console.log(fileEntry);
        fileEntry.file(function (file) {
          console.log("file");
          console.log(file);
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var content = this.result;
            console.log("content");
            console.log(content);
            resolve(content);
          };
          // The most important point, use the readAsDatURL Method from the file plugin
          reader.readAsDataURL(file);
        });
      }
    });
  }

  isToday(otherDate) {
    var today = new Date();
    return (today.toDateString() == otherDate.toDateString());
  }

  getFirstLastCharOfUser(userFullName: string) {
    var string = userFullName.split(' ');
    return string[0][0] + string[1][0];
  }

  randomString(length, appendKey?: string) {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    if (appendKey) {
      result = appendKey + result
    }
    return result;
  }

  getAscendingContactList(contacts) {
    var specialRegex = /[^A-Z a-z0-9]/;
    let contactList = contacts.filter(obj => Object.keys(obj).includes("custName") && obj.custName != null && !specialRegex.test(obj.custName));
    console.log(JSON.stringify(contactList));
    var sorted = contactList.sort((a, b) => a.custName > b.custName ? 1 : -1);
    var grouped = sorted.reduce((groups, contact) => {
      if (contact.custName != null) {
        var letter = contact.custName.charAt(0);

        groups[letter] = groups[letter] || [];
        groups[letter].push(contact);

        return groups;
      }
    }, {});
    var result = Object.keys(grouped).map(key => ({ key, contacts: grouped[key] }));
    return result;
  }

  /**
   * Close Popup name by class name
   * @param popupName
   */
  closePopup(popupName: string) {
    $(popupName).removeClass('popup-active');
    $('div.ios-nav-overlay').fadeOut(400);
  }

  /**
   * Open Modal Popup By Class name
   */
  openPopup(popupName: string, checkExisting?) {
    if (checkExisting) {
      $(popupName).addClass('popup-active');
      $('div.ios-nav-overlay').fadeIn(400);
    } else {
      if (!$(popupName).hasClass('popup-active')) {
        setTimeout(() => {
          $(popupName).addClass('popup-active');
          $('div.ios-nav-overlay').fadeIn(400);
        }, 100);
      } else {
        $(popupName).removeClass('popup-active');
        $('div.ios-nav-overlay').fadeOut();
      }
    }

  }

  hadClassActive(className) {
    if ($(className).hasClass('popup-active')) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * close all popup
   */
  closeAllPopup() {
    $('.popup-bottom').removeClass('popup-active');
    $('div.ios-nav-overlay').fadeOut(400);
  }

  closeSideNavUPI() {
    $('nav.global-nav').removeClass('nav-showing');
    $('div.nav-overlay').fadeOut(300);
    $('body').css('overflow', 'inherit');
  }

  closeSideNavOmni() {
    $('nav.global-nav').removeClass('nav-showing');
    $('div.ios-nav-overlay').fadeOut(400);
    $('body').css('overflow', 'inherit');
  }


  savebase64AsImageFileIos(filename, blob, contentType) {
    console.log("Inside savebase64AsImageFileIos...");
    // var folderPath = cordova.file.documentsDirectory;
    var folderPath = cordova.file.dataDirectory;
    console.log('folderPath', folderPath);

    window.resolveLocalFileSystemURL(folderPath, function (dir) {
      console.log('dir');
      console.log(dir);
      console.log("Access to the directory granted succesfully");
      dir.getFile(filename, { create: true }, function (file) {
        console.log("File created succesfully.");
        file.createWriter(function (fileWriter) {
          console.log("Writing content to file");
          fileWriter.write(blob);
          fileWriter.onwriteend = function () {
            var url = file.toURL();
            console.log('FILE url', url);
            cordova.plugins.fileOpener2.open(url, contentType, {
              error: function error(err) {
                console.error(err);
                // alert("Unable to open");
              },
              success: function success() {
                console.log("success with opening the file");
              }
            });

          };

          fileWriter.onerror = function (err) {
            // alert("Unable to download");
            console.error(err);
          };
        }, function (err) {
          // alert('Unable to save file in path ' + folderpath);
          console.error(err);
        });
      });
    });
  }

  /**
  * Create a Image file according to its database64 content only.
  *
  * @param folderpath {String} The folder where the file will be created
  * @param filename {String} The name of the file that will be created
  * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
  */
  savebase64AsImageFile(filename, content, contentType, msgKey?: any, toastColor?: any) {
    var storageLocation = "";

    switch (device.platform) {
      case "Android":
        //storageLocation = cordova.file.externalRootDirectory;
        storageLocation = 'file:///storage/emulated/0/';
        // cordova.file.createDir(cordova.file.externalDataDirectory, storageLocation, true);
        break;

      case "iOS":
        storageLocation = cordova.file.documentsDirectory;
        break;
    }

    var folderPath = storageLocation;
    var folderName = "product"
    // Convert the base64 string in a Blob
    var DataBlob = this.b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    if (device.platform == "Android") {
      cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (status) {
        switch (status) {
          case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            window.resolveLocalFileSystemURL(folderPath, function (fileSystem) {
              fileSystem.getDirectory(folderName, { create: true, exclusive: false }, function (dir) {
                console.log("Access to the directory granted succesfully");
                dir.getFile(filename, { create: true }, function (file) {
                  console.log("File created succesfully.");
                  file.createWriter(function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                    if (msgKey) showToastMessage(msgKey, toastColor);
                    fileWriter.onwriteend = function () {
                      var url = file.toURL();
                      cordova.plugins.fileOpener2.open(url, contentType, {
                        error: function error(err) {
                          console.error(err);
                          // alert("Unable to open");
                        },
                        success: function success() {
                          console.log("success with opening the file");
                        }
                      });
                    };

                    fileWriter.onerror = function (err) {
                      // alert("Unable to download");
                      console.error(err);
                    };
                  }, function (err) {
                    // alert('Unable to save file in path ' + folderpath);
                    console.error(err);
                  });
                });
              }, function (err) { console.error(err); });
            });
            break;
          // case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
          //   window['imagePicker'].requestReadPermission();
          //   break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            this.plugin.gotoSetting().subscribe((status) => {
              console.log("gotoSetting=====>", status);
            }, (err) => {
              console.log("gotoSetting error", err);
            });
            break;
          default:
            break;
        }
      }, function (error) {
        console.error(error);
      });
    }
    else {
      window.resolveLocalFileSystemURL(folderPath, function (fileSystem) {
        fileSystem.getDirectory(folderName, { create: true, exclusive: false }, function (dir) {
          console.log("Access to the directory granted succesfully");
          dir.getFile(filename, { create: true }, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
              console.log("Writing content to file");
              fileWriter.write(DataBlob);
              if (msgKey) showToastMessage(msgKey, toastColor);
              fileWriter.onwriteend = function () {
                var url = file.toURL();
                cordova.plugins.fileOpener2.open(url, contentType, {
                  error: function error(err) {
                    console.error(err);
                    // alert("Unable to open");
                  },
                  success: function success() {
                    console.log("success with opening the file");
                  }
                });
              };

              fileWriter.onerror = function (err) {
                // alert("Unable to download");
                console.error(err);
              };
            }, function (err) {
              // alert('Unable to save file in path ' + folderpath);
              console.error(err);
            });
          });
        }, function (err) { console.error(err); });
      });
    }




  }

  /**
   * Html code to base64 convert
   * @param section
   */
  convertHtmlToImage(section): Observable<any> {
    var self = this;
    if (device.platform.toLowerCase() == "android") {
      //
      // We pass that section to html2Canvase
      var self = this;
      var subject = new Subject<any>();
      html2canvas(section)
        .then(canvas => {
          console.log("canvas =====>" + JSON.stringify(canvas));
          // var link = document.createElement('a');
          let base64Image = canvas.toDataURL();
          console.log("base64Image ===>" + base64Image);
          // link.download = filename;
          // document.body.appendChild(link);
          // link.click();
          subject.next(base64Image);
          subject.complete();
        });
    } else if (device.platform.toLowerCase() == "ios") {

      //TODO: checking
      console.log("htmlToImage SECTION");
      console.log(section);
      var subject = new Subject<any>();

      htmlToImage.toPng(section)
        .then(function (dataUrl) {
          console.log('dataUrl', dataUrl);
          var img = new Image();
          img.src = dataUrl;
          console.error(img.src);
          subject.next(img.src);
          subject.complete();
        })
        .catch(function (error) {
          console.error('oops, something went wrong!');
          console.log(error);
        });
    } else {
      console.log("Unknown platform");
    }
    return subject.asObservable();
  }

  /**
   * Html code to base64 convert
   * @param section
   */
  convertHtmlToImageIos(section): Observable<any> {
    var self = this;
    if (device.platform.toLowerCase() == "ios") {
      //TODO: checking
      console.log("htmlToImage IOS SECTION");
      console.log(section);
      var subject = new Subject<any>();

      html2canvas(section,
        {
          allowTaint: false,
          removeContainer: true,
          backgroundColor: '#ffffff',
          scale: window.devicePixelRatio,
          useCORS: false
        })
        .then(canvas => {
          if (canvas.toBlob) {
            console.log("inside blob");
            console.log('canvas', canvas);
            canvas.toBlob(function (blob) {
              console.log("blob");
              console.log(blob);
              subject.next(blob);
              subject.complete();
            }, 'image/jpeg');
          }
        });
    } else {
      console.log("Unknown platform");
    }
    return subject.asObservable();
  }


  /**
  * Get browser name
  **/
  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }


  /**
  * Get browser version
  **/
  getBrowserVersion() {
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }

    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }

  public getBase64Image(imgUrl, callback) {

    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function () {

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png"),
        dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

      callback(dataURL); // the base64 string

    };

    // set attributes and src
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

  }

  filterValue(obj, key, value) {
    return obj.find(function (v) { return v[key] === value });
  }

  shareImage(fileName, base64) {
    console.log("shareImage =====>");
    window.plugins.socialsharing.share(null, fileName, base64, null);
  }

  addDecimalToFixed(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
  }


  /**
   * mask all number
   */
  maskNumber(number) {
    if (this.validateEmpty(number)) return number;
    let num = number;
    return num.replace(/\d(?=\d{4})/g, "*");
  }

  convertNumToDate(numDate) {
    // var numDate = 11102020;
    var y = numDate.substr(4),
      m = numDate.substr(2, 2),
      d = numDate.substr(0, 2);
    var date = new Date(y, m - 1, d);
    return date;
  }

  termAccepted(msg) {
    this.termAcceptedEvent.emit(msg);
  }
  
  maskEmailId(email) {
    if (email) {
      var parts = email.split("@");
      var name = parts[0];
      var result = name.charAt(0);
      for (var i = 1; i < name.length; i++) {
        result += "*";
      }
      result += name.charAt(name.length - 1);
      result += "@";
      var domain = parts[1];
      result += domain.charAt(0);
      var dot = domain.indexOf(".");
      for (var i = 1; i < dot; i++) {
        result += "*";
      }
      result += domain.substring(dot);

      return result;
    }
    else {
      return "";
    }
  }

  _getResizeBase64(path): Promise<any> {
    console.log("resize path", path);
    return new Promise((resolve, reject) => {
      var options = {
        uri: path,
        folderName: "Protonet Messenger",
        quality: 10,
        width: 400,
        height: 400,
        base64: true,
        fit: false
      };

      window.ImageResizer.resize(options,
        function (image) {
          // success: image is the new resized image
          console.log(image);
          resolve(image);
        }, function (error) {
          reject(error);
          // failed: grumpy cat likes this function
        });
    });
  }

  /*** Generate E-Receipt PDF */

  generatePDF(imageColor, msg, submsg, reftransJSON, receiptJSON, receiptName, branchJSON, printPDF, accountNo, todayDateTime) {
    var pdfsize = 'a4';
    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var img = new Image()
    img.src = this.productNewLogo; //1
    doc.addImage(img, 'png', 20, 16, 60, 15);
    doc.setLineWidth(0.5);
    doc.line(90, 7, 90, 40); // vertical line


    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");

    doc.setFontSize(7);
    var count1 = 10
    for (i = 0; i < branchJSON.length; i++) {
      var data = branchJSON[i].key + ": " + branchJSON[i].value
      doc.text(data, pageWidth - 110, count1, { align: 'left' });
      count1 = count1 + 5
    }
    // doc.text("Branch Name : ", pageWidth - 110, 10, {align :'left'});
    // doc.text("Branch Code : ", pageWidth - 110, 15, {align :'left'});
    // doc.text("Branch Address : ", pageWidth - 110, 20, {align :'left'});
    // doc.text("Branch Contact : ", pageWidth - 110, 25, {align :'left'});
    // doc.text("IFSC : " , pageWidth - 110, 30, {align :'left'});
    // doc.text("MICR Code : ", pageWidth - 110, 35, {align :'left'});

    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(20);

    doc.text("E-Receipt", pageWidth / 2, 60, { align: 'center' });



    var img = new Image()
    if (imageColor == 'success')
      img.src = this.successLogo; //2s
    else
      img.src = this.errorLogo; //3

    doc.addImage(img, 'png', 20, 75, 16, 16);


    var img = new Image()
    img.src = this.bbpsLogo

    if (receiptName == "BBPS") {
      doc.addImage(img, 'png', 175, 75, 16, 16);

    }

    doc.setFontSize(20);

    doc.text(msg, 40, 85, { align: 'left' });

    doc.setFontSize(12)
    doc.text(submsg, 40, 95, { align: 'left' });

    doc.setFontSize(9)
    doc.text(reftransJSON[0].key + ": " + reftransJSON[0].value, 40, 105, { align: 'left' });

    doc.setLineWidth(0.1);
    doc.line(17, 110, pageWidth - 17, 110);

    doc.setFontSize(11)
    var count = 120
    for (i = 0; i < receiptJSON.length; i++) {
      var data = receiptJSON[i].key + ": " + receiptJSON[i].value
      doc.text(data, 25, count, { align: 'left' });
      count = count + 10
    }

    doc.setFontSize(8)
    doc.text("This is computer generated statement and does not require any signature.", 15, 280, { align: 'left' });

    doc.setLineWidth(0.2);
    doc.rect(15, 70, doc.internal.pageSize.width - 30, 200, 'S');
    var address = this.constant.val_bank_address;
    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text(address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    if (printPDF == 'Y') {
      if (!window.hasOwnProperty('cordova')) {
        doc.autoPrint();
        window.open(doc.output('bloburl').toString());
      }
      else {
        this.shareDownloadedPDF(doc, receiptName + '_xx' + this.maskCharacter(accountNo, 4) + '_' + todayDateTime);

        // doc.autoPrint();
        // window.open(doc.output('bloburl').toString());
      }
    }
    else {
      this.downloadPDF(doc, receiptName + '_xx' + this.maskCharacter(accountNo, 4) + '_' + todayDateTime);
    }
  }


  shareGeneratePDF(imageColor, msg, submsg, reftransJSON, receiptJSON, receiptName, branchJSON, printPDF, accountNo, todayDateTime) {
    var pdfsize = 'a4';
    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var img = new Image()
    img.src = this.productNewLogo;
    doc.addImage(img, 'png', 20, 16, 60, 15);
    doc.setLineWidth(0.5);
    doc.line(90, 7, 90, 40); // vertical line


    doc.setFontSize(7);
    var count1 = 10
    for (i = 0; i < branchJSON.length; i++) {
      var data = branchJSON[i].key + ": " + branchJSON[i].value
      doc.text(data, pageWidth - 110, count1, { align: 'left' });
      count1 = count1 + 5
    }
    
    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(20);

    doc.text("E-Receipt", pageWidth / 2, 60, { align: 'center' });



    var img = new Image()
    if (imageColor == 'success')
      img.src = this.successLogo;
    else
      img.src = this.errorLogo;

    doc.addImage(img, 'png', 20, 75, 16, 16);

    doc.setFontSize(20);

    doc.text(msg, 40, 85, { align: 'left' });

    doc.setFontSize(12)
    doc.text(submsg, 40, 95, { align: 'left' });

    doc.setFontSize(9)
    doc.text(reftransJSON[0].key + ": " + reftransJSON[0].value, 40, 105, { align: 'left' });

    doc.setLineWidth(0.1);
    doc.line(17, 110, pageWidth - 17, 110);

    doc.setFontSize(11)
    var count = 120
    for (i = 0; i < receiptJSON.length; i++) {
      var data = receiptJSON[i].key + ": " + receiptJSON[i].value
      doc.text(data, 25, count, { align: 'left' });
      count = count + 10
    }

    doc.setFontSize(8)
    doc.text("This is computer generated statement and does not require any signature.", 15, 190, { align: 'left' });
    var address = this.constant.val_bank_address;
    doc.setLineWidth(0.2);
    doc.rect(15, 70, doc.internal.pageSize.width - 30, 115, 'S');

    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text(address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    this.shareDownloadedPDF(doc, receiptName + '_xx' + this.maskCharacter(accountNo, 4) + '_' + todayDateTime);
  }

  maskCharacter(str, n) {
    return str.slice(-n);
  }

  
  /* Account Mini Statement */
  getFlexiScheme(schemeCode){
    return (schemeCode == "SBFSS" || schemeCode == "SBFSG" || schemeCode == "SBFFD" || schemeCode == "CASBI" || schemeCode == "CASBN")
  }
  

  /*** Generate E-Receipt PDF */

  productNewLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAA0CAYAAABfN8x2AAAAAXNSR0IArs4c6QAAAKRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAfAAAAWodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAdqADAAQAAAABAAAANAAAAACrw0/7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjE0RkU5MjA4NzMxQzExRUM5MEVDOURBM0M1QTBBQjEyPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjE0RkU5MjA3NzMxQzExRUM5MEVDOURBM0M1QTBBQjEyPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjE0RkU5MjA1NzMxQzExRUM5MEVDOURBM0M1QTBBQjEyPC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOjE0RkU5MjA2NzMxQzExRUM5MEVDOURBM0M1QTBBQjEyPC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCAyMy4xIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KZO+YDwAAJhZJREFUeAHtXAl8VcW5nznLXZOQhARBAUUREgIEDK6gJqxPrVWrSe2iVavQskPVutZL3RAtIIsK9j2X+p5t0lp3FAO5UKFqiRAgBBBRAWUJQsh2l7PM+39z7k1uVjDS97Pvvfnde8+cOTPfzHzbfN83cy5j/wdTYXGhStOetX5C+uw1Y4dTXgjG6fqvk0Sn41X+dSZyckZKBCwpKrEkcSN2kdGgbyPInWLp5HTddSjFxWphsVAZrhJIQChMIEdX1jmBu97pv1jLQhGT1tVjHp5ROuZcGn5cgr9zUwkElPxAmdZiXKI9QrZX1qLV/+6bQGWhi2Y4a/WYe2YFx8yh/MQNeTpdv2spkaCDFm2ak72oojR7yeZf0zizF1dMxndz9qJNfxr6eIVfjr0VwVtyw3dtdidxPIHiQlcgpyQ6c/XYH0DvXrcgv/QcAr88r9w8id2cHFBQu8EibuYt26CHwq7LBRd3uXue6Yoc2N0XHTyGZWOkq+dZQ4wjXw2J8NBdKPuMzZGrCSlomTpZYyHekgtOspgTTFor5PoQH8Y/90pSGSgqic4uHTMASHkZy+wt1GOgLF8DOpqQ8c8dxYlBl2tpEbdyFld8vyGqHVNSUl9FyyMgagMI/BFBwYD7RQ7sqrWjoQ9dKq+RkB/owjzyA0JziCxBdPlHDjqxNREX60hi0cnOx9fPaZ9c5p61emzDzNVjHqM+4mr5ZPf3beDF1W/2oo1XDH3poMhaVLGi/6KPMxNhQiXfOGDhRmkbJJS3sf3aFCRUxuwJ8dxuKiMiBALN900PTiBDUlpUZBEhB6ZeO9jlEvVbJg/dLVu27ucEwJ1IlUCAKfjK8c4qG7MJBmTagtGlp6OtI6ffJWklTca5IAHCWnoEuY3bpueOzl5ScSsXPBcPjkFWR9pMvYMLK51z5TrU3Vg1Pffp9nDRUlqk6kU1IHrQ4orXsjM2f4pFuhyL9IOSm4ioXZAwR70UWTlLN43KzvjBDkVjFaYlPsEEXslZWpYkmacLcNubUFMZ9G3loELJuJDUF5MyPLmC86voOVSw+p1TwSVM0iJ76ZaL1aS0VKGz6Tnz16er3pRnFX+3qXr6qfcypvTeMW3IBs75XPep/W/DHB6Qwtc06eZMS8LOmSMRMdS/2Qs9Pkr1JJ/BNf0cLe2U+w6mp78jmxFx4wzQDKfjHJikBGvGwMUfn2rbfKXi8fdnwpZSpHfrcY1tp7/gNH6gYxhdeDKxPE8jf3XW6nH3pPf131B/ODJ3YcF7m+R6WxD8zhlM1duCEveQzr52uIEZRmiPxb0pVkNt1Go42mjWHAQWxGEHFfywWXMIWb67hUZNwFNLwsYe6CkG6CrqrEgjE6YRBZCwlpI+hvQ7VcmfwxxHuRkQJ4mWkglC5mNNjq8X+Zc6nMi5dr3q7+a1Q/VhNMMkhDBqDhGBrxq4uKKfHGDcAW+G26UcWcDLR5Qbs8rGX+/v7nr4yJ6Gnfuq0+4jYN9JKxjjyhyUD5wzZguxV3H7mC68fVVXzWGmKC7Fm+zTumXQY0l8oO4Cu6Hm+aq12y9uClrQ04TUgrABSDalK6/MYz1SfartwCGXSBUWmJyLC+l5Xa9ypwO6kdIrWDBQYJJkEoGCAW7SPT3bt2WXZAIu7FTcUwvqk9YTXHHPucpUJZkeIFTgXL7Fb2FxjktawKtGX4Ql6+VoyGTcFr8g6Z24DD7rd2ldTZhnSaFjC2yfNmQtJPQYU8T8yikF9UKIoaKh9urI0YNXKV9rl2Qt2ngTNGgyZ9pCVlJk5W/LbKZFArx2/divvmIsLcXHjjTWMSNCuHda4CIZIXlAnqSQXG+5Y1z1ve3JG/SM067XktPSuMu3m7v0l6s4f2sXY4AAEtriHSHs+5FFkEAYMGQs1ZvssUJ1O3dMHrJF9hCbnMx34Yfcl0BBMDrjvbF9Yfa97k93sYavI88sGLuqjIi6fFK50QWw/zNNwIWk5YKcm2LJpp+6uvV8Iwt2ju2K/nz7pBESP7BJprhST11iHDnwNIymCvJzg5NGtDunFhLL4OVS2r9/P9NdKvO7dWbasEIkYWPUpQprgvgJNFnIp922sNg74NwXPWcMvVzL6HuhltbzJ6ov7c3sxZvezXmysi812T5j+HoRrr9XcXmZ6uum40tEPQbYUO9cSDVOVmEXE7k1IKo57e3L3DDO3vWk6N0bjkT2qOnK7QTy1P3lVhdB/481Iy1HeNg+ddibWKauAcYvc+kZ1SBoaNAz24XqS1kSPXrgCRB1Mg2qfFJeh7ZCuxJLjUhT+jw66Xy6o6KmVNcLmoDBiELqeeMjJf4B510HSy4Ch1mFWU58QI2irsy+4yPVexcjf5Xkxqm5jyA8tsIylAJmW3VM8bxSNTX7a1onpBongF1IFNjnvEQSTvMab7p8WpYZtqDNxIwnclc2SIMJa64EHTf85JS6zkjffJgU8Im16oSBCQ9EXFxfPeO5z1J89bVXQt0NZNFwtYhYK7bPyN3TNI9O4HRIWGrs0skraJsObt9N7YyMovvm+88+9zoNRBVG2M3ADFxqa9tQ3H5ftHrvp6ZgUwhCkOXbRMBtRcM24pa+MpE6KS+COgFxCksKmzRITmGOCHCHeeJ1O7rOCcJ9YUFzVnDsMhB1LNQ+M6L2nxYWrHp14oaJ+s43fyTyoaaDBRwLbgIxYejl9SpXz0zLs78NY3U0Lppv3tEzlfK03TYj+yMBmcToJCDl+/OkXZIIg8ZCBmjwZk7LWEniMykggXzASphHYoVYvlPCahoImzCYePt9C4pC/u/P/Imnz6BZ7vSepjAjIGq8ooiCqC472vilomijdk3JORDjQEyAAh70bQ56lGONCMCHJSKWMEfqqB/km3ZdyPCJ99366khj0JhdNvZ2d5I+MVwnBbPGsIRkqGV5y00+YnlcVljv+eu9p/hdHMSMEALLYYjiCwWEcclr89jkfVd+oBXy5wQR7y0wAVuOnXCw44vNntqMFOvzm/uFpXEZg+0QC8ZmQiIDNOFWZjtbU1vX7ZCwAkaaopDxCoLF0CIQ9iAA3X744FmaS/29v/cAMnSdvUGHsAbWUJcdaTxoaZ7zq3458AANBgg0EgmatXjTBKjJDBuUV7m5LjAlb9ed79+SHIl+NkjlKliRmxFm7HuqoOQA9ZcfgLQF2vqeFBakwP6s4LhrdI/yeLjWiLqTNVe4wZq+dGzp19SWz0EkZ3FFkeAKqbTBKOneGGXK1gObQyj/kgsBh197pXIaX+f0VYa+WiKZyk84EYPAoAwyZg5cWDEQNv/1aHvJ1oObT2ce5vXW11rotwZY3QncrRJKuDg49fyvHfwQpmOSCDhZ6Zuv4IpIFUKxVGFuKp90zjbphRxHWmmsHRJWdkE14ikukLi3InXLug+Z4NE8PsM2onAh5EMQ1aNjna1m3Dp/5y8HfpkTqHSVT8qJxomataSqOxfRd2ANjxCWwdwpmcz+eg+twdPD0ch5vmR3abTRYraB5btRNNxWPCoYMY17XvxxcHNr4kpJBVHpBARU7ytoZ7v8mitSZ769cHTpH2jY2Uu2jGNiy1OI3vSnMQozCtpCgIhRFeBf1c7iinYJNM5sGHorbWbfHJx2zlftSRDBO26KaSNqf7B7+pMg0mTVn8LIVZTuIsVlgCquqH24qg9B5lqrUcyFcXRP1VS+FAPjce024JSKXoqtvQ4fFm2xUpkGQxzhTngaj0vflcKznaSmNa1NHayXUlBj0krrp+L1UeQjP6lv9hhP2iktiaoTUSNHLDN6QdXUc74gSa0MgKjUgAVlPyDqfC21xwhYwzC0wiGz/iizhFxH2KLR/7mq8Ui0zDZtFqqJGpGQ6Wcqv8KO8orCZ0ZcRxJLxCV45NZQAOL2d8f3gBZZqeoAD+USbTTCgveXKnjoko0/Uzy+lVx39Ud/htVYa6BP2AJGFIgyhBGJ2OF6lB8zrGjIUv2p4xWhVuQsq+wrJfabBkvIKMMSI4ma0X2NlpIBy1UIq+GYgUhSlPpz+sXqj3E4YzpmgLFStOTuSxATnodJiN1HyyWuXLaqgAnrrYYagfYRYcM8cLnnZT9dMVjG3I8zPgmEkNU6kQxaFng4LrrgdAwuVR9z24PJfbJIRQOVspXBdbdum+FjsHQv2Dnr3N2OpDb7V45qw8QZu8CqO0qNiEAaV1XwqBJnHYag1K8ba6IMRFXCDaZdezgcxZWZUbvke3OH5xJxZQACbk0gwBTLJVbCWMqwDLsB7g3ga3csLHjm8++/9lqyIZS5UkKNCDGX7E/xJrkR/XJBY+i4uiE1tMmuYiIqCBCCdGXYUfNPKGNAHsRLjlneHu8nb3m5ZDpI6kQQ6iKztjpE+IGXoKAfFxjHHevXpXiS3IBH9XUQzzJrDxuqL/UOaJhryOagvhQLFiDDcRiO9ZB8fxssrkE5GnYuPc/PdOLglG8vdUhYqmxCeqS3I4QGorLG/Z/9oFvfgRfpvmTQ0MTAOIjq0vGsXuXKhVUzhn9CRI1LaqxDGhgMIUZ9wWiWXcoyKkfQwnk+v9j77LXr/9FYF30JNVUQlwTJFWlESBPjMKJRud2WdtQjGaEmf+xfPSlabqTBbIQK9kfqomsXFLy7hGDu/GpAd2A0XUA4cUtLBcc4uQjVvw4JnYKw5i12Q+1cSFA1mJIGRGrNS1IN5F+QtbTiStwjYBCUNgXyJ5zACgNtQ0ZNNYzBVl0+RO2MgwgBPmqHam+xQrVToSne5JrLwYGMwEFUKRIkrPvjHdlGBM+dT6wM48RyoiiOCpaxhHjttlfJZW2LnZJIFOLvZHEBCcxoZlLvLAiZCsIalgL1C+Q1wrm4aOuUEVXtELUJNFm52Wxg033rTL2WJP1iMxS5v/GY8kMQUzcNG0uL7UJXxL4Txv02ZySiR+tmrhq7yJeifz9UY0TAJz4QF5E3eyLBLMaZpiKe/TlU22eQjIEgYiPUnQ9R9Vu2Tct9LrHfwc9uWWiFI/+AJPShjuQzUkSWuBr5Nxx/PbFFx/nk/XWS4WCMrQdepqNfE3C9sDk2GiKUv2v6BbUJrZdmLam4W3X7HoGhSYTSUA/t+fDsJysGV83I3Wq5NayFEmRTsxgtmu47y0jxaa+CDdXbGDGYQkYHKgjL4povSbjTenAbSFBgFkPVRTCRUdunjdiSU9xGUtsB27FqW3HkMsRymf7HX276PBwyfkc1I42maYRNFo3YIKxgX+2umXbH38bf4k3VpzXCoUEH3JOsY4zi3idHl+0gg6qopFj2C0L/wm6sa3Bl9vExy3h927Shz8Hh95C7Q9dhCzambr1tyEEgbykYgNoQPEUaOYqSRQXl+990pINujpPiy03VtGF/Mmu/fok2PAiuzayJRNScpZVJ1K88owT3bvvhoY9hk+UQDDgSLkKxhZ0vSKTD/bZQ26UNbIoYffM7HVEriX0AlQMsL68X+/jDvaweSFWlikfPILQrBQFnVYXEcgXWMOqqI8FdGyVRixxDqdPeOnmIQAFfPpGZbBL6Cocera/Xfg6GzYyGTdLV2uHqCOuX0x1uC/sh3Boycm3dq7pgF328IH/VowRa7tyMgLtQWKxunzY82H9RRZao3vNTbvM36Tn5j3SNJSfP+dmSmHI9JS6G4NpCUhqxcJJiQmRL0YlDaH2lWqhdNW3oDdmLN/4FVOq1Y/o5G6ha5ZSc+sTqAxdeMxBVk+QOJvUA1nX2RXhyYr2u5lsRdk4TnOqjjYwUYIyuspxUMDZjILGm/dWaEqX29T/k40F55WM3ntjEm6B3kAFa8ybm6SsC5bWj7hgwh2tsiW0JC+uuknman509oge3ELxGomVTs6KQB9uSKlhuAPCYr4tdj/6LPnHvmn72PvQ0l3ojV0thkZ6gVD8o2/7Y9zwLWiAPavpCO0xqFL05UkvVE9OJzw3+pYykTRphVk0bTmeVGI3Do4Z7INrQh5vWWbAxzsY00TcbB6PKh/WXmKdZOuHgJ3be1XwLwgZiUN54o5zVRzSm6m7JwLKYkKlqtNCy/WuKee22j5iWf/kTZjR0mK198QVWGHCxkoB0b7o6GGpXvtw5Nfj+4zuXnje13xSo5WyPRwvnjOoF+wyMbdG8ueFN0X2hWmPuotFl5fHok+yX3A4gGESN5CzdOMy2ldtAwJGwTnpD1XTHukZ+pKwKt4N8W4rwtMCDfNiFH+n/klWLMcA3/Tnk/zrBGrPgXPTE0uVR/H4MnZQCjNJwPfmnLYlKfeI0Qhe6btOkmVNaPVIxgOYEZCrkVhl8/9q/8GPbPmTaKX1tWG5M9yY97/63KZdLohJxv32SUktgGuoa70rO8LORRVmebr2SdXeSR/emePWUnn4fDNhPcIT0Hqq3LH6ENEZUKhu0pOIJwd0bsYs0GZZpLhAKS1mYZNTA+rXplAIYlcHQAVFbhRE7xApBbj9JoiJilbPo49zspZursBPze+5J+jeuus4AfBcYyIDvSn3LQAlcLxRLF+GkSGjrUXXIqYmsBGGF2e5RQvt3b675+4qztLNz/TCuMGa3pamaquiut1zX3TuyriSwPgfErfyWkguplb5c5QsHX7/xD6l3ufR9vUJHrAjUL1AurGiDG9tLqc9hPRNkBcd3dlhRCZHEQoTmWTWlx63msUMW3BuaioCF6lJcSRqsUCDWbIDoHxSRxq3Aak+4HucB8VSvvUQcLrDeYsPge03uT4vgPYIFFBce+FTFQCi0jyhWTkdaMD5qq4CIcCNsBX2Tnj0E320vpPVTiO4ELAXdEMYg2/Ckpg4Jm9gLEGpxENZ72llvM1+yi7l9s1UrEgWuXPAPTcSHNU3TyzJvmnd+5fN3bsopLAZxi76lWia7mIsXb9gB/1WkYDyEeEIUfQGbhwMwAYpi23VxiaEwoupNIqJS/zoQxhW3R4HarTINcx4YslLXXXsbqg/VfB4oCNPmNSJU51n1UbKAmwiHfDyJeAivPLZVGX8QD//Bk5MJ+zdPIcjhglEQxig9shBCiftlUP9/wZbMXu5zfbn951l19Awx491MUbsxnOyTdU/izwkRVvYHXhPRSBLbWTZd7Zc9UYEOVnTdwjqsqapuah6/C9Rd12f678+vXFS0NScA4gaIuDRmosU3S3nLyrXyScwYvKj8HjVp98MxCcAxGmw5Wea+U1PezQrwCQ20ntGa2gRdWDeijG4lY3BNI6LuxX7DeYmWKTHC51RJ2L1j9alNmxQn3pCnNqeZprgVHsFZkLC9IMZ/YHNjf9x3z1qyaQBGUQBVS517SO0rvmQNqv++7dOHPdwa8NCnK3oYJkuF5qCRQve0rvHt7jtcTYCVll3BDYD/itWfCbc3abLiS8L65LbJwNLcHmhk3dB8yT5FdX3Y7/Y/DyWi0qQJdd9miCbXofRxkoPCfkJRbcrDCtp2ODlRdfIg7VHKBPcF+hBJqm3yDTGTN4mo5EsSochyrWY95Nwh0CMpwA62pfuWY3U2vK3BS7dkm5a9Q01OnwffdJKa1P0hpumfZD258aJ4lA1Bjf44hEZoI08TYDkRFTzIX6bBkA8b69tH91GDZ0PTpVFIkWpT2clM7UqsUatz7qHOEudJ0UBsvyHVvjrvDymF947W/Wk3IdobAXHdqtujQ3IR80z2Yd34IOvR1RdX3p1T3n/R23A7Lpfnnro2cNAPXA2mJsLBe7VBgFbGTgvApMKbEs5WyyEPoBIibqXzSDJB9uItP4R9cDHWPpii2GDD+i0fx1kmdgYLbt+LiPVmWvVfh4ASClEaILAfbtJ/gWBZ5B8LabM7GAMrE+4sBeFEmL9nAuZuqvO503cjXTCRR6gWUiKSZUGLn86ftqiaeNOSsA88QEYCw/HTKHbjEKxMxFFzswA2CAOc39Ljpnl5mj91CKJTURhXLsXt1WGkULzVK3T3BwOXbhq/Y8qwMqglzkpiC1EzGJkj679VUdtbx0LHYJo+rdtQXBf7qBBshIrhH57HWIjIo8P6hZC7xmA9e8iKGAt9qmpGFJaJmOuPwR8PxOK6qEogab4YEMJpyCDLBazcQXBORmCTAETn3hhKNNoZ4rrndHfjsQtRsww7Gp8ikkTrgtQEEg4YErCWQbJvMHlkq8f2e4Vq52BgD0FaL7QjIeK6lm/7wfugrp3ksMgJYCjeoOkaG0QcjnNSLrbD8DH2V2m+hKwYhZ3qz88JklsjvC59Aoj6tU47Jm4vTk74GAasM91tqp4kTRHK6kGLNxYSguiISFOvlCFiA384GtqewdKiavON0wb3Cp2CaC5vzsHQe54CGDI5TKPA4sXxKv+9ilvbE9aUHVA9OzVfSgBzg7VMq0VTgAAkJU0K4tD4kExN12K0at0fukJDy5bj3zplSBWqr4KbQ/UimDOFXCn0eibwuE7n3l3YLd/JPP5V2Hi4kGLD6BtEbdY+GA5TYvhAEB74apovDeUbpZbIRtNg7OAyZvgoOfAwPlzoT+4HgvukqjoD84Vka18sn7Xf5Uq+CO7YMWxVQWI9Ee7xm/ANoYjMRhAZHpyvOHvZtl4Os2ASdD6Z2kPKIVlY2fheKugoAXU24tT0mH4i1AZtawGPVBpo4Kzh8T3UbVNzV9mhun/XumWSRUyd4fS7sGhPFJW9GGsPEI38yTCIoOB8bRnU+2HUoxSC3UDXgxIuQpM4GrsZzXeBaQlXiNRLHERAFATuw0fskO9DakAJAjoVcOkUCSI7grZr0FPUwNeEVZyJ+xSMo5EYAqkGGyirsHVJG99wjeB5ED8xew89dLtP3Q/+rYnNlxjFlHuysPboOSglfzv6aUNYOnRFFuO26cM2cjtaKHdxvEl+LSmdGEjGMeWuRyBg5k1cpu+ef/1Ol9s/DDbSDj2jrxsbzBpUsYY1yYe166AVCV1bNWnQfoIJOUrFaUYGle3SUjJ9Zt2RXYYd+g8aXPnE9o9SQuh8WnI6NIHHA0J4wGioLX5LbQCzpbQXFspJV03LvdWqPbwMUqrTHigYDSdusE/mhEQZWasEC0R4SjGiP4OqzkDQHsdiU/zk54KV5hD8/hcPl0uVYOptkDCGOXlVt19FPTcRARHXSTt+nVVHcyPDaMfM3B2Koo5E3a/UpFQ3/Fn0q+voV8Ihhke5DwxRD+ftEvDlBj2jN22gu7TUU9zYSnyjavo5pU5Y8lQwrrgfuGLQfh609aigAc6ASjfqeDtPrdULzUemuJlP54JtxfgZBnEBOnqRdi/ifh1VJOKWL59k0EaAdcCYCG4cCT614Bass73ul3aQz0ZqDZKF1wIfxvNcECsMzv8UkaF52+n4aQAWaaBZJckB0AkBHP/Ae6Kj4eXdgbJ6BK4jqPV81fShpRQwwDfGvbKF85NQnrXo40uhESdh7Odi7N1RgeZ7FAJTDqW3vGrqkPdot8XwsKXQUOmwoA5jfEuqpuZ+3DTH2DjIMsbBg9lo3w9Q9sFYWrx98tBy2nCgE/nUORGYNAcI42uM6FOwV3Q1VNKZ6NuLL1w/5QvM+03bZSzdOWnE4UFLtmA3374Zq2oDVo8Pq4789XdyTrFlgHDmHO8RNwJntL67uK3eXzl9cEW7OKNBnEiigbapF+808UEnxzTahZHYlojaUWqvL6rbWRt6jnbEmJSlRPkBT2zIGLBsRwZJg1PqECKeb3FtNZ9EWIn12itvPd+Bj21PJp/1zGUbuiW2TRxHYrkUgnhBR/PsCC/xdrh2KLFNdQCczt7SRnKQzga3lqx4RXRGx0PojC69OSbPzJJ6ja2BsloTskuYPG9L+53tSV0cJl3Rf+Eg/NMLwjvx91Scvc/ESu3n40huXZ8IQmOMlRMTKHH4wUHVQp4pag0SxKb+CQf5OMMlbREsW62ryfsYLuTykjh/4BsE1eQ+L807NjdqU53JeLCA7AjHZojDbZoDxlWId5vkOz4tYcar/h+8EocT99P3BLj9OBg6vjA0AaB+A06/dCUr9zueyNPrdJDHe36C8+u0jxOE8f/VWmAAhKPNa9rrlF96BbEtMY+L+AA49ZsSORBgZPd3CjsgIAHHqdNiPv9/IzHQOVI3XOn7VVl+hqwJ5Mo33YBoIiKV0YvHt68bD3+xmTiSEPQM9ah+R8SOw5BwyvLJtOeS0FQAeJRvukdRrH5zHSojostnTt34PbWXYyXGaZXicBPGFqvrwIrDc9o3l6Fc1qPyFiBPoK/4uKjvhH4JDI/jKRGHLeB/05s4wqeUjumOf1i5H3/K8QS+C/E/DhPpTC/BQ/lsvAD1LuVJqumamGatGTd+Vtm4rVRG/1c4q/hCmPtkrDYTmu4p4a8ELkVdGW+kvVVZ9g7alI19b3ZwbDExCZW1RhwxDmkSetaU2oEff5bIDFTWGl68XsK1ibnjBEh45jAP9ZfQ58yyMc/NXj32WqqXONfO+orPOQ67dd1438D/j/FdTvVa14m3Tby2IUqRfOOtxHK7td44Mf5bOOEPY4b1mMLNvTN7TmaicrhYx//MolxGXOid1NtXjz8fuxR1tk87YCqK6TaUf4TN0HTqCK/+vcYy/R/MWn/hbzj/e/hXa8cMMk3ex6u7P5p78VtHgZkMOKPyEHTTwFz2A8ifxoUyrTG1JgMn/s0nJpQcuvP9kcmRkDcttPvofpx3estvpL8N4j7kq0v2u5g3aR5fsY/e56k/fOy0Jy5d+dnMtRN6uSNWY0hT+gQKVm6ld2dVd2S0omlb519aspekHV/pC9/5/rhTjXolbOvGYLc7aeO8Ua/X/WrN+EtwvuvTAA98SWObvWZ8H9wPthR7C8r2xcc7c/W4kZqbf4Ix4UyTOI3Kp394WfLMVZGRwN3mBWNKviQCoQ3CzozfuW5cL0W4QoYI98J+8rZpay/L1E3zXJsb6xcWlNTQS9q+Aek5hJv6lev/DnAN+J4GGgwi2DmZ1fASOk9tVBK9vkhN8KoFGUi7FhaU3regoHQuvgh2czek95dqlJ2LwMu9VA+S+5bF7RdslT/CItYhvdG4OmqYfREqexCIuAgTGwYD/kci7L8Mb8Sdjz24JYgv/zRiRtbf9bcr0vAiQC2iF3LHgzbNJ5fl94TFPx4IOMWy7QJDF3dbbvsh6suwvJcpOnspOas7xsKGgG1uSqpPHcVt7RqDGS9RnSOHjg3AFluQ8jg8ttDQ2Bc4fjf79jXj++Hd2fcQBboWZ45enl025ntE1LjGMQ3xKvNY7yuKMtcwGzdAY6zA+apHESfePBt/e0CaB6Gmf8cBzes0pq3GP7xdQX0AH28jbr/ciorngfiLIQh7qK4WMlZiNwz/AseLf7V67AQiqpQ0UAtBxlcx/53CVq6ftWr0ebptvCUUcRX+fmAFMU/ygNQrUO1xwJuIua+lfkALOuUYonxlfqakEeU7Sm0IW1lS2aSCECXxzCzLT73ztZEylAho7yBqA68SuxxCRDH5sYgyDQXRs/ClQ9YbMcAknPPFtoY4ff6lK9ejbBUGOBcvSr2SwsxNgtuPgylKAKt7xDZ+gNAxBiykuiWJeqogeAAwnwNx1ywcU/o0+vPBQ3EiTJb824Puv7t05VpEiNai/MH5+avKEJFCrE3GhRHfB+uAU5wJiwwIyKs4G3ULokZzUMeP8mdA8l2IPDn/j5QP3xwJ9dLw8xTmcRGukBBes2D0eyPhMr6O7d/ZCy569wjOmc1F+V9QnSJU19D84cEMnZ9fmrOg4L3L0W4vNjUsHrYCyOtcqNTX5xARXCFp22jaKAHTov2j8/Pf+w0Y52nM4wtEs5fRM1x//zu814s6z2AaJYCTM2PV6EvAJHTqQi49hVTxOKkNYeMSS+1wRDO6sCBYM++qdXW0ngFbNwELpThkhyw3MKAQOvdOhDEl+wERQHQc9CBhZ+FY3ykIW0tHvkbov4F6vds2eT0A4G0joAxvTaKufN799CRn4jjuALgOcbBFCPPXOeeL1zacQiBACETwbdkHGBB4YnR8BnslHKeumVv2rSBwztj7Ms8dGOjtdNx/AAC/Rj0u1aOsIEgitjt12S68CbmZ8qhyALOtnoHlhqv2s+AxYgT6My0DyO+GYdbINs5PDQiF1/gQ/gNm8d7g6Xj+N5y4uRuPycBzGBT/yINQIqlYStj5xhy50g8w/4j+fguGeRoVb8Q+ME6+sWMAqaA+4SbWXrbr9KcNYeMSCxWJeC87E528im+xvy7tU1BgBb0ljnXkFAzitIWj31uHjl/014XKqQ7yp6N/nHKzaE9NIhrE/wBIf4iMCkgy4qUsCWcLMnDtA8LghSi8nCWY1AjNI7XdmIUMduMdgGLkr54ZHPsCkDUHY5AGFtp8BCQ8PnPVuB8JE292IGYPtfgKVNgzyDuMwHgS4DuhPFWbCwJRvPUC4Gc81Cde92QirorRd7dEBsIrRWlyPGAYhBUcxnUkPhXwe9P8548uxaFwwTH3IPp+GS+GDcEzVbXFXDBzN/Qt++KWdRCw8D8bMctZoc0UkerAVx4E3qAF2XDQfpzKjR3EqDjP7cdPD7B4D+ANjMtdYBLSOGxbsBqgO09tCFtSWCK5Qg0ruyEVl2G1fxlr4l/xAsD3oE5/7IAz/4wN46kyz9nbmNutWI+wDvJqbiu18y8t3YgJFtFz/GnWvWDHqbSWzi8oDWBwD6K+G0I92mDWWxYzcVKQ/0TCKimRe3p4/+0FqLG7ZPsxq1fg+SgM9H0QFusa/ymV7z2cNgtSfQcQcOjJcaV7VEXJY0xZiTq3cU0tALJANjYDyCmm+gsuefcjw+BjMa4vgKf/DAlLSkwgPyi1BcZ0A04LrKO6YOg7cKBCWqCQ+ScVgy18cvTKD1EHFq+Sinc/J+JFwfuo7lH8SSl6AtMpz4VqzeGqsMsfH7P6U0VVClC+B21ewmvLH1Hd+Jv5kL2f8LAujc8FBSv/CP17HZB+GOWLQfEaCM8vgPfnMOewMKyREZNtNqL8XQiCxHl8zATzm6Z2OYI4Lm5+E8Cb4GdCEv8Lb5SvA9d+jCte9m2RWsCBKmrDSAm1ZV1IZHMb5GN+akI1ZBPr4LZJElrWar4jODHftrmw/VxivUS4ifl4y/bK6FmCFohX7fDaEYwOG7Sae0f1/huW/BreBCw+DgAAAABJRU5ErkJggg=="
  successLogo = "data:image/png;base64,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"

  errorLogo = "data:image/png;base64,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"
  bbpsLogo = "data:image/png;base64,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"


}
