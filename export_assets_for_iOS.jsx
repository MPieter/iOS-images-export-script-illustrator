/**
 * Author: Pieter Meiresone
 */
#include "json2.js"

var selectedAppIconArtboards = {};
var selectedAppIconExportOptions = {};

var selectedImagesArtboards = {};
var selectedImageExportOptions = {};

var iosAppIconExportOptions = [
    {
        name: "iPhone-20@2x.png",
        size: 40,
        type: "iPhone Notification iOS 7-13 (2x)",
        idiom: "iphone",
        sizeJSON: "20x20",
        scale: "2x"
    },
    {
        name: "iPhone-20@3x.png",
        size: 60,
        type: "iPhone Notification iOS 7-13 (3x)",
        idiom: "iphone",
        sizeJSON: "20x20",
        scale: "3x"
    },
    {
        name: "iPhone-29@2x.png",
        size: 58,
        type: "iPhone Settings iOS 7-13 (2x)",
        idiom: "iphone",
        sizeJSON: "29x29",
        scale: "2x"
    },
    {
        name: "iPhone-29@3x.png",
        size: 87,
        type: "iPhone Settings iOS 7-13 (3x)",
        idiom: "iphone",
        sizeJSON: "29x29",
        scale: "3x"
    },
    {
        name: "iPhone-40@2x.png",
        size: 80,
        type: "iPhone Spotlight iOS 7-13 (2x)",
        idiom: "iphone",
        sizeJSON: "40x40",
        scale: "2x"
    },
    {
        name: "iPhone-40@3x.png",
        size: 120,
        type: "iPhone Spotlight iOS 7-13 (3x)",
        idiom: "iphone",
        sizeJSON: "40x40",
        scale: "3x"
    },
    {
        name: "iPhone-60@2x.png",
        size: 120,
        type: "iPhone App iOS 7-13 (2x)",
        idiom: "iphone",
        sizeJSON: "60x60",
        scale: "2x"
    },
    {
        name: "iPhone-60@3x.png",
        size: 180,
        type: "iPhone App iOS 7-13 (3x)",
        idiom: "iphone",
        sizeJSON: "60x60",
        scale: "3x"
    },
    {
        name: "-iPad-20.png",
        size: 20,
        type: "iPad Notifications iOS 7-13 (1x)",
        idiom: "ipad",
        sizeJSON: "20x20",
        scale: "1x"
    },
    {
        name: "-iPad-20@2x.png",
        size: 40,
        type: "iPad Notifications iOS 7-13 (2x)",
        idiom: "ipad",
        sizeJSON: "20x20",
        scale: "2x"
    },
    {
        name: "-iPad-29.png",
        size: 29,
        type: "iPad Settings iOS 7-13 (1x)",
        idiom: "ipad",
        sizeJSON: "29x29",
        scale: "1x"
    },
    {
        name: "-iPad-29@2x.png",
        size: 58,
        type: "iPad Settings iOS 7-13 (2x)",
        idiom: "ipad",
        sizeJSON: "29x29",
        scale: "2x"
    },
    {
        name: "-iPad-40.png",
        size: 40,
        type: "iPad Spotlight iOS 7-13 (1x)",
        idiom: "ipad",
        sizeJSON: "40x40",
        scale: "1x"
    },
    {
        name: "-iPad-40@2x.png",
        size: 80,
        type: "iPad Spotlight iOS 7-13 (2x)",
        idiom: "ipad",
        sizeJSON: "40x40",
        scale: "2x"
    },
    {
        name: "-iPad-76.png",
        size: 76,
        type: "iPad App iOS 7-13 (1x)",
        idiom: "ipad",
        sizeJSON: "76x76",
        scale: "1x"
    },
    {
        name: "-iPad-76@2x.png",
        size: 152,
        type: "iPad App iOS 7-13 (2x)",
        idiom: "ipad",
        sizeJSON: "76x76",
        scale: "2x"
    },
    {
        name: "-iPad-167@2x.png",
        size: 167,
        type: "iPad Pro (12.9-inch) App iOS 7-13 (2x)",
        idiom: "ipad",
        sizeJSON: "83.5x83.5",
        scale: "2x"
    },
    {
        name: "AppStore-Artwork-1024.png",
        size: 1024,
        type: "App Store",
        idiom: "ios-marketing",
        sizeJSON: "1024x1024",
        scale: "1x"
    }
];

