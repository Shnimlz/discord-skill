# Investigaciones de Ingeniería Inversa en Discord con REA

Esta guía detalla cómo utilizar las herramientas de **REA** (*Reverse Engineering Anything*) para desensamblar, auditar e inspeccionar artefactos reales de Discord y sus librerías de forma metódica y segura.

---

## 1. Auditoría de Aplicaciones Electron y Archivos `.asar`

Discord Desktop, al igual que los clientes embebidos, empaqueta su código en archivos `.asar` de Electron. 

Para auditar el grafo de módulos, canales IPC y llamadas internas:

### Comando de Análisis Estático:
```bash
# Analizar la estructura del ASAR de Discord de forma estática
rea analyze-javascript-application "C:/Users/.../Discord/app-1.0.9000/modules/discord_desktop_core/core.asar" --json
```

### Lo que REA extrae automáticamente:
1. **Mapeo de Canales IPC**: Identifica los canales `ipcRenderer.send`, `ipcRenderer.invoke` y `ipcMain.handle`. Esto permite entender cómo el cliente de Discord se comunica con sus procesos nativos.
2. **ContextBridge y Preload**: Revela las APIs que Discord expone de forma segura a sus ventanas webviews.
3. **Módulos y Dependencias**: Extrae el grafo de módulos (JAG) y reconstruye mapas de código fuente (Source Maps) si existen.

---

## 2. Auditoría de Módulos Nativos de Audio (`.node` C++)

Tanto Discord Desktop como `@discordjs/voice` compilan módulos nativos en C/C++ (`discord_voice.node`, bindings de `libopus` y `libsodium`).

Cuando la documentación oficial no explica cómo se procesa un codec o cómo se cifra un datagrama UDP:

### Flujo de Decompilación en Ghidra vía REA:
1. **Abrir el binario nativo**:
   ```json
   {
     "tool": "open_binary",
     "arguments": {
       "path": "./node_modules/@discordjs/voice/dist/native/voice.node",
       "provider_id": "ghidra"
     }
   }
   ```
2. **Inspeccionar funciones exportadas**:
   * Usar `binary_overview` para identificar la tabla de símbolos y funciones exportadas de Node-API (`napi_register_module_v1`).
3. **Decompilar a Pseudocódigo**:
   * Llamar a `analyze_function` sobre la función de encriptación o decodificación Opus para examinar la matemática de buffers y empaquetado RTP.

---

## 3. Comparación Semántica de Versiones con `compare_javascript_export_shapes`

Cuando Discord.js o `discord-api-types` actualizan una versión menor (ej. de 14.26.5 a 14.27.0), los changelogs suelen omitir detalles internos.

REA permite comparar **la forma de los objetos exportados**:

```json
{
  "tool": "compare_javascript_export_shapes",
  "arguments": {
    "left": { "kind": "retained-evidence", "evidence_id": "ev_VERSION_ANTERIOR" },
    "right": { "kind": "retained-evidence", "evidence_id": "ev_VERSION_NUEVA" },
    "module_path": "dist/index.js",
    "export_name": "Routes"
  }
}
```

* **Resultado devuelto**: Un reporte de cambios a nivel de punteros JSON (JSON Pointers) que muestra exactamente:
  * Propiedades nuevas añadidas.
  * Propiedades eliminadas o alteradas.
  * Cambios en la firma de tipos devuelta.

---

## 4. Observación Pasiva de Discord Activities (CDP)

Para depurar una Discord Activity en ejecución sin interactuar agresivamente con la página:

1. Inicia Discord con el puerto de depuración activado (`--remote-debugging-port=9222`).
2. Usa `list_browser_targets` en REA para detectar la página webview de la actividad.
3. **Inspección Pasiva**:
   * Captura errores de consola emitidos por el `@discord/embedded-app-sdk`.
   * Verifica que las URLs cargadas cumplan con el **Content Security Policy (CSP)** de Discord.
   * *Invariante*: No se capturan contraseñas, tokens de usuario ni cookies privadas.
