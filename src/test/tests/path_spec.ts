/**
 * License: see license.txt file.
 */


/// <reference path="../../../lib/jasmine/jasmine.d.ts" />
/// <reference path="../../math/Point.ts" />
/// <reference path="../../math/path/Segment.ts" />
/// <reference path="../../math/path/SegmentLine.ts" />
/// <reference path="../../math/path/BezierTracer.ts" />
/// <reference path="../../math/path/SegmentQuadratic.ts" />
/// <reference path="../../math/path/SegmentBezier.ts" />
/// <reference path="../../math/path/SubPath.ts" />
/// <reference path="../../math/Path.ts" />


module test.math {

    "use strict";

    import Point= cc.math.Point;
    import Vector= cc.math.Vector;
    import Segment= cc.math.path.Segment;
    import SegmentLine= cc.math.path.SegmentLine;
    import SegmentQuadratic= cc.math.path.SegmentQuadratic;
    import SegmentBezier= cc.math.path.SegmentBezier;
    import SubPath= cc.math.path.SubPath;
    import Path= cc.math.Path;


    describe("cc.paht", function () {

        it("test chained moveTo", function () {

            var path:Path = new Path();
            path.moveTo(5, 5);
            path.moveTo(15, 15);
            path.moveTo(7, 7);

            expect(path.numSubPaths()).toBe(1);
            expect(path.getCurrentTracePosition()).toEqual(new Vector(7, 7));
        });

        it("test beginPath", function () {

            var path= new Path();
            path.rect(0,0,100,100);
            path.rect(20,20,100,100);
            path.rect(40,40,100,100);

            path.beginPath();

            expect( path.numSubPaths() ).toBe( 0 );
            expect( path.getCurrentTracePosition() ).toEqual( {x:0, y:0} );
        });

        it("test lineTo in empty path", function() {

            var path : Path = new Path();
            path.lineTo(100,100);

            expect( path.numSubPaths() ).toBe(1);
            expect( (<SubPath>path._segments[0]).numSegments() ).toBe( 1 );
            expect( path.getLength() ).toBeCloseTo( 0, .001 );
        });


        it("test empty path [moveTo then closePath]", function() {
            var path:Path = new Path();

            path.moveTo(50, 50);
            path.closePath();

            expect( path.getLength() ).toBe(0);
            expect( path.getValueAt(.5) ).toEqual( new Vector(50,50) );

        });

        describe("test lineTo", function() {

            it("test lineTo from closedPath", function () {

                var path:Path = new Path();

                path.moveTo(50, 50);
                path.lineTo(100, 50);
                path.lineTo(100, 100);
                path.lineTo(50, 100);
                path.closePath();

                expect(path.numSubPaths()).toBe(1);
                expect((<SubPath>path._segments[0]).numSegments()).toBe(4);
                expect(path.getLength()).toBeCloseTo(200, .01);

                path.lineTo(250, 250);

                expect(path.numSubPaths()).toBe(2);

                var sp:SubPath = <SubPath>path._segments[1];
                expect(sp.numSegments()).toBe(1);
            });

            it("test path getValueAt", function () {

                var path:Path = new Path();

                path.moveTo(50, 50);
                path.lineTo(100, 50);
                path.lineTo(100, 100);
                path.lineTo(50, 100);
                path.closePath();

                var v2 = path.getValueAt(.05);
                expect(v2).toEqual(new Vector(60, 50));
                var v0 = path.getValueAt(.5);
                expect(v0).toEqual(new Vector(100, 100));
                var v1 = path.getValueAt(.75);
                expect(v1).toEqual(new Vector(50, 100));
            });
        });

        describe("test rect", function() {

            it("properly SubPathing [one rect 2 subpaths, one empty]", function() {

                var path : Path = new Path();

                path.rect(300,300,100,100);

                // rect creates a subpath with the rect, and another empty subpath
                expect( path.numSubPaths() ).toBe( 2 );
                expect( path._currentSubPath.numSegments() ).toBe(0);
            });

            it("properly SubPathing 2", function() {

                var path : Path = new Path();

                path.moveTo(50,50);
                path.lineTo(100,50);
                path.rect(300,300,100,100);

                // rect creates a subpath with the rect, and another empty subpath
                expect( path.numSubPaths() ).toBe( 3 );
                expect( (<SubPath>path._segments[1]).getStartingPoint() ).toEqual( new Vector(300,300) );

                path.rect(400,400,100,100);
                expect( path.numSubPaths() ).toBe( 4 );
                expect( (<SubPath>path._segments[1]).getStartingPoint() ).toEqual( new Vector(300,300) );
                expect( (<SubPath>path._segments[2]).getStartingPoint() ).toEqual( new Vector(400,400) );
            });

        });

        describe("test arc", function() {

            it("has correct numer of subpaths and segments", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, Math.PI / 3, false);
                path.arc(110, 50, r, 0, Math.PI / 3, true);

                expect(path.numSubPaths()).toBe(1);

                // 3 segments: arc, line, arc
                expect((<SubPath>path._segments[0]).numSegments()).toBe(3);
            });

            it("two arcs have segments correctly set", function() {
                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, Math.PI / 3, false);
                path.arc(110, 50, r, 0, Math.PI / 3, true);

                var sp : SubPath= (<SubPath>path._segments[0]);

                expect( sp._segments[0].getEndingPoint() ).toEqual( sp._segments[1].getStartingPoint() );
                expect( sp._segments[1].getEndingPoint() ).toEqual( sp._segments[2].getStartingPoint() );

                expect(
                    sp._segments[0].getLength() +
                    sp._segments[2].getLength()).toBeCloseTo(2 * Math.PI * r, .0001);
            });

            it("has correct length", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, Math.PI / 3, false);
                path.arc(110, 50, r, 0, Math.PI / 3, true);

                expect(path.numSubPaths()).toBe(1);

                // 3 segments: arc, line, arc
                expect((<SubPath>path._segments[0]).numSegments()).toBe(3);

                expect(path.getLength()).toBeCloseTo(
                    2 * Math.PI * r +
                     Vector.distance(
                         (<SubPath>path._segments[0])._segments[0].getEndingPoint(),
                         (<SubPath>path._segments[0])._segments[2].getStartingPoint()
                     ), .0001);
            });

            it("Mixed with rect", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, Math.PI / 3, false);
                path.rect(100,100,100,100);

                expect(path.numSubPaths()).toBe(3);

            });


            it("Mixed with rect has correct length", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, Math.PI / 3, false);
                path.rect(100,100,100,100);

                expect(path.numSubPaths()).toBe(3);

                expect( path.getLength() ).toBe( r*Math.PI/3 + 100*4 );

            });

            it("Path with only an arc is ok", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, 8*Math.PI, false);

                expect(path.numSubPaths()).toBe(1);
                expect((<SubPath>path._segments[0]).numSegments()).toBe(1);

            });

            it("maximum length 2PI", function () {

                var r = 25;
                var path:Path = new Path();

                path.arc(50, 50, r, 0, 8*Math.PI, false);

                expect(path.numSubPaths()).toBe(1);

                expect( path.getLength() ).toBeCloseTo( 2*Math.PI*r, .0001 );

            });

        });

        describe("test Quadratic", function() {

            it("length and flatten length", function() {

                var sq1= new SegmentQuadratic({
                    p0 : { x:0, y:0},
                    p1 : { x:50,y:100},
                    p2 : { x:50,y:50}
                });

                var sq0= cc.math.Path.createFromPoints( sq1.trace() );

                expect( sq0.getLength() ).toBeCloseTo( sq1.getLength(), .001 );

            });

            it("Dirty non flattened segment updates length", function() {

                var sq0= new SegmentQuadratic({
                    p0 : { x:0, y:0},
                    p1 : { x:50,y:100},
                    p2 : { x:50,y:50}
                });

                var len0= sq0.getLength();
                sq0._p1.x=100;
                sq0._dirty= true;
                var len1= sq0.getLength();

                expect( sq0._dirty ).not.toEqual( true );
                expect( len0 ).not.toEqual( len1 );
            });

        });


        describe("test Cubic", function() {

            it("length and flatten length", function() {

                var sq1= new SegmentBezier({
                    p0 : { x:0, y:0},
                    p1 : { x:50,y:100},
                    p2 : { x:30,y:70},
                    p3 : { x:50,y:50}
                });

                var sq0= cc.math.Path.createFromPoints( sq1.trace() );

                expect( sq0.getLength() ).toBeCloseTo( sq1.getLength(), .001 );

            });

            it("Dirty non flattened segment updates length", function() {

                var sq0= new SegmentQuadratic({
                    p0 : { x:0, y:0},
                    p1 : { x:50,y:100},
                    p2 : { x:30,y:70},
                    p3 : { x:50,y:50}
                });

                var len0= sq0.getLength();
                sq0._p1.x=100;
                sq0._dirty= true;
                var len1= sq0.getLength();

                expect( sq0._dirty ).not.toEqual( true );
                expect( len0 ).not.toEqual( len1 );
            });

        });

    });
}