// Reemplaza la línea de 'import' por una petición fetch dentro de la carga del documento:
document.addEventListener("DOMContentLoaded", () => {
    // Ruta hacia tu archivo JSON puro
    fetch('../data/volcanoes.json')
        .then(response => response.json())
        .then(data => {
            // Guardamos los datos globalmente o los pasamos a la función
            window.volcanoesData = data;
            renderVolcanoes(data);
            setupModal(data);
        });

    handleVisitCounter();
});


