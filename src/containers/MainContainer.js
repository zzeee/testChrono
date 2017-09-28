/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import {Main} from '../components'
import FlatButton from 'material-ui/FlatButton';


import * as act from '../actions/actions.js'

function FORMATLINE(props) {
    let res = ''
    if (props.line && props.line.length > 0) {
        const qt = props.line
//    console.log('QTT', typeof qt, qt.length)
        res = qt.map(e => {
            return <TableRowColumn>{e}</TableRowColumn>
        })
    }

    return <TableRow>{res}</TableRow>
}

class MainContainer extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        reqsent: PropTypes.bool.isRequired,
        error: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props)
        this.subClick = this.subClick.bind(this)
        this.urlChange = this.urlChange.bind(this)
        this.state = {urltext: ''}
    }

    subClick(e) {
        this.props.dispatch(act.doGetUrl(this.state.urltext))
        e.preventDefault()
        return false
    }

    urlChange(e) {
        this.setState({urltext: e.target.value})
    }

    render() {
        let url = this.props.data.url
        let data = this.props.data.data
        let rest = ''
        try {
            if (data !== '') {
                let data2 = JSON.parse(data)
                //console.log('data2', data2)
                if (data2.data) {
                    let data3 = JSON.parse(data2.data)
                    //console.log('data3', typeof data3, data3)
                    let i = 0
                    if (data3.length > 0) {
                        // rest=<table>;
                        console.log('qrr')

                        rest = (
                            <Table>
                                <TableBody>
                                    {data3.map(q => {
                                        i++;
                                        return <FORMATLINE key={i} line={q}/>
                                    })}
                                </TableBody>
                            </Table>
                        )
                    }
                }
            }
        } catch (ex) {
            //console.log("catche main",ex)
        }

        return (
            <div>
                <Main hide={this.props.reqsent} txt={this.state.urltext} handleChange={e => this.urlChange(e)}
                      subClick={e => this.subClick(e)}/>
                <div>URL:{url?url:this.state.urltext}</div>


                {this.props.reqsent ? <div><span>Запрос отправлен, ожидаем ответ... <br /><FlatButton label="Стоп!" primary={true} /></span></div> : <div></div> }
                {this.props.error? <div>Ошибка обработки!</div>:<div></div>}
                Статус:|{+this.props.reqsent}:{+this.props.error}|
                {rest}
            </div>
        )
    }
}

function mapStateToProps(state) {
//    console.log("state", state);
    if (state) {
        return {
            data: state.main.data,
            reqsent: state.main.reqsent,
            error: state.main.error
        }

    }

}

export default connect(mapStateToProps)(MainContainer)
