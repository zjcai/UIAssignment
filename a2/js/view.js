'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        // TODO
        this.imageModel;
        this.setImageModel(imageModel);
        this.currentView;

        this._init();
    };

    _.extend(ImageRenderer.prototype, {
        _init: function() {
            var self = this;
            this.imgDiv = document.createElement('div');
            
            var imgTemplate = document.getElementById('imgTemplate');
            this.imgDiv.appendChild(document.importNode(imgTemplate.content, true));
            this.imgDiv.className = "imgTemplate";

            //display data
            var imgView = this.imgDiv.querySelector('.imgView');
            imgView.src = "." + self.imageModel.getPath();
            imgView.addEventListener('click', function() {
                var imagePopup = document.getElementById("imagePopup");
                var popupBackground = document.getElementById("popupBackground");
                var fullImage = document.getElementById("fullImage");
                fullImage.src = this.src;
                imagePopup.style.display = "block";
                popupBackground.style.display = "block";
            });

            var imgName = this.imgDiv.querySelector('.imgName');
            imgName.innerHTML = self.imageModel.getPath().replace(/^.*[\\\/]/, '');
            var imgModDate = this.imgDiv.querySelector('.imgModDate');
            imgModDate.innerHTML = self.imageModel.getModificationDate();

            var imgRating = this.imgDiv.querySelector('.imgRating');
            var radios = imgRating.querySelectorAll('input');
            var ratingIndex = 5 - this.imageModel.getRating();
            if (ratingIndex !== 5) {
                radios[ratingIndex].checked = true;
                radios[ratingIndex].parentElement.className = "checked";
            }

            for (var i = 0, length = radios.length; i < length; i++) {
                radios[i].onclick = function() {
                    //alert(this.value);
                    if (self.imageModel.getRating() !== this.value) {
                        self.imageModel.setRating(this.value);
                        for (var i = 0, length = radios.length; i < length; i++) {
                            radios[i].parentElement.className = "";
                        }
                        this.parentElement.className = "checked";
                    }
                }
            }
        },

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            // TODO
            return this.imgDiv;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            // TODO
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            // TODO
            this.imageModel = imageModel;

        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            // TODO
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function(currentToolbar) {
        // TODO
        this.currentView = LIST_VIEW;
        this.currentImageCollectionModel;
        this.currentRatingFilter = currentToolbar.getCurrentRatingFilter();
        this.currentImageRendererFactory = new ImageRendererFactory();
        this.listenerIndex = 0;


        var self = this;

        // Binds toolbar with collectionView
        currentToolbar.addListener(function(toolbar, eventType, eventDate) {
            if ((eventType === LIST_VIEW) || (eventType === GRID_VIEW)) {
                self.setToView(eventType);   
                //alert("View in CollectionView Change!");
            }
            else {
                // TODO: dont know where to filter
                self.currentRatingFilter = toolbar.getCurrentRatingFilter();
                //alert("Rating Change to" + self.currentRatingFilter);
                document.getElementById('app-container').appendChild(self.getElement());
            }
        });
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            // TODO
            var oldDiv = document.getElementById("imageCollectionDiv");
            if (oldDiv !== null) oldDiv.parentNode.removeChild(oldDiv);
            this.imageCollectionDiv = document.createElement('div');
            this.imageCollectionDiv.id = "imageCollectionDiv";
            this.imageCollectionDiv.className = this.getCurrentView() === LIST_VIEW ?  "listViewImageCollection" : "gridViewImageCollection";
            var ModelSets = this.currentImageCollectionModel.getImageModels();
            for (var i=0; i < ModelSets.length; i++) {
                if (this.currentRatingFilter <= ModelSets[i].getRating()) {
                    this.imageCollectionDiv.appendChild(this.currentImageRendererFactory.createImageRenderer(ModelSets[i]).getElement());
                }
            }
            return this.imageCollectionDiv;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            // TODO
            return this.currentImageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            // TODO
            this.currentImageRendererFactory = imageRendererFactory;
            document.getElementById('app-container').appendChild(this.getElement());
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            // TODO
            return this.currentImageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            // TODO
            if (this.currentImageCollectionModel !== undefined) {
                this.currentImageCollectionModel.removeListener(this.listenerIndex);
            }
            this.currentImageCollectionModel = imageCollectionModel;
            imageCollectionModel.addListener(function(eventType, imageModelCollection, imageModel, eventDate) {
                if ((eventType === "IMAGE_ADDED_TO_COLLECTION_EVENT") || (eventType === "IMAGE_REMOVED_FROM_COLLECTION_EVENT")) {
                    //alert("Success!");
                }
                else {
                    //alert("IMAGE_META_DATA_CHANGED_EVENT");
                }
            });
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            // TODO
            this.currentView = viewType;
            if (viewType == LIST_VIEW) {
                document.getElementById("imageCollectionDiv").className = "listViewImageCollection";
            }
            else {
                document.getElementById("imageCollectionDiv").className = "gridViewImageCollection";
            }
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            // TODO
            return this.currentView;
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.listeners = [];
        //grid/list View
        this.currentView = LIST_VIEW;
        this.ratingFilter = 0;

        this._init();

        var self = this;
        this.notify = function(eventType) {
            _.each(this.listeners, function(listener) {
               listener(self, eventType, Date.now()); 
            });
        }

    };

    _.extend(Toolbar.prototype, {
        _init: function() {
            var self = this;
            this.toolbarHeader = document.createElement('header');
            var toolbarTemplate = document.getElementById('toolbar');
            this.toolbarHeader.appendChild(document.importNode(toolbarTemplate.content, true));
            var listViewLi = this.toolbarHeader.querySelector('.listView');
            var gridViewLi = this.toolbarHeader.querySelector('.gridView');
            listViewLi.addEventListener('click', function() {
                if (self.getCurrentView() !== LIST_VIEW) {
                    listViewLi.className = "listView selectedView";
                    gridViewLi.className = "gridView";
                    self.setToView(LIST_VIEW);
                }
            });
            gridViewLi.addEventListener('click', function() {
                if (self.getCurrentView() !== GRID_VIEW) {
                    listViewLi.className = 'listView';
                    gridViewLi.className = "gridView selectedView";
                    self.setToView(GRID_VIEW);
                }
            });

            
            //var starRating = this.toolbarHeader.querySelector('#starRatingFilter');
            var starRating = this.toolbarHeader.querySelector('.starRating');
            var radios = starRating.querySelectorAll('input');
            var clear = this.toolbarHeader.querySelector('.clear');

            clear.addEventListener('click', function() {
                if (self.getCurrentRatingFilter() != 0) {
                    self.setRatingFilter(0);
                    for (var i = 0, length = radios.length; i < length; i++) {
                        radios[i].parentElement.className = "";
                    }
                }
            });

            for (var i = 0, length = radios.length; i < length; i++) {
                radios[i].onclick = function() {
                    //alert(this.value);
                    if (self.getCurrentRatingFilter() != this.value) {
                        self.setRatingFilter(this.value);
                        for (var i = 0, length = radios.length; i < length; i++) {
                            radios[i].parentElement.className = "";
                        }
                        this.parentElement.className = "checked";
                    }
                }
            }
        },
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            // TODO
            return this.toolbarHeader;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            // TODO
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            // TODO
            var index = this.listeners.indexOf(listener_fn);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            //TODO
            this.currentView = viewType;
            this.notify(viewType);
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            // TODO
            this.ratingFilter = rating;
            this.notify(RATING_CHANGE);
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}