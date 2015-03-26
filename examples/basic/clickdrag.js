"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

function clickDrag(Component) {

    return React.createClass({
        getInitialState: function getInitialState() {
            return {
                isMouseDown: false,
                mouseDownPositionX: 0,
                mouseDownPositionY: 0,
                moveDeltaX: 0,
                moveDeltaY: 0
            };
        },

        componentDidMount: function componentDidMount() {
            var node = React.findDOMNode(this);

            node.addEventListener("mousedown", this._onMouseDown);
            document.addEventListener("mousemove", this._onMouseMove);
            document.addEventListener("mouseup", this._onMouseUp);
        },

        componentWillUnmount: function componentWillUnmount() {
            var node = React.findDOMNode(this);

            node.removeEventListener("mousedown", this._onMouseDown);
            document.removeEventListener("mousemove", this._onMouseMove);
            document.removeEventListener("mouseup", this._onMouseUp);
        },

        _onMouseDown: function _onMouseDown(e) {
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

        _onMouseUp: function _onMouseUp() {
            if (this.state.isMouseDown) {
                this.setState({
                    isMouseDown: false,
                    isMoving: false
                });
            }
        },

        _onMouseMove: function _onMouseMove(e) {
            if (this.state.isMouseDown) {
                this.setState({
                    isMoving: true,
                    moveDeltaX: e.clientX - this.state.mouseDownPositionX,
                    moveDeltaY: e.clientY - this.state.mouseDownPositionY
                });
            }
        },

        render: function render() {
            return React.createElement(Component, _extends({}, this.props, { dataDrag: this.state }));
        }

    });
}

module.exports = clickDrag;
