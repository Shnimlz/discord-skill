# Reglas y Límites de Ingeniería Inversa (Discord REA Boundary)

El uso de **REA** (*Reverse Engineering Anything*) dentro de **`discord-skill`** está diseñado para desmitificar protocolos, auditar binarios de voz nativos, analizar paquetes de Discord y garantizar la máxima compatibilidad de software.

Para proteger a los desarrolladores y mantener la integridad del proyecto, cualquier operación de ingeniería inversa debe cumplir estrictamente las siguientes **4 Reglas Invariables**:

---

## Regla 1: Frontera Estricta de ToS y No-Selfbots (Legal & Safety Boundary)

* **Prohibición Total de Selfbots**: Queda terminantemente prohibido utilizar REA para emular cuentas de usuario humano, eludir protecciones Cloudflare JA3/JA4 o automatizar acciones de usuario prohibidas por los Términos de Servicio de Discord.
* **Propósito Autorizado**: Las herramientas de ingeniería inversa se limitan exclusivamente a:
  1. Comprensión de protocolos de red (Gateway WebSockets, Voice UDP/RTP, Ed25519).
  2. Detección de breaking changes y contratos no documentados entre versiones de npm.
  3. Auditoría de extensiones nativas (`.node`) de audio y rendimiento.
  4. Depuración de Discord Activities (Embedded Apps) en entornos locales.

---

## Regla 2: Integridad de Evidencia (Evidence Ledger Invariant)

Nunca especules ni afirmes comportamientos de Discord sin evidencia verificable:

1. **Observación Factual**: Solo lo que se puede medir o extraer directamente (hashes SHA-256, cadenas literales, desensamblado a nivel de bytes, rutas HTTP canónicas).
2. **Inferencia de Análisis**: Lo deducido a partir de pseudocódigo o decompilación (canales IPC de Electron, tipos deducidos). Debe marcarse explícitamente como *Inferencia*.
3. **Desconocido (`record_unknown`)**: Si la lógica está ofuscada o requiere el backend de Discord para confirmarse, debe marcarse como *Desconocido*. El análisis estático jamás prueba ejecución en runtime.

---

## Regla 3: Cero Extracción de Secretos y Privacidad (Privacy Invariant)

* En capturas de tráfico (HAR, mitmproxy) o depuración pasiva de navegadores/Electron vía CDP:
  * **Exclusión automática**: Se eliminan deliberadamente encabezados `Authorization: <token>`, cookies de sesión, tokens de pago y datos personales de usuarios.
  * Nunca almacenes volcados que contengan tokens activos de producción en el repositorio.

---

## Regla 4: Ruteo Seguro de Herramientas REA

Al investigar artefactos de Discord, utiliza la herramienta adecuada según el objetivo:

| Objetivo | Herramienta REA Recomendada | Modo de Operación |
| :--- | :--- | :--- |
| **ASAR de Electron / Bundles Webpack** | `analyze_javascript_application` | Estático (sin ejecutar el código) |
| **Diff de Formas de API en npm** | `compare_javascript_export_shapes` | Comparación semántica AST |
| **Módulos Nativos de Audio (`.node`)** | `open_binary` (Ghidra / IDA) | Desensamblado nativo de C++ |
| **Capturas de Red de la API** | `inspect_web_network_capture` | Inspección offline de archivos HAR |
| **Discord Activities en Runtime** | `list_browser_targets` + CDP | Observación pasiva de solo lectura |
