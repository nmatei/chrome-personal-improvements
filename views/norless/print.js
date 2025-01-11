function getDocTitle() {
  return new Date().toISOString().split("T")[0] + "-Songs";
}

function saveAsHTML(target) {
  const docTitle = getDocTitle();
  const html = getPlaylistDoc(target, "", true, true);
  download(html, docTitle + ".html", "text/plain");
}

async function copyPlaylist(target) {
  // TODO not best solution yet
  //  when have <span class="text"></span> inside
  //  - try to render html inside iframe and read text from there
  //const body = mapBody(target, '');
  const html = getPlaylistDoc(target, "📌 ", false);
  const body = await getInnerToClipboard(html);
  copyToClipboard(body);
}

function getPlaylistDoc(target, titlePrefix = "", repeatChorus = false, actions = false) {
  const docTitle = getDocTitle();
  let body = mapBody(target, "<br />", titlePrefix, repeatChorus);
  body = body.replaceAll("‑", "-");
  return getPrintPage(body, docTitle, actions);
}

function mapBody(target, nl = "<br />", titlePrefix = "", repeatChorus = false) {
  const songs = getSongsEntries(target);
  let body = Object.values(songs)
    .map(e => {
      const forms = {};
      return {
        title: e.title,
        slides: e.slides
          ? e.slides
              .map(s => {
                let text = "";
                if (s.form) {
                  if (forms[s.form]) {
                    if (!repeatChorus) {
                      return `${s.form}\n`;
                    }
                  } else {
                    forms[s.form] = 1;
                    text = `${s.form}:${nl}`;
                  }
                }
                text += s.text.replaceAll("\n", `${nl}\n`);
                return text;
              })
              .join(`${nl}${nl}\n\n`)
          : ""
      };
    })
    .map(c => `<h1>${titlePrefix}${c.title}</h1>\n${c.slides}`)
    .join(`${nl}${nl}\n\n`);

  body = body.replaceAll(`<span class="final">*</span>`, ``);

  return body;
}

function getPrintPage(body, docTitle, actions = false) {
  return `<html>
  <head>
	<title>${docTitle}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
      body {
        padding: 10px;
        font-size: 1.7em;
        background: #fff;
        color: #000;
      }
      h1 {
        margin: 5px 2px;
        font-size: 1.3em;
        color: #00217e;
      }
      h1 a {
        font-size: 0.6em;
      }
      .chord {
        display: none;
      }

      a {
        text-decoration: none;
        color: #00217e;
      }

      #toc {
        margin: 10px 0;
      }
      #toc a {
        display: block;
      }

      .toolbar {
        display: flex;
        justify-content: flex-end;
      }
      button {
        cursor: pointer;
        font-size: 1em;
        background-color: #0798ab;
        color: #fff;
        border-radius: 3px;
        border: 1px solid #343434;
        padding: 3px 8px;
      }

      button:disabled {
        cursor: default;
        background: transparent;
        opacity: 0.5;
      }

      body.dark-mode {
        background: #000;
        color: #fff;
      }
      .dark-mode a,
      .dark-mode h1 {
        color: #efef00;
      }
	</style>
  </head>
  <body>
    <div id="toc">
    ${
      actions
        ? `
      <div class="toolbar">
        <button id="lightMode" onclick="toggleDisplayMode()" disabled>🌞</button>
        <button id="darkMode" onclick="toggleDisplayMode()">🌒</button>
      </div>
    `
        : ""
    }      
    </div>
    <br />
    
	  ${body}
	  
	  ${
      actions
        ? `
	  <script>
      function toggleDisplayMode() {
        document.body.classList.toggle("dark-mode");
        var lightMode = document.getElementById("lightMode");
        lightMode.disabled = !lightMode.disabled;
        var darkMode = document.getElementById("darkMode");
        darkMode.disabled = !darkMode.disabled;

        localStorage.setItem("dark-mode", lightMode.disabled ? "0" : "1");
      }

      if (localStorage.getItem("dark-mode") === "1") {
        toggleDisplayMode();
      }

      var tocContent = Array.from(document.querySelectorAll("h1")).map(function (h1, i) {
        var title = h1.innerHTML;
        h1.innerHTML = "<a href='#toc'>🔝</a> " + title;
        h1.id = "s" + (i + 1);
        return "<a href='#s" + (i + 1) + "'>" + (i + 1) + " " + title + "</a>";
      });
      document.getElementById("toc").innerHTML += tocContent.join("");
    </script>
	  `
        : ""
    }
  </body>
  </html>`;
}
