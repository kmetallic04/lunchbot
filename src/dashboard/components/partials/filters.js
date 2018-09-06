import React from 'react';

class Filter extends React.Component {
    render() {
        const {
            options,
            filterFunction,
            id,
            label
        } = this.props;

        const vendorsList = options.map(option => {
            return <option key={option} value={option}>{option.substring(0, 10)}</option>
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

export default Filter;
