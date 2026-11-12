# CD Familia Córdova 2027 🏆⚽
> Sistema Integral de Gestión Deportiva, Recaudación Pro-Fondos y Memoria Histórica del Club.
> **Destino:** Campeonato Provincial en Junín (Jisse / Janjaillo) | **Fecha Límite:** 30 de Junio de 2027.

---

## 📋 Resumen del Proyecto

Plataforma oficial desarrollada para el **CD Familia Córdova**, club deportivo familiar radicado en Lima, con el objetivo de gestionar y transparentar los recursos, la logística de viaje y la nómina deportiva rumbo al campeonato provincial de 2 días en Junín (~3,400 msnm) en junio de 2027.

### 🎯 Metas y Presupuesto Obligatorio
- **Fondo para 3 Jales (Refuerzos Externos):** S/ 3,000 (S/ 1,000 c/u para pasajes ida/vuelta Lima-Junín y viáticos/honorarios).
- **Saldo de Inscripción Oficial:** S/ 180 (complementando la donación de S/ 500 comprometida por Manolo).
- **Logística en Cancha:** S/ 250 (hielo, agua local y fruta fresca de recarga).
- **Fondo de Imprevistos:** S/ 500 para contingencias médicas o mecánicas.
- **Presupuesto Total Requerido:** **S/ 3,930**.
- **Recaudación Proyectada:** **S/ 5,545** (33 domingos de cuotas a S/ 60/sem + 3 Polladas Pro-Fondos), garantizando un **superávit de +S/ 1,615**.

---

## ✨ Características Principales

1. **Dashboard de Resumen General & Analytics con Recharts**:
   - KPIs financieros en tiempo real con indicador de cobertura de jales (S/ 1k, S/ 2k, S/ 3k).
   - Curva acumulada de ahorro semanal con hitos de polladas (`AreaChart`).
   - Comparativa de presupuesto asignado vs cubierto por categoría (`BarChart`).
   - Desglose porcentual de fuentes de ingreso (`PieChart` / Donut).

2. **Control de Cuotas Dominicales (33 Domingos)**:
   - Registro nominal para los 6 aportantes del núcleo activo a razón de S/ 10 semanales.
   - Matriz completa de aportes (Nov 2026 – Jun 2027) con registro de método (Yape / Efectivo).
   - Botón de cierre semanal *"Marcar Domingo Completo (S/ 60)"*.

3. **Logística de Polladas Pro-Fondos**:
   - Escandallo de costos real: S/ 8.50 costo por presa, S/ 20 precio de venta al público, **S/ 11.50 de ganancia neta por plato**.
   - Asignación de 17 tarjetas por miembro con control de cobro.

4. **Nómina & Scouting de Jales**:
   - Fichas individuales para los 3 refuerzos permitidos (Volante 10, Delantero 9, Central 2).
   - Control de transporte, confirmación y aclimatación a la altura.

5. **Libro de Compromisos & Donaciones**:
   - Seguimiento a las donaciones pactadas (Camisetas por Rocío, Balón por Mastha, Éter y botiquín por Jhon, Guantes por Barcos, Banderola por Edgar Espinoza, etc.).
   - Alerta protocolar para solicitar las donaciones sorpresa (Manolo y Vides) 30 días antes del viaje (fines de mayo 2027).

6. **Central de Campeonato Junín 2027**:
   - Ubicación en Jisse / Janjaillo (~3,400 msnm), mapa esquemático de ruta Lima-La Oroya-Jauja-Jisse, clima y recomendaciones de aclimatación.

7. **Álbum de Recuerdos & Muro de Aliento**:
   - Galería fotográfica con anécdotas y valores del club.
   - Muro interactivo para dejar mensajes de aliento en vivo sincronizados con Firebase.

8. **Exportación & Reportes**:
   - **Impresión / PDF Oficial**: Hoja con membrete del club, balance consolidado, estado de cuotas y firmas de conformidad física para reuniones familiares.
   - **Generador de Reportes de WhatsApp**: Formato listo con emojis y montos para compartir en el grupo familiar en 1 clic.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite.
- **Estilos:** Tailwind CSS v4.
- **Gráficos & Visualización:** Recharts.
- **Iconos:** Lucide React.
- **Base de Datos:** Firebase Firestore con sincronización en tiempo real (`onSnapshot`) y persistencia local de respaldo.
- **Testing:** Node.js Test Runner nativo con TypeScript (`tsx --test`).

---

## 🚀 Instalación y Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/legend-ac/CD-Familia-Cordova.git
cd CD-Familia-Cordova

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Ejecutar pruebas unitarias
npx tsx --test src/utils/calculator.test.ts

# 5. Compilar para producción
npm run build
```

---

## 🔒 Variables de Entorno

Copiar `.env.example` a `.env` si se requiere configuración personalizada:

```env
GEMINI_API_KEY="opcional_para_asistente"
APP_URL="http://localhost:3000"
```

---

*¡Por la gloria en Junín 2027! Viva el CD Familia Córdova.* ⚽🇵🇪
