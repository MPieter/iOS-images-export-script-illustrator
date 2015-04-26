/**
 * Author: Pieter Meiresone
 */
var selectedExportOptions = {};

var iosAppIconExportOptions = [
    {
        name: "Icon-60@2",
        size: 120,
        type: "Home screen on iPhone/iPod Touch with retina display"
    },
    {
        name: "Icon-60@3",
        size: 180,
        type: "Home screen on iPhone 6 Plus"
    },
    {
        name: "Icon-76",
        size: 76,
        type: "Home screen on iPad"
    },
    {
        name: "Icon-76@2",
        size: 152,
        type: "Home screen on iPad with retina display"
    },
    {
        name: "Icon-Small-40",
        size: 40,
        type: "Spotlight"
    },
    {
        name: "Icon-Small-40@2",
        size: 80,
        type: "Spotlight on devices with retina display"
    },
    {
        name: "Icon-Small-40@3",
        size: 120,
        type: "Spotlight on iPhone 6 Plus"
    },
];

var iosImageExportOptions = [
    {
        name: "@1x",
        scaleFactor: 50,
        type: "1x"
    },
    {
        name: "@2x",
        scaleFactor: 100,
        type: "2x"
    },
    {
        name: "@3x",
        scaleFactor: 150,
        type: "3x"
    }
];

var folder = Folder.selectDialog("Select export directory");
var document = app.activeDocument;

if(document && folder) {
    var dialog = new Window("dialog","Select export sizes");
    var osGroup = dialog.add("group");

    var iosCheckboxes = createSelectionPanel("App Icon", iosAppIconExportOptions, osGroup);
    var imageCheckboxes = createSelectionPanel("Images", iosImageExportOptions, osGroup);

    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "Export");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        for (var key in selectedExportOptions) {
            if (selectedExportOptions.hasOwnProperty(key)) {
                var item = selectedExportOptions[key];
                exportToFile(item.name, item.size, item.type);
            }
        }
        this.parent.parent.close();
    };
    
    cancelButton.onClick = function () {
        this.parent.parent.close();
    };

    dialog.show();
}

function exportToFile(name, iconSize, type) {
    var expFolder = new Folder(folder.fsName);

	if (!expFolder.exists) {
		expFolder.create();
	}

    var activeArtboard = app.activeDocument.artboards[app.activeDocument.artboards.getActiveArtboardIndex()];

    var scale = iconSize / activeArtboard.artboardRect[2] * 100;
	
	if ( app.documents.length > 0 ) 
	{
		var exportOptions = new ExportOptionsPNG24();
		var type = ExportType.PNG24;
		var fileSpec = new File(expFolder.fsName + "/" + name + ".png");
		exportOptions.verticalScale = scale;
		exportOptions.horizontalScale = scale;
		exportOptions.antiAliasing = true;
		exportOptions.transparency = true;
		exportOptions.artBoardClipping = true;
		app.activeDocument.exportFile (fileSpec, type, exportOptions);
	}
};

function createSelectionPanel(name, array, parent) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].type);
        cb.item = array[i];
        cb.value = true;
        cb.onClick = function() {
            if(this.value) {
                selectedExportOptions[this.item.name] = this.item;
                //alert("added " + this.item.name);
            } else {
                delete selectedExportOptions[this.item.name];
                //alert("deleted " + this.item.name);
            }
        };
        selectedExportOptions[array[i].name] = array[i];
    }
};