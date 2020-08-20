// namespace to avoid collisions with other javasrcipt functions and variables
var PPD = {};

// Bootstrap client-side form validation https://getbootstrap.com/docs/4.0/components/forms/?#validation
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          event.stopPropagation();
          if (form.checkValidity() === false) {
          } else {
            formSubmit();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

// jquery DOM ready function
$(function(){
   
});

function formSubmit(){
  PPD.searchForm = $('#searchForm');

  var $lastName  = PPD.searchForm.find('input#lastName'),
      $firstName = PPD.searchForm.find('input#firstName'),
      url        = PPD.searchForm.data('url');

    callPropertyData($lastName);  

    console.log('sbum');
  
}

function callPropertyData(q){
  console.log('hello');
  $.post('/ajx_propertydata',
        { value: q, direct: false, skip: 0})
        .done(function(data) {
          console.log(data);
          alert( data.TotalRecords);
        })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          alert( "finished" );
        });

}