$(document).ready(function(){
	
	/*
	 * SUBMIT LOGIN FORM
	 */
	$('#btnlogin').on('click', function(e){
		e.preventDefault();
		$('#box-info').hide();
		$('#box-ok').hide();
		$('#box-error').hide();
		$.ajax({
			type: 'POST', 
			url: '#',
			data: $('#loginform').serialize(),
			beforeSend: function() {
				$('#box-info').html('<i class="glyphicon glyphicon-hourglass"></i> Enviando datos...');
				$('#box-info').show();
			},
			success: function(data){
				if(data == "deshabilitado"){
					$('#box-info').hide();
					$('#box-error').html("<strong>Error:</strong> Ya no tienes acceso para ingresar aquí. Sorry dude ;)");
					$('#box-error').show();
				} else if(data == "incorrecto") {
					$('#box-info').hide();
					$('#box-error').html("<strong>Error:</strong> Usuario y Clave no concuerdan... cueec!");
					$('#box-error').show();
				} else {
					$('#box-info').hide();
					$('#box-ok').html("Datos correctos... Redirigiendo...");
					$('#box-ok').show();
					$('#loginform').hide();
					var json = JSON.parse(data);
					window.localStorage.setItem("id", json['id']);
					window.localStorage.setItem("nombre", json['nombre']);
					window.localStorage.setItem("usuario", json['usuario']);
					window.localStorage.setItem("email", json['email']);
					window.localStorage.setItem("grupo", json['grupo']);
					window.localStorage.setItem("identificado", "true");
					window.location.href = "home.html";
				}
			},
			error: function(data){
				console.log('error data: ' + JSON.stringify(data));
				$('#box-info').hide();
				$('#box-error').html("<strong>Error2:</strong> " + JSON.stringify(data));
				$('#box-error').show();
			}
		});
	});


	/*
	 * SELECT SERVICIO
	 */
	$("select.servicio").on('change', function(){
		switch(this.value) {
			case 'preventiva':
				$('section.preventiva').show();
				$('section.correctiva, section.upgrade, section.otros').hide();
				break;
			case 'correctiva':
				$('section.correctiva').show();
				$('section.preventiva, section.upgrade, section.otros').hide();
				break;
			case 'upgrade':
				$('section.preventiva, section.correctiva, section.otros').hide();
				$('section.upgrade').show();
				break;
			case 'otros':
				$('section.preventiva, section.correctiva, section.upgrade').hide();
				$('section.otros').show();
				break;	
			default:
				$('section.preventiva, section.correctiva, section.upgrade, section.otros').hide();
		}
		$(".navbtn2").fadeIn();
	});
	
	
	
	/*
	 * SELECT REPRESENTANTE
	 */
	$('select.representante').on('change', function(){
		switch(this.value) {
			case 'Si': $('.si_representante').show(); break;
			case 'No': $('.si_representante').hide(); break;
			default:   $('.si_representante').hide();
		}
		$(".navbtn3").fadeIn();
	});
	
	
	
	/*
	 * BOTONERA FORM
	 */
	$('.menubtn').on('click', function (){
		if( $(this).hasClass('active') ) { return; }
		$('.menubtn').removeClass('active');	
		$(this).addClass('active');
		$('section').slideUp();
		$('section.'+$(this).data('section')).slideDown();
		$('.menubtn').each(function(){ 
			//var cual = $(this).data('section');
			/* if( revisaSection(cual) == true) { $(this).children(":first").append('<i class="glyphicon glyphicon-ok"></i>'); } */
		});
	});
	
	function revisaSection(section) {
		var isValid = true;
		$('section.'+section+' input, section.'+section+' select').each(function() {
			var element = $(this);
			if(element.val() == '') { isValid = false; }
		});
		console.log(section + ': '+ isValid);
		//if(isValid == true) { $("[data-section='"+section+"'] a").append(' <i class="glyphicon glyphicon-ok"></i>'); }
		return isValid;
	}
	
	$('.navbtn').on('click', function(){
		
		var step   = $(this).attr('step');
		var target = $(this).attr('data-section');
		$('.menubtn').removeClass('active');
		$('.menubtn [data-section="'+target+'"]').addClass('active');		
		$('section').slideUp();
		$('section.'+$(this).data('section')).slideDown();
	});
	
	
	/*
	 * SUBMIT FORM
	 */
	$('#enviar_form').on('click', function(e){
		$('#box-info').hide();
		$('#box-ok').hide();
		$('#box-error').hide();
		e.preventDefault();
		$.ajax({
			type: 'POST', 
			url: '#',
			data: $('#form').serialize(),
			beforeSend: function() {
				$('#box-info').html('<i class="glyphicon glyphicon-hourglass"></i> Enviando formulario...');
				$('#box-info').fadeIn();
			},
			success: function(data){
				console.log('success data: ' + data);
				if(isFinite(data)){
					$('#box-info').fadeOut();
					$('#box-ok').html("Reporte #"+data+" guardado. Ahora puedes asociarle una foto o <a href='home.html'>volver al inicio</a>.");
					$('#box-ok').fadeIn();
					$('#form').hide();
					$('div.subirfoto').attr('data-reporte', data);
					$('div.subirfoto').fadeIn();
				} else {
					$('#box-info').fadeOut();
					$('#box-error').html("<strong>Error:</strong> " + JSON.stringify(data));
					$('#box-error').fadeIn();
				}
			},
			error: function(data){
				console.log('error data: ' + JSON.stringify(data));
				$('#box-info').fadeOut();
				$('#box-error').html("<strong>Error:</strong> " + JSON.stringify(data));
				$('#box-error').fadeIn();
			}
		});
	});
	
	
	/*
	 * GPS
	 */
	var lat = 0;
	var lng = 0;
	function getLocation() { navigator.geolocation.getCurrentPosition(gpsOk, gpsError, { enableHighAccuracy: true }); }

	function gpsOk(position) {
    	lat = position.coords.latitude;
		lng = position.coords.longitude;
		$('.gps').val(lat+', '+ lng);
	}
	function gpsError(error) { console.log('Error GPS: code: ' + error.code + '\n' + 'message: ' + error.message + '\n'); }
	getLocation();
	
	
	
	/*
	 * MOMENT FECHA
	 */
	$('#moment_fecha').datetimepicker(   { format: 'dd/MM/yyyy', pickTime: false });
    $('#moment_entrada').datetimepicker( { format: 'hh:mm',      pickDate: false, pickSeconds: false });
    $('#moment_salida').datetimepicker(  { format: 'hh:mm',      pickDate: false, pickSeconds: false  });
	
	$("#btn_salir").on('click', function(e){
		e.preventDefault();
		//localStorage.clear();
		window.localStorage.removeItem("id");
		window.localStorage.removeItem("nombre");
		window.localStorage.removeItem("email");
		window.localStorage.removeItem("grupo");
		window.localStorage.removeItem("identificado");
		window.location.href = "index.html";
	});


});