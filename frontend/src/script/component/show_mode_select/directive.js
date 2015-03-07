"use strict";

define(["app"], function (app) {

    app.directive('showModeSelect', function () {
        
        return {
            scope: {
                mode: '='
            },
            templateUrl: 'script/component/show_mode_select/view.html',
            controllerAs: 'modes',
            controller: function ($scope, $transclude) {
                
                /**
                 * Base class representation of Filter Mode
                 */
                class ModeFilter {

                    constructor () {

                        this.label = 'Undefinded';
                        this.selected = false;

                    }

                    select () {

                        this.selected = true;

                    }

                    unselect () {

                        this.selected = false;
                        
                    }

                    filter () {

                        throw new Error('Must override this method');

                    }

                }

                class All extends ModeFilter {

                    constructor () {

                        super();
                        this.label = 'All';

                    }

                    filter (input) {

                        return true;

                    }

                }

                class Pending extends ModeFilter {

                    constructor () {

                        super();
                        this.label = 'Pending';

                    }

                    filter (input) {

                        return (!input.completed) ? true : false;

                    }

                }

                class Completed extends ModeFilter {

                    constructor () {

                        super();
                        this.label = 'Completed';

                    }

                    filter (input) {

                        return (input.completed) ? true : false;

                    }                    

                }

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
        };

    });

});