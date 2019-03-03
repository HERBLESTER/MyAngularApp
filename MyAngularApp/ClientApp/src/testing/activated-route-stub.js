"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
var ActivatedRouteStub = /** @class */ (function () {
    function ActivatedRouteStub(initialParams) {
        // Use a ReplaySubject to share previous values with subscribers
        // and pump new values into the `paramMap` observable
        this.subject = new rxjs_1.ReplaySubject();
        /** The mock paramMap observable */
        this.paramMap = this.subject.asObservable();
        this.setParamMap(initialParams);
        //  console.log(initialParams);
    }
    /** Set the paramMap observables's next value */
    ActivatedRouteStub.prototype.setParamMap = function (params) {
        var pMap = router_1.convertToParamMap(params);
        console.log(pMap.keys);
        this.subject.next(pMap);
        console.log(this.paramMap.forEach(function (val) { return val; }));
    };
    ;
    return ActivatedRouteStub;
}());
exports.ActivatedRouteStub = ActivatedRouteStub;
//# sourceMappingURL=activated-route-stub.js.map