'use strict';

var React = require('react');
var objectAssign = require('react/lib/Object.assign');

var noop = function() {};

function clickDrag(Component, opts = {}) {

    var touch = opts.touch || false;
    var resetOnSpecialKeys = opts.resetOnSpecialKeys || false;
    var getSpecificEventData = opts.getSpecificEventData || function() { return {}; };

    var onDragStart = opts.onDragStart || noop;
    var onDragStop = opts.onDragStop || noop;
    var onDragMove = opts.onDragMove || noop;

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

            this._wasUsingSpecialKeys = false;
        }

        componentDidMount() {
            var node = React.findDOMNode(this);

            node.addEventListener('mousedown', this._onMouseDown);
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);

            if(touch) {
                node.addEventListener('touchstart', this._onMouseDown);
                document.addEventListener('touchmove', this._onMouseMove);
                document.addEventListener('touchend', this._onMouseUp);
            }
        }

        componentWillUnmount() {
            var node = React.findDOMNode(this);

            node.removeEventListener('mousedown', this._onMouseDown);
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('mouseup', this._onMouseUp);

            if(touch) {
                node.removeEventListener('touchstart', this._onMouseDown);
                document.removeEventListener('touchmove', this._onMouseMove);
                document.removeEventListener('touchend', this._onMouseUp);
            }
        }

        _setMousePosition(x, y) {
            this.setState({
                isMouseDown: true,
                isMoving: false,
                mouseDownPositionX: x,
                mouseDownPositionY: y,
                moveDeltaX: 0,
                moveDeltaY: 0
            });
        }

        _onMouseDown(e) {
            // only left mouse button
            if(touch || e.button === 0) {
                var pt = (e.changedTouches && e.changedTouches[0]) || e;

                this._setMousePosition(pt.clientX, pt.clientY);

                onDragStart(e);
            }
        }

        _onMouseUp(e) {
            if(this.state.isMouseDown) {
                this.setState({
                    isMouseDown: false,
                    isMoving: false
                });

                onDragStop(e);
            }
        }

        _onMouseMove(e) {
            if(this.state.isMouseDown) {
                var pt = (e.changedTouches && e.changedTouches[0]) || e;

                var isUsingSpecialKeys = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
                if(resetOnSpecialKeys && this._wasUsingSpecialKeys !== isUsingSpecialKeys) {
                    this._wasUsingSpecialKeys = isUsingSpecialKeys;
                    this._setMousePosition(pt.clientX, pt.clientY);
                }
                else {
                    this.setState(objectAssign({
                        isMoving: true,
                        moveDeltaX: pt.clientX - this.state.mouseDownPositionX,
                        moveDeltaY: pt.clientY - this.state.mouseDownPositionY
                    }, getSpecificEventData(e)));
                }

                onDragMove(e);
            }
        }

        render() {
            return <Component {...this.props} dataDrag={this.state} />;
        }
    };
}

module.exports = clickDrag;
