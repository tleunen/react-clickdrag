"use strict";

var ReactClickDragMixin = {
    componentWillMount: function() {
        this.__isMouseDown = false;
        this.__startPosition = null;
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

    __onMouseDown: function(e) {
        // only left mouse button
        if (e.button !== 0) return

        this.__isMouseDown = true;
        this.__startPosition = {
            x: e.clientX,
            y: e.clientY
        };

        this._onDragStart && this._onDragStart(e, this.__startPosition);
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
                x: e.clientX - this.__startPosition.x,
                y: e.clientY - this.__startPosition.y
            };

            this._onDragMove && this._onDragMove(e, deltaPos);
        }
    }
};

module.exports = ReactClickDragMixin;