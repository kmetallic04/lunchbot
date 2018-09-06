import React from 'react';

import Navigation from './components/navigation';
import Orders from './components/orders';
import Vendors from './components/vendors';
import Items from './components/items';

class Dashboard extends React.Component {
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
            <div className="container">
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


export default Dashboard;
