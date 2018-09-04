
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'orders',
            data: [],
            filters: [
                {
                    type: 'vendor',
                    value: 'all'
                },
                {
                    type: 'status',
                    value: 'all'
                }
            ],
            filteredData: [],
            manage: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        this.getData('/orders', 'orders');
    }

    getData(endpoint, page='orders') {
        fetch(endpoint)
            .then(response =>
                response.json()
            )
            .then(results => {
                this.setState({
                    data: results.data,
                    filteredData: results.data,
                    filter: [
                        {
                            type: 'vendor',
                            value: 'all'
                        },
                        {
                            type: page === 'items' ? 'category' : 'paid',
                            value: 'all'
                        }
                    ],
                    page
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    filterData(data, filters) {
        let filteredData = data;

        filters.forEach(filter => {
            if (filter.value !== 'all'){
                filteredData = filteredData.filter(instance => {
                    return instance[filter.type] === filter.value
                })
            }
        });
        return filteredData;
    }

    handleFilter(e) {
        const {
            data,
            filters
        } = this.state;

        const id = e.target.getAttribute('id');
        const value = e.target.value;

        if (id === 'vendor-filter') {
            filters[0] = {
                type: 'vendor',
                value: value
            };
        } else if (id === 'status-filter') {
            filters[1] = {
                type: 'paid',
                value: value === 'all' ? value : value === 'Paid'
            };
        } else if (id === 'category-filter') {
            filters[1] = {
                type: 'category',
                value: value
            };
        }

        const filteredData = this.filterData(data, filters);

        this.setState({
            filters,
            filteredData
        })
    }

    handleClick(e) {
        const btn = e.target.getAttribute('id');

        switch (btn) {
            case 'orders':
                this.getData('/orders', 'orders');
                break;
            case 'manage':
                this.setState({
                    manage: !this.state.manage
                });
                break;
            case 'vendors':
                this.getData('/vendors', 'vendors');
                this.setState({
                    manage: false
                });
                break;
            case 'items':
                this.getData('/items', 'items');
                this.setState({
                    manage: false
                });
                break;
            default:
                break;
        }
    }

    render() {
        const {
            filteredData,
        } = this.state;
        return (
            <div classNameName="container">
                <Navigation clickFunction={this.handleClick} manage={this.state.manage}/>
                <div id="clear"></div>
                {
                    this.state.page === 'vendors' ? <Vendors data={filteredData} clickFunction={this.handleClick}/> :
                    this.state.page === 'items' ? <Items data={filteredData} clickFunction={this.handleClick} filterFunction={this.handleFilter}/> :
                    <Orders data={filteredData} clickFunction={this.handleClick} filterFunction={this.handleFilter}/>
                }
            </div>
        );
    }
}

class Navigation extends React.Component {
    render () {
        const {
            manage,
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
                    <div className="management">
                        <a className="btn nav" id="manage" onClick={clickFunction}>Manage</a>
                        {
                            manage ?
                            <div className="management-options">
                                <a className="drop" id="vendors" onClick={clickFunction}>vendors</a>
                                <a className="drop" id="items" onClick={clickFunction}>items</a>
                            </div>:
                            <div className="hidden"/>
                        }
                    </div>

                </div>
            </div>
        )
    }
}

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
            if (!vendors.has(order.vendor)){
                vendors.add(order.vendor);
            }
            return <OrderRow order={order}/>;
        })

        return (
            <div className="view" id="orders">
                <div id="top">
                    <h3 className="header">{new Date().toISOString().substring(0, 10)} | LUNCH ORDERS</h3>
                    <div className="filters">
                        <h4>Filter by: </h4>
                        <Filter options={Array.from(vendors)} filterFunction={filterFunction} id={'vendor-filter'} label={'Vendor'}/>
                        <Filter options={statuses} filterFunction={filterFunction} id={'status-filter'} label={'Status'}/>
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
                    {
                        rowItems.length > 0 ?
                        rowItems:
                        <BlankRow span={"5"} type={'orders'}/>
                    }
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
            data,
            clickFunction
        } = this.props;

        const rowItems = data.map(vendor => {
            return <VendorRow vendor={vendor} />;
        });

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
                    {
                        rowItems.length > 0 ?
                        rowItems:
                        <BlankRow span={"4"} type={'vendors'}/>
                    }
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
            data,
            clickFunction,
            filterFunction
        } = this.props;

        let vendors = new Set();
        let categories = new Set();

        const rowItems = data.map(item => {
            if (!vendors.has(item.vendor)) {
                vendors.add(item.vendor);
            }
            if (!categories.has(item.category)) {
                categories.add(item.category);
            }
            return <ItemRow item={item} />;
        })

        return  (
            <div className="view" id="items">
                <div id="top">
                    <h3 className="header">MENU ITEMS</h3>
                    <div className="filters">
                        <h4>Filter by: </h4>
                        <Filter options={Array.from(vendors)} filterFunction={filterFunction} id={'vendor-filter'} label={'Vendor'}/>
                        <Filter options={Array.from(categories)} filterFunction={filterFunction} id={'category-filter'} label={'Category'}/>
                    </div>
                </div>
                <table>
                    <tr>
                        <th>Item</th>
                        <th>Vendor</th>
                        <th>Price</th>
                        <th>Category</th>
                    </tr>
                    {
                        rowItems.length > 0 ?
                            rowItems :
                            <BlankRow span={"4"} type={'items'} />
                    }
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
        const {order} = this.props;
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
    render () {
        const {vendor} = this.props;
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
    render () {
        const {item} = this.props;
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
    render () {
        const text = `Zero ${ this.props.type } available`;
        return (
            <tr>
                <td colSpan={this.props.span}>{text}</td>
            </tr>
        )
    }
}

class Filter extends React.Component {
    render () {
        const {
            options,
            filterFunction,
            id,
            label
        } = this.props;

        const vendorsList = options.map(option => {
            return <option value={option}>{option.substring(0, 10)}</option>
        })

        return (
            <div className="filter-group">
                <p>{label}</p>
                <select id={id} onChange={filterFunction}>
                    <option value="all">All</option>
                    {vendorsList}
                </select>
            </div>
        )
    }
}

const mount = document.querySelector('#root');
ReactDOM.render(<App />, mount);
