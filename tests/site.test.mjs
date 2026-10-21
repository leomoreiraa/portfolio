import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import vm from "node:vm";

const read = (file) => readFileSync(resolve(file), "utf8");
const index = read("index.html");
const projects = vm.runInNewContext(read("js/projects.js") + "\nprojects;", {});
const entries = Object.values(projects).flat();
const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

test("all projects have unique identities, working local pages, and dated entries", () => {
  assert.deepEqual(entries.map(p => p.id).sort(), ["luna","orbitir","ruido","uebit"]);
  assert.equal(new Set(entries.map(p => p.id)).size, entries.length);
  for (const project of entries) {
    assert.match(project.published, /^20\d\d-(0[1-9]|1[0-2])$/);
    assert.ok(existsSync(resolve(project.link)), "Missing project page: " + project.link);
    assert.ok(project.tags.length >= 3);
  }
});

test("Uebit and RUÍDO have complete magazine articles, resource links and local navigation", () => {
  for (const id of ["uebit", "ruido"]) {
    const page = read(`projects/${id}.html`);
    assert.match(page, /class="magazine-article"/);
    assert.match(page, /class="table-of-contents"/);
    assert.match(page, /href="\.\.\/index\.html#articles"/);
    assert.match(page, /class="project-buttons"/);
    assert.match(page, /href="https:\/\/github.com\/leomoreiraa\//);
    const targets = [...page.matchAll(/<nav class="table-of-contents"[\s\S]*?<\/nav>/g)][0]?.[0] ?? "";
    assert.ok(targets.length > 100, `Missing table of contents for ${id}`);
    for (const [,fragment] of targets.matchAll(/href="#([a-z0-9-]+)"/g)) {
      assert.ok(page.includes(`id="${fragment}"`), `Missing article target ${id}#${fragment}`);
    }
    for (const [,local] of page.matchAll(/(?:href|src)="(\.\.\/[^"#?]+)"/g)) {
      assert.ok(existsSync(resolve(dirname(`projects/${id}.html`), local)),
        `Broken local asset in ${id}: ${local}`);
    }
  }
});

test("home and all article menus link to publications and projects", () => {
  assert.ok(index.includes('id="articles"'));
  assert.ok(index.includes('id="article-previews"'));
  for (const article of ["uebit", "ruido", "luna", "orbitir"]) {
    const content = read(`projects/${article}.html`);
    assert.ok(content.includes('href="../index.html#projects"'));
    assert.ok(content.includes('href="../index.html#articles"'));
  }
  assert.match(read("js/carousel.js"), /allProjects\.filter\(\(project\) => project\.featured\)/);
  assert.equal(entries.filter(p => p.featured).length, 2);
});

test("all UI strings and project metadata exist in each supported language", () => {
  const keys = [...index.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
  for (const code of ["en", "pt", "zh"]) {
    const dict = JSON.parse(read(`locales/${code}.json`));
    const inline = vm.runInNewContext(read(`js/lang/${code}.js`) + `\n${code};`, {});
    for (const key of keys) assert.equal(typeof get(dict, key), "string",
      `Missing ${code} translation: ${key}`);
    for (const project of entries) {
      for (const field of ["description", "fullDescription"]) {
        assert.equal(typeof dict.projects[project.id]?.[field], "string",
          `Missing ${code} project description ${project.id}.${field}`);
        assert.equal(dict.projects[project.id][field], inline.projects[project.id][field],
          `Inline and JSON translations diverge for ${code}.${project.id}.${field}`);
      }
    }
    assert.equal(dict.nav.articles, inline.nav.articles);
    assert.equal(dict.articles.read, inline.articles.read);
  }
});
