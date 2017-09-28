/**
 * Created by zzeee on 26.09.2017.
 */
import TextField from 'material-ui/TextField'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import pure from 'recompose/pure'
import PropTypes from 'prop-types'

function Main({ subClick, handleChange, txt,hide }) {
  return (
    <div style={{ background: 'black' }}>
      <form onSubmit={subClick}>
          {hide?<div>txt</div>:<TextField hintText="Введите URL CSV файла" value={txt} onChange={handleChange} />}
        <RaisedButton label="Обработать!" primary={true} type="submit" />
      </form>
    </div>
  )
}

Main.propTypes = {
  subClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  txt: PropTypes.string.isRequired,
  hide:  PropTypes.bool.isRequired
}

export default pure(Main)
