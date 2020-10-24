class SearchForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        values: {
          nameQuery: ""
        },
        isSubmitting: false,
        isError: true,
        propertyData: [],
        propertyTotal: 0,
        propertyPagination: [],
        propertySkip: 0,
        vehicleData: [],
        vehicleTotal: 0,
        vehiclePagination: [],
        vehicleSkip: 0
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({
        values: { ...this.state.values, [event.target.name]: event.target.value }
      });
    }
  
    handleSubmit(event) {
      console.log('A name was submitted: ' + this.state.values.nameQuery);
      event.preventDefault();

      const formData = new FormData();
      formData.append('nameSearch', this.state.values.nameQuery);

      let csrftoken = getCookie('csrftoken');
  
      fetch("/ajx_propertydata", {
          method: "POST",
          body: JSON.stringify({"nameQuery": this.state.values.nameQuery, "skip": 0}),
          mode: 'same-origin',
          headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken }
      })
      .then(response => {
          this.setState({ isSubmitting: false });
          $('#property').addClass('d-none');
          return response.json();
      })
      .then(propdata => {
          this.setState({propertyData: propdata.response_data.Records})
          this.setState({propertyTotal: propdata.response_data.TotalRecords})
          $('#property').removeClass('d-none');
          !propdata.hasOwnProperty("error")
              ? this.setState({ message: propdata.success })
              : this.setState({ message: propdata.error, isError: true });
      });

      fetch("/ajx_vehicledata", {
        method: "POST",
        body: JSON.stringify({"nameQuery": this.state.values.nameQuery, "skip": 0}),
        mode: 'same-origin',
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken }
        })
        .then(response => {
            this.setState({ isSubmitting: false });
            $('#vehicle').addClass('d-none');
            return response.json();
        })
        .then(vehdata => {
            this.setState({vehicleData: vehdata.response_data.Records})
            this.setState({vehicleTotal: vehdata.response_data.TotalRecords})
            $('#vehicleResultsHeading span').text('Record');
            $('input[name=makeQuery]').val(''),
            $('input[name=modelQuery]').val(''),
            $('#vehicle').removeClass('d-none');
            !vehdata.hasOwnProperty("error")
                ? this.setState({ message: vehdata.success })
                : this.setState({ message: vehdata.error, isError: true });
        });
    }

    createPagination(type, n){
      var elements = [],
          pages = 20;
      for(var i = 0; i < pages; i++){
          elements.push(<li class="page-item"><a class="page-link" href="#">{i}</a></li>);
      }
      
      return elements
    }

    componentDidMount() {
      let thisReactForm = this;
      let skip = 0;
      this.$el = $(this.el);
      let csrftoken = getCookie('csrftoken');
      // Bootstrap client-side form validation https://getbootstrap.com/docs/4.0/components/forms/?#validation
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(this.$el, function(form) {
        form.addEventListener('submit', function(event) {
           event.preventDefault();
           event.stopPropagation();
           if (form.checkValidity() === false) {
            thisReactForm.setState({ isError: true })
           } else {
            thisReactForm.setState({ isSubmitting: true });
           }
          form.classList.add('was-validated');
        }, false);
      });

      $("#nameQuery").autocomplete(
        {source: "/ajx_autocomplete", 
        minLength: 2,
        select: function( event, ui ) {
          $('#nameQuery').val( ui.item.Value );
          thisReactForm.setState({ values: {nameQuery: ui.item.Value} });
          return false;
        } }
        ).autocomplete( "instance" )._renderItem = function( ul, item ) {
          return $( "<li></li>" )
            .append(item.Value )
            .appendTo( ul );
        };

      $("body").on('click', ".property-prev", function(e){
          e.preventDefault();
      });

      $("body").on('click', ".property-next", function(e){
        e.preventDefault();
        skip = skip + 20;
        $.ajax({
          method: 'POST',
          url: '/ajx_propertydata',
          contentType: 'application/json',
          headers: {
            'X-CSRFToken': csrftoken 
          },
            data: JSON.stringify({"nameQuery": thisReactForm.state.values.nameQuery, "skip": skip})
          })
          .done(function( response ) {
            thisReactForm.setState({propertyData: response.response_data.Records})
          });
      });

      $(".btn-vehicleSearch").on('click', function(e){
        e.preventDefault();
        $('#property').addClass('d-none');
        $('input[name=nameQuery]').val(' ');

        var $this = $('#vehicleForm'),
            make  = $this.find('input[name=makeQuery]').val(),
            model = $this.find('input[name=modelQuery]').val(),
            token = getCookie('csrftoken');

        $.ajax({
          method: 'POST',
          url: '/ajx_vehiclesearch',
          contentType: 'application/json',
          headers: {
            'X-CSRFToken': token 
        },
          data: JSON.stringify({ "make": make, "model": model })
        })
          .done(function( response ) {
            thisReactForm.setState({vehicleData: response.response_data});
            $('#vehicleResultsHeading span').text('Search');
            $('#vehicle').removeClass('d-none');
          });
      });

    }
  
    render() {
      return (
        <div>

          <form novalidate="true"  id="searchForm" className="needs-validation" method="post" onSubmit={this.handleSubmit}  
          ref={el => this.el = el} autoComplete="off">
            <div className="row">
              <div className="col">
                <label className="sr-only" htmlFor="nameQuery">Name</label>
                <input name="nameQuery" type="text" className="form-control mb-2 mr-sm-2" id="nameQuery" aria-describedby="nameHelp" placeHolder="Name" required value={this.state.value} onChange={this.handleChange} />
                <small id="nameHelp" class="form-text text-muted">Last name first or partial name, no commas</small>
                <div className="invalid-feedback">
                  Please provide a name.
                </div>
              </div>
              <div className="col-md-auto">
                <button type="submit" className="btn btn-primary mb-2">Search</button>
              </div>
              
            </div>
            <div className={'message ${this.state.isError && "error"}'}>
              {this.state.isSubmitting ? "Searching..." : ""}
            </div>
          </form>

          <p class="lead mt-5"><strong>Search Vehicle Records Pulled from Lee County by Make and Model </strong></p>
          <div class="row">
            <div class="col">
              <form id="vehicleForm" method="post" autoComplete="off">
                <div className="row">
                  <div className="col">
                    <label className="sr-only" htmlFor="makeQuery">Make</label>
                    <input name="makeQuery" type="text" className="form-control mb-2 mr-sm-2" id="makeQuery" placeHolder="Make" />
                  </div>
                  <div className="col">
                    <label className="sr-only" htmlFor="modelQuery">Model</label>
                    <input name="modelQuery" type="text" className="form-control mb-2 mr-sm-2" id="modelQuery" placeHolder="Model" />
                  </div>
                  <div className="col-md-auto">
                    <button type="button" className="btn btn-primary btn-vehicleSearch mb-2">Search</button>
                  </div>
                </div>
              </form> 
            </div>
          </div>

          <div id="property" class="mt-5 d-none">
            <h3>Property Record Results</h3>
            <table class="table">
              <thead>
                <tr class="bg-success" >
                  <th scope="col">Owner Name</th>
                  <th scope="col">Owner Address</th>
                  <th scope="col">Property Address</th>
                  <th scope="col">Value</th>
                  <th scope="col">Tax</th>
                  <th scope="col">Paid</th>
                </tr>
              </thead>
            { this.state.propertyData.length == 0 &&
                <tr><td colspan="6">No propertyData records at this time.</td></tr>
            }
            { this.state.propertyData.map(propertyItem => 
              <tr>
                <td>{propertyItem.OwnerName1}</td>
                <td>{propertyItem.OwnerAddress.Line1}{propertyItem.OwnerAddress.Line2.length ? " " + propertyItem.OwnerAddress.Line2 : ""}, 
                &nbsp;{propertyItem.OwnerAddress.City}, {propertyItem.OwnerAddress.State} {propertyItem.OwnerAddress.Zip}</td>
                <td>
                {propertyItem.SitusAddress && propertyItem.SitusAddress.Line1 ? propertyItem.SitusAddress.Line1 : ""}
                {propertyItem.SitusAddress && propertyItem.SitusAddress.City  ? ", " +  propertyItem.SitusAddress.City : ""}
                {propertyItem.SitusAddress && propertyItem.SitusAddress.State ? ", " + propertyItem.SitusAddress.State : ""}
                {propertyItem.SitusAddress && propertyItem.SitusAddress.Zip   ? ", " + propertyItem.SitusAddress.Zip : ""}
                </td>
                <td>{formatCurrency.format(propertyItem.Values.Appraised)}</td>
                <td>{formatCurrency.format(propertyItem.Values.BaseTax)}<br />({propertyItem.Year})</td>
                <td>{propertyItem.Payment.Status}</td>
              </tr>
              )}
            </table>
            
          </div>
      
          <div id="vehicle" class="mt-5 d-none">
            <h3 id="vehicleResultsHeading">Vehicle <span>Record</span></h3>
            <table class="table">
              <thead>
                <tr class="bg-primary">
                  <th scope="col">Owner Name</th>
                  <th scope="col">Owner Address</th>
                  <th scope="col">Make/Model</th>
                  <th scope="col">Body&nbsp;Type</th>
                  <th scope="col">Year</th>
                  <th scope="col">Color</th>
                </tr>
              </thead>
            { this.state.vehicleData.length == 0 &&
                <tr><td colspan="5">No vehicle records at this time. Check the chart for renewal month.</td></tr>
            }
            { this.state.vehicleData.map(vehicleItem => 
                <tr>
                  <td>{vehicleItem.OwnerName1}</td>
                  <td>{vehicleItem.OwnerAddress.Line1}{vehicleItem.OwnerAddress.Line2.length ? " " + vehicleItem.OwnerAddress.Line2 : ""}, 
                  &nbsp;{vehicleItem.OwnerAddress.City}, {vehicleItem.OwnerAddress.State} {vehicleItem.OwnerAddress.Zip}</td>
                  <td>{vehicleItem.Make} {vehicleItem.Model}</td>
                  <td>{vehicleItem.BodyType}</td>
                  <td>{vehicleItem.ModelYear}</td>
                  <td>{vehicleItem.Color}</td>
                  </tr>
              )}
            </table>
             
          </div>
        
      </div>
      );
    }
  }

  ReactDOM.render(
    <SearchForm />,
    document.getElementById('root')
  );

// The following function are copying from 
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function autocompleteSearch(value){
  let csrftoken = getCookie('csrftoken');

  fetch("/ajx_autocomplete", {
    method: "POST",
    body: value,
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => {
      return response.json();
  })
  .then(data => {
      return data.response_data; 
  });

}

var formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

