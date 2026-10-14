# Guía de Contribución a discord-skill

¡Gracias por tu interés en colaborar con **`discord-skill`**!

El objetivo de este proyecto es ser el punto de referencia abierto y de código abierto para desarrolladores y agentes de inteligencia artificial que construyen bots avanzados en Discord.

---

## 🛠️ ¿Cómo contribuir?

1. **Haz un Fork** del repositorio.
2. **Crea una rama descriptiva**:
   ```bash
   git checkout -b feature/nuevo-extractor-voice
   ```
3. **Instala dependencias**:
   ```bash
   pnpm install
   ```
4. **Prueba tus cambios**:
   ```bash
   pnpm cli audit
   ```
5. **Realiza tus commits** y abre un Pull Request.

---

## 🎯 Áreas prioritarias de colaboración

* **Nuevos Extractores**: Mapeo profundo de opciones de audio en `@discordjs/voice`.
* **Detección de Cambios de Tipos**: Mejoras al motor de diff AST para avisar de propiedades obsoletas (`@deprecated`).
* **Documentación para Agentes**: Nuevos patrones y recetas en `.agents/skills/discord-skill/references/`.
