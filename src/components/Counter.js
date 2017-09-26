import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import * as act  from '../actions/actions.js';




function Counter({ increment, incrementIfOdd, decrement, counter }) {
  return (
    <div style={{background:"black"}}>
        <form>
        <TextField
            hintText="Введите URL CSV файла"
        />    <RaisedButton label="Обработать!" primary={true}  /></form>
    </div>
  )
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
}

export default pure(Counter)
