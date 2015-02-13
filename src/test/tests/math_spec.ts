/**
 * License: see license.txt file.
 */


/// <reference path="../../../lib/jasmine/jasmine.d.ts" />
/// <reference path="../../math/Color.ts" />
/// <reference path="../../math/Rectangle.ts" />

module test.math {

    import Color = cc.math.Color;
    import Vector = cc.math.Vector;
    import Rectangle = cc.math.Rectangle;

    "use strict";

    describe("Math", function() {
        describe("Color", function () {

            beforeEach(function () {
                jasmine.addMatchers({
                    toEqual: function (util, customEqualityTesters) {

                        return {
                            compare: function (actual, expected) {

                                var result:any = {
                                    pass: false,
                                    message: ""
                                };

                                if (actual instanceof cc.math.Color && expected instanceof cc.math.Color) {

                                    result.pass = actual._color[0] === expected._color[0] &&
                                        actual._color[1] === expected._color[1] &&
                                        actual._color[2] === expected._color[2] &&
                                        actual._color[3] === expected._color[3];

                                } else {

                                    result.pass = util.equals(actual, expected, customEqualityTesters);
                                }

                                if (result.pass) {
                                    result.message = "Colors  match.";
                                } else {
                                    result.message = "Colors don't match.";
                                }

                                return result;
                            }
                        }

                    }
                });
            });

            it("Built in white color RGB", function () {
                expect(cc.math.Color.WHITE).toEqual(new cc.math.Color(1, 1, 1));
            });
            it("Built in white color RGBA", function () {
                expect(cc.math.Color.WHITE).toEqual(new cc.math.Color(1, 1, 1, 1));
            });
            it("Built in blue color RGBA", function () {
                expect(cc.math.Color.BLUE).toEqual(new cc.math.Color(0, 0, 1, 1));
            });
            it("Red component form RGBA", function () {
                expect(1).toEqual(new cc.math.Color(1, 0, 0, 1).r);
            });
            it("Alpha component form RGBA", function () {
                expect(0).toEqual(new cc.math.Color(1, 0, 0, 0).a);
            });
            it("Alpha component form RGB", function () {
                expect(1).toEqual(new cc.math.Color(1, 1, 1).a);
            });

            it("Creation from JSON", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.createFromRGBA({r: 255, g: 255, b: 255, a: 255}));
            });

            it("Build from RGB", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("FFF"));
            });
            it("Build from RGBA", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("FFFF"));
            });
            it("Build from #RGB", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("#FFF"));
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#F0F"));
            });
            it("Build from #rgb", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#f0f"));
            });
            it("Build from #RGBA", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("#FFFF"));
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#F0FF"));
            });
            it("Build from #rgba", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#f0ff"));
            });
            it("Build from RRGGBB", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("FFFFFF"));
            });
            it("Build from RRGGBBAA", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("FFFFFFFF"));
            });
            it("Build from #RRGGBB", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("#FFFFFF"));
                expect(cc.math.Color.RED.getHexRGB()).toEqual("#FF0000");
            });
            it("Build from #rrggbbB", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#ff0ff"));
            });
            it("Build from #RRGGBBAA", function () {
                expect(cc.math.Color.WHITE).toEqual(cc.math.Color.fromStringToColor("#FFFFFFFF"));
                expect(cc.math.Color.GREEN.getHexRGBA()).toEqual("#00FF00FF");
            });
            it("Build from #rrggbbaa", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("#ff0ffff"));
            });
            it("Build from rgb(rrr,ggg,bbb)", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("rgb(255,0,255)"));
            });
            it("Build from rgba(rrr,ggg,bbb,a)", function () {
                expect(cc.math.Color.MAGENTA).toEqual(cc.math.Color.fromStringToColor("rgb(255,0,255,1)"));
            });
            it("Build from rgba(rrr,ggg,bbb,a) - 2", function () {
                 expect(cc.math.Color.TRANSPARENT_BLACK).toEqual(cc.math.Color.fromStringToColor("rgb(0,0,0,0)"));
            });

            it("getHexRGBA", function () {
                expect(cc.math.Color.createFromRGBA(cc.math.Color.GREEN.getHexRGBA())).toEqual(cc.math.Color.GREEN);
            });

        });

        describe("Rect", function() {
            it("test intersection", function() {
                var r0 : Rectangle = new Rectangle(100,100,100,100);

                var r1 : Rectangle = new Rectangle();

                expect( r1.set( 50,50,100,100 ).intersectsWith(r0) ).toBe(true);
                expect( r1.set( 150,50,100,100 ).intersectsWith(r0) ).toBe(true);
                expect( r1.set( 50,150,100,100 ).intersectsWith(r0) ).toBe(true);
                expect( r1.set( 150,150,100,100 ).intersectsWith(r0) ).toBe(true);
                expect( r1.set( 50,50,100,100 ).intersects(100,100,100,100) ).toBe(true);
                expect( r1.set( 150,50,100,100 ).intersects(100,100,100,100) ).toBe(true);
                expect( r1.set( 50,150,100,100 ).intersects(100,100,100,100) ).toBe(true);
                expect( r1.set( 150,150,100,100 ).intersects(100,100,100,100) ).toBe(true);

                expect( r1.set( 20,20,50,50 ).intersectsWith(r0) ).toBe(false);
                expect( r1.set( 250,50,50,50 ).intersectsWith(r0) ).toBe(false);
                expect( r1.set( 20,150,50,50 ).intersectsWith(r0) ).toBe(false);
                expect( r1.set( 250,150,50,50 ).intersectsWith(r0) ).toBe(false);
                expect( r1.set( 20,20,50,50 ).intersects(100,100,100,100) ).toBe(false);
                expect( r1.set( 250,50,50,50 ).intersects(100,100,100,100) ).toBe(false);
                expect( r1.set( 20,150,50,50 ).intersects(100,100,100,100) ).toBe(false);
                expect( r1.set( 250,150,50,50 ).intersects(100,100,100,100) ).toBe(false);
            });

            it("test intersection result", function() {

                var r0 : Rectangle = new Rectangle(100,100,100,100);
                var r1 : Rectangle = new Rectangle();

                expect( r1.set( 50,50,100,100 ).intersectWith(r0) ).toEqual( new Rectangle(100,100,50,50) );
            });

            it("test void intersection result", function() {

                var r0 : Rectangle = new Rectangle(100,100,100,100);
                var r1 : Rectangle = new Rectangle();

                expect( r1.set( 50,50,10,10 ).intersectWith(r0) ).toEqual( new Rectangle(0,0,0,0) );
            });

            it("test point in rect", function() {
                var r0 : Rectangle = new Rectangle(100,100,100,100);
                expect( r0.contains( 100,100 ) ).toBe(true);
                expect( r0.contains( 200,200 ) ).toBe(false);
                expect( r0.contains( new Vector(100,100) ) ).toBe(true);
                expect( r0.contains( new Vector(200,200) ) ).toBe(false);
            });
        });
    });
}