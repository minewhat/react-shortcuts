'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _combokeys = require('combokeys');

var _combokeys2 = _interopRequireDefault(_combokeys);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this._combokeys = null, _this._lastEvent = null, _this._bindShortcuts = function (shortcutsArr) {
      var element = _this._getElementToBind();
      element.setAttribute('tabindex', _this.props.tabIndex);
      _this._combokeys = new _combokeys2.default(element);
      _this._decorateCombokeys();
      _this._combokeys.bind(shortcutsArr, _this._handleShortcuts, _this.props.eventType);

      if (_this.props.global) {
        element.addEventListener('shortcuts:global', _this._customGlobalHandler);
      }
    }, _this._customGlobalHandler = function (e) {
      var _e$detail = e.detail,
          character = _e$detail.character,
          modifiers = _e$detail.modifiers,
          event = _e$detail.event;


      var targetNode = null;
      if (_this.props.targetNodeSelector) {
        targetNode = document.querySelector(_this.props.targetNodeSelector);
      }

      if (e.target !== _this._domNode && e.target !== targetNode) {
        _this._combokeys.handleKey(character, modifiers, event, true);
      }
    }, _this._decorateCombokeys = function () {
      var element = _this._getElementToBind();
      var originalHandleKey = _this._combokeys.handleKey.bind(_this._combokeys);

      // NOTE: stopCallback is a method that is called to see
      // if the keyboard event should fire
      _this._combokeys.stopCallback = function (event, domElement, combo) {
        var isInputLikeElement = domElement.tagName === 'INPUT' || domElement.tagName === 'SELECT' || domElement.tagName === 'TEXTAREA' || domElement.contentEditable && domElement.contentEditable === 'true';

        var isReturnString = void 0;
        if (event.key) {
          isReturnString = event.key.length === 1;
        } else {
          isReturnString = Boolean(_helpers2.default.getCharacter(event));
        }

        if (isInputLikeElement && isReturnString && !_this.props.alwaysFireHandler) {
          return true;
        }

        return false;
      };

      _this._combokeys.handleKey = function (character, modifiers, event, isGlobalHandler) {
        if (_this._lastEvent && event.timeStamp === _this._lastEvent.timeStamp && event.type === _this._lastEvent.type) {
          return;
        }
        _this._lastEvent = event;

        var isolateOwner = false;
        if (_this.props.isolate && !event.__isolateShortcuts) {
          event.__isolateShortcuts = true;
          isolateOwner = true;
        }

        if (!isGlobalHandler) {
          element.dispatchEvent(new CustomEvent('shortcuts:global', {
            detail: { character: character, modifiers: modifiers, event: event },
            bubbles: true,
            cancelable: true
          }));
        }

        // NOTE: works normally if it's not an isolated event
        if (!event.__isolateShortcuts) {
          if (_this.props.preventDefault) {
            event.preventDefault();
          }
          if (_this.props.stopPropagation && !isGlobalHandler) {
            event.stopPropagation();
          }
          originalHandleKey(character, modifiers, event);
          return;
        }

        // NOTE: global shortcuts should work even for an isolated event
        if (_this.props.global || isolateOwner) {
          originalHandleKey(character, modifiers, event);
        }
      };
    }, _this._getElementToBind = function () {
      var element = null;
      if (_this.props.targetNodeSelector) {
        element = document.querySelector(_this.props.targetNodeSelector);
        (0, _invariant2.default)(element, 'Node selector \'' + _this.props.targetNodeSelector + '\'  was not found.');
      } else {
        element = _this._domNode;
      }

      return element;
    }, _this._unbindShortcuts = function () {
      if (_this._combokeys) {
        _this._combokeys.detach();
        _this._combokeys.reset();
      }
    }, _this._onUpdate = function () {
      var shortcutsArr = _this.props.name && _this.props.shortcuts.getShortcuts(_this.props.name);
      _this._unbindShortcuts();
      _this._bindShortcuts(shortcutsArr || []);
    }, _this._handleShortcuts = function (event, keyName) {
      if (_this.props.name) {
        var shortcutName = _this.props.shortcuts.findShortcutName(keyName, _this.props.name);

        if (_this.props.handler) {
          _this.props.handler(shortcutName, event);
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_class, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._onUpdate();

      if (this.props.name) {
        this.props.shortcuts.addUpdateListener(this._onUpdate);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unbindShortcuts();

      if (this.props.name) {
        this.props.shortcuts.removeUpdateListener(this._onUpdate);
      }

      if (this.props.global) {
        var element = this._getElementToBind();
        element.removeEventListener('shortcuts:global', this._customGlobalHandler);
      }
    }

    // NOTE: combokeys must be instance per component

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(node) {
            _this2._domNode = node;
          },
          tabIndex: this.props.tabIndex,
          className: this.props.className
        },
        this.props.children
      );
    }
  }]);

  return _class;
}(_react2.default.Component);

_class.displayName = 'Shortcuts';
_class.propTypes = {
  children: _propTypes2.default.node,
  handler: _propTypes2.default.func,
  name: _propTypes2.default.string,
  tabIndex: _propTypes2.default.number,
  className: _propTypes2.default.string,
  eventType: _propTypes2.default.string,
  stopPropagation: _propTypes2.default.bool,
  preventDefault: _propTypes2.default.bool,
  targetNodeSelector: _propTypes2.default.string,
  global: _propTypes2.default.bool,
  isolate: _propTypes2.default.bool,
  alwaysFireHandler: _propTypes2.default.bool,
  shortcuts: _propTypes2.default.object.isRequired
};
_class.defaultProps = {
  tabIndex: -1,
  className: null,
  eventType: null,
  stopPropagation: true,
  preventDefault: false,
  targetNodeSelector: null,
  global: false,
  isolate: false,
  alwaysFireHandler: false,
  shortcuts: null
};
exports.default = _class;
module.exports = exports['default'];