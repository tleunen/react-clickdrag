"use strict";

var ReactClickDragMixin = {
    componentWillMount: function() {
        this.__isMouseDown = false;
        this.__mouseDownPosition = {
            x: 0,
            y: 0
        };
    },

    componentDidMount: function() {
        var node = this.getDOMNode();

        node.addEventListener('mousedown', this.__onMouseDown);
        document.addEventListener('mousemove', this.__onMouseMove);
        document.addEventListener('mouseup', this.__onMouseUp);
    },

    componentWillUnmount: function() {
        var node = this.getDOMNode();

        node.removeEventListener('mousedown', this.__onMouseDown);
        document.removeEventListener('mousemove', this.__onMouseMove);
        document.removeEventListener('mouseup', this.__onMouseUp);
    },

    setMousePosition: function(x, y) {
        this.__mouseDownPosition.x = x;
        this.__mouseDownPosition.y = y;
    },

    __onMouseDown: function(e) {
        // only left mouse button
        if (e.button !== 0) return

        this.__isMouseDown = true;
        this.setMousePosition(e.clientX, e.clientY);

        this._onDragStart && this._onDragStart(e, this.__mouseDownPosition);
    },

    __onMouseUp: function(e) {
        if(this.__isMouseDown) {

            this.__isMouseDown = false;
            this._onDragStop && this._onDragStop(e);
        }
    },

    __onMouseMove: function(e) {
        if(this.__isMouseDown) {

            var deltaPos = {
                x: e.clientX - this.__mouseDownPosition.x,
                y: e.clientY - this.__mouseDownPosition.y
            };

            this._onDragMove && this._onDragMove(e, deltaPos);
        }
    }
};

module.exports = ReactClickDragMixin;