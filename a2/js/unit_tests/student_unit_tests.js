'use strict';

var expect = chai.expect;

describe('Student Unit Tests', function() {
    // Your tests starts here.
    describe("modelModule", function() {

    //var ImageModel;
    var modelModule;
    var imageModel;
    var ImageCollectionModel;

    beforeEach(function() {
    	modelModule = createModelModule();
    	imageModel = new modelModule.ImageModel(
                            '/images/test.png',
                        	new Date(),
                        	'',
                        	0
                    );
    	ImageCollectionModel = new modelModule.ImageCollectionModel();
    });

    afterEach(function() {
    	modelModule = undefined;
    	imageModel = undefined;
    	ImageCollectionModel = undefined;
    });

    it('getRating should return 0 since the initial rating is 0', function() {
      var currentRating = imageModel.getRating();
      expect(currentRating, 'currentRating should be a 0').to.be.equal(0);
    });

    it('should return 5 after set the rating to 5', function() {
      var currentRating = imageModel.getRating(imageModel.setRating(5));
      expect(currentRating, 'newRating should be a 5').to.be.equal(5);
    });

    it('should notify every listener when the current model changed.', function() {
      var listener_fn_1 = sinon.spy();
      var listener_fn_2 = sinon.spy();
      imageModel.addListener(listener_fn_1);
      imageModel.addListener(listener_fn_2);
      var current = imageModel.getCaption();

      current = imageModel.getCaption(imageModel.setCaption("new caption"));

      expect(current, 'new caption should be "new caption"').to.be.equal("new caption");
      expect(listener_fn_1.calledWith, imageModel);
      expect(listener_fn_2.calledWith, imageModel);
    });


    it('(imageModel)should add and then remove a listener correctly.', function() {
      var listener_fn = sinon.spy();
      var addListenerSpy = sinon.spy(imageModel, "addListener");
      var removeListenerSpy = sinon.spy(imageModel, "removeListener");


      // Adds a listener
      imageModel.addListener(listener_fn);

      expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
      expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
      expect(imageModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

      // Removes a listener
      imageModel.removeListener(listener_fn);

      expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
      expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
      expect(imageModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

      imageModel.removeListener(listener_fn);
      expect(imageModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
    });

	it('(ImageCollectionModel)should add and then remove a listener correctly.', function() {
      var listener_fn = sinon.spy();
      var addListenerSpy = sinon.spy(ImageCollectionModel, "addListener");
      var removeListenerSpy = sinon.spy(ImageCollectionModel, "removeListener");


      // Adds a listener
      ImageCollectionModel.addListener(listener_fn);

      expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
      expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
      expect(ImageCollectionModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

      // Removes a listener
      ImageCollectionModel.removeListener(listener_fn);

      expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
      expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
      expect(ImageCollectionModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

      ImageCollectionModel.removeListener(listener_fn);
      expect(ImageCollectionModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
    });
  });
});
