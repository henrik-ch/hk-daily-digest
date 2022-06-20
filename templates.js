module.exports.document = function (input_section) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="A single place to check all my daily news sites in 1 go">
        <title>Daily Digest</title>
    
        <link href="../assets/dist/css/bootstrap.min.css" rel="stylesheet">
    
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
    
        <script src="../assets/dist/js/bootstrap.bundle.min.js"></script>
    
    </body>
    
    </html>`;
  }