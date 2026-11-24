
// ─── LANGUAGE ──────────────────────────────────────────────────────────────
let LANG = (function(){
  var p = new URLSearchParams(location.search).get('lang');
  if (p === 'en') return 'en';
  return 'es';
})();
// Set initial button active state once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  ['en','es'].forEach(function(lang) {
    var btn = document.getElementById('btn-' + lang);
    if (!btn) return;
    btn.style.color = (lang === LANG) ? 'var(--yellow)' : 'var(--dim)';
    btn.style.borderColor = (lang === LANG) ? 'var(--yellow)' : 'var(--border2)';
  });
});

const T = {
  en: {
    progress: 'DIAGNOSTIC PROGRESS',
    back: '← BACK',
    restart: 'START OVER',
    wa: 'CONTACT BIKELAB',
    shimano_service: 'SHIMANO SERVICE',
    sram_service: 'SRAM SERVICE',
    community_note: 'NOTE: This procedure is not in the official manual — documented by the technical community (Reddit r/bikewrench, BikeRadar forums). It works in most cases. If it fails, go to a certified dealer.',
    no_return: 'This problem has no documented home fix. Attempting repairs without the right tools risks further damage.',
    peru: '🇵🇪 Based in Peru? Send us your diagnostic result — ',
    peru2: 'BikeLab Studio, Trujillo.',
    social_cta: 'Saved you time? Follow us — it\'s the only way to help.',
    social_ig: 'Instagram',
    social_fb: 'Facebook',
  },
  es: {
    progress: 'PROGRESO DEL DIAGNÓSTICO',
    back: '← VOLVER',
    restart: 'EMPEZAR DE NUEVO',
    wa: 'CONTACTAR BIKELAB',
    shimano_service: 'SERVICIO SHIMANO',
    sram_service: 'SERVICIO SRAM',
    community_note: 'NOTA: Este procedimiento no está en el manual oficial — documentado por la comunidad técnica (Reddit r/bikewrench, foros BikeRadar). Funciona en la mayoría de casos. Si no funciona, visita un dealer certificado.',
    no_return: 'Este problema no tiene solución casera documentada. Intentar la reparación sin herramientas profesionales puede empeorar el daño.',
    peru: '🇵🇪 ¿Estás en Perú? Escríbenos con el resultado de tu diagnóstico — ',
    peru2: 'BikeLab Studio, Trujillo.',
    social_cta: '¿Te ahorró tiempo? Síguenos — es la única forma de ayudarnos.',
    social_ig: 'Instagram',
    social_fb: 'Facebook',
  }
};

function t(key) { return T[LANG][key] || T.en[key]; }

function setLang(l) {
  LANG = l;
  document.documentElement.lang = l;
  ['en','es'].forEach(function(lang) {
    var btn = document.getElementById('btn-' + lang);
    if (!btn) return;
    btn.style.color = (lang === l) ? 'var(--yellow)' : 'var(--dim)';
    btn.style.borderColor = (lang === l) ? 'var(--yellow)' : 'var(--border2)';
  });
  updateStaticText();
  restart();
}

function updateStaticText() {
  const s = LANG === 'es';
  document.getElementById('h-label').textContent = s ? '// Herramienta de Diagnóstico v1.0 — Gratis e Interactiva' : '// Diagnostic Tool v1.0 — Free & Interactive';
  document.getElementById('h-title').innerHTML = s ? 'DIAGNÓSTICO<br>CAMBIOS<br><span>ELECTRÓNICOS_</span>' : 'ELECTRONIC<br>SHIFTING<br><span>DIAGNOSTIC_</span>';
  document.getElementById('h-sub').textContent = s ? 'Una pregunta a la vez. Shimano Di2 y SRAM AXS. No necesitas la app para empezar.' : 'One question at a time. Shimano Di2 and SRAM AXS. No app required to start.';
  document.getElementById('h-badge3').textContent = s ? 'Herramienta Gratuita' : 'Free Tool';
  document.getElementById('prog-label').textContent = t('progress');
  document.getElementById('f-note').textContent = s ? 'Procedimientos basados en documentación oficial Shimano y SRAM' : 'Procedures based on official Shimano & SRAM documentation';
  document.getElementById('f-home').textContent = s ? '← BikeLab Studio' : '← BikeLab Studio';
  document.getElementById('faq-en').style.display = s ? 'none' : 'block';
  document.getElementById('faq-es').style.display = s ? 'block' : 'none';
  document.getElementById('sag-card-title').textContent = s ? 'Calculadora de SAG para Suspensión' : 'Suspension SAG Calculator';
  document.getElementById('sag-card-desc').textContent = s ? 'Configura correctamente el SAG de tu horquilla y amortiguador — la otra variable clave del rendimiento.' : 'Set your fork and shock sag correctly — the other key variable in bike performance.';
  document.getElementById('sag-link').textContent = s ? 'CALCULAR SAG →' : 'CALCULATE SAG →';
}