var iosImageExportOptions = [
    {
        name: "",
        scaleFactor: 100,
        type: "1x"
    },
    {
        name: "@2x",
        scaleFactor: 200,
        type: "2x"
    },
    {
        name: "@3x",
        scaleFactor: 300,
        type: "3x"
    }
];

var folder = Folder.selectDialog("Select export directory");
var document = app.activeDocument;

if(document && folder) {
    var dialog = new Window("dialog","Export assets for iOS");
    var imageGroup = dialog.add("group");
    imageGroup.alignChildren = "top";
    
    var appIconGroup = dialog.add("group");
    appIconGroup.alignChildren = "top";

    createArtboardSelectionPanel("Select artboards to export as App Icons", selectedAppIconArtboards, imageGroup);
    createSelectionPanel("Export options for App Icon", iosAppIconExportOptions, selectedAppIconExportOptions, imageGroup);
    
    createArtboardSelectionPanel("Select artboards to export as images", selectedImagesArtboards, imageGroup);
    createSelectionPanel("Export options for Images", iosImageExportOptions, selectedImageExportOptions, imageGroup);

    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "Export");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        exportAppIcons();
        exportImages();

        this.parent.parent.close();
    };
    
    cancelButton.onClick = function () {
        this.parent.parent.close();
    };

    dialog.show();
}

function spacesToHyphens(string) {
    return string.replace(/\s+/g, '-');
}

function exportAppIcons() {
    for (var artboardName in selectedAppIconArtboards) {
        var artboard = app.activeDocument.artboards.getByName(artboardName);
        var activeIndex = 0;
        while (!(app.activeDocument.artboards[activeIndex].name === artboardName)) {
            activeIndex++;
        }
        app.activeDocument.artboards.setActiveArtboardIndex(activeIndex);


        var expFolder = new Folder(folder.fsName + "/" + artboard.name + ".appiconset" + "/");
        if (!expFolder.exists) {
            expFolder.create();
        }

        var jsonFileObject = {
            images: [],
            info: {
                version: 1,
                author: "xcode"
            }
        };
        
        for(var key in selectedAppIconExportOptions) {
            var item = selectedAppIconExportOptions[key];
            
            //The app.activeDocument.exportFile function causes all spaces to be 
            //converted to hyphens, thus we should use an unspaced name
            var unspacedName = spacesToHyphens(artboard.name + item.name);
            jsonFileObject.images.push({
                idiom: item.idiom,
                size: item.sizeJSON,
                filename: unspacedName,
                scale: item.scale
            });
        }

        var jsonFile = new File(expFolder.fsName + "/Contents.json");
        jsonFile.open("w");
        jsonFile.write(JSON.stringify(jsonFileObject, null, 2));
        jsonFile.close();

        for (var key in selectedAppIconExportOptions) {
            var item = selectedAppIconExportOptions[key];
            //The app.activeDocument.exportFile function causes all spaces to be 
            //converted to hyphens, thus we should use an unspaced name
            var unspacedName = spacesToHyphens(artboard.name + item.name);
            exportAppIcon(artboard, expFolder, unspacedName, item.size, item.type);
        }
    }
};

function exportAppIcon(artboard, expFolder, name, iconSize, type) {
    var scale = iconSize * 100 / Math.abs(artboard.artboardRect[1] - artboard.artboardRect[3]);
	
	if ( app.documents.length > 0 ) 
	{
		var exportOptions = new ExportOptionsPNG24();
		var type = ExportType.PNG24;
		var fileSpec = new File(expFolder.fsName + "/" + name);
		exportOptions.verticalScale = scale;
		exportOptions.horizontalScale = scale;
		exportOptions.antiAliasing = false;
		exportOptions.transparency = true;
		exportOptions.artBoardClipping = true;
		app.activeDocument.exportFile (fileSpec, type, exportOptions);
	}
};

