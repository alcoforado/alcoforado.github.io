require.config({
    baseUrl: 'javascript',
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});

require(['boot'], function () {
    require(['specs'], function () {
        window.onload();
    });
});

