/*
Name: 			Forms
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version:	11.1.0
*/

(($ => {
    /*
	Custom Rules
	*/

    // No White Space
    $.validator.addMethod("noSpace", (value, element) => {
		if( $(element).attr('required') ) {
			return value.search(/^(?! *$)[^]+$/) == 0;
		}

		return true;
	}, 'Please fill this empty field.');

    /*
	Assign Custom Rules on Fields
	*/
    $.validator.addClassRules({
	    'form-control': {
	        noSpace: true
	    }
	});

    /*
	Contact Form: Basic
	*/
    $('.contact-form').each(function(){
		$(this).validate({
			errorPlacement(error, element) {
				if(element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
					error.appendTo(element.closest('.form-group'));
				} else if( element.is('select') && element.closest('.custom-select-1') ) {
					error.appendTo(element.closest('.form-group'));
				} else {
					if( element.closest('.form-group').length ) {
						error.appendTo(element.closest('.form-group'));
					} else {
						error.insertAfter(element);
					}
				}
			},
			submitHandler(form) {

				const $form = $(form), $messageSuccess = $form.find('.contact-form-success'), $messageError = $form.find('.contact-form-error'), $submitButton = $(this.submitButton), $errorMessage = $form.find('.mail-error-message'), submitButtonText = $submitButton.val();

				$submitButton.val( $submitButton.data('loading-text') ? $submitButton.data('loading-text') : 'Loading...' ).attr('disabled', true);

				// Fields Data
				const formData = $form.serializeArray(), data = {};

				$(formData).each((index, {name, value}) => {
					if( data[name] ) {
						data[name] = data[name] + ', ' + value;						
					} else {
						data[name] = value;
					}
				});

				// Google Recaptcha v2
				if( data["g-recaptcha-response"] != undefined ) {
					data["g-recaptcha-response"] = $form.find('#g-recaptcha-response').val();
				}

				// Ajax Submit
				$.ajax({
					type: 'POST',
					url: $form.attr('action'),
					data
				}).always(({response, errorMessage, responseText}, textStatus, jqXHR) => {

					$errorMessage.empty().hide();

					if (response == 'success') {

						// Uncomment the code below to redirect for a thank you page
						// self.location = 'thank-you.html';

						$messageSuccess.removeClass('d-none');
						$messageError.addClass('d-none');

						// Reset Form
						$form.find('.form-control')
							.val('')
							.blur()
							.parent()
							.removeClass('has-success')
							.removeClass('has-danger')
							.find('label.error')
							.remove();

						if (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
							$('html, body').animate({
								scrollTop: $messageSuccess.offset().top - 80
							}, 300);
						}

						$form.find('.form-control').removeClass('error');

						$submitButton.val( submitButtonText ).attr('disabled', false);
						
						return;

					} else if (response == 'error' && typeof errorMessage !== 'undefined') {
						$errorMessage.html(errorMessage).show();
					} else {
						$errorMessage.html(responseText).show();
					}

					$messageError.removeClass('d-none');
					$messageSuccess.addClass('d-none');

					if (($messageError.offset().top - 80) < $(window).scrollTop()) {
						$('html, body').animate({
							scrollTop: $messageError.offset().top - 80
						}, 300);
					}

					$form.find('.has-success')
						.removeClass('has-success');
						
					$submitButton.val( submitButtonText ).attr('disabled', false);

				});
			}
		});
	});

    /*
	Contact Form: Advanced
	*/
    $('#contactFormAdvanced').validate({
		onkeyup: false,
		onclick: false,
		onfocusout: false,
		rules: {
			'captcha': {
				captcha: true
			},
			'checkboxes[]': {
				required: true
			},
			'radios': {
				required: true
			}
		},
		errorPlacement(error, element) {
			if(element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
				error.appendTo(element.closest('.form-group'));
			} else if( element.is('select') && element.closest('.custom-select-1') ) {
				error.appendTo(element.closest('.form-group'));
			} else {
				error.insertAfter(element);
			}
		}
	});

    /*
	Contact Form: reCaptcha v3
	*/
    $('.contact-form-recaptcha-v3').each(function(){
		$(this).validate({
			errorPlacement(error, element) {
				if(element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
					error.appendTo(element.closest('.form-group'));
				} else if( element.is('select') && element.closest('.custom-select-1') ) {
					error.appendTo(element.closest('.form-group'));
				} else {
					error.insertAfter(element);
				}
			},
			submitHandler(form) {

				const $form = $(form), $messageSuccess = $form.find('.contact-form-success'), $messageError = $form.find('.contact-form-error'), $submitButton = $(this.submitButton), $errorMessage = $form.find('.mail-error-message'), submitButtonText = $submitButton.val();

				$submitButton.val( $submitButton.data('loading-text') ? $submitButton.data('loading-text') : 'Loading...' ).attr('disabled', true);

				const recaptchaSrcURL = $('#google-recaptcha-v3').attr('src'), newURL          = new URL(recaptchaSrcURL), site_key        = newURL.searchParams.get("render");

				grecaptcha.execute(site_key, {action: 'contact_us'}).then(token => {

					// Fields Data
					const formData = $form.serializeArray(), data = {};

					$(formData).each((index, {name, value}) => {
					    data[name] = value;
					});

					// Recaptcha v3 Token
					data["g-recaptcha-response"] = token;

					// Ajax Submit
					$.ajax({
						type: 'POST',
						url: $form.attr('action'),
						data
					}).always(({response, errorMessage, responseText}, textStatus, jqXHR) => {

						$errorMessage.empty().hide();

						if (response == 'success') {

							// Uncomment the code below to redirect for a thank you page
							// self.location = 'thank-you.html';

							$messageSuccess.removeClass('d-none');
							$messageError.addClass('d-none');

							// Reset Form
							$form.find('.form-control')
								.val('')
								.blur()
								.parent()
								.removeClass('has-success')
								.removeClass('has-danger')
								.find('label.error')
								.remove();

							if (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
								$('html, body').animate({
									scrollTop: $messageSuccess.offset().top - 80
								}, 300);
							}

							$form.find('.form-control').removeClass('error');

							$submitButton.val( submitButtonText ).attr('disabled', false);
							
							return;

						} else if (response == 'error' && typeof errorMessage !== 'undefined') {
							$errorMessage.html(errorMessage).show();
						} else {
							$errorMessage.html(responseText).show();
						}

						$messageError.removeClass('d-none');
						$messageSuccess.addClass('d-none');

						if (($messageError.offset().top - 80) < $(window).scrollTop()) {
							$('html, body').animate({
								scrollTop: $messageError.offset().top - 80
							}, 300);
						}

						$form.find('.has-success')
							.removeClass('has-success');
							
						$submitButton.val( submitButtonText ).attr('disabled', false);

					});

				});
			}
		});
	});
})).apply(this, [jQuery]);