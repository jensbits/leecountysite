class SearchForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A last name was submitted: ' + this.state.value);
      event.preventDefault();
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
           } 
          form.classList.add('was-validated');
        }, false);
      });
    }
  
    render() {
      return (
        <form novalidate="true"  id="searchForm" className="needs-validation" method="post" onSubmit={this.handleSubmit}  ref={el => this.el = el}>
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
      </form>
      );
    }
  }

  ReactDOM.render(
    <SearchForm />,
    document.getElementById('root')
  );