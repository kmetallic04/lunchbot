import React from 'react';

const {
    VendorRow,
    BlankRow
} = require('./partials/rows');

class Vendors extends React.Component {
    render () {
        const {
            data,
            clickFunction
        } = this.props;

        const rowItems = data.map(vendor => {
            return <VendorRow key={vendor._id} vendor={vendor} />;
        });

        return  (
            <div className="view" id="vendors">
                <div id="top">
                    <h3 className="header">VENDORS</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Item Count</th>
                            <th>Paybill</th>
                            <th>TillNo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rowItems.length > 0 ?
                            rowItems:
                            <BlankRow span={"4"} type={'vendors'}/>
                        }
                    </tbody>
                </table>
                <div id="actions">
                    <a className="btn action mute" id="deleteVendor" onClick={clickFunction}>DELETE</a>
                    <a className="btn action" id="createVendor" onClick={clickFunction}>CREATE</a>
                </div>
            </div>
        )
    }
}

export default Vendors;

