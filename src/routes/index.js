import React from 'react'
import { Header } from '../components'
import { Footer } from '../components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from 'styled-components'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { MainContainer } from '../containers'

const Container = styled.div`text-align: center;`

function Routes() {
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <Router>
        <Container>
          <Header />
          <Route path="/" component={MainContainer} />
          <Footer />
        </Container>
      </Router>
    </MuiThemeProvider>
  )
}

export default Routes
