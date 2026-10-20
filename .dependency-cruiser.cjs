module.exports = {
  forbidden: [
    {
      name: 'dominio-no-importa-aplicacion',
      comment:
        'Regla A: el dominio es el nucleo; no puede depender de la capa de aplicacion.',
      severity: 'error',
      from: { path: '^src/[^/]+/dominio' },
      to: { path: '^src/[^/]+/aplicacion' },
    },
    {
      name: 'dominio-no-importa-infraestructura',
      comment:
        'Regla B: el dominio no puede depender de infraestructura (frameworks, I/O, adaptadores).',
      severity: 'error',
      from: { path: '^src/[^/]+/dominio' },
      to: { path: '^src/[^/]+/infraestructura' },
    },
    {
      name: 'aplicacion-no-importa-infraestructura',
      comment:
        'Regla C: la aplicacion define puertos (interfaces) pero NUNCA importa adaptadores concretos de infraestructura.',
      severity: 'error',
      from: { path: '^src/[^/]+/aplicacion' },
      to: { path: '^src/[^/]+/infraestructura' },
    },
    {
      name: 'dominio-no-importa-nestjs',
      comment:
        'Regla D: el dominio es TypeScript puro. No puede acoplarse a NestJS ni a librerias de framework.',
      severity: 'error',
      from: { path: '^src/[^/]+/dominio' },
      to: { path: 'node_modules/(@nestjs|rxjs|express|typeorm)' },
    },
    {
      name: 'aplicacion-no-importa-nestjs-io',
      comment:
        'Regla E: la aplicacion orquesta casos de uso; no debe acoplarse a detalles de framework web ni de I/O.',
      severity: 'error',
      from: { path: '^src/[^/]+/aplicacion' },
      to: { path: 'node_modules/(@nestjs/platform-express|express|typeorm)' },
    },
    {
      name: 'sin-dependencias-circulares',
      comment: 'Regla F: no se permiten ciclos de dependencia entre modulos.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'sin-huerfanos',
      comment: 'Modulos no alcanzables (salvo tests, tipos y entrypoints).',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',
          '\\.spec\\.ts$',
          'src/main\\.ts$',
          '(^|/)\\.[^/]+\\.(js|cjs|ts)$',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: { extensions: ['.ts', '.js'] },
  },
};
