/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Contacts Controller
issueTrackerApp.controller("ContactsController", function($scope, $modal, $log, $timeout, pageService, contactService, inputFileService) {
	//console.log("ContactsController...");
	var newPage = {
		isDetailPage : false,
		title : "Contacts List",
		createLabel : "New Contact",
		createUrl : "setting/contacts/newID",
		uploadLabel : "Click to upload Contacts",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadContactList = function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.contacts = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		contactService.loadContacts(function(contacts, message) {
			$scope.contacts = contacts;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.contacts.length / $scope.pageSize);
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadContactList();
	
	//Upload Excel file
	var doNewAction = function() {
		$timeout(function() {
			var fileSelector = inputFileService.getSelectorById("fileElement");
			inputFileService.loadFileDialog(fileSelector);
			
			inputFileService.addFileSelectedListener(fileSelector, function() {
				if (this.files && this.files.length > 0) {
					var file = this.files[0],
					fileName = file.name,
					fileSize = parseInt(file.size / 1024),
					requestData = {
						fileId : 0,
						fileRequest : file,
						fileSize : file.size
					};
					console.log("Üpload file's size: " + fileSize + "KB");
					
					if (fileName.indexOf("Contact") > -1) {
						contactService.uploadContactCsv(requestData, function(data, message) {
							//console.log(data);
							//console.log(message);
							loadContactList();
						});
					} else {
						alert("Your file is not Contact Excel file!");
					}
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	$scope.doDeleteContact = function(id, size) {
		var item = {
				id : id,
				confirm : "contact"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModalDeleteContactInstanceCtrl,
			size : size,
			resolve : {
				item : function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal for delete Contact dismissed at: ' + new Date());
		});
		
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

//Create Contact Detail Controller
issueTrackerApp.controller("ContactDetailController", function($scope, $routeParams, $location, $timeout, pageService, contactService, photoService, utilService, inputFileService) {
	var contactId = utilService.getId($routeParams.contactId),
	contact = {id : contactId},
	createLabel = "Save New Contact",
	isUpdateContact = false;
	
	//Make sure it is old data, then make update flag as true
	if (utilService.isNumber(contactId)) {
		isUpdateContact = true;
		createLabel = "Update Contact";
	}
	
	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	
	if (isUpdateContact) {
		//Get AssignedTo by Contact ID
		(function() {
			contactService.loadAssignedToList(contactId, function(assignedToIssues, message) {
				$scope.assignedToIssues = assignedToIssues;
			});
		})();//auto execute function
		
		//Get Opened by Contact ID
		(function() {
			contactService.loadOpenedByList(contactId, function(openedByIssues, message) {
				$scope.openedByIssues = openedByIssues;
			});
		})();//auto execute function
		
		//Get Contact by Contact ID
		(function() {
			contactService.loadContact(contactId, function(contact, message) {
				$scope.contact = contact;
				
				//Get Byte Array Photo by ID
				var photoId =contact.attachment ? contact.attachment : -1;
				if (photoId > 0) {
					//load image from byte Array to display on page
					photoService.getByteArrayPhoto(photoId, function(data, message) {
						$scope.isNewUploadImage = false;
						$scope.imageSource = utilService.getImageUrlBase64(data);
					});
				}
				
			});
		})();//auto execute function
	} else {
		//New Data
		$scope.contact = contact;
	}
	
	//Test Photo
//	photoService.getLastByteArrayPhoto(function(data, message) {
//		$scope.isNewUploadImage = false;
//		$scope.imageSource = utilService.getImageUrlBase64(data);
//	});
	
	//Upload Image
	$scope.imageSource = "";
	$scope.isNewUploadImage = true;
	$scope.openFileDialog = function() {
		$timeout(function() {
		var fileSelector = inputFileService.getSelectorById("contactAttachment");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			$scope.isNewUploadImage = false;
				var files = this.files,
				photoId = ($scope.contact.attachment ? $scope.contact.attachment : 0);
				
				if (files && files.length > 0) {
					var file = files[0],
					fileName = file.name,
					fileSize = parseInt(file.size / 1024),
					requestData = {
						fileId : photoId,
						fileRequest : file,
						fileSize : file.size
					};
					console.log("Üpload file's size: " + fileSize + "KB");
					
					//check to make sure it is not the same file's name
					if (!(fileName === $scope.contactAttachmentName)) {
						photoService.uploadPhoto(requestData, function(data, message) {
							if (photoId > 0) {
								//Old Upload Photo
								$scope.contact.attachment = photoId;
								
								//load image from byte Array to display on page
								photoService.getByteArrayPhoto(photoId, function(data, message) {
									$scope.imageSource = utilService.getImageUrlBase64(data);
								});
								
							} else {
								//New Upload Photo
								photoService.getLastPhoto(function(data, message) {
									var newPhotoId = data.id;
									$scope.contact.attachment = newPhotoId;
									
									if (newPhotoId > 0) {
										//load image from byte Array to display on page
										photoService.getByteArrayPhoto(newPhotoId, function(data, message) {
											$scope.imageSource = utilService.getImageUrlBase64(data);
										});
									}
									
								});
								
							}
							//console.log(message);
						});
						
					}
					
					$scope.contactAttachmentName = fileName;
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	var newPage = {
		isDetailPage : true,
		title : "Contact Details",
		createLabel : createLabel,
		isDisplaySaveBtn : isUpdateContact,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var contacts = contactService.getContacts(),
		newContactId = contacts.length + 1,
		newContact = {
			id : isUpdateContact ? contactId : newContactId,
			firstName : $scope.contact.firstName,
			lastName : $scope.contact.lastName,
			company : $scope.contact.company,
			jobTitle : $scope.contact.jobTitle,
			emailAddress : $scope.contact.emailAddress,
			webPage : $scope.contact.webPage,
			businessPhone : $scope.contact.businessPhone,
			homePhone : $scope.contact.homePhone,
			mobilePhone : $scope.contact.mobilePhone,
			faxNumber : $scope.contact.faxNumber,
			address : $scope.contact.address,
			city : $scope.contact.city,
			stateProvince : $scope.contact.stateProvince,
			zipPostalCode : $scope.contact.zipPostalCode,
			countryRegion : $scope.contact.countryRegion,
			note : $scope.contact.note,
			attachment : $scope.contact.attachment ? $scope.contact.attachment : -1
		};
		//console.log(newContact);
		
		if (isUpdateContact) {
			contactService.updateContact(newContact, function(data, message) {
				alert(message);
				$location.path("/setting/contacts");//redirect to contacts page
				//$location.reload();
			});
		} else {
			//createContactPost
			contactService.createContact(newContact, function(data, message) {
				alert(message);
				$location.path("/setting/contacts");
				//$location.reload();
			});
		}
	};
	
	//Overide on page service
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

var ModalDeleteContactInstanceCtrl = function($scope, $modalInstance, item, contactService) {

	$scope.item = item;

	$scope.ok = function() {
		contactService.deleteContact(item.id, function(data, message) {
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
