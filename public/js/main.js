class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'orders',
            data: '',
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        // fetch orders
    }

    handleClick(e) {
        var btn = e.target.getAttribute('id');

        console.log('Button clicked', btn);

        switch (btn) {
            case 'orders':
                console.log('Orders clicked...')
                break;
            case 'manage':
                console.log('Manage clicked...')
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div classNameName="container">
                <Navigation clickFunction={this.handleClick}/>
                <div id="clear"></div>
                {
                    this.state.page === 'vendors' ? <Vendors data={this.state.data} clickFunction={this.handleClick}/> :
                    this.state.page === 'items' ? <Items data={this.state.data} clickFunction={this.handleClick}/> :
                    <Orders data={this.state.data} clickFunction={this.handleClick}/>
                }
            </div>
        );
    }
}

class Navigation extends React.Component {
    render () {
        const {
            clickFunction
        } = this.props;

        return  (
            <div className="navigation">
                <div id="banner">
                    <h1 className="header" id="main">LUNCHBOT</h1>
                    <h4 className="header">management dashboard</h4>
                </div>
                <div className="navs">
                    <a className="btn nav" id="orders" onClick={clickFunction}>orders</a>
                    <div className="dropdown nav">
                        <a className="btn nav" id="manage" onClick={clickFunction}>Manage</a>
                        <div className="dropdown-content">
                            <a className="drop" id="vendors" onClick={clickFunction}>vendors</a>
                            <a className="drop" id="items" onClick={clickFunction}>items</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Orders extends React.Component {
    render() {
        const {
            clickFunction
        } = this.props;

        return (
            <div className="view" id="orders">
                <div id="top">
                    <h3 className="header">30/08/2018 | LUNCH ORDERS</h3>
                    <div className="dropdown">
                        <a className="btn select" id="ordersFilter" onClick={clickFunction}>Filter</a>
                        <div className="dropdown-content">
                            <a className="drop" id="vendor" onClick={clickFunction}>vendor</a>
                            <a className="drop" id="paid" onClick={clickFunction}>paid</a>
                            <a className="drop" id="pending" onClick={clickFunction}>paid</a>
                        </div>
                    </div>
                </div>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Item</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    <OrderRow />
                    <OrderRow />
                    <OrderRow />
                    <OrderRow />
                    <OrderRow />
                    <OrderRow />
                </table>
                <div id="actions">
                    <a className="btn action" id="print" onClick={clickFunction}>PRINT</a>
                    <a className="btn action" id="send" onClick={clickFunction}>SEND</a>
                </div>
            </div>
        )
    }
}

class Vendors extends React.Component {
    render () {
        const {
            clickFunction
        } = this.props;

        return  (
            <div className="view" id="vendors">
                <div id="top">
                    <h3 className="header">VENDORS</h3>
                </div>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Item Count</th>
                        <th>Paybill</th>
                        <th>TillNo</th>
                    </tr>
                    <VendorRow />
                    <VendorRow />
                    <VendorRow />
                    <VendorRow />
                    <VendorRow />
                    <VendorRow />
                </table>
                <div id="actions">
                    <a className="btn action mute" id="deleteVendor" onClick={clickFunction}>DELETE</a>
                    <a className="btn action" id="createVendor" onClick={clickFunction}>CREATE</a>
                </div>
            </div>
        )
    }
}

class Items extends React.Component {
    render () {
        const {
            clickFunction
        } = this.props;

        return  (
            <div className="view" id="items">
                <div id="top">
                    <h3 className="header">MENU ITEMS</h3>
                    <div className="dropdown">
                        <a className="btn select" id="itemsFilter" onClick={clickFunction}>Filter</a>
                        <div className="dropdown-content">
                            <a className="drop" id="vendor" onClick={clickFunction}>vendor</a>
                            <a className="drop" id="category" onClick={clickFunction}>category</a>
                        </div>
                    </div>
                </div>
                <table>
                    <ItemRow />
                    <ItemRow />
                    <ItemRow />
                    <ItemRow />
                    <ItemRow />
                    <ItemRow />
                </table>
                <div id="actions">
                    <a className="btn action mute" id="deleteItem" onClick={clickFunction}>DELETE</a>
                    <a className="btn action" id="createItem" onClick={clickFunction}>CREATE</a>
                </div>
            </div>
        )
    }
}

class OrderRow extends React.Component {
    render () {
        return (
            <tr>
                <td>Lorem</td>
                <td>Ipsum</td>
                <td>Doloret</td>
                <td>100</td>
                <td>Paid</td>
            </tr>
        )
    }
}

class VendorRow extends React.Component {
    render () {
        return (
            <tr>
                <td>Lorem</td>
                <td>Ipsum</td>
                <td>Doloret</td>
                <td>100</td>
            </tr>
        )
    }
}

class ItemRow extends React.Component {
    render () {
        return (
            <tr>
                <td>Lorem</td>
                <td>Ipsum</td>
                <td>Doloret</td>
                <td>100</td>
            </tr>
        )
    }
}

const mount = document.querySelector('#root');
ReactDOM.render(<App />, mount);
