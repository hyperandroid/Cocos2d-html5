/**
 * License: see license.txt file.
 */


/// <reference path="../../../lib/jasmine/jasmine.d.ts" />
/// <reference path="../../node/Node.ts" />

module test.math {

    "use strict";

    import Node = cc.node.Node;

    describe("cc.node.Node", function() {

        describe("Enumeration", function() {
            describe("Non recursive enumeration.", function () {

                var node0, node00, node000, node001, node002, node003;

                beforeEach(function () {
                    node0 = new Node().setName("root");

                    node00 = new Node().setName("child0");

                    node000 = new Node().setName("child00");
                    node001 = new Node().setName("child01");
                    node002 = new Node().setName("child02");
                    node003 = new Node().setName("child03");

                    node0.addChild(node00);
                    node00.addChild(node000);
                    node00.addChild(node001);
                    node00.addChild(node002);
                    node00.addChild(node003);
                });

                it("child0/child00", function () {

                    var ret = [];

                    node0.enumerateChildren("child0/child00", function (node:Node) {
                        ret.push(node);
                    });

                    expect(ret.length).toEqual(1);
                });

                it("child0/child0[0-9]   from root. ", function () {
                    var ret = [];
                    node0.enumerateChildren("child0/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });

                    expect(ret.length).toEqual(4);
                    expect(ret[1]).toBe(node001);
                });

                it("child0/child0[0-9]   from non root. ", function () {

                    var ret = [];
                    node00.enumerateChildren("child0/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(0);
                });

                it("../../child0/child0[0-9]", function () {

                    var ret = [];
                    node000.enumerateChildren("../../child0/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

                it("/child0/child0[0-9]", function () {

                    var ret = [];
                    node000.enumerateChildren("/child0/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

                it("/*/child0[0-9] ", function () {
                    var ret = [];
                    node000.enumerateChildren("/*/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

                it("/*/child0[0-9]/.. ", function () {
                    var ret = [];
                    node000.enumerateChildren("/*/child0[0-9]/..", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                    if (ret.length > 3) {
                        expect(ret[0]).toEqual(ret[1]);
                        expect(ret[1]).toEqual(ret[2]);
                        expect(ret[2]).toEqual(ret[3]);
                        expect(ret[3]).toEqual(node00);
                    }

                });

                it("/*/child0[0-9]/../../../../.. ", function () {
                    try {
                        node000.enumerateChildren("/*/child0[0-9]/../../../../..", function (node:Node) {
                        });
                        expect(true).toBe(false);
                    } catch (e) {
                        expect(true).toBe(true);
                    }

                });
            });

            describe("Test Recursive Enumeration", function () {


                var node0, node00, node000, node001, node002, node003, node0001;

                beforeEach(function () {
                    node0 = new Node().setName("root");

                    node00 = new Node().setName("child00");

                    node000 = new Node().setName("child000");
                    node001 = new Node().setName("child001");
                    node002 = new Node().setName("child002");
                    node003 = new Node().setName("child003");

                    node0001 = new Node().setName("child000");

                    node0.addChild(node00);
                    node00.addChild(node000);
                    node00.addChild(node001);
                    node00.addChild(node002);
                    node00.addChild(node003);
                    node000.addChild(node0001);

                });

                it("//child000", function () {
                    var ret = [];
                    node0.enumerateChildren("//child000", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(2);
                });

                it("//child00/child000", function () {
                    var ret = [];
                    node0.enumerateChildren("//child00/child000", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(1);
                });

                it("//child000   in a different node", function () {
                    var ret = [];
                    node00.enumerateChildren("//child000", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(2);
                });

                it("//*", function () {
                    var ret = [];
                    node00.enumerateChildren("//*", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(6);

                });

                it("Wrongly defined path: //////////*", function () {
                    var ret = [];
                    node00.enumerateChildren("//*", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(6);

                });

                it("Wrongly defined path: //child0//child00", function () {

                    try {
                        node00.enumerateChildren("//child0//child00", function (node:Node) {
                        });
                        expect(true).toBe(false);
                    } catch (e) {
                        expect(true).toBe(true);
                    }
                });
            });

            describe("Test posix extensions", function () {

                var node0, node00, node000, node001, node002, node003, node0001;

                beforeEach(function () {
                    node0 = new Node().setName("root");

                    node00 = new Node().setName("child00");

                    node000 = new Node().setName("child000");
                    node001 = new Node().setName("child001");
                    node002 = new Node().setName("child002");
                    node003 = new Node().setName("child003");

                    node0001 = new Node().setName("child000");

                    node0.addChild(node00);
                    node00.addChild(node000);
                    node00.addChild(node001);
                    node00.addChild(node002);
                    node00.addChild(node003);
                    node000.addChild(node0001);

                });

                it("digit = /child00/child00[:digit:]", function () {

                    var ret = [];
                    node000.enumerateChildren("/child00/child00[:digit:]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);

                });

                it("alpha = /[:alpha:]+[:digit:]/child0[0-9]", function () {

                    var ret = [];
                    node000.enumerateChildren("/[:alpha:]+[:digit:]/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

                it("alnum = /[:alnum:]+/child0[0-9]", function () {

                    var ret = [];
                    node000.enumerateChildren("/[:alnum:]+/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

                it("word = /[:word:]/child0[0-9]", function () {

                    var ret = [];
                    node000.enumerateChildren("/[:word:]/child0[0-9]", function (node:Node) {
                        ret.push(node);
                    });
                    expect(ret.length).toEqual(4);
                });

            });
        });

        describe("Test node naming", function () {

            it("naming error '++}{*'", function () {

                var node = new Node();
                try {
                    node.setName("++}{*");
                    expect(true).toBe(false);
                } catch (e) {
                    expect(true).toBe(true);
                }

            });

            it("naming ok: 'alsjDFSDOF02498__4583450lskj'", function () {

                var node = new Node();
                try {
                    node.setName("alsjDFSDOF02498__4583450lskj");
                    expect(true).toBe(true);
                } catch (e) {
                    expect(true).toBe(false);
                }

            });

        });

        describe("Test node addChild", function () {

            var node0;
            var node00, node01, node02, node03, node04, node05, node06;

            beforeEach(function () {

                node0 = new Node();
                node01 = new Node();
                node02 = new Node();
                node03 = new Node();
                node04 = new Node();
                node05 = new Node();
                node06 = new Node();
            });

            it("adding plain", function () {
                node0.addChild(node01);
                node0.addChild(node02);
                node0.addChild(node03);
                node0.addChild(node04);
                node0.addChild(node05);
                node0.addChild(node06);

                expect(node0.getChildren().length).toEqual(6);
            });

            it("adding localZOrdered", function () {

                node01._localZOrder = 10;
                node02._localZOrder = -2;
                node03._localZOrder = 30;
                node04._localZOrder = 0;
                node05._localZOrder = -3;
                node06._localZOrder = 5;

                node0.addChild(node01);
                node0.addChild(node02);
                node0.addChild(node03);
                node0.addChild(node04);
                node0.addChild(node05);
                node0.addChild(node06);

                // explicit call othewisa made in call to visit
                node0.__sortChildren();

                expect(node0.getChildren().length === 6);
                expect(node0._children[0]).toEqual(node05);
                expect(node0._children[5]).toEqual(node03);
            });

            it("adding explicit localZOrdered ", function () {

                node01._localZOrder = 10;
                node02._localZOrder = -2;
                node03._localZOrder = 30;
                node04._localZOrder = 0;
                node05._localZOrder = -3;
                node06._localZOrder = 5;

                node0.addChild(node01, 10);
                node0.addChild(node02, -5);
                node0.addChild(node03, 15);
                node0.addChild(node04, -30);
                node0.addChild(node05, 20);
                node0.addChild(node06, 5);

                // explicit call othewisa made in call to visit
                node0.__sortChildren();

                expect(node0.getChildren().length === 6);
                expect(node0._children[0]).toEqual(node04);
                expect(node0._children[5]).toEqual(node05);
            });

            it("adding orderOfArrival", function () {

                node01._localZOrder = 1;
                node02._localZOrder = 1;
                node03._localZOrder = 1;
                node04._localZOrder = 1;

                node05._localZOrder = 0;
                node06._localZOrder = 0;

                node0.addChild(node01.setName("01"));
                node0.addChild(node02.setName("02"));
                node0.addChild(node03.setName("03"));
                node0.addChild(node04.setName("04"));
                node0.addChild(node05.setName("05"));
                node0.addChild(node06.setName("06"));

                node01._orderOfArrival = 10;
                node02._orderOfArrival = 11;
                node03._orderOfArrival = 7;
                node04._orderOfArrival = 6;

                node05._orderOfArrival = 4;
                node06._orderOfArrival = 2;

                // explicit call otherwise made in call to visit
                node0.__sortChildren();

                expect(node0.getChildren().length === 6);
                expect(node0._children[0]).toEqual(node06);
                expect(node0._children[1]).toEqual(node05);
                expect(node0._children[5]).toEqual(node02);
            });

            it("node addChild with parent", function () {

                var node0 = new Node();
                var node1 = new Node();
                var node2 = new Node();

                node0.addChild(node1);
                try {
                    node2.addChild(node1);
                    expect(true).toBe(false);
                } catch (e) {
                    expect(true).toBe(true);
                }
            });

        });

        describe("Test node removeChild", function() {
            var node0;
            var node00, node01, node02, node03, node04, node05, node06;

            beforeEach(function () {

                node0 = new Node();
                node01 = new Node();
                node02 = new Node();
            });

            it("removing plain", function () {

                node0.addChild(node01);

                node0.removeChild(node01);
                node0.removeChild(node02);

                expect(node0.getChildren().length).toEqual(0);
                expect(node01.getParent()).toEqual(null);
            });

            it("remove actions from ActionManager", function() {

            });
        })
    });
}