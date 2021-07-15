import React, {Component} from "react";
import Nouislider from "nouislider-react";
// import "nouislider/distribute/nouislider.css";

export default class NoUiSlider extends Component {

    state = {value: 0};

    constructor(props) {
        super(props);
        this.state = {
            min: 0,
            max: 1,
        }
    }

    render() {
        if (this.props.min === this.props.max) return ''
        return (
            <div className="price-range-area">
                <Nouislider
                    range={{min: this.props.min, max: this.props.max}}
                    start={[this.props.min, this.props.max]}
                    connect
                    onSlide={(data) => {
                        this.setState({
                            min: data[0],
                            max: data[1],
                        })
                    }}
                />
                <div className="value-wrapper d-flex">
                    <div className="price">{this.props.title}:</div>
                    {this.props.symbol ? <span>{this.props.symbol}</span> : ''}
                    <div>{this.state.min}</div>
                    <div className="to">to</div>
                    {this.props.symbol ? <span>{this.props.symbol}</span> : ''}
                    <div>{this.state.max}</div>
                </div>
            </div>
        );
    }
}