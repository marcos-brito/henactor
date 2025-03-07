interface Resources {
  "commands": {
    "pallete": {
      "OpenPallete": {
        "name": "Open command pallete",
        "desc": "Opens the command pallete"
      },
      "PalleteNext": {
        "name": "Pallete next",
        "desc": "Selects the next command on the pallete"
      },
      "PalletePrevious": {
        "name": "Pallete previous",
        "desc": "Selects the previous command on the pallete"
      },
      "PalleteExecute": {
        "name": "Pallete execute",
        "desc": "Executes the selected command on the pallete"
      }
    },
    "settings": {
      "OpenSettings": {
        "name": "Open settings",
        "desc": "Opens the settings"
      },
      "OpenThemePicker": {
        "name": "Open theme picker",
        "desc": "Opens the theme picker"
      },
      "SaveSettings": {
        "name": "Save settings",
        "desc": "Writes the settings to the configuration file"
      }
    },
    "fs": {
      "Delete": {
        "name": "Delete",
        "desc": "Deletes a file system entry"
      },
      "Rename": {
        "name": "Rename",
        "desc": "Renames a file system entry"
      },
      "Create": {
        "name": "Create",
        "desc": "Creates a new file system entry"
      }
    },
    "tabs": {
      "RenameCurrentTab": {
        "name": "Rename current tab",
        "desc": "Renames the current tab"
      },
      "NewTab": {
        "name": "New tab",
        "desc": "Creates a new tab"
      },
      "CloseTab": {
        "name": "Close tab",
        "desc": "Closes the current tab"
      },
      "NextTab": {
        "name": "Next tab",
        "desc": "Goes to the next tab"
      },
      "PreviousTab": {
        "name": "Previous tab",
        "desc": "Goes to the previous tab"
      },
      "OpenViewPicker": {
        "name": "Open view picker",
        "desc": "Opens the view picker"
      },
      "OpenSortMethodPicker": {
        "name": "Open sort method picker",
        "desc": "Opens the sort method picker"
      }
    },
    "keygrabber": {
      "QuitKeygrabber": {
        "name": "Quit key grabber",
        "desc": "Quits the key grabber"
      }
    }
  },
  "contextMenu": {
    "explorer": {
      "newItem": "New item",
      "paste": "Paste",
      "details": "Details"
    },
    "entry": {
      "open": "Open",
      "openInNewTab": "Open in a new tab",
      "cut": "Cut",
      "copy": "Copy",
      "copyTo": "Copy to…",
      "moveTo": "Move to…",
      "rename": "Rename",
      "compress": "Compress",
      "moveToTrash": "Move to trash bin",
      "delete": "Delete",
      "details": "Details"
    },
    "tab": {
      "new": "New tab",
      "rename": "Rename",
      "duplicate": "Duplicate",
      "close": "Close",
      "closeAhead": "Close ahead",
      "closeBehind": "Close behind",
      "closeExcept": "Close all other tabs"
    }
  },
  "modals": {
    "renameTab": {
      "title": "Rename tab",
      "confirmation": "Rename"
    }
  },
  "settings": {
    "configure": "Configure",
    "general": {
      "name": "General",
      "options": {
        "lang": {
          "name": "Language",
          "desc": "Change the display language"
        },
        "downloadIcons": {
          "name": "Download icons",
          "desc": "Should the icons you set be downloaded"
        },
        "autoReload": {
          "name": "Auto reload",
          "desc": "Should the app reload whenever config files change?"
        },
        "defaultTab": {
          "name": "Default tab",
          "desc": "Set the name and path for new tabs",
          "fields": {
            "name": "Name",
            "path": "Path"
          }
        },
        "defaultView": {
          "name": "Default view",
          "desc": "Change the default view for new tabs"
        },
        "defaultGridSize": {
          "name": "Default grid size",
          "desc": "Set the default number of columns for the grid view"
        }
      }
    },
    "appearance": {
      "name": "Appearance",
      "options": {
        "title": {
          "name": "Title",
          "desc": "Set the sidebar top text"
        },
        "theme": {
          "name": "Theme",
          "desc": "Change the current theme"
        },
        "truncationLimit": {
          "name": "Truncation limit",
          "desc": "Set the character limit of a file name before truncation"
        }
      }
    },
    "pins": {
      "name": "Pins",
      "options": {}
    },
    "keybinds": {
      "name": "Keybinds"
    }
  },
  "ui": {
    "pallete": {
      "placeHolder": "Select an item",
      "active": "Active",
      "controls": {
        "navigate": "{{previousKey}} {{nextKey}} to navigate",
        "use": "{{executeKey}} to use",
        "dismiss": "{{dismissKey}} to dismiss"
      }
    },
    "toolBar": {
      "filter": "Filter",
      "sort": {
        "title": "Sort",
        "methods": {
          "name": "A-Z",
          "size": "Size",
          "kind": "Kind",
          "natural": "First found",
          "accessed": "Last accessed",
          "modified": "Last modified",
          "created": "Most recent"
        }
      },
      "views": {
        "grid": "Grid",
        "list": "List",
        "tree": "Tree"
      }
    },
    "words": {
      "tabs": "Tabs",
      "pins": "Pins"
    },
    "emptyDir": "Empty directory",
    "details": {
      "dirItem_one": "{{count}} item",
      "dirItem_other": "{{count}} items",
      "kind": {
        "link": "Symbolic link",
        "dir": "Directory",
        "file": "File"
      }
    },
    "keygrabber": {
      "message": "Press your keys. {{keys}} when you are done"
    }
  }
}

export default Resources;
