import React from 'react';


class Navigation extends React.Component {
    render() {
        const {
            manage,
            clickFunction
        } = this.props;

        return (
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
                                </div> :
                                <div className="hidden" />
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default Navigation;
