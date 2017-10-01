/**
 * Created by zzeee on 26.09.2017.
 */
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import LinearProgress from 'material-ui/LinearProgress'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'

import {Main, CsvTable} from '../components'


import * as act from '../actions/actions.js'

class MainContainer extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        data_d: PropTypes.array,
        data_d_mwidth: PropTypes.number,
        data_u: PropTypes.string,
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
        const url = this.props.data.url;
        const actionsL = [
            <FlatButton
                label="Закрыть окно"
                primary={true}
                keyboardFocused={true}
                onClick={e => this.props.dispatch(act.ResetState())}
            />,
        ];
        const actionsE = [
            <FlatButton
                label="Закрыть окно"
                primary={true}
                keyboardFocused={true}
                onClick={e => this.props.dispatch(act.ResetState())}
            />,
        ];

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

                <CsvTable url={this.props.data_u}
                          data={this.props.data_d}
                          maxwidth={this.props.data_d_mwidth}
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
            data_d:state.main.data_d,
            data_d_mwidth:state.main.data_d_mwidth,
            data_u:state.main.data_u,
            reqsent: state.main.reqsent,
            error: state.main.error,
        }
    }
}

export default connect(mapStateToProps)(MainContainer)