// ─── TREE ──────────────────────────────────────────────────────────────────
const TREE = {
  // Q0 — System select
  q0: {
    step: { en: 'STEP_01 / SYSTEM', es: 'PASO_01 / SISTEMA' },
    q: { en: 'What electronic system do you have?', es: '¿Qué sistema electrónico tienes?' },
    desc: { en: 'Select your groupset brand to get accurate procedures.', es: 'Selecciona la marca de tu grupo para obtener procedimientos exactos.' },
    opts: [
      { key:'A', text:{ en:'Shimano Di2', es:'Shimano Di2' }, sub:{ en:'Dura-Ace, Ultegra, 105, GRX, XTR, XT, SLX — 11v or 12v', es:'Dura-Ace, Ultegra, 105, GRX, XTR, XT, SLX — 11v o 12v' }, cls:'di2-opt', next:'q1' },
      { key:'B', text:{ en:'SRAM AXS', es:'SRAM AXS' }, sub:{ en:'Red, Force, Rival eTap AXS — Road or MTB Eagle', es:'Red, Force, Rival eTap AXS — Ruta o MTB Eagle' }, cls:'axs-opt', next:'q1_axs' }
    ],
    progress: 5
  },

  // ─── DI2 BRANCH ────────────────────────────────────────────────────────
  q1: {
    step: { en: 'STEP_02 / DI2 — INITIAL CHECK', es: 'PASO_02 / DI2 — DIAGNÓSTICO INICIAL' },
    q: { en: 'Any sign of life?', es: '¿Hay alguna señal de vida?' },
    desc: { en: 'Press any shifter button or the button on the rear derailleur. Any LED, sound, or partial response?', es: 'Presiona cualquier pulsador o el botón del desviador trasero. ¿Hay algún LED, sonido o respuesta parcial?' },
    opts: [
      { key:'A', text:{ en:'Yes — LED on, some shifts work, or partial response', es:'Sí — LED encendido, algunos cambios funcionan, o respuesta parcial' }, next:'q2_di2' },
      { key:'B', text:{ en:'No — Completely dead, zero response', es:'No — Todo muerto, cero respuesta' }, next:'q_di2_dead' }
    ],
    progress: 20
  },

  q_di2_dead: {
    step: { en: 'STEP_03 / DI2 — DEAD SYSTEM', es: 'PASO_03 / DI2 — SISTEMA MUERTO' },
    q: { en: 'Where is your battery?', es: '¿Dónde está tu batería?' },
    desc: { en: 'Di2 12v: built into the seatpost (BT-DN300). Di2 11v: in the seatpost or frame (BT-DN110). Location affects the reset procedure.', es: 'Di2 12v: integrada en el tija de sillín (BT-DN300). Di2 11v: en la tija o el cuadro (BT-DN110). Esto afecta el procedimiento.' },
    opts: [
      { key:'A', text:{ en:'12v — Battery in seatpost (slide-out)', es:'12v — Batería en tija (deslizable)' }, next:'q_di2_charge' },
      { key:'B', text:{ en:'11v — Battery in seatpost or frame (push-button)', es:'11v — Batería en tija o cuadro (botón)' }, next:'q_di2_charge' },
      { key:'C', text:{ en:'Not sure', es:'No estoy seguro' }, next:'q_di2_charge' }
    ],
    progress: 35
  },

  q_di2_charge: {
    step: { en: 'STEP_04 / DI2 — BATTERY', es: 'PASO_04 / DI2 — BATERÍA' },
    q: { en: 'Remove and reconnect the battery. Press the RD button for 5 sec. Any LED?', es: 'Retira y reconecta la batería. Presiona el botón del RD 5 seg. ¿Hay LED?' },
    desc: { en: 'Remove the battery fully, wait 30 seconds, reinstall. Then press the rear derailleur button (or Junction A on 11v) for 5–10 seconds.', es: 'Retira la batería completamente, espera 30 segundos, reinstala. Luego presiona el botón del desviador trasero (o Junction A en 11v) 5–10 segundos.' },
    opts: [
      { key:'A', text:{ en:'Yes — LED appeared after reconnecting', es:'Sí — Apareció LED al reconectar' }, next:'q2_di2' },
      { key:'B', text:{ en:'No LED at all — tried charging for 1+ hour', es:'Ningún LED — intenté cargar 1+ hora' }, next:'r_di2_battery_dead' },
      { key:'C', text:{ en:'Red LED solid or rapid red blink', es:'LED rojo fijo o parpadeo rojo rápido' }, next:'r_di2_charge_now' }
    ],
    progress: 50
  },

  q2_di2: {
    step: { en: 'STEP_03 / DI2 — SYMPTOM', es: 'PASO_03 / DI2 — SÍNTOMA' },
    q: { en: 'What exactly is failing?', es: '¿Qué exactamente está fallando?' },
    desc: { en: 'Select the symptom that best describes your problem.', es: 'Selecciona el síntoma que mejor describe el problema.' },
    opts: [
      { key:'A', text:{ en:'Shifting fails under load or on climbs', es:'Los cambios fallan bajo carga o en cuestas' }, sub:{ en:'Works on the flat, fails when pedaling hard', es:'Funciona en llano, falla pedalando fuerte' }, next:'r_di2_synchro' },
      { key:'B', text:{ en:'Battery drains too fast', es:'La batería se descarga demasiado rápido' }, sub:{ en:'100% to dead in days without riding', es:'De 100% a vacía en días sin pedalear' }, next:'r_di2_drain' },
      { key:'C', text:{ en:'System crashed after impact', es:'Sistema bloqueado tras un golpe' }, sub:{ en:'Fell or hit something, now won\'t shift', es:'Caída o golpe, ahora no cambia' }, next:'r_di2_crash' },
      { key:'D', text:{ en:'Shifter not responding or needs hard press', es:'Pulsador no responde o requiere presión fuerte' }, sub:{ en:'One or both sides intermittent or sticky', es:'Uno o ambos lados intermitente o pegajoso' }, next:'r_di2_shifter' },
      { key:'E', text:{ en:'Indexing off — noisy, imprecise, chain rubs', es:'Indexing desajustado — ruidoso, impreciso, roce de cadena' }, next:'r_di2_index' },
      { key:'F', text:{ en:'Firmware update failed / system unresponsive after update', es:'Actualización de firmware fallida / sistema muerto tras update' }, next:'r_di2_brick' }
    ],
    progress: 40
  },

  // ─── AXS BRANCH ────────────────────────────────────────────────────────
  q1_axs: {
    step: { en: 'STEP_02 / AXS — INITIAL CHECK', es: 'PASO_02 / AXS — DIAGNÓSTICO INICIAL' },
    q: { en: 'Any sign of life?', es: '¿Hay alguna señal de vida?' },
    desc: { en: 'Press the AXS button on the rear derailleur for 1 second. Any LED response?', es: 'Presiona el botón AXS del desviador trasero 1 segundo. ¿Hay respuesta LED?' },
    opts: [
      { key:'A', text:{ en:'Yes — LED lights up or partial function', es:'Sí — LED enciende o función parcial' }, next:'q2_axs' },
      { key:'B', text:{ en:'No — Completely dead', es:'No — Todo muerto' }, next:'q_axs_dead' }
    ],
    progress: 20
  },

  q_axs_dead: {
    step: { en: 'STEP_03 / AXS — DEAD SYSTEM', es: 'PASO_03 / AXS — SISTEMA MUERTO' },
    q: { en: 'Remove the derailleur battery and do a hard reset', es: 'Retira la batería del desviador y haz un hard reset' },
    desc: { en: 'Official SRAM procedure: Remove battery → wait 15 seconds → press AXS button without battery to drain residual energy → reinstall charged battery.', es: 'Procedimiento oficial SRAM: Retira la batería → espera 15 segundos → presiona el botón AXS sin batería para drenar energía residual → reinstala batería cargada.' },
    opts: [
      { key:'A', text:{ en:'Done — LED appeared after reinstalling', es:'Hecho — Apareció LED al reinstalar' }, next:'q2_axs' },
      { key:'B', text:{ en:'Still nothing after hard reset', es:'Sigue sin respuesta tras el hard reset' }, next:'r_axs_battery_check' }
    ],
    progress: 40
  },

  q2_axs: {
    step: { en: 'STEP_03 / AXS — SYMPTOM', es: 'PASO_03 / AXS — SÍNTOMA' },
    q: { en: 'What exactly is failing?', es: '¿Qué exactamente está fallando?' },
    desc: { en: 'Select the symptom that best describes your problem.', es: 'Selecciona el síntoma que mejor describe el problema.' },
    opts: [
      { key:'A', text:{ en:'Pairing lost — shifter not talking to derailleur', es:'Pairing perdido — pulsador no comunica con desviador' }, sub:{ en:'LED blinks strangely, won\'t shift despite battery OK', es:'LED parpadea raro, no cambia aunque batería OK' }, next:'r_axs_pair' },
      { key:'B', text:{ en:'Shifter dead or unresponsive', es:'Pulsador muerto o sin respuesta' }, sub:{ en:'One or both levers do nothing', es:'Una o ambas palancas no hacen nada' }, next:'r_axs_shifter' },
      { key:'C', text:{ en:'Battery drains too fast or false low reading', es:'Batería drena rápido o lectura falsa de baja' }, next:'r_axs_drain' },
      { key:'D', text:{ en:'Chain drops when shifting to large chainring', es:'Cadena cae al cambiar al plato grande' }, sub:{ en:'Common on Force/Rival 1st gen', es:'Común en Force/Rival 1ª gen' }, next:'r_axs_chain_drop' },
      { key:'E', text:{ en:'Shifting imprecise, skipping, or noisy', es:'Cambios imprecisos, salta o ruidoso' }, next:'r_axs_index' },
      { key:'F', text:{ en:'Oil leak from rear derailleur pivot', es:'Fuga de aceite en el pivote del desviador trasero' }, sub:{ en:'Oily residue, chain noise, Red/Force only', es:'Residuo aceitoso, ruido cadena, solo Red/Force' }, next:'r_axs_orbit' }
    ],
    progress: 40
  },

  // ─── DI2 RESULTS ──────────────────────────────────────────────────────
  r_di2_charge_now: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Battery low — charge now', es: 'Batería baja — carga ahora' },
    desc: { en: 'Red LED = battery depleted. This is normal. Charge with the standard USB charger for 1–3 hours until LED turns green.', es: 'LED rojo = batería agotada. Esto es normal. Carga con el cargador USB estándar 1–3 horas hasta que el LED sea verde.' },
    steps: [
      { en: 'Connect battery charger (SM-BCR2 for 11v, or USB-C seatpost cable for 12v)', es: 'Conecta el cargador de batería (SM-BCR2 para 11v, o cable USB-C de tija para 12v)' },
      { en: 'Charge until LED solid green (1–3 hours depending on depletion)', es: 'Carga hasta LED verde sólido (1–3 horas según nivel de agotamiento)' },
      { en: 'Reconnect battery and press shifter 3–5 times quickly to wake up the system', es: 'Reconecta la batería y presiona el pulsador 3–5 veces rápido para despertar el sistema' },
      { en: 'If system doesn\'t wake up after full charge — proceed to next issue', es: 'Si el sistema no despierta tras carga completa — continúa al siguiente problema' }
    ],
    official: true,
    progress: 100
  },

  r_di2_battery_dead: {
    type: 'workshop',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Battery likely failed or internal cable issue', es: 'Batería probablemente fallida o problema de cable interno' },
    desc: { en: 'No response after charge and reset indicates a failed battery or disconnected internal cable — both require professional diagnosis.', es: 'Sin respuesta tras carga y reset indica batería fallida o cable interno desconectado — ambos requieren diagnóstico profesional.' },
    steps: [],
    official: true,
    progress: 100
  },

  r_di2_synchro: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Disable Synchro Shift mode', es: 'Desactiva el modo Synchro Shift' },
    desc: { en: 'Synchro Shift can reject commands under load. Disable it via E-Tube app or directly on the bike.', es: 'Synchro Shift puede rechazar comandos bajo carga. Desactívalo vía app E-Tube o directamente en la bici.' },
    steps: [
      { en: 'Option A (with app): Open E-Tube Cyclist → My Bike → Shift Mode → select Manual or Semi-Synchro', es: 'Opción A (con app): Abre E-Tube Cyclist → Mi Bici → Modo de cambio → selecciona Manual o Semi-Synchro' },
      { en: 'Option B (without app): Hold the RD button for 0.5–2 seconds until LED blinks blue — this temporarily enters manual mode', es: 'Opción B (sin app): Mantén el botón RD 0.5–2 segundos hasta que LED parpadee azul — entra temporalmente en modo manual' },
      { en: 'Test: shift through all gears under moderate load on a climb', es: 'Prueba: cambia por todos los piñones bajo carga moderada en una cuesta' },
      { en: 'Also check: L/H limit screws — if too tight, loosen 1/4 turn each', es: 'Verifica también: tornillos límite L/H — si están muy apretados, afloja 1/4 vuelta' }
    ],
    official: true,
    progress: 100
  },

  r_di2_drain: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Phantom battery drain — known issue on Di2 11v with EW-WU111', es: 'Drenaje fantasma — problema conocido en Di2 11v con EW-WU111' },
    desc: { en: 'The Bluetooth module (EW-WU111) on 11v can stay awake, draining the battery in days. Isolate the faulty component.', es: 'El módulo Bluetooth (EW-WU111) en 11v puede quedarse activo, drenando la batería en días. Aísla el componente defectuoso.' },
    steps: [
      { en: 'Charge battery to 100%', es: 'Carga la batería al 100%' },
      { en: 'Disconnect one component from the E-Tube network each day (start with EW-WU111 if present)', es: 'Desconecta un componente de la red E-Tube cada día (empieza por el EW-WU111 si lo tienes)' },
      { en: 'Check charge each morning — the disconnected component that stops the drain is the cause', es: 'Revisa la carga cada mañana — el componente desconectado que detiene el drenaje es el causante' },
      { en: 'Also: Disable Bluetooth in E-Tube app when not in use. Loosen L/H limits 1/4 turn (tight limits = motor overworks)', es: 'También: Desactiva Bluetooth en app E-Tube cuando no uses. Afloja límites L/H 1/4 vuelta (límites apretados = motor trabaja de más)' },
      { en: 'If drain continues after isolation test — faulty cable or component requires professional diagnosis with SM-PCE02', es: 'Si el drenaje continúa tras el test de aislamiento — cable o componente defectuoso requiere diagnóstico con SM-PCE02' }
    ],
    official: false,
    progress: 100
  },

  r_di2_crash: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Crash Recovery mode — system self-locked after impact', es: 'Modo Crash Recovery — sistema bloqueado tras impacto' },
    desc: { en: 'Di2 has a safety mechanism that disconnects the motor servo after impact. Follow these steps to re-engage it.', es: 'Di2 tiene un mecanismo de seguridad que desconecta el servo motor tras un impacto. Sigue estos pasos para reactivarlo.' },
    steps: [
      { en: 'Place bike in a stand. Keep the cranks turning slowly throughout the process', es: 'Pon la bici en el soporte. Mantén las bielas girando lentamente durante todo el proceso' },
      { en: 'Hold the RD button (or Junction A on 11v) until the RED LED blinks (approx. 5 seconds)', es: 'Mantén presionado el botón del RD (o Junction A en 11v) hasta que el LED ROJO parpadee (aprox. 5 segundos)' },
      { en: 'Release the button. The derailleur will sweep through all gears automatically', es: 'Suelta el botón. El desviador hará un barrido por todos los piñones automáticamente' },
      { en: 'When sweep completes, LED turns off. Test shifting normally', es: 'Cuando el barrido termine, el LED se apaga. Prueba los cambios normalmente' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_di2_shifter: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Sticky or unresponsive shifter', es: 'Pulsador pegajoso o sin respuesta' },
    desc: { en: 'Buttons can get sticky from sweat, rain, or dust. Before assuming internal failure, try cleaning.', es: 'Los botones pueden pegarse por sudor, lluvia o polvo. Antes de asumir falla interna, prueba a limpiar.' },
    steps: [
      { en: 'Clean buttons with dry cloth. Use compressed air if available. Do NOT use liquid cleaners', es: 'Limpia los botones con trapo seco. Usa aire comprimido si tienes. NO uses limpiadores líquidos' },
      { en: 'Press the sticky button 20–30 times firmly to "unstick" it', es: 'Presiona el botón pegajoso 20–30 veces con firmeza para "despegarlo"' },
      { en: 'Check E-Tube connector: press firmly with TL-EW02 tool (or gentle thumb pressure) — vibration can partially disconnect it', es: 'Verifica el conector E-Tube: presiona firmemente con herramienta TL-EW02 (o presión suave del pulgar) — la vibración puede desconectarlo parcialmente' },
      { en: 'If problem persists after cleaning — internal PCB failure. Requires replacement', es: 'Si el problema persiste tras limpiar — fallo interno de PCB. Requiere reemplazo' }
    ],
    official: true,
    progress: 100
  },

  r_di2_index: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Indexing adjustment — on-bike without app', es: 'Ajuste de indexing — en la bici sin app' },
    desc: { en: 'Official Di2 micro-adjustment procedure. Shift to the 5th largest sprocket first.', es: 'Procedimiento oficial de micro-ajuste Di2. Primero cambia al 5º piñón más grande.' },
    steps: [
      { en: 'Shift chain to the 5th largest sprocket', es: 'Cambia la cadena al 5º piñón más grande' },
      { en: 'Press and hold RD button until YELLOW LED lights solid — you are now in adjustment mode', es: 'Mantén presionado el botón del RD hasta que el LED AMARILLO se encienda fijo — estás en modo ajuste' },
      { en: 'Use right shifter: one button moves derailleur 0.2mm inward, other moves 0.2mm outward', es: 'Usa el pulsador derecho: un botón mueve el desviador 0.2mm hacia adentro, el otro 0.2mm hacia afuera' },
      { en: 'Adjust inward until you hear chain rub on 4th sprocket, then back out 4 clicks to center', es: 'Ajusta hacia adentro hasta escuchar roce en el 4º piñón, luego 4 clics hacia afuera para centrar' },
      { en: 'Press RD button again until YELLOW LED turns off — adjustment saved', es: 'Presiona el botón RD nuevamente hasta que LED AMARILLO se apague — ajuste guardado' },
      { en: 'Test all gears. Repeat if needed', es: 'Prueba todos los piñones. Repite si es necesario' }
    ],
    official: true,
    progress: 100
  },

  r_di2_brick: {
    type: 'workshop',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Firmware brick — no home fix possible', es: 'Brick de firmware — no hay solución casera' },
    desc: { en: 'A failed Bluetooth firmware update corrupts the EPROM memory. Recovery requires a wired connection to a PC using the SM-PCE02 tool — Shimano dealer equipment only.', es: 'Una actualización de firmware fallida por Bluetooth corrompe la memoria EPROM. La recuperación requiere conexión por cable a una PC con la herramienta SM-PCE02 — equipo exclusivo de dealers Shimano.' },
    steps: [],
    official: true,
    prevention: { en: 'Prevention: NEVER update Di2 firmware via Bluetooth. Always use a wired connection with SM-PCE02 when available.', es: 'Prevención: NUNCA actualices firmware Di2 por Bluetooth. Usa siempre conexión por cable con SM-PCE02 cuando esté disponible.' },
    progress: 100
  },

  // ─── AXS RESULTS ──────────────────────────────────────────────────────
  r_axs_battery_check: {
    type: 'workshop',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Battery or pogo pin issue — check before going to service', es: 'Problema de batería o pogo pin — verifica antes de ir al servicio' },
    desc: { en: 'After a full hard reset with no response, the issue is either a dead battery, a broken pogo pin, or an internal component failure.', es: 'Tras un hard reset completo sin respuesta, el problema es batería muerta, pogo pin roto o fallo interno de componente.' },
    steps: [
      { en: 'Try a different known-good AXS battery if available', es: 'Prueba con otra batería AXS que funcione, si tienes' },
      { en: 'Inspect the pogo pin (small spring-loaded pin on the derailleur): if collapsed or broken, it cannot be repaired at home', es: 'Inspecciona el pogo pin (pequeño pin con resorte en el desviador): si está hundido o roto, no se puede reparar en casa' },
      { en: 'If battery swap doesn\'t help — warranty claim or professional service required', es: 'Si cambiar la batería no ayuda — reclamación de garantía o servicio profesional requerido' }
    ],
    official: true,
    progress: 100
  },

  r_axs_pair: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Re-pair AXS components — official procedure without app', es: 'Re-emparejar componentes AXS — procedimiento oficial sin app' },
    desc: { en: 'The rear derailleur is always the master. Start pairing from there. Turn off WiFi and other Bluetooth devices nearby to reduce interference.', es: 'El desviador trasero siempre es el maestro. Empieza el pairing desde ahí. Apaga WiFi y otros dispositivos Bluetooth cercanos para reducir interferencias.' },
    steps: [
      { en: 'Start pairing session: Hold AXS button on rear derailleur until GREEN LED blinks slowly. Release. (Session expires in 30 sec)', es: 'Inicia sesión de pairing: Mantén botón AXS en desviador trasero hasta LED VERDE parpadee lento. Suelta. (Sesión expira en 30 seg)' },
      { en: 'For 2x systems: Hold AXS button on front derailleur until GREEN LED blinks fast. Release', es: 'Para sistemas 2x: Mantén botón AXS en desviador delantero hasta LED VERDE parpadee rápido. Suelta' },
      { en: 'Pair right shifter: Hold AXS button inside right lever until GREEN LED blinks fast. Release', es: 'Empareja pulsador derecho: Mantén botón AXS dentro de la palanca derecha hasta LED VERDE parpadee rápido. Suelta' },
      { en: 'Pair left shifter: Repeat step 3 with left lever', es: 'Empareja pulsador izquierdo: Repite paso 3 con palanca izquierda' },
      { en: 'Close session: Press and release AXS button on rear derailleur once. LED stops blinking', es: 'Cierra sesión: Presiona y suelta botón AXS del desviador trasero una vez. LED deja de parpadear' },
      { en: 'Test: press a shifter — RD LED should blink when receiving command', es: 'Prueba: presiona un pulsador — LED del RD debe parpadear al recibir comando' }
    ],
    official: true,
    progress: 100
  },

  r_axs_shifter: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Dead AXS shifter — CR2032 battery', es: 'Pulsador AXS muerto — batería CR2032' },
    desc: { en: 'AXS shifters run on a CR2032 coin cell battery. This is the most common cause of a dead lever.', es: 'Los pulsadores AXS funcionan con una pila de botón CR2032. Es la causa más frecuente de una palanca muerta.' },
    steps: [
      { en: 'Open the shifter battery cover with a coin (turn counterclockwise)', es: 'Abre la tapa de la pila del pulsador con una moneda (gira en sentido antihorario)' },
      { en: 'Replace CR2032 (available at pharmacies and electronics stores, ~$1–2)', es: 'Reemplaza la CR2032 (disponible en farmacias y tiendas de electrónica, ~S/5)' },
      { en: 'If new battery also fails: use a small precision flathead screwdriver to VERY gently lift the contact tabs ~1mm upward to restore spring tension', es: 'Si la pila nueva también falla: usa un destornillador de precisión plano para levantar MUY suavemente las pestañas de contacto ~1mm para restaurar la tensión' },
      { en: 'Re-pair the shifter following the pairing procedure', es: 'Vuelve a emparejar el pulsador siguiendo el procedimiento de pairing' },
      { en: 'WARNING: If you over-bend and break the contact tabs — the shifter needs replacement', es: 'ADVERTENCIA: Si doblas demasiado y rompes las pestañas de contacto — el pulsador necesita reemplazo' }
    ],
    official: true,
    progress: 100
  },

  r_axs_drain: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'AXS battery drain — transport accelerometer issue', es: 'Drenaje AXS — problema del acelerómetro en transporte' },
    desc: { en: 'AXS derailleurs have internal accelerometers. Car vibration triggers them and "wakes" the motors continuously, draining batteries on transport.', es: 'Los desviadores AXS tienen acelerómetros internos. Las vibraciones del coche los activan y "despiertan" los motores continuamente, drenando baterías en transporte.' },
    steps: [
      { en: 'Transport fix: ALWAYS remove AXS batteries before loading the bike on a car rack or vehicle. Replace the red protective caps on terminals', es: 'Fix para transporte: SIEMPRE retira las baterías AXS antes de cargar la bici en portabicicletas o vehículo. Pon las tapas rojas protectoras en los terminales' },
      { en: 'False low reading fix: Charge for 1 hour → remove battery 30 sec → reinstall → update firmware in AXS app', es: 'Fix para lectura falsa: Carga 1 hora → retira batería 30 seg → reinstala → actualiza firmware en app AXS' },
      { en: 'If battery won\'t hold charge even in static storage — battery is degraded, needs replacement', es: 'Si la batería no retiene carga incluso guardada estática — batería degradada, necesita reemplazo' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_axs_chain_drop: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Chain drop to large chainring — Force/Rival 1st gen known issue', es: 'Caída de cadena al plato grande — problema conocido Force/Rival 1ª gen' },
    desc: { en: 'This is a documented design tolerance issue in early Force and Rival eTap AXS. The red adjustment wedge and High limit are the fix.', es: 'Es un problema documentado de tolerancias de diseño en Force y Rival eTap AXS primeras generaciones. La cuña roja y el límite High son la solución.' },
    steps: [
      { en: 'Install the SRAM red adjustment wedge (included in box or available from SRAM dealer) — this is mandatory for 1st gen Force/Rival', es: 'Instala la cuña roja de ajuste SRAM (incluida en la caja o disponible en dealer SRAM) — obligatoria para Force/Rival 1ª gen' },
      { en: 'Adjust High-Limit (H) screw: maximum 0.5mm chain clearance from the chainring', es: 'Ajusta el tornillo High-Limit (H): máximo 0.5mm de holgura entre cadena y plato' },
      { en: 'Check chainring inner bolt rotation: align the position mark with the crank spider — incorrect rotation from factory causes this', es: 'Verifica la rotación del perno interno del plato: alinea la marca de posición con la araña de la biela — la rotación incorrecta de fábrica causa esto' },
      { en: 'If using original SRAM chain: replace with KMC chain — many users report this resolves the issue completely', es: 'Si usas cadena original SRAM: reemplaza con cadena KMC — muchos usuarios reportan que esto lo resuelve completamente' },
      { en: 'If chain drop continues after all adjustments — derailleur cage may be twisted from a previous chain jam. Needs inspection', es: 'Si la cadena sigue cayendo tras todos los ajustes — la jaula del desviador puede estar torcida por un atasco previo. Necesita inspección' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_axs_index: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'AXS micro-adjustment — on-bike without app', es: 'Micro-ajuste AXS — en la bici sin app' },
    desc: { en: 'First clean the chain and cassette with a dry cloth. Dirty drivetrain mimics indexing problems.', es: 'Primero limpia la cadena y el cassette con un trapo seco. La transmisión sucia imita problemas de indexing.' },
    steps: [
      { en: 'Clean chain and cassette with dry cloth (remove gross dirt first)', es: 'Limpia la cadena y cassette con trapo seco (elimina la suciedad gruesa primero)' },
      { en: 'On-bike micro-adjust: Press AXS button on RD until LED blinks → use shifter buttons to move derailleur +/- in small increments', es: 'Micro-ajuste en bici: Presiona botón AXS en RD hasta LED parpadee → usa botones del pulsador para mover desviador +/- en pequeños incrementos' },
      { en: 'Adjust B-screw for 5–7mm gap between guide pulley and largest sprocket (use a finger as gauge)', es: 'Ajusta el tornillo B para 5–7mm de holgura entre la polea guía y el piñón más grande (usa un dedo como medida)' },
      { en: 'If skipping persists after adjustment: check derailleur hanger — if bent, indexing cannot be corrected without replacing it', es: 'Si el salto persiste tras el ajuste: verifica el adaptador del desviador — si está doblado, el indexing no se puede corregir sin reemplazarlo' }
    ],
    official: true,
    progress: 100
  },

  r_axs_orbit: {
    type: 'workshop',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Orbit fluid leak — warranty claim required', es: 'Fuga del sistema Orbit — reclamación de garantía requerida' },
    desc: { en: 'The Orbit fluid damper in SRAM Red and Force AXS is a sealed system — it cannot be serviced or refilled at home. A leak means the internal seals have failed.', es: 'El amortiguador de fluido Orbit en SRAM Red y Force AXS es un sistema sellado — no se puede revisar ni rellenar en casa. Una fuga significa que los sellos internos han fallado.' },
    steps: [],
    official: true,
    warranty: true,
    progress: 100
  },
};

// ─── STATE & ENGINE ────────────────────────────────────────────────────────
let history = [];
let current = 'q0';

function getNode(id) { return TREE[id]; }

function render(nodeId) {
  current = nodeId;
  const node = getNode(nodeId);
  if (!node) return;

  const fill = node.progress || 10;
  document.getElementById('prog-fill').style.width = fill + '%';

  const container = document.getElementById('tool-container');
  container.innerHTML = '';

  if (history.length > 0) {
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = t('back');
    backBtn.onclick = goBack;
    container.appendChild(backBtn);
  }

  if (node.type) {
    renderResult(node, container);
  } else {
    renderQuestion(node, container);
  }
}

function renderQuestion(node, container) {
  const card = document.createElement('div');
  card.className = 'card';

  const step = document.createElement('p');
  step.className = 'card-step';
  step.textContent = node.step[LANG] || node.step.en;
  card.appendChild(step);

  const q = document.createElement('h2');
  q.className = 'card-question';
  q.textContent = node.q[LANG] || node.q.en;
  card.appendChild(q);

  if (node.desc) {
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.innerHTML = (node.desc[LANG] || node.desc.en).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    card.appendChild(desc);
  }

  const opts = document.createElement('div');
  opts.className = 'options';

  node.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt ' + (opt.cls || '');

    const key = document.createElement('span');
    key.className = 'opt-key';
    key.textContent = opt.key;
    btn.appendChild(key);

    const textWrap = document.createElement('div');
    const text = document.createElement('div');
    text.className = 'opt-text';
    text.textContent = opt.text[LANG] || opt.text.en;
    textWrap.appendChild(text);

    if (opt.sub) {
      const sub = document.createElement('div');
      sub.className = 'opt-sub';
      sub.textContent = opt.sub[LANG] || opt.sub.en;
      textWrap.appendChild(sub);
    }

    btn.appendChild(textWrap);
    btn.onclick = () => { history.push(current); render(opt.next); };
    opts.appendChild(btn);
  });

  card.appendChild(opts);
  container.appendChild(card);
}

