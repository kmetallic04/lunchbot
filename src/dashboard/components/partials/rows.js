import React from 'react';

class OrderRow extends React.Component {
    render() {
        const { order } = this.props;
        return (
            <tr key={order._id}>
                <td>{order.person.name}</td>
                <td>{order.item}</td>
                <td>{order.vendor}</td>
                <td>{order.amount}</td>
                <td>{order.paid ? 'Paid' : 'Unpaid'}</td>
            </tr>
        )
    }
}

class VendorRow extends React.Component {
    render() {
        const { vendor } = this.props;
        return (
            <tr>
                <td>{vendor.name}</td>
                <td>{30}</td>
                <td>{vendor.checkout === undefined ? '-' : 'YES'}</td>
                <td>{vendor.checkout === undefined ? '-' : 'YES'}</td>
            </tr>
        )
    }
}

class ItemRow extends React.Component {
    render() {
        const { item } = this.props;
        return (
            <tr>
                <td>{item.name}</td>
                <td>{item.vendor}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
            </tr>
        )
    }
}

class BlankRow extends React.Component {
    render() {
        const text = `Zero ${this.props.type} available`;
        return (
            <tr>
                <td colSpan={this.props.span}>{text}</td>
            </tr>
        )
    }
}

module.exports = {
    OrderRow,
    VendorRow,
    ItemRow,
    BlankRow
}
