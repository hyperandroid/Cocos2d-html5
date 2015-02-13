/**
 * License: see license.txt file.
 */


/// <reference path="../../../lib/jasmine/jasmine.d.ts" />
/// <reference path="../../node/Node.ts" />
/// <reference path="../../input/InputManager.ts" />
/// <reference path="../../input/MouseInputManager.ts" />


module test.math {

    import Node= cc.node.Node;
    import SceneGraphInputTreeNode = cc.input.SceneGraphInputTreeNode;

    "use strict";

    describe("Input", function() {
        describe("InputManagerSceneGraphInputTreeNode", function () {

            var nodes:Node[]= [];
            var root:SceneGraphInputTreeNode;

            beforeEach(function() {
                nodes= [];
                for( var i=0; i<100; i++ ) {
                    var n:Node= new Node().setName('node'+i);
                    n._orderOfArrival=i;
                    nodes.push( n );
                }

                root= new SceneGraphInputTreeNode( new Node().setName("root") );
            });

            it("Adds to the right root.", function() {

                root.insert( [ nodes[0], nodes[1], nodes[2], root.node ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(1);
                expect( nodesWithInput[0] ).toBe( nodes[0] );

            });

            it("Adds to the wrong root.", function() {

                root.insert( [ nodes[0], nodes[1], nodes[2], nodes[3] ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(0);

            });

            it("Adds the root node for input", function() {

                root.insert( [ root.node ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(1);
                expect( nodesWithInput[0] ).toBe( root.node );
            });

            it("Adds non terminal for input", function() {

                root.insert( [ nodes[2], nodes[10], nodes[20], root.node ] );
                root.insert( [ nodes[10], nodes[20], root.node ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(2);
                expect( nodesWithInput[0] ).toBe( nodes[2] );
                expect( nodesWithInput[1] ).toBe( nodes[10] );
            });

            it("Has properly sorted nodes", function() {

                root.insert( [ nodes[2], nodes[10], nodes[20], root.node ] );
                root.insert( [ nodes[0], nodes[10], nodes[20], root.node ] );
                root.insert( [ nodes[1], nodes[10], nodes[20], root.node ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(3);

                // sorted in inverse _orderOfArrival. Nodes have same z-index and growing _orderOfArrival.
                // input routes from top to bottom, that's why the list is inverted.
                expect( nodesWithInput[0] ).toBe( nodes[2] );
                expect( nodesWithInput[1] ).toBe( nodes[1] );
                expect( nodesWithInput[2] ).toBe( nodes[0] );
            });

            it("Has properly sorted nodes - 2", function() {

                root.insert( [ nodes[2], nodes[10], nodes[20], root.node ] );
                root.insert( [ nodes[0], nodes[10], nodes[20], root.node ] );
                root.insert( [ nodes[1], nodes[10], nodes[20], root.node ] );

                root.insert( [ nodes[3], nodes[11], nodes[20], root.node ] );
                root.insert( [ nodes[4], nodes[11], nodes[20], root.node ] );

                root.insert( [ nodes[5], nodes[15], nodes[25], root.node ] );
                root.insert( [ nodes[6], nodes[15], nodes[25], root.node ] );

                var nodesWithInput:Node[]= root.flatten();
                expect( nodesWithInput.length ).toBe(7);
            });

        });
    });
}