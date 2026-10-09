# DevLeo

Portfólio estático em HTML, CSS e JavaScript, com página inicial em inglês,
português e chinês e artigos sobre os projetos.

## Executar

Abra `index.html` no navegador ou, na pasta do projeto, execute:

```sh
python -m http.server 8000
```

Acesse `http://localhost:8000`. O site não precisa de build.

## Organização

- `index.html`: página inicial.
- `projects/`: artigos dos projetos.
- `js/projects.js`: cadastro único dos projetos, usado pelos carrosséis e cards.
- `js/carousel.js`: montagem dos cards e navegação dos carrosséis.
- `js/lang/`: traduções carregadas pelo site.
- `locales/`: cópias JSON das traduções; mantenha-as sincronizadas com `js/lang/`.
- `css/`: estilos gerais e dos artigos.

Ao cadastrar um projeto, adicione suas descrições em `projects.<id>` nos três
idiomas. Os carrosséis aceitam setas, indicadores e as teclas ← e →.

Os arquivos usam UTF-8 e indentação de dois espaços, configurados em
`.editorconfig` e `.prettierrc.json`.
