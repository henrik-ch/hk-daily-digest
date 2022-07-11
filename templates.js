// module.exports.document = function (input_section) {
//     return `<!DOCTYPE html>
//     <html lang="en">
    
//     <head>
//         <meta charset="UTF-8">
//         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <meta name="description" content="A single place to check all my daily news sites in 1 go">
//         <title>Daily Digest</title>
    
//         <!-- CSS only -->
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha256-YvdLHPgkqJ8DVUxjjnGVlMMJtNimJ6dYkowFFvp4kKs=" crossorigin="anonymous">
    
//     </head>
    
//     <body>
//         <main>
//             <header class="bg-dark mb-4">
//                 <nav class="container navbar navbar-dark">
//                     <div class="container-fluid">
//                         <h1 class="text-light h2 mb-0">Daily Digest</h1>
//                         <a rel="noopener" href="https://github.com/henrik-ch" class="text-light"
//                             title="See repository on Github">Github</a>
//                     </div>
//                 </nav>
//             </header>
//             <div class="container mb-3">
//                 <div class="row mb-3">
//                     <div class="col">
//                         <strong>Updated</strong>: ${new Date().toISOString().replace(/T/, ' '). substring(0,16) + ' GMT'} 
//                     </div>
//                 </div>

//                 <div class="accordion" id="accordionDigest">
//                     ${input_section}
//                 </div>
//             </div>
//             <footer class="bg-dark text-light p-4">
//                 <div class="container text-center">
//                     Made with <span class="pe-1">❤️</span> by <a class="text-light" href="https://beinghenrik.blogspot.com/"
//                         title="Henrik Karlsson Blog">Henrik Karlsson</a>
//                 </div>
//             </footer>
//         </main>
    
//         <!-- JavaScript Bundle with Popper -->
//         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha256-cMPWkL3FzjuaFSfEYESYmjF25hCIL6mfRSPnW8OVvM4=" crossorigin="anonymous"></script>
    
//     </body>
    
//     </html>`;
//   }


module.exports.document = function (input_section, navbar_section) {
  return `<!doctype html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <!-- <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"> -->
    <meta name="generator" content="Hugo 0.88.1">
    <!-- <title>Top navbar example · Bootstrap v5.1</title> -->
  
    <title>Daily RSS Digest Tech</title>
  
  
    <!-- <link rel="canonical" href="https://getbootstrap.com/docs/5.1/examples/navbar-static/"> -->
  
  
  
    <!-- Bootstrap core CSS -->
    <link href="./bootstrap-5.1.3-dist/css/bootstrap.min.css" rel="stylesheet">
  
    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
  
      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
  
  
    <!-- Custom styles for this template -->
    <link href="navbar-top.css" rel="stylesheet">
  </head>
  
  <body>
  
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Daily Digest</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
          ${navbar_section}
          </ul>
          <!-- <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form> -->
        </div>
      </div>
    </nav>
  
    <main class="container">
      <div class="bg-light p-5 rounded">
        <!-- <h1>Navbar example</h1>
        <p class="lead">This example is a quick exercise to illustrate how the top-aligned navbar works. As you scroll,
          this navbar remains in its original position and moves with the rest of the page.</p> -->
  
  
        <div class="accordion" id="accordionDigest">
        ${input_section}
        </div>
  
  
        <!-- <a class="btn btn-lg btn-primary" href="../components/navbar/" role="button">View navbar docs &raquo;</a> -->
      </div>
    </main>
  
    <script src="./bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js"></script>
  </body>
  
  </html>`;
}
