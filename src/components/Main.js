/**
 * Created by zzeee on 26.09.2017.
 */
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import pure from 'recompose/pure'
import PropTypes from 'prop-types'

function Main({ subClick, handleChange, txt }) {
  return (
    <div style={{ background: 'black' }}>
      <form onSubmit={subClick}>
        <TextField hintText="Введите URL CSV файла" value={txt} onChange={handleChange} />
        <RaisedButton label="Обработать!" primary={true} type="submit" />
      </form>
    </div>
  )
}

Main.propTypes = {
  subClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  txt: PropTypes.string.isRequired,
}

export default pure(Main)
