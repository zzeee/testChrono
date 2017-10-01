/**
 * Created by zzeee on 01.10.2017.
 */
import React from 'react';
import {Table, TableBody, TableRow, TableHeaderColumn, TableHeader, TableRowColumn} from 'material-ui/Table'

function FORMATCSVLINE(props) {
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

function CsvTable(props) {
    let i=0;
    const qres=(props.data && props.data.length>0?<Table bodyStyle={{overflow: 'visible'}}>
        <TableBody>
            {props.data.map(q => {
                let sqlength = q.length; // Обход глюка в Table который не отоюражает стоблцы если их не было в первой строке. Делаем всю таблицу равной ширины
                for (let y = 0; y < props.maxwidth - sqlength; y++) {
                    q.push('');
                }

                i++;
                return <FORMATCSVLINE key={i} line={q}/>
            })}
            </TableBody></Table>:<span>Нет информации для отображения</span>);
    return (qres);
}

export default CsvTable
