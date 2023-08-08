import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { DigitOnlyDirective, NumberDirective, NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { alphaNumericDirective,AlphaNumericAllowedSpecialChars, NotAllowSpace } from '../directives/aplha-numeric.directive';
import { DatePatternDirective } from '../directives/date-pattern.directive';
import { passwordDirective } from '../directives/password.directive';
import { AlphabetsOnlyDirective,AlphabetsNSpaceOnlyDirective, AlphaNumericOnlyDirective,AlphaSpecialCharOnlyDirective,AlphabetNNumberOnlyDirective,UpidOnlyDirective, } from '../directives/alphabets-only.directive';
import { AppConstants } from '../app.constant';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {CustomCurrencyPipe,DynamicCurrencyPipe,FilterPipe } from '../pipes/custom-currency.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AmountOnlyDirective } from '../directives/numbers-only.directive';
import { DateAgoPipe, OrdinalDatePipe } from '../pipes/date-ago.pipe';
import { DatePipe } from '@angular/common';
import { DateFormatPipe, FormatDatePipe, FormatTimerPipe, TimeFormatPipe } from '../pipes/date-formatter.pipe';
import { FirstLastChar } from '../pipes/first-last-char.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE  } from 'ng-pick-datetime-ex';
import { AllowTwoDigitDecimalNumbersDirective } from '../directives/allow-two-digit-decimal-numbers.directive';
import { MaskAccountNoPipe } from '../pipes/mask-account-no.pipe';
import {LimitDirectiveDirective} from '../directives/limit-directive.directive'
import {SearchFilterPipe} from '../pipes/search-filter.pipe'
import {BreadcrumbModule} from 'src/app/pages/common-ui/breadcrumb/breadcrumb.module'
import {BannerModule} from 'src/app/pages/common-ui/banner/banner.module'
@NgModule({
  declarations: [DatePatternDirective, 
    SearchFilterPipe,
    NumbersOnlyDirective,
    NumberDirective,
    alphaNumericDirective,
    AlphabetsNSpaceOnlyDirective,
    AlphabetsOnlyDirective,
    CustomCurrencyPipe,
    TranslatePipe,
    AlphaNumericOnlyDirective,
    FilterPipe,
    AlphaSpecialCharOnlyDirective,
    AlphabetNNumberOnlyDirective,
    UpidOnlyDirective,
    passwordDirective,
    AmountOnlyDirective,
    DigitOnlyDirective,
    DateAgoPipe,
    AlphaNumericAllowedSpecialChars,
    NotAllowSpace,
    DynamicCurrencyPipe,
    FormatDatePipe,
    DateFormatPipe,
    TimeFormatPipe,
    FormatTimerPipe,
    FirstLastChar,
    OrdinalDatePipe,
    AllowTwoDigitDecimalNumbersDirective,
    MaskAccountNoPipe,
    LimitDirectiveDirective,  
  ],
  imports: [
    CommonModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
  ],
  exports: [
    BreadcrumbModule,
    BannerModule,
    DatePatternDirective,
    NumbersOnlyDirective,
    NumberDirective,
    alphaNumericDirective,
    AlphabetsOnlyDirective,
    AlphabetsNSpaceOnlyDirective,
    CustomCurrencyPipe,
    TranslatePipe,
    AlphaNumericOnlyDirective,
    FilterPipe,
    AlphaSpecialCharOnlyDirective,
    AlphabetNNumberOnlyDirective,
    UpidOnlyDirective,
    passwordDirective,
    DynamicCurrencyPipe,
    AmountOnlyDirective,
    DigitOnlyDirective,
    DateAgoPipe,
    AlphaNumericAllowedSpecialChars,
    LimitDirectiveDirective,
    NotAllowSpace,
    DatePipe,
    FormatDatePipe,
    DateFormatPipe,
    SearchFilterPipe,
    TimeFormatPipe,
    FormatTimerPipe,
    FirstLastChar,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    AllowTwoDigitDecimalNumbersDirective,
    MaskAccountNoPipe,
    

  ],
  providers:[AppConstants,CustomCurrencyPipe,TranslatePipe,FilterPipe,TitleCasePipe,DateAgoPipe,DatePipe,DynamicCurrencyPipe,OrdinalDatePipe, {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB'}]
})
export class SharedModule { }

