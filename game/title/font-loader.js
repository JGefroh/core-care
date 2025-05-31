function loadFont() {
    var customFont = new FontFace('Pixellari', 'url("/assets/fonts/Pixellari.ttf")');
    customFont.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
    })
}

loadFont()