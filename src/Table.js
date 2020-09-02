import React, { Fragment } from 'react'
import "./Table.css";
import numeral from 'numeral';
function Table({countries}) {
    return (
        <Fragment>
            {countries.map((country) =>(
                    <tr key = {country.country}>
                        <td>{country.country}</td>
                        <td>
                            <strong>{numeral(country.cases).format("0,0")}</strong>
                        </td>
                    </tr>
            ))}
        </Fragment>
    );
}

export default Table
