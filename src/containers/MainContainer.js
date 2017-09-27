/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react';
import {Main} from '../components';
import {createStructuredSelector, createSelector} from 'reselect';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import * as act from '../actions/actions.js'

function FORMATLINE(props) {
    console.log("pr", props);
    let res="";

    if (props.line && props.line.length>0)
    {
        const qt=props.line;
        res=qt.map((e)=><td>{e}</td>);
    }

    return <tr>
        {res}
    </tr>

}


class MainContainer extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.subClick = this.subClick.bind(this);
        this.urlChange = this.urlChange.bind(this);
        this.state = {urltext: ''}
    }

    subClick(e) {
        this.props.dispatch(act.doGetUrl(this.state.urltext));
        e.preventDefault();
        return false;
    }

    urlChange(e) {
        this.setState({urltext: e.target.value})
    }

    render() {
        let url = this.props.data.url;
        let data = this.props.data.data;
        let rest = "";

        try {
            if (data !== "") {
                let data2 = JSON.parse(data);
                let data3 = data2.data;
                console.log(data3);
                if (data3.length > 0) {
                    // rest=<table>;
                    rest = <table>{data3.map((q) => <FORMATLINE line={q}/>)}</table>
                }

            }

        }
        catch (ex) {
            console.log(ex);
        }
        // console.log(data);

        // /let data2 =
        try {
            let qree = JSON.parse(data);
            for (let i = 0; i < qree.length; i++) {
                var qstr = qree[i];
            }
            //console.log(, "S");
        }
        catch (ex) {
            console.log(ex);
        }
        //console.log("qrt",  this.props.data);
        //var qdata=JSON.parse(data);
        //console.log(qdata);
        return (
            <div>
                <Main txt={this.state.urltext} handleChange={e => this.urlChange(e)} subClick={e => this.subClick(e)}/>
                <div>URL:{url}</div>
                {rest}
            </div>
        )
    }
}

function mapStateToProps(state) {
    if (state) {
        return {
            data: state.counter.data,
        }
    }
}

export default connect(mapStateToProps)(MainContainer)
