'use strict';

var React = require('react');

function clickDrag(Component) {

    return React.createClass({
        getInitialState: function() {
            return {
                isMouseDown: false,
                isMoving: false,
                mouseDownPositionX: 0,
                mouseDownPositionY: 0,
                moveDeltaX: 0,
                moveDeltaY: 0
            };
        },

        componentDidMount: function() {
            var node = React.findDOMNode(this);

            node.addEventListener('mousedown', this._onMouseDown);
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
        },

        componentWillUnmount: function() {
            var node = React.findDOMNode(this);

            node.removeEventListener('mousedown', this._onMouseDown);
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('mouseup', this._onMouseUp);
        },

        _onMouseDown: function(e) {
            // only left mouse button
            if (e.button === 0) {
                this.setState({
                    isMouseDown: true,
                    isMoving: false,
                    mouseDownPositionX: e.clientX,
                    mouseDownPositionY: e.clientY,
                    moveDeltaX: 0,
                    moveDeltaY: 0
                });
            }
        },

        _onMouseUp: function() {
            if(this.state.isMouseDown) {
                this.setState({
                    isMouseDown: false,
                    isMoving: false
                });
            }
        },

        _onMouseMove: function(e) {
            if(this.state.isMouseDown) {
                this.setState({
                    isMoving: true,
                    moveDeltaX: e.clientX - this.state.mouseDownPositionX,
                    moveDeltaY: e.clientY - this.state.mouseDownPositionY
                });
            }
        },

        render: function() {
            return <Component {...this.props} dataDrag={this.state} />;
        }

    });
}

module.exports = clickDrag;