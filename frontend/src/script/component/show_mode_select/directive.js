"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var app = require('../../app');
/**
 * Base class representation of Filter Mode
 */
var ModeFilter = (function () {
    function ModeFilter() {
        this.label = 'Undefinded';
        this.selected = false;
    }
    ModeFilter.prototype.select = function () {
        this.selected = true;
    };
    ModeFilter.prototype.unselect = function () {
        this.selected = false;
    };
    ModeFilter.prototype.filter = function (input) {
        throw new Error('Must override this method');
    };
    return ModeFilter;
})();
var All = (function (_super) {
    __extends(All, _super);
    function All() {
        _super.call(this);
        this.label = 'All';
    }
    All.prototype.filter = function (input) {
        return true;
    };
    return All;
})(ModeFilter);
var Pending = (function (_super) {
    __extends(Pending, _super);
    function Pending() {
        _super.call(this);
        this.label = 'Pending';
    }
    Pending.prototype.filter = function (input) {
        return (!input.completed) ? true : false;
    };
    return Pending;
})(ModeFilter);
var Completed = (function (_super) {
    __extends(Completed, _super);
    function Completed() {
        _super.call(this);
        this.label = 'Completed';
    }
    Completed.prototype.filter = function (input) {
        return (input.completed) ? true : false;
    };
    return Completed;
})(ModeFilter);
var ShowModeSelectCtrl = (function () {
    function ShowModeSelectCtrl($scope, $transclude) {
        this.select = function (mode) {
            // Unselect currently selected button
            this.mode.unselect();
            // Select
            mode.select();
            this.mode = mode;
            $scope.mode.selected = mode;
        };
        // Initiallize starting mode
        this.list = [new All(), new Pending(), new Completed()];
        this.mode = this.list[1];
        this.mode.select();
        $scope.mode.selected = this.mode;
    }
    ShowModeSelectCtrl.$inject = [
        '$scope',
        '$transclude'
    ];
    return ShowModeSelectCtrl;
})();
app.directive('showModeSelect', function () {
    return {
        scope: {
            mode: '='
        },
        templateUrl: 'script/component/show_mode_select/view.html',
        controllerAs: 'modes',
        controller: ShowModeSelectCtrl
    };
});
module.exports = ShowModeSelectCtrl;
//# sourceMappingURL=directive.js.map