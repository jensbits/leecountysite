// namespace to avoid collisions with other javasrcipt functions and variables
var PPD = {};

// jquery DOM ready function
$(function(){
   
});


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