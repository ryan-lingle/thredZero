import React from 'react'
import ReactDOM from 'react-dom'

export default class Selector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: Object.keys(window.tweeSchema)
    }
    this.handleHover = this.handleHover.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleHover(event) {
    this.setState({ options: Object.keys(window.tweeSchema) })
  }

  handleChange(event) {
    const val = event.target.value;
    if (val == null || val == '') {
      event.target.parentNode.parentNode.parentNode.style.background = "white";
    } else {
      event.target.parentNode.parentNode.parentNode.style.background = "#29a3ef";
    }
    this.props.handleChange(event)
  }

  render() {
    const options = this.state.options.map((twee, i) => {
      return(
        <option value={twee} key={i}>{twee}</option>
      )
    })
    return(
      <div className="selector">
        <select onMouseEnter={this.handleHover} onChange={this.handleChange}>
          <option value={null}></option>
          {options}
        </select>
      </div>
    )
  }
}
