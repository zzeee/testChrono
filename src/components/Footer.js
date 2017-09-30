import React from 'react'
import FontIcon from 'material-ui/FontIcon'

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'

import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>
const nearbyIcon = <IconLocationOn />

function Footer() {
  return (
    <Paper zDepth={1} style={{ position: 'absolute', marginBottom: '10px' }}>
      </Paper>
  )
}

export default Footer
