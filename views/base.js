(function() {
  "use strict";

  var async = require('async'),
      _     = require('underscore'),

      render, getName, getTemplate, getSubviews,

      getProto,
      _protoSet;

  getName     = function get_name()     { return this._view_name };
  getTemplate = function get_template() { return this._template  };
  getSubviews = function get_subviews() { return this._subviews  };

  render = function base_view_render( res, data, cb ) {
    res.render( this.getTemplate(), data, cb);
  };

  _protoSet = {
    std : { render : render, getName : getName, getTemplate : getTemplate, getSubviews : getSubviews }
  };
  getProto = function get_proto( type ) {
    return _.clone( _protoSet[ type ] );
  };

  module.exports = {
    render      : render,
    getName     : getName,
    getTemplate : getTemplate,
    getSubviews : getSubviews,
    getProto    : getProto
  };
}());
