'use strict';

var React = require('react');

function clickDrag(Component) {

    return class extends React.Component {
        constructor() {
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);


            this.state = {
                isMouseDown: false,
                isMoving: false,
                mouseDownPositionX: 0,
                mouseDownPositionY: 0,
                moveDeltaX: 0,
                moveDeltaY: 0
            };
        }

        componentDidMount() {
            var node = React.findDOMNode(this);

            node.addEventListener('mousedown', this._onMouseDown);
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
        }

        componentWillUnmount() {
            var node = React.findDOMNode(this);

            node.removeEventListener('mousedown', this._onMouseDown);
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('mouseup', this._onMouseUp);
        }

        _onMouseDown(e) {
            // only left mouse button
            if(e.button === 0) {
                this.setState({
                    isMouseDown: true,
                    isMoving: false,
                    mouseDownPositionX: e.clientX,
                    mouseDownPositionY: e.clientY,
                    moveDeltaX: 0,
                    moveDeltaY: 0
                });
            }
        }

        _onMouseUp() {
            if(this.state.isMouseDown) {
                this.setState({
                    isMouseDown: false,
                    isMoving: false
                });
            }
        }

        _onMouseMove(e) {
            if(this.state.isMouseDown) {
                this.setState({
                    isMoving: true,
                    moveDeltaX: e.clientX - this.state.mouseDownPositionX,
                    moveDeltaY: e.clientY - this.state.mouseDownPositionY
                });
            }
        }

        render() {
            return <Component {...this.props} dataDrag={this.state} />;
        }
    };
}

module.exports = clickDrag;