function exportImages() {
    for (var artboardName in selectedImagesArtboards) {
        var activeArtboard = app.activeDocument.artboards.getByName(artboardName);
        var activeIndex = 0;
        while (!(app.activeDocument.artboards[activeIndex].name === artboardName)) {
            activeIndex++;
        }
        app.activeDocument.artboards.setActiveArtboardIndex(activeIndex);
            
        var expFolder = new Folder(folder.fsName + "/" + activeArtboard.name + ".imageset" + "/");
        if (!expFolder.exists) {
            expFolder.create();
        }

        var jsonFileObject = {
            images: [],
            info: {
                version: 1,
                author: "xcode"
            }
        };

        for(var key in selectedImageExportOptions) {
            var item = selectedImageExportOptions[key];
            //The app.activeDocument.exportFile function causes all spaces to be 
            //converted to hyphens, thus we should use an unspaced name
            var unspacedName = spacesToHyphens(activeArtboard.name + item.name + ".png");
            jsonFileObject.images.push({
                idiom: "universal",
                scale: item.type,
                filename: unspacedName
            });
        }

        var jsonFile = new File(expFolder.fsName + "/Contents.json");
        jsonFile.open("w");
        jsonFile.write(JSON.stringify(jsonFileObject, null, 2));
        jsonFile.close();

        for (var key in selectedImageExportOptions) {
            if (selectedImageExportOptions.hasOwnProperty(key)) {
                var item = selectedImageExportOptions[key];
                exportImage(expFolder, activeArtboard, item.name, item.scaleFactor, item.type)
            }
        }
    }
};

function exportImage(expFolder, activeArtboard, name, scale, type) {
    var exportOptions = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    //The app.activeDocument.exportFile function causes all spaces to be 
    //converted to hyphens, thus we should use an unspaced name
    var unspacedName = spacesToHyphens(activeArtboard.name + name + ".png");

    var fileSpec = new File(expFolder.fsName + "/" + unspacedName);
    exportOptions.verticalScale = scale;
    exportOptions.horizontalScale = scale;
    exportOptions.antiAliasing = true;
    exportOptions.transparency = true;
    exportOptions.artBoardClipping = true;
    app.activeDocument.exportFile (fileSpec, type, exportOptions);
};

function createArtboardSelectionPanel(name, selected, parent) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    panel.minimumSize.width = 300;
    panel.orientation = "row";
    panel.alignChildren = "top";

    var CHECKBOXES_PER_PANEL = 10;
    var totalPanels = Math.ceil(app.activeDocument.artboards.length / CHECKBOXES_PER_PANEL);
    var groups = []
    for (var i = 0; i < totalPanels; i++) {
        var group = panel.add("group", undefined, name);
        group.orientation = "column";
        group.alignChildren = "left";
        groups.push(group);
    };

    for (var i = 0; i < app.activeDocument.artboards.length; i++) {
        var destGroup = groups[Math.floor(i / CHECKBOXES_PER_PANEL)];

        var cb = destGroup.add("checkbox", undefined, "\u00A0" + app.activeDocument.artboards[i].name)
        cb.item = app.activeDocument.artboards[i];
        cb.value = false;
        cb.onClick = function() {
            if (this.value) {
                selected[this.item.name] = this.item;
            } else {
                delete selected[this.item.name];
            }
        };
    }
};

function createSelectionPanel(name, array, selected, parent) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    panel.minimumSize.width = 400;
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].type);
        cb.item = array[i];
        cb.value = true;
        cb.onClick = function() {
            if(this.value) {
                selected[this.item.name] = this.item;
                //alert("added " + this.item.name);
            } else {
                delete selected[this.item.name];
                //alert("deleted " + this.item.name);
            }
        };
        selected[array[i].name] = array[i];
    }
};
