import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
	
import { CsvTable } from 'components'

describe('<CsvTable />', () => {
   it('Renders correct number of columns', () => {

      const component = renderer.create(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
         <CsvTable url="ta"  maxwidth={3}  data={[[1,2,3]]} /> 
</MuiThemeProvider>
      );
      const json = component.toJSON();
expect(json.children[1].children[0].children[0].children[0].children.length).toBe(3)
   });
});