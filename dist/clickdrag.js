"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var objectAssign = require("react/lib/Object.assign");

var noop = function noop() {};

function clickDrag(Component) {
    var opts = arguments[1] === undefined ? {} : arguments[1];

    var touch = opts.touch || false;
    var resetOnSpecialKeys = opts.resetOnSpecialKeys || false;
    var getSpecificEventData = opts.getSpecificEventData || function () {
        return {};
    };

    var onDragStart = opts.onDragStart || noop;
    var onDragStop = opts.onDragStop || noop;
    var onDragMove = opts.onDragMove || noop;

    return (function (_React$Component) {
        var _class = function () {
            _classCallCheck(this, _class);

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
        };

        _inherits(_class, _React$Component);

        _createClass(_class, {
            componentDidMount: {
                value: function componentDidMount() {
                    var node = React.findDOMNode(this);

                    node.addEventListener("mousedown", this._onMouseDown);
                    document.addEventListener("mousemove", this._onMouseMove);
                    document.addEventListener("mouseup", this._onMouseUp);

                    if (touch) {
                        node.addEventListener("touchstart", this._onMouseDown);
                        document.addEventListener("touchmove", this._onMouseMove);
                        document.addEventListener("touchend", this._onMouseUp);
                    }
                }
            },
            componentWillUnmount: {
                value: function componentWillUnmount() {
                    var node = React.findDOMNode(this);

                    node.removeEventListener("mousedown", this._onMouseDown);
                    document.removeEventListener("mousemove", this._onMouseMove);
                    document.removeEventListener("mouseup", this._onMouseUp);

                    if (touch) {
                        node.removeEventListener("touchstart", this._onMouseDown);
                        document.removeEventListener("touchmove", this._onMouseMove);
                        document.removeEventListener("touchend", this._onMouseUp);
                    }
                }
            },
            _setMousePosition: {
                value: function _setMousePosition(x, y) {
                    this.setState({
                        isMouseDown: true,
                        isMoving: false,
                        mouseDownPositionX: x,
                        mouseDownPositionY: y,
                        moveDeltaX: 0,
                        moveDeltaY: 0
                    });
                }
            },
            _onMouseDown: {
                value: function _onMouseDown(e) {
                    // only left mouse button
                    if (touch || e.button === 0) {
                        var pt = e.changedTouches && e.changedTouches[0] || e;

                        this._setMousePosition(pt.clientX, pt.clientY);

                        onDragStart(e);
                    }
                }
            },
            _onMouseUp: {
                value: function _onMouseUp(e) {
                    if (this.state.isMouseDown) {
                        this.setState({
                            isMouseDown: false,
                            isMoving: false
                        });

                        onDragStop(e);
                    }
                }
            },
            _onMouseMove: {
                value: function _onMouseMove(e) {
                    if (this.state.isMouseDown) {
                        var pt = e.changedTouches && e.changedTouches[0] || e;

                        var isUsingSpecialKeys = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
                        if (resetOnSpecialKeys && this._wasUsingSpecialKeys !== isUsingSpecialKeys) {
                            this._wasUsingSpecialKeys = isUsingSpecialKeys;
                            this._setMousePosition(pt.clientX, pt.clientY);
                        } else {
                            this.setState(objectAssign({
                                isMoving: true,
                                moveDeltaX: pt.clientX - this.state.mouseDownPositionX,
                                moveDeltaY: pt.clientY - this.state.mouseDownPositionY
                            }, getSpecificEventData(e)));
                        }

                        onDragMove(e);
                    }
                }
            },
            render: {
                value: function render() {
                    return React.createElement(Component, _extends({}, this.props, { dataDrag: this.state }));
                }
            }
        });

        return _class;
    })(React.Component);
}

module.exports = clickDrag;
