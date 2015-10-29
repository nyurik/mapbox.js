describe("L.mapbox.styleLayer", function() {
    var server;

    beforeEach(function() {
        server = sinon.fakeServer.create();
    });

    afterEach(function() {
        server.restore();
    });

    describe("#getTileUrl", function() {
        var retina;

        beforeEach(function() {
            retina = L.Browser.retina;
            L.Browser.retina = false;
        });

        afterEach(function() {
            L.Browser.retina = retina;
        });

        it("distributes over the URLs in the tiles property", function() {
            var layer = L.mapbox.styleLayer('mapbox://styles/bobbysud/cifr15emd00007zlzxjew2rar');
            expect(layer.getTileUrl({x: 0, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/0/0?access_token=key');
            expect(layer.getTileUrl({x: 1, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/1/0?access_token=key');
            expect(layer.getTileUrl({x: 2, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/2/0?access_token=key');
            expect(layer.getTileUrl({x: 3, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/3/0?access_token=key');
            expect(layer.getTileUrl({x: 4, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/4/0?access_token=key');
        });

        it("requests @2x tiles on retina", function() {
            L.Browser.retina = true;
            var layer = L.mapbox.styleLayer('mapbox://styles/bobbysud/cifr15emd00007zlzxjew2rar');
            expect(layer.getTileUrl({x: 0, y: 0, z: 0})).to.equal('http://a.tiles.mapbox.com/styles/v1/bobbysud/cifr15emd00007zlzxjew2rar/tiles/0/0/0@2x?access_token=key');
        });
    });
});
