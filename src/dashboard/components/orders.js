import React from 'react';
import Filter from './partials/filters';

const {
    OrderRow,
    BlankRow
} = require('./partials/rows');

class Orders extends React.Component {

    render() {

        const {
            data,
            clickFunction,
            filterFunction
        } = this.props;

        const statuses = ['Paid', 'Unpaid']
        let vendors = new Set();

        const rowItems = data.map(order => {
            if (!vendors.has(order.vendor)) {
                vendors.add(order.vendor);
            }
            return <OrderRow key={order._id} order={order} />;
        })

        return (
            <div className="view" id="orders">
                <div id="top">
                    <h3 className="header">{new Date().toISOString().substring(0, 10)} | LUNCH ORDERS</h3>
                    <div className="filters">
                        <h4>Filter by: </h4>
                        <Filter options={Array.from(vendors)} filterFunction={filterFunction} id={'vendor-filter'} label={'Vendor'} />
                        <Filter options={statuses} filterFunction={filterFunction} id={'status-filter'} label={'Status'} />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Item</th>
                            <th>Vendor</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rowItems.length > 0 ?
                                rowItems :
                                <BlankRow span={"5"} type={'orders'} />
                        }
                    </tbody>
                </table>
                <div id="actions">
                    <a className="btn action" id="print" onClick={clickFunction}>PRINT</a>
                    <a className="btn action" id="send" onClick={clickFunction}>SEND</a>
                </div>
            </div>
        )
    }
}

export default Orders;
