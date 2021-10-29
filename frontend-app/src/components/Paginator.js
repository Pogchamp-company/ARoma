import React, {Component} from "react";

export default class Paginator extends Component {

    render() {
        return (
            <div className="pagination">
                <button onClick={(e => {
                    if (this.props.page - 1 >= 1) this.props.setPage(this.props.page - 1)
                })}>&laquo;</button>

                {Array.from({length: this.props.pagesCount}, (v, k) => k + 1).map(value => {
                    return <button className={this.props.page === value ? "active" : ""} onClick={e => {
                        if (this.props.page !== value) this.props.setPage(value)
                    }
                    }>{value}</button>
                })}
                <button onClick={(e => {
                    if (this.props.page + 1 <= this.props.pagesCount) this.props.setPage(this.props.page + 1)
                })}>&raquo;</button>
            </div>
        )
    }
}