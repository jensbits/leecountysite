// namespace to avoid collisions with other javasrcipt functions and variables
var PPD = {};




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