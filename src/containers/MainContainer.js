/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react'
import { Main } from 'components'
import { createStructuredSelector, createSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as act  from '../actions/actions.js';

class MainContainer extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        console.log("antilint");
        this.subClick=this.subClick.bind(this);
    }

    subClick(e)
    {
        this.props.dispatch(act.doGetUrl("333"));
        e.preventDefault();
        return false;
    }

        render() {
         return (
             <div>wrfewr<Main subClick={(e)=>this.subClick(e)} /></div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    counter: createSelector(state => state.counter, counterState => counterState),
})


export default connect(mapStateToProps )(MainContainer)
