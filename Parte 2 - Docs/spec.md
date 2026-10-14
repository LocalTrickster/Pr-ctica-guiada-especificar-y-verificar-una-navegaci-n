# Spec: práctica de navegación — 7 al 14/10/2026

Estado: Aprobada para la variante A
Repositorio: https://github.com/LocalTrickster/Pr-ctica-guiada-especificar-y-verificar-una-navegaci-n
Commit inicial: 74cebd4
Variante elegida: A — terreno lento
Rutas relevantes:
- `src/domain/model/grid.ts`
- `src/domain/navigation/search.ts`
- `src/application/simulation/guardSimulation.ts`
- `tests/navigation/search.test.ts`
- `tests/application/guardSimulation.test.ts`
Comandos confirmados:
- `npm run typecheck`
- `npm run test:run -- tests/navigation/search.test.ts tests/application/guardSimulation.test.ts tests/model/grid.test.ts`
- `npm run build`
- `npm run validate`

## Objetivo
Comparar navegación y verificar una única mejora con un caso normal y uno límite, manteniendo separadas búsqueda, seguimiento y decisión.

## Alcance
Explorar el código, comparar BFS y A*, revisar las trazas guiadas de DFS y Dijkstra, adaptar esta spec, planear tres incrementos, implementar terreno lento y validar la conexión con la simulación del guardia.

## Fuera de alcance
Implementar DFS o Dijkstra; cambiar FSM, percepción o controles; agregar dependencias, editor de mapas, motor nuevo o despliegue; implementar más de una variante.

## Requisitos comunes
BASE-01: identificar búsqueda, seguimiento, consumidor y pruebas con rutas reales; registrar commit inicial, cambios previos y validación de referencia.

BASE-02: usar el fixture 5x3 definido debajo. Comparar BFS y A* unitarios con igual mapa, inicio y meta: estado, ruta, pasos, costo, nodos expandidos y frontera máxima. No inventar métricas ausentes; si alguna no está disponible, registrar esa limitación.

BASE-03: explicar la traza DFS y completar la traza Dijkstra provistas en la guía; no implementar esos algoritmos.

BASE-04: verificar ruta válida, inicio igual a meta con costo 0, destino libre inaccesible y extremos inválidos, de acuerdo con el contrato del proyecto.

BASE-05: copiar un único anexo, contrastar sus supuestos con el código, completar rutas y comandos confirmados. Registrar un contraste y una decisión humana.

BASE-06: implementar solo la variante A, reutilizar capacidades existentes y conservar la conducta anterior.

BASE-07: demostrar caso normal, límite y llamada desde el consumidor real; ejecutar pruebas enfocadas y validación final; revisar el diff.

BASE-08: entregar `spec.md`, `plan.md` y `evidencia.md` en esta carpeta, junto con la URL y el commit final.

## Criterios de aceptación comunes
BASE-AC1: la evidencia identifica repositorio y commit, capas, cambios previos, comando y resultado inicial; distingue hechos de supuestos.

BASE-AC2: en el fixture libre, BFS y A* devuelven una ruta cardinal válida de 4 pasos y costo 4. Se registran las métricas reales disponibles y se explican las trazas DFS y Dijkstra.

BASE-AC3: inicio=meta es éxito de costo 0; la barrera completa es inaccesible; los extremos fuera del mapa producen resultados inválidos según el contrato documentado.

BASE-AC4: spec y plan aprobados antes de implementar; se registra una decisión humana y su contraste; sólo se desarrolla el anexo elegido.

BASE-AC5: criterios del anexo con pruebas reproducibles; conexión con el consumidor demostrada; validación final y diff revisados, sin regresiones nuevas ni ampliaciones del alcance.

BASE-AC6: los tres documentos, URL y commit final identifican la misma versión entregada el 14/10; los cambios de código y pruebas pertenecen a ese commit.

## Fixture común
Cuadrícula: x=0..4, y=0..2; origen arriba a la izquierda; cuatro vecinos cardinales, sin diagonales; inicio S=(0,1), meta G=(4,1); todas las celdas libres y costo 1. La ruta incluye inicio y meta; pasos = aristas.

Para inaccesibilidad, bloquear (2,0), (2,1) y (2,2), dejando la meta libre. Probar extremos inválidos por separado: inicio (-1,1) o meta (5,1). Adaptar el fixture al formato actual sin cambiar su significado.

## Anexo A: terreno lento
Intención: minimizar el costo de desplazamiento, no solo la cantidad de pasos.

Escenario: fixture común con costo de entrada 5 en (1,1), (2,1) y (3,1). El resto de las celdas cuesta 1; el inicio no suma costo. No hay celdas bloqueadas.

Requisitos:
- A-01: A* suma costos positivos de entrada; BFS conserva su semántica unitaria y no se presenta como referencia del mínimo ponderado.
- A-02: reutilizar A* con costo ponderado y heurística Manhattan admisible basada en el costo mínimo de entrada, manteniendo compatible el caso unitario.
- A-03: conectar los costos del mapa con el consumidor de navegación existente, sin crear una interfaz nueva.
- A-04: al usar un mapa nuevo con la franja a costo 1, la búsqueda vuelve al mínimo unitario y no reutiliza costos del mapa anterior.

Criterios:
- A-AC1: el camino directo tiene 4 pasos y costo 16 (=5+5+5+1); A* devuelve un rodeo válido de 6 pasos y costo 6. El rodeo puede ser por arriba o por abajo.
- A-AC2: sin la franja lenta, la ruta tiene 4 pasos y costo 4.
- A-AC3: la prueba de la simulación confirma el uso del modo ponderado; el modo unitario conserva su funcionamiento.

Fuera de alcance: cambiar velocidad, crear terrenos gráficos o editar niveles.

## Restricciones
No sobreescribir cambios previos ni ocultar fallos modificando pruebas. No instalar dependencias, acceder a secretos, publicar ni crear commits automáticamente. Mantener el dominio independiente de Phaser y del navegador. Limitar cambios de código a mapa/costos, navegación, consumidor mínimo y pruebas.
