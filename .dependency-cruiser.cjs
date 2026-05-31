/**
 * Проверка направления зависимостей по слоям FSD (core.md §2, §5).
 * Цепочка: app → features → entities → shared. Импорт только вправо.
 * Между slice'ами одного слоя прямые зависимости запрещены.
 */
module.exports = {
  forbidden: [
    {
      name: "shared-не-импортит-выше",
      comment:
        "shared — крайний правый слой, не зависит от app/features/entities (core.md §2)",
      severity: "error",
      from: { path: "^src/shared" },
      to: { path: "^(app|src/(features|entities))" },
    },
    {
      name: "entities-не-импортит-выше",
      comment: "entities зависит только от shared (core.md §2)",
      severity: "error",
      from: { path: "^src/entities" },
      to: { path: "^(app|src/features)" },
    },
    {
      name: "features-не-импортит-app",
      comment: "features зависит от entities/shared, но не от app (core.md §2)",
      severity: "error",
      from: { path: "^src/features" },
      to: { path: "^app" },
    },
    {
      name: "entities-без-кросс-slice",
      comment:
        "slice в entities не импортит соседний slice — склейка слоем выше (core.md §5)",
      severity: "error",
      from: { path: "^src/entities/([^/]+)/" },
      to: { path: "^src/entities/([^/]+)/", pathNot: "^src/entities/$1/" },
    },
    {
      name: "features-без-кросс-slice",
      comment:
        "slice в features не импортит соседний slice — склейка слоем выше (core.md §5)",
      severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/([^/]+)/", pathNot: "^src/features/$1/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  },
};
