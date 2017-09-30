/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Table, TableBody, TableRow, TableHeaderColumn, TableHeader, TableRowColumn} from 'material-ui/Table'
import LinearProgress from 'material-ui/LinearProgress'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'

import {Main, CsvTable} from '../components'


import * as act from '../actions/actions.js'

function FORMATLINE(props) {
    let res = ''
    if (props.line && props.line.length > 0) {
        const qt = props.line
        //    console.log('QTT', typeof qt, qt.length)
        let i = 0;
        res = qt.map(e => {

            let width = e.length * 2 + 'px'
            i++;
            return <TableRowColumn key={i} style={{width: 120}}>{e}</TableRowColumn>
        })
    }

    return <TableRow>{res}</TableRow>
}

class MainContainer extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        reqsent: PropTypes.bool.isRequired,
        error: PropTypes.bool.isRequired,
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
                    const data3 = JSON.parse(data2.data)
                    //  console.log('data3', typeof data3, data3)
                    let i = 0;
                    if (data3.length > 0) {
                        const maxwidth = Math.max.apply(null, data3.map((e) => parseInt(e.length)));
                        rest = (
                            <Table bodyStyle={{overflow: 'visible'}}>
                                <TableBody>
                                    {data3.map(q => {
                                        i++;
                                        let sqlength = q.length;
                                        //console.log(q,);
                                        for (let y = 0; y < maxwidth - sqlength; y++) {
                                            q.push('');
                                        }
//                    console.log(q);
                                        return <FORMATLINE key={i} maxline={maxwidth} line={q}/>
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

        const actionsL = [
            <FlatButton
                label="Закрыть окно"
                primary={true}
                keyboardFocused={true}
                onClick={e => this.props.dispatch(act.ResetState())}
            />,
        ]
        const actionsE = [
            <FlatButton
                label="Закрыть окно"
                primary={true}
                keyboardFocused={true}
                onClick={e => this.props.dispatch(act.ResetState())}
            />,
        ]

        return (
            <div>

                {url ? (
                    <div>
                        <br />
                        <h2>
                            Загружен URL:<br />
                        </h2>
                        <h4>{url}</h4>
                    </div>
                ) : (
                    <span />
                )}
                {rest}
                <CsvTable url={this.props.data.url}
                          data={this.props.data.data}
                />

                <Main
                    hide={this.props.reqsent}
                    txt={this.state.urltext}
                    handleChange={e => this.urlChange(e)}
                    subClick={e => this.subClick(e)}
                />
                <Snackbar
                    open={this.props.reqsent}
                    message="Запрос отправлен, ожидаем ответ..."
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
                <Dialog
                    title="Загрузка..."
                    actions={actionsL}
                    modal={false}
                    open={this.props.reqsent}
                    onRequestClose={this.handleClose}
                >
                    {' '}
                    <LinearProgress mode="indeterminate"/>
                    Подождите, информация загружается...
                </Dialog>
                <Dialog
                    title="Возникла ошибка!"
                    actions={actionsE}
                    modal={false}
                    open={this.props.error}
                    onRequestClose={this.handleClose}
                >
                    {' '}
                    <h2>Ошибка загрузки!</h2>
                </Dialog>
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
            error: state.main.error,
        }
    }
}

export default connect(mapStateToProps)(MainContainer)
