/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var genericDatePickerService = angular.module("genericDatePickerService", []);

// Create Date Picker Service
genericDatePickerService.factory("datePickerService", function($rootScope){
	//private variables
	var strDDMM = "01/01/",
	currentDate = new Date(),
	currentYear = currentDate.getFullYear(),
	dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	},
	formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ],
	
	//private functions
	addCurrentYear = function(numberOfYear){
		return currentYear + numberOfYear;
	}
	minusCurrentYear = function(numberOfYear){
		return currentYear - numberOfYear;
	},
	getDateAdd = function(numberOfYear){
		var strDate_add = strDDMM + addCurrentYear(numberOfYear);
		
		return new Date(strDate_add);
	},
	getDateMinus = function(numberOfYear){
		var strDate_minus = strDDMM + minusCurrentYear(numberOfYear);
		
		return new Date(strDate_minus);
		
	},
	getDateOptions = function(){
		return dateOptions;
	},
	setDateOptions = function(newDateOptions){
		dateOptions = newDateOptions;
	},
	getFormats = function(){
		return formats;
	},
	getFormat = function(index){
		return formats[index];
	},
	addFormat = function(newFormat){
		formats.push(newFormat);
	},
	removeFormat = function(index){
		formats.splice(index, 1);
	},
	
	initDate = function(date){
		return new Date(date);
	},
	// Disable weekend selection
	disabled = function(date, mode){
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	};
	
	return{
		//public functions
		initDate : initDate,
		disabled : disabled,
		addFormat : addFormat,
		getFormat : getFormat,
		getDateAdd : getDateAdd,
		getFormats : getFormats,
		removeFormat : removeFormat,
		getDateMinus : getDateMinus,
		getDateOptions : getDateOptions,
		setDateOptions : setDateOptions,
		addCurrentYear : addCurrentYear,
		minusCurrentYear : minusCurrentYear
	};
});