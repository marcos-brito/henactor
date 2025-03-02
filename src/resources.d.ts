interface Resources {
  "commands": {
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
    }
  }
}

export default Resources;
