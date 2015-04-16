declare var require:any;
import app = require('../application');

/**
 * Base class representation of Filter Mode
 */
class ModeFilter {

    protected label:string;
    protected selected:boolean;

    constructor() {

        this.label = 'Undefinded';
        this.selected = false;

    }

    select() {

        this.selected = true;

    }

    unselect() {

        this.selected = false;

    }

    filter(input:string) : boolean {

        throw new Error('Must override this method');

    }

}

class All extends ModeFilter {

    constructor() {

        super();
        this.label = 'All';

    }

    filter(input:string) : boolean {

        return true;

    }

}

class Pending extends ModeFilter {

    constructor() {

        super();
        this.label = 'Pending';

    }

    filter(input) : boolean {

        return (!input.completed) ? true : false;

    }

}

class Completed extends ModeFilter {

    constructor() {

        super();
        this.label = 'Completed';

    }

    filter(input) : boolean {

        return (input.completed) ? true : false;

    }

}

class ShowModeSelectCtrl {

    public select;
    public list;
    public mode;

    public static $inject = [
        '$scope',
        '$transclude'
    ];

    constructor ($scope, $transclude) {

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

}


app.directive('showModeSelect', function () {

    return {
        scope: {
            mode: '='
        },
        templateUrl: 'component/show_mode_select.html',
        controllerAs: 'modes',
        controller: ShowModeSelectCtrl
    };

});

export = ShowModeSelectCtrl;