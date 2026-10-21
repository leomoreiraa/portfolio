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
    assert.match(page, /href="\.\.\/index\.html#projects"/);
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

test("all four projects are in the original programming section", () => {
  assert.deepEqual(Array.from(projects.programming, p => p.id), ["orbitir","luna","ruido","uebit"]);
  assert.equal(Object.keys(projects).length, 1);
  assert.match(index, /id="carousel-programming"/);
  assert.doesNotMatch(index, /carousel-science|carousel-references|id="articles"|href="#articles"/);
  for (const article of ["uebit", "ruido", "luna", "orbitir"]) {
    const content = read(`projects/${article}.html`);
    for (const anchor of ["home", "about", "projects"]) {
      assert.ok(content.includes(`href="../index.html#${anchor}"`));
    }
    assert.doesNotMatch(content, /href="\.\.\/index\.html#articles"/);
  }
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
  }
});
