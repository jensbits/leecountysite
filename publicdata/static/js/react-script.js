class SearchForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        values: {
          lastName: "",
          firstName: ""
        },
        isSubmitting: false,
        isError: false
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      // this.setState({value: event.target.value});
      this.setState({
        values: { ...this.state.values, [event.target.name]: event.target.value }
      });
    }
  
    handleSubmit(event) {
      console.log('A last name was submitted: ' + this.state.values.lastName);
      event.preventDefault();
      console.log(this.state);
      this.setState({ isSubmitting: true });

      let csrftoken = getCookie('csrftoken');
  
      fetch("/ajx_propertydata", {
          method: "POST",
          body: JSON.stringify(this.state.values),
          headers: { "X-CSRFToken": csrftoken }
      })
      .then(response => {
          this.setState({ isSubmitting: false });
          return response.json();
      })
      .then(data => {
          console.log(data);
          !data.hasOwnProperty("error")
              ? this.setState({ message: data.success })
              : this.setState({ message: data.error, isError: true });
      });
    }

    componentDidMount() {
      this.$el = $(this.el);
      // Bootstrap client-side form validation https://getbootstrap.com/docs/4.0/components/forms/?#validation
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(this.$el, function(form) {
        form.addEventListener('submit', function(event) {
           event.preventDefault();
           event.stopPropagation();
           if (form.checkValidity() === false) {
            this.setState({ isError: true })
           } 
          form.classList.add('was-validated');
        }, false);
      });

      $("#lastName").autocomplete(
        {source: "/ajx_autocomplete", 
        minLength: 2,
        select: function( event, ui ) {
          $("#lastName").val( ui.item.Value );
          return false;
        } }
      ).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
          .append( item.Value )
          .appendTo( ul );
      };

    }
  
    render() {
      return (
        <form novalidate="true"  id="searchForm" className="needs-validation" method="post" 
        onSubmit={this.handleSubmit}  ref={el => this.el = el} autoComplete="off">
        <div className="row">
          <div className="col">
            <label className="sr-only" htmlFor="lastName">Last Name</label>
            <input name="lastName" type="text" className="form-control mb-2 mr-sm-2" id="lastName" placeHolder="Last Name" required value={this.state.value} onChange={this.handleChange} />
            <div className="invalid-feedback">
              Please provide a last name.
            </div>
          </div>
          <div className="col">
            <label className="sr-only" htmlFor="firstName">First Name (optional)</label>
            <div className="input-group mb-2 mr-sm-2">
              <input name="firstName" type="text" className="form-control" id="firstName" placeHolder="First Name (optional)" />
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary mb-2">Submit</button>
          </div>
        </div>
        <div className={'message ${this.state.isError && "error"}'}>
          {this.state.isSubmitting ? "Searching..." : this.state.message}
        </div>
      </form>
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
      // this.setState({ isSubmitting: false });
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