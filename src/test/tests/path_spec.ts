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


    describe("cc.math.path", function () {

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
                    points : [
                        { x:0, y:0},
                        { x:50,y:100},
                        { x:50,y:50}
                    ]
                });

                var sq0= cc.math.Path.createFromPoints( sq1.trace() );

                expect( sq0.getLength() ).toBeCloseTo( sq1.getLength(), .001 );

            });

            it("Dirty non flattened segment updates length", function() {

                var sq0= new SegmentQuadratic({
                    points : [
                        { x:0, y:0},
                        { x:50,y:100},
                        { x:50,y:50}
                    ]
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
                    points : [
                        { x:0, y:0},
                        { x:50,y:100},
                        { x:30,y:70},
                        { x:50,y:50}
                    ]
                });

                var sq0= cc.math.Path.createFromPoints( sq1.trace() );

                expect( sq0.getLength() ).toBeCloseTo( sq1.getLength(), .001 );

            });

            it("Dirty non flattened segment updates length", function() {

                var sq0= new SegmentQuadratic({
                    points : [
                        { x:0, y:0},
                        { x:50,y:100},
                        { x:30,y:70},
                        { x:50,y:50}
                    ]
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

    describe("cc.math.path serialization", function() {

        it("Serialize Arc", function() {

            var arc= new cc.math.path.SegmentArc({
                x: 100,
                y:100,
                radius: 50,
                startAngle : 0,
                endAngle : Math.PI*2,
                ccw : false
            });

            var initializer= arc.getInitializer();

            var arc2= new cc.math.path.SegmentArc( initializer );

            expect( arc2._x ).toEqual( arc._x );
            expect( arc2._y ).toEqual( arc._y );
            expect( arc2._radius ).toEqual( arc._radius );
            expect( arc2._startAngle ).toEqual( arc._startAngle );
            expect( arc2._endAngle ).toEqual( arc._endAngle );
            expect( arc2._ccw ).toEqual( arc._ccw );
        });

        it("Serialize Quadratic", function() {

            var quadratic= new cc.math.path.SegmentQuadratic({
                points : [
                    { x:100, y: 100 },
                    { x:100, y: 400 },
                    { x:200, y: 400 }
                ]
            });

            var initializer= quadratic.getInitializer();
            expect( initializer.points.length ).toEqual(3);

            var quadratic2= new cc.math.path.SegmentQuadratic( initializer );

            expect( quadratic2._p0.x ).toEqual( quadratic._p0.x );
            expect( quadratic2._p0.y ).toEqual( quadratic._p0.y );
            expect( quadratic2._cp0.x ).toEqual( quadratic._cp0.x );
            expect( quadratic2._cp0.y ).toEqual( quadratic._cp0.y );
            expect( quadratic2._p1.x ).toEqual( quadratic._p1.x );
            expect( quadratic2._p1.y ).toEqual( quadratic._p1.y );

        });

        it("Serialize Cubic", function() {

            var cubic= new cc.math.path.SegmentBezier({
                points : [
                    { x:100, y: 100 },
                    { x:100, y: 400 },
                    { x:400, y: 100 },
                    { x:200, y: 400 }
                ]
            });

            var initializer= cubic.getInitializer();
            expect( initializer.points.length ).toEqual(4);

            var cubic2= new cc.math.path.SegmentBezier( initializer );

            expect( cubic._p0.x ).toEqual( cubic2._p0.x );
            expect( cubic._p0.y ).toEqual( cubic2._p0.y );
            expect( cubic._cp0.x).toEqual( cubic2._cp0.x );
            expect( cubic._cp0.y).toEqual( cubic2._cp0.y );
            expect( cubic._cp1.x).toEqual( cubic2._cp1.x );
            expect( cubic._cp1.y).toEqual( cubic2._cp1.y );
            expect( cubic._p1.x ).toEqual( cubic2._p1.x );
            expect( cubic._p1.y ).toEqual( cubic2._p1.y );
        });

        it("Serialize Cardinal Spline", function() {

            var cubic= new cc.math.path.SegmentCardinalSpline({
                points : [
                    { x:100, y: 100 },
                    { x:100, y: 400 },
                    { x:400, y: 100 },
                    { x:200, y: 400 }
                ],
                tension : .2
            });

            var initializer= cubic.getInitializer();
            expect( initializer.points.length ).toEqual(4);

            var cubic2= new cc.math.path.SegmentCardinalSpline( initializer );

            expect( cubic._p0.x ).toEqual( cubic2._p0.x );
            expect( cubic._p0.y ).toEqual( cubic2._p0.y );
            expect( cubic._cp0.x).toEqual( cubic2._cp0.x );
            expect( cubic._cp0.y).toEqual( cubic2._cp0.y );
            expect( cubic._cp1.x).toEqual( cubic2._cp1.x );
            expect( cubic._cp1.y).toEqual( cubic2._cp1.y );
            expect( cubic._p1.x ).toEqual( cubic2._p1.x );
            expect( cubic._p1.y ).toEqual( cubic2._p1.y );
            expect( cubic._tension ).toEqual( cubic2._tension );
        });

        it("Serialize Line", function() {

            var line= new cc.math.path.SegmentLine({
                points : [
                    {x:0, y:0},
                    {x:100, y:100}
                ]
            });

            var initializer= line.getInitializer();
            expect( initializer.points.length ).toEqual(2);

            var line2= new cc.math.path.SegmentLine( initializer );

            expect( line._start.x ).toEqual( line2._start.x );
            expect( line._start.y ).toEqual( line2._start.y );
            expect( line._end.x ).toEqual( line2._end.x );
            expect( line._end.y ).toEqual( line2._end.y );

        });

        it("Serialize Path", function() {


            var shape= new cc.math.Path();
            shape.beginPath();
            shape.moveTo(-50.000000, -172.500000);
            shape.lineTo(-37.000000, -182.500000);
            shape.lineTo(-20.000000, -187.500000);
            shape.lineTo(-1.000000, -185.500000);
            shape.lineTo(16.000000, -178.500000);
            shape.lineTo(30.000000, -169.500000);
            shape.lineTo(37.000000, -177.500000);
            shape.lineTo(46.000000, -181.500000);
            shape.lineTo(58.000000, -177.500000);
            shape.lineTo(64.000000, -162.500000);
            shape.lineTo(61.000000, -140.500000);
            shape.lineTo(45.000000, -99.500000);
            shape.lineTo(36.000000, -83.500000);
            shape.lineTo(35.000000, -76.500000);
            shape.lineTo(32.000000, -69.500000);
            shape.lineTo(22.000000, -63.500000);
            shape.lineTo(20.000000, -54.500000);
            shape.lineTo(36.000000, 15.500000);
            shape.lineTo(38.000000, 60.500000);
            shape.lineTo(7.000000, 151.500000);
            shape.lineTo(14.000000, 166.500000);
            shape.lineTo(9.000000, 185.500000);
            shape.lineTo(-36.000000, 185.500000);
            shape.lineTo(-44.000000, 177.500000);
            shape.lineTo(-52.000000, 159.500000);
            shape.lineTo(-58.000000, 159.500000);
            shape.lineTo(-66.000000, 178.500000);
            shape.lineTo(-115.000000, 178.500000);
            shape.lineTo(-117.000000, 170.500000);
            shape.lineTo(-114.000000, 163.500000);
            shape.lineTo(-107.000000, 151.500000);
            shape.lineTo(-103.000000, 130.500000);
            shape.lineTo(-115.000000, 66.500000);
            shape.lineTo(-115.000000, 53.500000);
            shape.lineTo(-112.000000, 27.500000);
            shape.lineTo(-110.000000, -11.500000);
            shape.lineTo(-93.000000, -63.500000);
            shape.lineTo(-76.000000, -97.500000);
            shape.lineTo(-87.000000, -113.500000);
            shape.lineTo(-89.000000, -120.500000);
            shape.lineTo(-95.000000, -123.500000);
            shape.lineTo(-103.000000, -141.500000);
            shape.lineTo(-102.000000, -155.500000);
            shape.lineTo(-101.000000, -167.500000);
            shape.lineTo(-89.000000, -178.500000);
            shape.lineTo(-79.000000, -183.500000);
            shape.lineTo(-66.000000, -183.500000);
            shape.lineTo(-57.000000, -178.500000);
            shape.lineTo(-50.000000, -172.500000);

            var initializer= shape.getInitializer();

            var shape2= new cc.math.Path( initializer );

            var initializer2= shape2.getInitializer();

            expect( initializer ).toEqual( initializer2 );

        });
    });

}