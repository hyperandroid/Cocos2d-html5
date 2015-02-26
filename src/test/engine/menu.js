/**
 * License: see license.txt file.
 */

(function() {

    var demos= {

        path : window.DEMOS_PATH || "",
        demos: [
            {
                file : "anchors.html",
                title: "Anchors"
            },
            {
                file : "atlas.html",
                title: "Atlas image"
            },
            {
                file : "atlas-texturepack.html",
                title: "Atlas Texture packed"
            },
            {
                file : "atlas-texturepack2.html",
                title: "Atlas Texture packed (II)"
            },
            {
                file : "audio.html",
                title: "Web Audio"
            },
            {
                file : "input.html",
                title: "Basic input"
            },
            {
                file : "input2.html",
                title: "Input mix"
            },
            {
                file : "input-mask.html",
                title: "Input w/Alpha mask"
            },
            {
                file : "layout.html",
                title: "Liquid Layout"
            },
            {
                file : "layout2.html",
                title: "Layout + Orientation"
            },
            {
                file : "path.html",
                title: "PathAction"
            },
            {
                file : "sprites.html",
                title: "Sprites on path"
            },
            {
                file : "units.html",
                title: "Units vs Pixels"
            },
            {
                file : "test7.html",
                title: "Custom node draw"
            },
            {
                file : "text.html",
                title: "Loads of text"
            },
            {
                file : "hierarchies.html",
                title: "Hierarchical Nodes"
            },
            {
                file : "../moonwarriors/index.html",
                title: "Moon Warriors (the game)"
            }
        ]
    };

    function getPath( demoData ) {
        return demos.path ? demos.path+"/"+demoData.file : demoData.file;
    }

    function createNodes() {

        var path= window.location.pathname.split("/");
        var mypage= null;

        if ( path && path.length ) {
            mypage= path[ path.length-1 ];
        }

        var nodes= [];

        for (var i = 0; i < demos.demos.length; i++) {
            var demoData = demos.demos[i];
            var node = document.createElement("li");
            if ( demoData.file===mypage ) {
                node.innerHTML =  String.fromCharCode(0x25B6) + " " + (demoData.title ? demoData.title : demoData.file);

            } else {
                node.innerHTML = "<a href='" + getPath(demoData) + "'>" + (demoData.title ? demoData.title : demoData.file) + "</a>";
            }

            nodes.push(node);
        }

        return nodes;
    }

    function removeAllChildren( node ) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    var nodes= createNodes();

    var menu= document.getElementById("site-menu");
    if ( menu ) {

        removeAllChildren( menu );

        for (var i = 0; i < nodes.length; i++) {
            menu.appendChild(nodes[i]);
        }
    } else {
        console.log("Can't find menu anchor.");
    }

})();