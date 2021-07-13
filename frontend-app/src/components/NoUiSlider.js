import React, {Component} from "react";
import Nouislider from "nouislider-react";
// import "nouislider/distribute/nouislider.css";

export default class NoUiSlider extends Component {

    state = { value: 0 };

    handleClick = () => {
        this.setState(prevState => ({ value: prevState + 10 }));
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Change state</button>
                <Nouislider
                    range={{ min: 0, max: 100 }}
                    start={[20, 80]}
                    connect
                />
            </div>
        );
    }
}