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
        vehicleData: []
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
          body: JSON.stringify({"nameQuery": this.state.values.nameQuery}),
          headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken }
      })
      .then(response => {
          this.setState({ isSubmitting: false });
          return response.json();
      })
      .then(propdata => {
          console.log(propdata);
          this.setState({propertyData: propdata.response_data.Records})
          console.log(this.state.propertyData)
          !propdata.hasOwnProperty("error")
              ? this.setState({ message: propdata.success })
              : this.setState({ message: propdata.error, isError: true });
      });

      fetch("/ajx_vehicledata", {
        method: "POST",
        body: JSON.stringify({"nameQuery": this.state.values.nameQuery}),
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken }
        })
        .then(response => {
            this.setState({ isSubmitting: false });
            return response.json();
        })
        .then(vehdata => {
            console.log(vehdata);
            this.setState({vehicleData: vehdata.response_data.Records})
            console.log(this.state.vehicleData)
            !vehdata.hasOwnProperty("error")
                ? this.setState({ message: vehdata.success })
                : this.setState({ message: vehdata.error, isError: true });
        });
    }

    componentDidMount() {
      let thisReactForm = this;
      this.$el = $(this.el);
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
          $("#nameQuery").val( ui.item.Value );
          thisReactForm.setState({ values: {nameQuery: ui.item.Value} });
          return false;
        } }
      ).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
          .append(item.Value )
          .appendTo( ul );
      };

    }
  
    render() {
      return (
        <div>
        <form novalidate="true"  id="searchForm" className="needs-validation" method="post" onSubmit={this.handleSubmit}  
        ref={el => this.el = el} autoComplete="off">
        <div className="row">
          <div className="col">
            <label className="sr-only" htmlFor="nameQuery">Name</label>
            <input name="nameQuery" type="text" className="form-control mb-2 mr-sm-2" id="nameQuery" placeHolder="Name" required value={this.state.value} onChange={this.handleChange} />
            <div className="invalid-feedback">
              Please provide a name.
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mb-2">Search</button>
          </div>
        </div>
        <div className={'message ${this.state.isError && "error"}'}>
          {this.state.isSubmitting ? "Searching..." : ""}
        </div>
      </form>
      <h3>Property Results</h3>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Owner Name</th>
            <th scope="col">Owner Address</th>
            <th scope="col">Property Address</th>
            <th scope="col">Value</th>
            <th scope="col">Tax</th>
            <th scope="col">Delinquent</th>
          </tr>
        </thead>
      { this.state.propertyData.map(propertyItem => 
          <tr>
            <td>{propertyItem.OwnerName1}</td>
            <td>{propertyItem.OwnerAddress.Line1}{propertyItem.OwnerAddress.Line2.length ? " " + propertyItem.OwnerAddress.Line2 : ""}, 
            &nbsp;{propertyItem.OwnerAddress.City}, {propertyItem.OwnerAddress.State} {propertyItem.OwnerAddress.Zip}</td>
            <td>{propertyItem.SitusAddress.Line1}, {propertyItem.SitusAddress.City != null ? propertyItem.SitusAddress.City + "," : ""}
            {propertyItem.SitusAddress.State} 
             {propertyItem.SitusAddress.Zip}</td>
            <td>{formatCurrency.format(propertyItem.Values.Appraised)}</td>
            <td>{formatCurrency.format(propertyItem.Values.BaseTax)}<br />({propertyItem.Year})</td>
            <td>{propertyItem.isDelinquent ? "Yes" : "No"}</td>
            </tr>
         )}
      </table>
      <h3>Vehicle Results</h3>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Owner Name</th>
            <th scope="col">Owner Address</th>
            <th scope="col">Make/Model</th>
            <th scope="col">Year</th>
            <th scope="col">Color</th>

          </tr>
        </thead>
      { this.state.vehicleData.map(vehicleItem => 
          <tr>
            <td>{vehicleItem.OwnerName1}</td>
            <td>{vehicleItem.OwnerAddress.Line1}{vehicleItem.OwnerAddress.Line2.length ? " " + vehicleItem.OwnerAddress.Line2 : ""}, 
            &nbsp;{vehicleItem.OwnerAddress.City}, {vehicleItem.OwnerAddress.State} {vehicleItem.OwnerAddress.Zip}</td>
            <td>{vehicleItem.Make} {vehicleItem.Model}</td>
            <td>{vehicleItem.ModelYear}</td>
            <td>{vehicleItem.Color}</td>
            </tr>
         )}
      </table>
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
      console.log(data.response_data);
      return data.response_data
      // !data.hasOwnProperty("error")
      //     ? this.setState({ message: data.success })
      //     : this.setState({ message: data.error, isError: true });
          
  });

}

var formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});