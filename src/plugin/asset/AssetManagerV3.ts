
/// <reference path="./AssetManager.ts"/>
/// <reference path="../loader/Resource.ts"/>
/// <reference path="../asset/AssetManager.ts"/>

module cc {

    import Resource= cc.plugin.loader.Resource;

    var path = {

        join: function () {
            var l = arguments.length;
            var result = "";
            for (var i = 0; i < l; i++) {
                result = (result + (result == "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
            }
            return result;
        },

        extname: function (pathStr) {
            var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
            return temp ? temp[1] : null;
        },

        mainFileName: function (fileName) {
            if (fileName) {
                var idx = fileName.lastIndexOf(".");
                if (idx !== -1)
                    return fileName.substring(0, idx);
            }
            return fileName;
        },

        basename: function (pathStr, extname) {
            var index = pathStr.indexOf("?");
            if (index > 0) pathStr = pathStr.substring(0, index);
            var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
            var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
            if (!result) return null;
            var baseName = result[2];
            if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() == extname.toLowerCase())
                return baseName.substring(0, baseName.length - extname.length);
            return baseName;
        },

        dirname: function (pathStr) {
            return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, '$2');
        },

        changeExtname: function (pathStr, extname) {
            extname = extname || "";
            var index = pathStr.indexOf("?");
            var tempStr = "";
            if (index > 0) {
                tempStr = pathStr.substring(index);
                pathStr = pathStr.substring(0, index);
            }
            index = pathStr.lastIndexOf(".");
            if (index < 0) return pathStr + extname + tempStr;
            return pathStr.substring(0, index) + extname + tempStr;
        },

        changeBasename: function (pathStr, basename, isSameExt) {
            if (basename.indexOf(".") == 0) return this.changeExtname(pathStr, basename);
            var index = pathStr.indexOf("?");
            var tempStr = "";
            var ext = isSameExt ? this.extname(pathStr) : "";
            if (index > 0) {
                tempStr = pathStr.substring(index);
                pathStr = pathStr.substring(0, index);
            }
            index = pathStr.lastIndexOf("/");
            index = index <= 0 ? 0 : index + 1;
            return pathStr.substring(0, index) + basename + ext + tempStr;
        }
    };


    function getResource( id:string ) : any {
        var res:cc.plugin.asset.ResourcesMap= cc.plugin.asset.AssetManager._resources;
        return res[id];
    }

    export class spriteFrameCache {

        static addSpriteFrames( plist_url_file ) {

            var plist= getResource( plist_url_file );
            var imageName= plist[0].metadata.realTextureFileName;

            var imageResFile:string= path.changeBasename(plist_url_file, imageName || ".png", false);

            var resource= cc.plugin.asset.AssetManager._resources[ imageResFile ];

            cc.plugin.asset.AssetManager.addImage( resource, imageResFile );
            cc.director._renderer.prepareTexture( cc.plugin.asset.AssetManager.getTexture(imageResFile) );
            cc.plugin.asset.AssetManager.addSpriteFramesFromFrameWithPLIST( imageResFile, plist );
        }

        static getSpriteFrame( name:string ) {
            return cc.plugin.asset.AssetManager.getSpriteFrame( name );
        }
    }

    export class textureCache {

        static addImage( name:string ) : cc.render.Texture2D {

            var image= getResource( name );

            var texture:cc.render.Texture2D= cc.plugin.asset.AssetManager.addImage( image, name );
            cc.director._renderer.prepareTexture( texture );

            return texture;
        }
    }

    export class animationCache {
        static addAnimation( animation:cc.node.sprite.Animation, name:string ) {
            cc.plugin.asset.AssetManager.addAnimation( animation, name );
        }

        static getAnimation( name:string ) : cc.node.sprite.Animation {
            return cc.plugin.asset.AssetManager.getAnimationById( name );
        }
    }
}