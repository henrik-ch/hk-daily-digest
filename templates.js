module.exports.document = function (input_section) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="A single place to check all my daily news sites in 1 go">
        <title>Daily Digest</title>
    
        <!-- CSS only -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha256-YvdLHPgkqJ8DVUxjjnGVlMMJtNimJ6dYkowFFvp4kKs=" crossorigin="anonymous">
    
    </head>
    
    <body>
        <main>
            <header class="bg-dark mb-4">
                <nav class="container navbar navbar-dark">
                    <div class="container-fluid">
                        <h1 class="text-light h2 mb-0">Daily Digest</h1>
                        <a rel="noopener" href="https://github.com/henrik-ch" class="text-light"
                            title="See repository on Github">Github</a>
                    </div>
                </nav>
            </header>
            <div class="container mb-3">
                <div class="row mb-3">
                    <div class="col">
                        <strong>Updated</strong>: ${new Date().toISOString().replace(/T/, ' '). substring(0,16) + ' GMT'} 
                    </div>
                </div>

                <div class="accordion" id="accordionDigest">
                    ${input_section}
                </div>
            </div>
            <footer class="bg-dark text-light p-4">
                <div class="container text-center">
                    Made with <span class="pe-1">❤️</span> by <a class="text-light" href="https://beinghenrik.blogspot.com/"
                        title="Henrik Karlsson Blog">Henrik Karlsson</a>
                </div>
            </footer>
        </main>
    
        <!-- JavaScript Bundle with Popper -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha256-cMPWkL3FzjuaFSfEYESYmjF25hCIL6mfRSPnW8OVvM4=" crossorigin="anonymous"></script>
    
    </body>
    
    </html>`;
  }