function renderResult(node, container) {
  const typeMap = { solved:'solved', limit:'limit', workshop:'workshop' };
  const iconMap = {
    solved: { cls:'green', label: LANG==='es' ? '✓ SOLUCIÓN ENCONTRADA' : '✓ SOLUTION FOUND' },
    limit:  { cls:'orange', label: LANG==='es' ? '⚠ LÍMITE CASERO' : '⚠ HOME FIX LIMIT' },
    workshop: { cls:'red', label: LANG==='es' ? '✕ REQUIERE TALLER' : '✕ PROFESSIONAL SERVICE REQUIRED' },
  };

  const card = document.createElement('div');
  card.className = 'result-card ' + (typeMap[node.type] || 'limit');

  const icon = document.createElement('div');
  icon.className = 'result-icon ' + iconMap[node.type].cls;
  icon.textContent = iconMap[node.type].label;
  card.appendChild(icon);

  const step = document.createElement('p');
  step.className = 'card-step';
  step.textContent = node.step[LANG] || node.step.en;
  card.appendChild(step);

  const title = document.createElement('h2');
  title.className = 'result-title';
  title.textContent = node.title[LANG] || node.title.en;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.innerHTML = (node.desc[LANG] || node.desc.en).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  card.appendChild(desc);

  if (node.steps && node.steps.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'result-steps';
    node.steps.forEach((s, i) => {
      const li = document.createElement('li');
      const num = document.createElement('span');
      num.className = 'step-num';
      num.textContent = String(i+1).padStart(2,'0');
      li.appendChild(num);
      const txt = document.createElement('span');
      txt.innerHTML = (s[LANG] || s.en).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      li.appendChild(txt);
      ul.appendChild(li);
    });
    card.appendChild(ul);
  }

  if (node.prevention) {
    const prev = document.createElement('div');
    prev.className = 'result-note';
    prev.innerHTML = '<strong>' + (LANG==='es' ? 'PREVENCIÓN: ' : 'PREVENTION: ') + '</strong>' + (node.prevention[LANG] || node.prevention.en);
    card.appendChild(prev);
  }

  if (node.warranty) {
    const w = document.createElement('div');
    w.className = 'result-note';
    w.innerHTML = '<strong>' + (LANG==='es' ? 'GARANTÍA: ' : 'WARRANTY: ') + '</strong>' + (LANG==='es' ? 'Contacta a tu dealer SRAM autorizado. Proporciona el número de serie del componente y evidencia fotográfica de la fuga.' : 'Contact your authorized SRAM dealer. Provide the component serial number and photographic evidence of the leak.');
    card.appendChild(w);
  }

  if (node.community) {
    const cn = document.createElement('div');
    cn.className = 'result-note community';
    cn.textContent = t('community_note');
    card.appendChild(cn);
  }

  // Peru note
  const peru = document.createElement('div');
  peru.className = 'peru-note';
  peru.innerHTML = t('peru') + '<a href="https://wa.me/51934391545?text=' + encodeURIComponent(LANG==='es' ? 'Hola BikeLab, diagnóstico Di2/AXS: ' : 'Hi BikeLab, Di2/AXS diagnostic result: ') + '" style="color:var(--yellow);text-decoration:none"><strong>' + t('peru2') + '</strong></a>';
  card.appendChild(peru);

  // Social follow
  const social = document.createElement('div');
  social.className = 'social-follow';
  const socialText = document.createElement('p');
  socialText.className = 'social-follow-text';
  socialText.textContent = t('social_cta');
  social.appendChild(socialText);
  const socialBtns = document.createElement('div');
  socialBtns.className = 'social-follow-btns';
  const ig = document.createElement('a');
  ig.className = 'btn-social';
  ig.href = 'https://www.instagram.com/bikelab.studio';
  ig.target = '_blank';
  ig.rel = 'noopener';
  ig.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' + t('social_ig');
  socialBtns.appendChild(ig);
  const fb = document.createElement('a');
  fb.className = 'btn-social';
  fb.href = 'https://www.facebook.com/bikelabstudio.peru';
  fb.target = '_blank';
  fb.rel = 'noopener';
  fb.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' + t('social_fb');
  socialBtns.appendChild(fb);
  social.appendChild(socialBtns);
  card.appendChild(social);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'actions';

  const restart = document.createElement('button');
  restart.className = 'btn-restart';
  restart.textContent = t('restart');
  restart.onclick = () => { history = []; render('q0'); };
  actions.appendChild(restart);

  if (node.type === 'workshop') {
    const shimano = document.createElement('a');
    shimano.className = 'btn-service';
    shimano.href = 'https://si.shimano.com';
    shimano.target = '_blank';
    shimano.rel = 'noopener';
    shimano.textContent = t('shimano_service') + ' →';
    actions.appendChild(shimano);

    const sram = document.createElement('a');
    sram.className = 'btn-service';
    sram.href = 'https://www.sram.com/en/service';
    sram.target = '_blank';
    sram.rel = 'noopener';
    sram.textContent = t('sram_service') + ' →';
    actions.appendChild(sram);
  }

  const wa = document.createElement('a');
  wa.className = 'btn-wa';
  wa.href = 'https://wa.me/51934391545?text=' + encodeURIComponent(LANG==='es' ? 'Hola BikeLab, diagnóstico Di2/AXS: ' : 'Hi BikeLab, Di2/AXS diagnostic: ');
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.textContent = t('wa') + ' →';
  actions.appendChild(wa);

  card.appendChild(actions);
  container.appendChild(card);
}

function goBack() {
  if (history.length > 0) {
    const prev = history.pop();
    render(prev);
  }
}

function restart() {
  history = [];
  render('q0');
}

// Init
updateStaticText();
render('q0');
