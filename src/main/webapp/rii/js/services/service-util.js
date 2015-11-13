/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var genericUtilService = angular.module("genericUtilService", []);

// Create Generic Util Service
genericUtilService.factory("utilService", function($rootScope) {
	//private functions
	var getId = function(id) {
		var itemId = 0;
		if(id) {
			itemId = id;
			if(!isNaN(id)) {//is number
				itemId = parseInt(id);
			}
		}
		return itemId;
	},
	isNumber = function(num) {
		return (!isNaN(num) && num > 0);
	},
	isString = function(str) {
		return ((typeof str == 'string') || (str instanceof String));
	},
	getDate = function(strDate) {
		var newStrDate = getStrDateYYYYMMDD(strDate);
		var date = (isString(newStrDate) ? (new Date(newStrDate)) : (new Date()));
		return date;
	},
	endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	getDateMilliseconds = function(strDate) {
		var dateMilli = (isString(strDate) ? (Date.parse(strDate)) : ((new Date()).getMilliseconds()));
		return dateMilli;
	},
	isValidDate = function(strDate) {
		var date = getDate(strDate);
		return !isNaN(date);
	},
	convertDate = function(strDate) {
		var dateMilli = strDate;
		if(strDate && isString(strDate)) {
			var newStrDate = getStrDateYYYYMMDD(strDate);
			dateMilli = getDateMilliseconds(newStrDate);
		}
		
		return (new Date(dateMilli));
	},
	convertDateMilli = function(strDate) {
		var newStrDateMilli = strDate;
		if(strDate && isString(strDate)) {
			var newStrDate = getStrDateYYYYMMDD(strDate);
			newStrDateMilli = getDateMilliseconds(newStrDate);
		}
		
		return newStrDateMilli;
	},
	getStrDateYYYYMMDD = function(strDate) {
		var newDate = strDate;
		if(strDate && isString(strDate)) {
			var dateArray = strDate.split('-'),
			day = dateArray[2].substring(0, 2),
			newDate = dateArray[0] + '-' + dateArray[1] + '-' + day;
		}
		return newDate;
	},
	getStrDateDDMMYYYY = function(strDate) {
		var date = convertDate(strDate),
		year = date.getFullYear(),
		month = date.getMonth(),
		day = date.getDate(),
		str = day + "/" + (month + 1) + "/" + year;
		
		return str;
	},
	addDays = function(date, days) {
		var newDate = new Date(date);
		newDate.setDate(date.getDate() + days);
		
		return newDate;
	},
	minusDateMonth = function(date, months) {
		var newDate = new Date(date);
		newDate.setUTCMonth(date.getUTCMonth() - months);
		
		return newDate;
	},
	getScreenSize = function() {
		var w = 0,h = 0;
		
		// IE
		if (!window.innerWidth) {
			if (!(document.documentElement.clientWidth == 0)) {
				// strict mode
				w = document.documentElement.clientWidth;
				h = document.documentElement.clientHeight;
			} else {
				// quirks mode
				w = document.body.clientWidth;
				h = document.body.clientHeight;
			}
		} else {
			// w3c
			w = window.innerWidth;
			h = window.innerHeight;
		}
		
		return {
			width : w,
			height : h
		};
	},
	removeDuplicateList = function(items) {
		var tmp = [];
		for (var i = 0; i < items.length; i++) {
			if (tmp.indexOf(items[i]) == -1) {
				tmp.push(items[i]);
			}
		}

		return tmp;
	},
	removeDuplicateArrayByID = function(currentArray) {
		var newArray = [];
		again : for (var i = 0; i < currentArray.length; i++) {
			for (var j = 0; j < newArray.length; j++) {
				if(newArray[j].id = currentArray[i].id)
					continue again;
			}
			newArray[newArray.length] = currentArray[i];
		}
		return newArray;
	},
	sortArrayAsc = function(arr) {
		arr.sort(function(a, b) {
			return a - b;
		});
		
		return arr;
	},
	sortArrayDesc = function(arr) {
		arr.sort(function(a, b) {
			return b - a;
		});
		
		return arr;
	},
	sortListAscById = function(items) {
		items.sort(function(item1, item2) {
			return (item1.id - item2.id);
		});
		
		return items;
	},
	sortListDescById = function(items) {
		items.sort(function(item1, item2) {
			return (item2.id - item1.id);
		});
		
		return items;
	},
	convertByteArrayToBase64 = function(byteArray) {
		//Get content data from Content-Type:application/octet-stream in jersey
		//it is bye array in java
		//now convert it into base64 in javascript
		
		var binary = '',
		bytes = new Uint8Array( byteArray ),
		len = bytes.byteLength;
		
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		
		//convert binary to base64
		var base64 = window.btoa( binary );
		
		//references:
		//http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
		//https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64.btoa
		
		return base64;
	},
	getImageUrlBase64 = function(byteArray) {
		//convert binary to base64
		var getBase64 = convertByteArrayToBase64(byteArray);
		
		return 'data:image/png;base64,' + getBase64;
	},
	isEmptyObject = function(object) {
		for(var key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	},
	isValidObject = function(object) {
		return (!isEmptyObject(object));
	};
	
	return{
		// public functions
		getId : getId,
		getDate : getDate,
		addDays : addDays,
		isString : isString,
		isNumber : isNumber,
		endsWith : endsWith,
		isValidDate : isValidDate,
		convertDate : convertDate,
		sortArrayAsc : sortArrayAsc,
		isValidObject : isValidObject,
		isEmptyObject : isEmptyObject,
		getScreenSize : getScreenSize,
		sortArrayDesc : sortArrayDesc,
		minusDateMonth : minusDateMonth,
		sortListAscById : sortListAscById,
		sortListDescById : sortListDescById,
		convertDateMilli : convertDateMilli,
		getImageUrlBase64 : getImageUrlBase64,
		getStrDateYYYYMMDD : getStrDateYYYYMMDD,
		getStrDateDDMMYYYY : getStrDateDDMMYYYY,
		getDateMilliseconds : getDateMilliseconds,
		removeDuplicateList : removeDuplicateList,
		convertByteArrayToBase64 : convertByteArrayToBase64,
		removeDuplicateArrayByID : removeDuplicateArrayByID
	};
});

// Create Base 64 Service
genericUtilService.factory("base64Service", function($rootScope) {
	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	return {
		encode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output + keyStr.charAt(enc1)
						+ keyStr.charAt(enc2)
						+ keyStr.charAt(enc3)
						+ keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window.alert("There were invalid base64 characters in the input text.\n"
							+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
							+ "Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};
});
