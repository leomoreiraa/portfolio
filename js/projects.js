// Project metadata drives cards, carousels and editorial highlights.
// Descriptions live in js/lang/*.js under projects.<id>.
const projects = {
  programming: [
    { id: "orbitir", title: "Orbitir", published: "2025-01", tags: ["Spring Boot", "Angular", "PostgreSQL", "WebSocket"], link: "projects/orbitir.html" },
    { id: "luna", title: "Luna", published: "2025-01", tags: ["React", "TypeScript", "Vite", "Recharts"], link: "projects/luna.html" },
  ],
  science: [
    { id: "ruido", title: "RUÍDO", published: "2026-10", featured: true, tags: ["Next.js", "TypeScript", "Prisma", "SQLite", "GitHub Actions"], link: "projects/ruido.html" },
  ],
  references: [
    { id: "uebit", title: "Uebit", published: "2026-10", featured: true, tags: ["React", "Vite", "Blockly", "JavaScript", "Education"], link: "projects/uebit.html" },
  ],
};
