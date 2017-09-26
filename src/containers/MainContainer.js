/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react'
import { Main } from '../components'
import { createStructuredSelector, createSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as act from '../actions/actions.js'

class MainContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.subClick = this.subClick.bind(this)
    this.urlChange = this.urlChange.bind(this)
    this.state = { urltext: '' }
  }

  subClick(e) {
    this.props.dispatch(act.doGetUrl(this.state.urltext))
    e.preventDefault()
    return false
  }

  urlChange(e) {
    this.setState({ urltext: e.target.value })
  }

  render() {
    let url = this.props.data.url
    let data = this.props.data.data
    //console.log("qrt",  this.props.data);
    return (
      <div>
        <Main txt={this.state.urltext} handleChange={e => this.urlChange(e)} subClick={e => this.subClick(e)} />
        <div>URL:{url}</div>
        <div>DATA:{data}</div>
      </div>
    )
  }
}

//const mapStateToProps = createStructuredSelector({
//  data: createSelector(state => state.data, counterState => counterState)
//})

function mapStateToProps(state) {
  if (state) {
    return {
      data: state.counter.data,
    }
  }
}

export default connect(mapStateToProps)(MainContainer)
