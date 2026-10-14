# Evidencia — práctica de navegación
Estado: validación local aprobada; commit final pendiente
Repositorio: https://github.com/LocalTrickster/Pr-ctica-guiada-especificar-y-verificar-una-navegaci-n
Commit inicial: `74cebd4`
Commit final: pendiente de registrar después de revisión; no se creó un commit
Variante: A — terreno lento
Cambios previos: el worktree estaba limpio al iniciar la tarea.

## Exploración
| Capa | Ruta | Capacidad comprobada |
|---|---|---|
| Búsqueda | `src/domain/navigation/search.ts` | BFS y A*; A* ahora suma costo de entrada y usa Manhattan escalada por el costo mínimo |
| Seguimiento | `src/domain/navigation/pathFollower.ts` | Consume puntos de ruta y avanza por tramos |
| Consumidor | `src/application/simulation/guardSimulation.ts` | Calcula y conserva el resultado de A* para la ruta inicial del guardia |
| Pruebas | `tests/navigation/search.test.ts`, `tests/application/guardSimulation.test.ts` | Casos del contrato de búsqueda y prueba de la ruta ponderada desde la simulación |

Decisión: representar el costo por celda en el mapa. Así A* usa el costo al entrar a cada celda sin alterar BFS, el seguimiento ni la máquina de estados.

Contraste con la guía: la primera versión de `spec.md` no describía correctamente el anexo A. Se corrigió al comprobar la guía: el trabajo solicitado es terreno lento con costo 5 en la franja central. La selección de esta variante se confirmó en la instrucción del estudiante.

Orden de trabajo: la spec completa se corrigió durante la implementación, no antes de comenzar el código. Por ese motivo, BASE-AC4 no se considera satisfecho aunque la selección de la variante A sí fue indicada.

## Comparación — fixture libre de 5x3
Vecinos: norte, este, sur, oeste. En empate, A* elige menor heurística y luego orden de inserción.

| Algoritmo | Estado | Ruta | Pasos | Costo | Expandidos | Frontera máxima |
|---|---|---|---:|---:|---:|---:|
| BFS | success | (0,1)→(1,1)→(2,1)→(3,1)→(4,1) | 4 | 4 | 12 | 4 |
| A* | success | (0,1)→(1,1)→(2,1)→(3,1)→(4,1) | 4 | 4 | 5 | 9 |

Las métricas se obtuvieron ejecutando los módulos compilados con el fixture indicado. La misma comparación está cubierta por `tests/navigation/search.test.ts`.

## Variante A — terreno lento
Costos 5 en (1,1), (2,1) y (3,1); las demás celdas cuestan 1. El inicio no suma costo.

| Algoritmo | Estado | Ruta | Pasos | Costo |
|---|---|---|---:|---:|
| BFS | success | ruta directa por y=1 | 4 | 4 |
| A* | success | (0,1)→(0,0)→(1,0)→(2,0)→(3,0)→(4,0)→(4,1) | 6 | 6 |

La ruta directa cuesta 16 (=5+5+5+1). Al crear un mapa nuevo sin costos especiales, A* vuelve a 4 pasos y costo 4. La prueba de `initialGuardSimulation` confirma la ruta ponderada en el consumidor.

## Trazas guiadas
DFS, con vecinos S:[A,B], A:[C], C:[X], X:[G], B:[D,E], D:[G], E:[] y vecinos insertados en orden inverso, produce S-A-C-X-G (4 pasos). BFS encuentra S-B-D-G (3 pasos). DFS no garantiza la ruta más corta: la primera meta alcanzada depende del orden de exploración y puede estar en una rama más profunda.

En Dijkstra: al extraer S=0 se descubren A=1 y B=3; al extraer A=1 se descubre G=10; al extraer B=3 se mejora G=6. Se extrae entonces la entrada válida de G con costo 6 y ruta S-B-G. Ambas alternativas tienen dos acciones, pero sus costos son 10 y 6; no corresponde terminar al descubrir G porque todavía puede aparecer una ruta más barata.

## Casos límite
- Inicio igual a meta: `success`, ruta con una celda, costo 0.
- Columna x=2 bloqueada: `unreachable`, ruta vacía y costo `null`.
- Inicio (-1,1): `invalid-start`.
- Meta (5,1): `invalid-goal`.

## Validación ejecutada
| Comando | Resultado |
|---|---|
| `npm run typecheck` | Aprobado |
| `npm run build` | Aprobado; Vite informó un aviso de chunk mayor a 500 kB |
| `npm run test:run -- tests/navigation/search.test.ts tests/application/guardSimulation.test.ts tests/model/grid.test.ts` | Aprobado: 3 archivos y 29 pruebas |
| `npm run test:run` | Aprobado: 10 archivos y 74 pruebas |
| `npm run validate` | Aprobado: tipos, pruebas y compilación |

Los comandos se ejecutaron desde la raíz del repositorio.

Además, una comprobación directa compiló el dominio y la simulación a JavaScript temporal y verificó con aserciones: fixture común, costos ponderados, BFS unitario, restauración del costo 1, inicio/meta inválidos, inicio igual a meta, destino inaccesible y ruta ponderada desde la simulación del guardia. El directorio temporal se eliminó al terminar.

## Entrega
URL del repositorio: https://github.com/LocalTrickster/Pr-ctica-guiada-especificar-y-verificar-una-navegaci-n

Commit final: pendiente de revisión y creación por el estudiante. No se creó ni publicó ningún commit.
