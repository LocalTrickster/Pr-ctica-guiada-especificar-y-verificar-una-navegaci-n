# Plan — práctica de navegación
Estado: Aprobado
Variante: A — terreno lento
Spec: spec.md

| Incremento | Trabajo | Archivos | Criterios | Comprobación |
|---|---|---|---|---|
| 1 | Agregar costos positivos por celda y búsqueda A* ponderada; conservar BFS unitario | `src/domain/model/grid.ts`, `src/domain/navigation/search.ts`, `tests/model/grid.test.ts`, `tests/navigation/search.test.ts` | A-01, A-02, A-AC1, A-AC2 | `npm run test:run -- tests/navigation/search.test.ts tests/model/grid.test.ts` |
| 2 | Probar el uso de la ruta ponderada en la simulación del guardia | `src/application/simulation/guardSimulation.ts`, `tests/application/guardSimulation.test.ts` | A-03, A-04, A-AC3 | `npm run test:run -- tests/application/guardSimulation.test.ts` |
| 3 | Ejecutar validación completa, revisar el diff y completar la evidencia | `Parte 2 - Docs/spec.md`, `Parte 2 - Docs/plan.md`, `Parte 2 - Docs/evidencia.md` | BASE-01 a BASE-08, A-AC1 a A-AC3 | `npm run validate` |

Riesgos: el costo de inicio no debe sumarse; BFS debe seguir ignorando los costos de terreno; el mapa y la simulación deben usar los mismos costos al calcular la ruta.

Detenerse si: el resultado del algoritmo difiere del costo verificable, se altera BFS unitario, la simulación pierde el estado de inaccesibilidad o se requiere una dependencia, interfaz o cambio de FSM/percepción.

Los comandos no crean commits ni publican cambios. El commit final se completará después de la revisión y confirmación del estudiante.
