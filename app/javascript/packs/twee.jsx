import React from 'react'
import ReactDOM from 'react-dom'

export default class Twee extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      children: [],
      inputValue: '',
      showSettings: false,
      modalIsOpen: false,
      header: this.props.name,
    }
    this.buildChildTwees = this.buildChildTwees.bind(this)
    this.renderTwee = this.renderTwee.bind(this)
    this.newTwee = this.newTwee.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.updateSchema = this.updateSchema.bind(this)
    this.getTweeLevels = this.getTweeLevels.bind(this)
    this.showSettings = this.showSettings.bind(this)
    this.hideSettings = this.hideSettings.bind(this)
    this.buildModal = this.buildModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.headerChange = this.headerChange.bind(this);
  }

  buildChildTwees() {
    const width = {
      width: `${100 / (this.state.children.length + 1)}%`
    }
    const children = this.state.children.map((name, i) => {
      return this.renderTwee(name, width, i)
    })
    return(
      <div className="child-twees">
        {children}
        <div className="new-twee-container" style={width}>
          <form onSubmit={this.newTwee}>
            <input type="text" className="new-input text-center" value={this.state.inputValue} onChange={this.handleChange} />
            <br/>
            <div className="far fa-plus-square new-twee-btn" onClick={this.newTwee}></div>
          </form>
        </div>
      </div>
    )
  }

  renderTwee(name, width, i) {
    return(
      <div className="twee-container" key={i} style={width}>
        <Twee name={name} />
      </div>
    )
  }

  handleChange(event) {
    const val = event.target.value
    this.setState({ inputValue: val })
  }

  newTwee(event) {
    event.preventDefault();
    const input = this.state.inputValue
    if (input != '') {
      const newChildren = this.state.children;
      newChildren.push(input);
      this.updateSchema(input);
      this.getTweeLevels();
      this.setState({ children: newChildren, inputValue: '' });
    }
  }

  updateSchema(newTwee) {
    window.tweeSchema[this.props.name].children.push(newTwee);
    window.tweeSchema[newTwee] = {};
    window.tweeSchema[newTwee].parent = this.props.name;
    window.tweeSchema[newTwee].header = newTwee;
    window.tweeSchema[newTwee].children = [];
  }

  getTweeLevels() {
    let counts = [];
    function levRec(l, count) {
      if (l.children.length == 0) {
         counts.push(count);
      } else {
        count++;
        l.children.forEach((ch) => {
          counts.push(count)
          levRec(window.tweeSchema[ch], count);
        })
      }
    }
    const ROOT = window.tweeSchema['ROOT']
    levRec(ROOT, 1)
    const level = Math.max.apply(null, counts);
    document.querySelector('.spacer').style.marginTop = `${50 + (50 * (level))}px`
  }

  showSettings() {
    this.setState({showSettings: true })
  }

  hideSettings() {
    this.setState({showSettings: false })
  }

  buildModal() {
    return(
      <div className = "twee-modal">
        <i className="fas fa-times modal-close" onClick={this.closeModal} ></i>
        <h4>Edit Header</h4>
        <textarea className="modal-text-area" defaultValue={this.state.header} rows="3" cols="30" >
        </textarea>
        <br/>
        <button className="pull-left modal-btn btn btn-primary" onClick={this.headerChange}>Save</button>
      </div>
    )
  }

  headerChange(event) {
    const val = event.target.previousSibling.previousSibling.value;
    this.setState({ header: val });
    this.closeModal();
    window.tweeSchema[this.props.name].header = val;
  }

  openModal() {
    document.querySelector('.overlay').style.display = 'block';
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    document.querySelector('.overlay').style.display = 'none';
    this.setState({ modalIsOpen: false })
  }

  render() {
    const childTwees = this.buildChildTwees()
    const klass = this.state.showSettings ? "show" : "hide";
    const modal = this.state.modalIsOpen ? this.buildModal() : null;
    return(
      <div className="twee">
        <div className="twee-head">
          <div className="inner-twee">
            <div className="twee-settings-container">
              <div className="twee-settings" onMouseEnter={this.showSettings} onMouseLeave={this.hideSettings}>
                <i className="fas fa-bars" ></i>
                <div className={`dropdown-items ${klass}`}>
                  <div className="dropdown-item" onClick={this.openModal} >
                    Edit Header
                  </div>
                  <div className="dropdown-item">
                    Expand
                  </div>
                </div>
              </div>
            </div>
            <div className="twee-name">
              {this.props.name}
            </div>
            <div className="twee-spacer">
            </div>
          </div>
        </div>
        {childTwees}
        {modal}
      </div>
    )
  }
}
