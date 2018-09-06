import React from 'react';
import Filter from './partials/filters';

const {
    ItemRow,
    BlankRow
} = require('./partials/rows');

class Items extends React.Component {
    render() {
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
            return <ItemRow key={item._id} item={item} />;
        })

        return (
            <div className="view" id="items">
                <div id="top">
                    <h3 className="header">MENU ITEMS</h3>
                    <div className="filters">
                        <h4>Filter by: </h4>
                        <Filter options={Array.from(vendors)} filterFunction={filterFunction} id={'vendor-filter'} label={'Vendor'} />
                        <Filter options={Array.from(categories)} filterFunction={filterFunction} id={'category-filter'} label={'Category'} />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Vendor</th>
                            <th>Price</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rowItems.length > 0 ?
                                rowItems :
                                <BlankRow span={"4"} type={'items'} />
                        }
                    </tbody>
                </table>
                <div id="actions">
                    <a className="btn action mute" id="deleteItem" onClick={clickFunction}>DELETE</a>
                    <a className="btn action" id="createItem" onClick={clickFunction}>CREATE</a>
                </div>
            </div>
        )
    }
}

export default Items;
