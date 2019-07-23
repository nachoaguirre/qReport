var pictureSource;
var destinationType;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	pictureSource   = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	console.log("init: " + JSON.stringify(navigator.camera.PictureSourceType) + ' 2: '+ JSON.stringify(navigator.camera.DestinationType) );
}

function clearCache() {
    navigator.camera.cleanup();
}

var retries = 0;
function onCapturePhoto(fileURI) {
	//alert("func oncapturephoto");
    var win = function (r) {
	    //alert("func win");
        clearCache();
        retries = 0;
        $('#box-info').hide();
        $('#box-ok').html("Imagen asociada al reporte satisfactoriamente. <a href='home.html'>Volver</a>");
		$('#box-ok').fadeIn();
		$('div.subirfoto').fadeOut();
    }
 
    var fail = function (error) {
	    //alert("func fail");
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            $('#box-info').hide();
            $('#box-error').html('<strong>Error:</strong> No se pudo cargar la imagen :(');
			$('#box-error').fadeIn();
        }
    }
	var elID = $('div.subirfoto').attr('data-reporte');
    //alert('id del reporte: ' + elID);
    var options = new FileUploadOptions();
    $('#box-info').html("Cargando imagen al servidor... esto puede demorar unos minutos");
    $('#box-info').show();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI("http://#URL#/asistencia/getmobilepic/"+elID), win, fail, options);
}



$("#capturep").on('click', function(e){
	e.preventDefault();
	alert("capturep");
	$('#box-info').hide();
	$('#box-ok').hide();
	$('#box-error').hide();
	capturePhoto();
});
$("#getp").on('click', function(e){
	e.preventDefault();
	alert("getp");
	$('#box-info').hide();
	$('#box-ok').hide();
	$('#box-error').hide();
	getPhoto();
});


function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI
    });
}

function getPhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY
    });
}

function onFail(message) {
	$('#box-error').html('<strong>Error:</strong> '+message);
	$('#box-error').fadeIn();
}