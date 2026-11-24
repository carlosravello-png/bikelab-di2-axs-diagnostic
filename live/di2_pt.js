
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
    progress: 'PROGRESSO DO DIAGNÓSTICO',
    back: '← VOLTAR',
    restart: 'COMEÇAR DE NOVO',
    wa: 'CONTATAR BIKELAB',
    shimano_service: 'ASSISTÊNCIA SHIMANO',
    sram_service: 'ASSISTÊNCIA SRAM',
    community_note: 'NOTA: Este procedimento não está no manual oficial — documentado pela comunidade técnica (Reddit r/bikewrench, fóruns BikeRadar). Funciona na maioria dos casos. Se não funcionar, procure um dealer certificado.',
    no_return: 'Este problema não tem solução caseira documentada. Tentar o reparo sem ferramentas profissionais pode agravar o dano.',
    peru: '🇵🇪 Está no Peru? Escreva para nós com o resultado do seu diagnóstico — ',
    peru2: 'BikeLab Studio, Trujillo.',
    social_cta: 'Te poupou tempo? Siga-nos — é a única forma de ajudar.',
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
  document.getElementById('h-label').textContent = s ? '// Ferramenta de Diagnóstico v1.0 — Grátis e Interativa' : '// Diagnostic Tool v1.0 — Free & Interactive';
  document.getElementById('h-title').innerHTML = s ? 'DIAGNÓSTICO<br>CÂMBIO<br><span>ELETRÔNICO_</span>' : 'ELECTRONIC<br>SHIFTING<br><span>DIAGNOSTIC_</span>';
  document.getElementById('h-sub').textContent = s ? 'Uma pergunta por vez. Shimano Di2 e SRAM AXS. Você não precisa do app para começar.' : 'One question at a time. Shimano Di2 and SRAM AXS. No app required to start.';
  document.getElementById('h-badge3').textContent = s ? 'Ferramenta Gratuita' : 'Free Tool';
  document.getElementById('prog-label').textContent = t('progress');
  document.getElementById('f-note').textContent = s ? 'Procedimentos baseados em documentação oficial Shimano e SRAM' : 'Procedures based on official Shimano & SRAM documentation';
  document.getElementById('f-home').textContent = s ? '← BikeLab Studio' : '← BikeLab Studio';
  document.getElementById('faq-en').style.display = s ? 'none' : 'block';
  document.getElementById('faq-es').style.display = s ? 'block' : 'none';
  document.getElementById('sag-card-title').textContent = s ? 'Calculadora de SAG para Suspensão' : 'Suspension SAG Calculator';
  document.getElementById('sag-card-desc').textContent = s ? 'Configure corretamente o SAG do seu garfo e amortecedor — a outra variável chave do desempenho.' : 'Set your fork and shock sag correctly — the other key variable in bike performance.';
  document.getElementById('sag-link').textContent = s ? 'CALCULAR SAG →' : 'CALCULATE SAG →';
}

// ─── TREE ──────────────────────────────────────────────────────────────────
const TREE = {
  // Q0 — System select
  q0: {
    step: { en: 'STEP_01 / SYSTEM', es: 'PASSO_01 / SISTEMA' },
    q: { en: 'What electronic system do you have?', es: 'Qual sistema eletrônico você tem?' },
    desc: { en: 'Select your groupset brand to get accurate procedures.', es: 'Selecione a marca do seu grupo para obter procedimentos exatos.' },
    opts: [
      { key:'A', text:{ en:'Shimano Di2', es:'Shimano Di2' }, sub:{ en:'Dura-Ace, Ultegra, 105, GRX, XTR, XT, SLX — 11v or 12v', es:'Dura-Ace, Ultegra, 105, GRX, XTR, XT, SLX — 11v ou 12v' }, cls:'di2-opt', next:'q1' },
      { key:'B', text:{ en:'SRAM AXS', es:'SRAM AXS' }, sub:{ en:'Red, Force, Rival eTap AXS — Road or MTB Eagle', es:'Red, Force, Rival eTap AXS — Estrada ou MTB Eagle' }, cls:'axs-opt', next:'q1_axs' }
    ],
    progress: 5
  },

  // ─── DI2 BRANCH ────────────────────────────────────────────────────────
  q1: {
    step: { en: 'STEP_02 / DI2 — INITIAL CHECK', es: 'PASSO_02 / DI2 — DIAGNÓSTICO INICIAL' },
    q: { en: 'Any sign of life?', es: 'Há algum sinal de vida?' },
    desc: { en: 'Press any shifter button or the button on the rear derailleur. Any LED, sound, or partial response?', es: 'Pressione qualquer comando ou o botão do câmbio traseiro. Há algum LED, som ou resposta parcial?' },
    opts: [
      { key:'A', text:{ en:'Yes — LED on, some shifts work, or partial response', es:'Sim — LED aceso, alguns câmbios funcionam, ou resposta parcial' }, next:'q2_di2' },
      { key:'B', text:{ en:'No — Completely dead, zero response', es:'Não — Tudo morto, zero resposta' }, next:'q_di2_dead' }
    ],
    progress: 20
  },

  q_di2_dead: {
    step: { en: 'STEP_03 / DI2 — DEAD SYSTEM', es: 'PASSO_03 / DI2 — SISTEMA MORTO' },
    q: { en: 'Where is your battery?', es: 'Onde está sua bateria?' },
    desc: { en: 'Di2 12v: built into the seatpost (BT-DN300). Di2 11v: in the seatpost or frame (BT-DN110). Location affects the reset procedure.', es: 'Di2 12v: integrada no canote do selim (BT-DN300). Di2 11v: no canote ou no quadro (BT-DN110). Isso afeta o procedimento.' },
    opts: [
      { key:'A', text:{ en:'12v — Battery in seatpost (slide-out)', es:'12v — Bateria no canote (deslizável)' }, next:'q_di2_charge' },
      { key:'B', text:{ en:'11v — Battery in seatpost or frame (push-button)', es:'11v — Bateria no canote ou quadro (botão)' }, next:'q_di2_charge' },
      { key:'C', text:{ en:'Not sure', es:'Não tenho certeza' }, next:'q_di2_charge' }
    ],
    progress: 35
  },

  q_di2_charge: {
    step: { en: 'STEP_04 / DI2 — BATTERY', es: 'PASSO_04 / DI2 — BATERIA' },
    q: { en: 'Remove and reconnect the battery. Press the RD button for 5 sec. Any LED?', es: 'Retire e reconecte a bateria. Pressione o botão do câmbio traseiro 5 seg. Há LED?' },
    desc: { en: 'Remove the battery fully, wait 30 seconds, reinstall. Then press the rear derailleur button (or Junction A on 11v) for 5–10 seconds.', es: 'Retire a bateria completamente, espere 30 segundos, reinstale. Depois pressione o botão do câmbio traseiro (ou Junction A em 11v) por 5–10 segundos.' },
    opts: [
      { key:'A', text:{ en:'Yes — LED appeared after reconnecting', es:'Sim — Apareceu LED ao reconectar' }, next:'q2_di2' },
      { key:'B', text:{ en:'No LED at all — tried charging for 1+ hour', es:'Nenhum LED — tentei carregar 1+ hora' }, next:'r_di2_battery_dead' },
      { key:'C', text:{ en:'Red LED solid or rapid red blink', es:'LED vermelho fixo ou piscada vermelha rápida' }, next:'r_di2_charge_now' }
    ],
    progress: 50
  },

  q2_di2: {
    step: { en: 'STEP_03 / DI2 — SYMPTOM', es: 'PASSO_03 / DI2 — SINTOMA' },
    q: { en: 'What exactly is failing?', es: 'O que exatamente está falhando?' },
    desc: { en: 'Select the symptom that best describes your problem.', es: 'Selecione o sintoma que melhor descreve o problema.' },
    opts: [
      { key:'A', text:{ en:'Shifting fails under load or on climbs', es:'Os câmbios falham sob carga ou em subidas' }, sub:{ en:'Works on the flat, fails when pedaling hard', es:'Funciona no plano, falha pedalando forte' }, next:'r_di2_synchro' },
      { key:'B', text:{ en:'Battery drains too fast', es:'A bateria descarrega rápido demais' }, sub:{ en:'100% to dead in days without riding', es:'De 100% a vazia em dias sem pedalar' }, next:'r_di2_drain' },
      { key:'C', text:{ en:'System crashed after impact', es:'Sistema bloqueado após um impacto' }, sub:{ en:'Fell or hit something, now won\'t shift', es:'Queda ou impacto, agora não troca' }, next:'r_di2_crash' },
      { key:'D', text:{ en:'Shifter not responding or needs hard press', es:'Comando não responde ou exige pressão forte' }, sub:{ en:'One or both sides intermittent or sticky', es:'Um ou ambos os lados intermitente ou emperrado' }, next:'r_di2_shifter' },
      { key:'E', text:{ en:'Indexing off — noisy, imprecise, chain rubs', es:'Indexação desajustada — ruidoso, impreciso, roça a corrente' }, next:'r_di2_index' },
      { key:'F', text:{ en:'Firmware update failed / system unresponsive after update', es:'Atualização de firmware falhou / sistema morto após update' }, next:'r_di2_brick' }
    ],
    progress: 40
  },

  // ─── AXS BRANCH ────────────────────────────────────────────────────────
  q1_axs: {
    step: { en: 'STEP_02 / AXS — INITIAL CHECK', es: 'PASSO_02 / AXS — DIAGNÓSTICO INICIAL' },
    q: { en: 'Any sign of life?', es: 'Há algum sinal de vida?' },
    desc: { en: 'Press the AXS button on the rear derailleur for 1 second. Any LED response?', es: 'Pressione o botão AXS do câmbio traseiro por 1 segundo. Há resposta de LED?' },
    opts: [
      { key:'A', text:{ en:'Yes — LED lights up or partial function', es:'Sim — LED acende ou função parcial' }, next:'q2_axs' },
      { key:'B', text:{ en:'No — Completely dead', es:'Não — Tudo morto' }, next:'q_axs_dead' }
    ],
    progress: 20
  },

  q_axs_dead: {
    step: { en: 'STEP_03 / AXS — DEAD SYSTEM', es: 'PASSO_03 / AXS — SISTEMA MORTO' },
    q: { en: 'Remove the derailleur battery and do a hard reset', es: 'Retire a bateria do câmbio e faça um hard reset' },
    desc: { en: 'Official SRAM procedure: Remove battery → wait 15 seconds → press AXS button without battery to drain residual energy → reinstall charged battery.', es: 'Procedimento oficial SRAM: Retire a bateria → espere 15 segundos → pressione o botão AXS sem bateria para drenar a energia residual → reinstale a bateria carregada.' },
    opts: [
      { key:'A', text:{ en:'Done — LED appeared after reinstalling', es:'Feito — Apareceu LED ao reinstalar' }, next:'q2_axs' },
      { key:'B', text:{ en:'Still nothing after hard reset', es:'Continua sem resposta após o hard reset' }, next:'r_axs_battery_check' }
    ],
    progress: 40
  },

  q2_axs: {
    step: { en: 'STEP_03 / AXS — SYMPTOM', es: 'PASSO_03 / AXS — SINTOMA' },
    q: { en: 'What exactly is failing?', es: 'O que exatamente está falhando?' },
    desc: { en: 'Select the symptom that best describes your problem.', es: 'Selecione o sintoma que melhor descreve o problema.' },
    opts: [
      { key:'A', text:{ en:'Pairing lost — shifter not talking to derailleur', es:'Pareamento perdido — comando não se comunica com o câmbio' }, sub:{ en:'LED blinks strangely, won\'t shift despite battery OK', es:'LED pisca estranho, não troca mesmo com bateria OK' }, next:'r_axs_pair' },
      { key:'B', text:{ en:'Shifter dead or unresponsive', es:'Comando morto ou sem resposta' }, sub:{ en:'One or both levers do nothing', es:'Uma ou ambas as manetes não fazem nada' }, next:'r_axs_shifter' },
      { key:'C', text:{ en:'Battery drains too fast or false low reading', es:'Bateria drena rápido ou leitura falsa de baixa' }, next:'r_axs_drain' },
      { key:'D', text:{ en:'Chain drops when shifting to large chainring', es:'Corrente cai ao trocar para a coroa grande' }, sub:{ en:'Common on Force/Rival 1st gen', es:'Comum em Force/Rival 1ª geração' }, next:'r_axs_chain_drop' },
      { key:'E', text:{ en:'Shifting imprecise, skipping, or noisy', es:'Câmbios imprecisos, pula ou ruidoso' }, next:'r_axs_index' },
      { key:'F', text:{ en:'Oil leak from rear derailleur pivot', es:'Vazamento de óleo no pivô do câmbio traseiro' }, sub:{ en:'Oily residue, chain noise, Red/Force only', es:'Resíduo oleoso, ruído na corrente, só Red/Force' }, next:'r_axs_orbit' }
    ],
    progress: 40
  },

  // ─── DI2 RESULTS ──────────────────────────────────────────────────────
  r_di2_charge_now: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Battery low — charge now', es: 'Bateria baixa — carregue agora' },
    desc: { en: 'Red LED = battery depleted. This is normal. Charge with the standard USB charger for 1–3 hours until LED turns green.', es: 'LED vermelho = bateria esgotada. Isso é normal. Carregue com o carregador USB padrão por 1–3 horas até o LED ficar verde.' },
    steps: [
      { en: 'Connect battery charger (SM-BCR2 for 11v, or USB-C seatpost cable for 12v)', es: 'Conecte o carregador de bateria (SM-BCR2 para 11v, ou cabo USB-C do canote para 12v)' },
      { en: 'Charge until LED solid green (1–3 hours depending on depletion)', es: 'Carregue até o LED verde fixo (1–3 horas conforme o nível de esgotamento)' },
      { en: 'Reconnect battery and press shifter 3–5 times quickly to wake up the system', es: 'Reconecte a bateria e pressione o comando 3–5 vezes rápido para acordar o sistema' },
      { en: 'If system doesn\'t wake up after full charge — proceed to next issue', es: 'Se o sistema não acordar após carga completa — siga para o próximo problema' }
    ],
    official: true,
    progress: 100
  },

  r_di2_battery_dead: {
    type: 'workshop',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Battery likely failed or internal cable issue', es: 'Bateria provavelmente com defeito ou problema de cabo interno' },
    desc: { en: 'No response after charge and reset indicates a failed battery or disconnected internal cable — both require professional diagnosis.', es: 'Sem resposta após carga e reset indica bateria com defeito ou cabo interno desconectado — ambos requerem diagnóstico profissional.' },
    steps: [],
    official: true,
    progress: 100
  },

  r_di2_synchro: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Disable Synchro Shift mode', es: 'Desative o modo Synchro Shift' },
    desc: { en: 'Synchro Shift can reject commands under load. Disable it via E-Tube app or directly on the bike.', es: 'O Synchro Shift pode rejeitar comandos sob carga. Desative-o pelo app E-Tube ou direto na bike.' },
    steps: [
      { en: 'Option A (with app): Open E-Tube Cyclist → My Bike → Shift Mode → select Manual or Semi-Synchro', es: 'Opção A (com app): Abra o E-Tube Cyclist → Minha Bike → Modo de câmbio → selecione Manual ou Semi-Synchro' },
      { en: 'Option B (without app): Hold the RD button for 0.5–2 seconds until LED blinks blue — this temporarily enters manual mode', es: 'Opção B (sem app): Segure o botão RD por 0.5–2 segundos até o LED piscar azul — entra temporariamente em modo manual' },
      { en: 'Test: shift through all gears under moderate load on a climb', es: 'Teste: troque por todos os pinhões sob carga moderada numa subida' },
      { en: 'Also check: L/H limit screws — if too tight, loosen 1/4 turn each', es: 'Verifique também: parafusos limite L/H — se muito apertados, afrouxe 1/4 de volta' }
    ],
    official: true,
    progress: 100
  },

  r_di2_drain: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Phantom battery drain — known issue on Di2 11v with EW-WU111', es: 'Drenagem fantasma — problema conhecido no Di2 11v com EW-WU111' },
    desc: { en: 'The Bluetooth module (EW-WU111) on 11v can stay awake, draining the battery in days. Isolate the faulty component.', es: 'O módulo Bluetooth (EW-WU111) no 11v pode ficar ativo, drenando a bateria em dias. Isole o componente defeituoso.' },
    steps: [
      { en: 'Charge battery to 100%', es: 'Carregue a bateria a 100%' },
      { en: 'Disconnect one component from the E-Tube network each day (start with EW-WU111 if present)', es: 'Desconecte um componente da rede E-Tube por dia (comece pelo EW-WU111 se tiver)' },
      { en: 'Check charge each morning — the disconnected component that stops the drain is the cause', es: 'Verifique a carga toda manhã — o componente desconectado que para a drenagem é o causador' },
      { en: 'Also: Disable Bluetooth in E-Tube app when not in use. Loosen L/H limits 1/4 turn (tight limits = motor overworks)', es: 'Também: Desative o Bluetooth no app E-Tube quando não usar. Afrouxe os limites L/H 1/4 de volta (limites apertados = motor trabalha demais)' },
      { en: 'If drain continues after isolation test — faulty cable or component requires professional diagnosis with SM-PCE02', es: 'Se a drenagem continuar após o teste de isolamento — cabo ou componente defeituoso requer diagnóstico com SM-PCE02' }
    ],
    official: false,
    progress: 100
  },

  r_di2_crash: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Crash Recovery mode — system self-locked after impact', es: 'Modo Crash Recovery — sistema bloqueado após impacto' },
    desc: { en: 'Di2 has a safety mechanism that disconnects the motor servo after impact. Follow these steps to re-engage it.', es: 'O Di2 tem um mecanismo de segurança que desconecta o servo motor após um impacto. Siga estes passos para reativá-lo.' },
    steps: [
      { en: 'Place bike in a stand. Keep the cranks turning slowly throughout the process', es: 'Coloque a bike no suporte. Mantenha as pedivelas girando lentamente durante todo o processo' },
      { en: 'Hold the RD button (or Junction A on 11v) until the RED LED blinks (approx. 5 seconds)', es: 'Segure o botão do câmbio traseiro (ou Junction A em 11v) até o LED VERMELHO piscar (aprox. 5 segundos)' },
      { en: 'Release the button. The derailleur will sweep through all gears automatically', es: 'Solte o botão. O câmbio fará uma varredura por todos os pinhões automaticamente' },
      { en: 'When sweep completes, LED turns off. Test shifting normally', es: 'Quando a varredura terminar, o LED se apaga. Teste os câmbios normalmente' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_di2_shifter: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Sticky or unresponsive shifter', es: 'Comando emperrado ou sem resposta' },
    desc: { en: 'Buttons can get sticky from sweat, rain, or dust. Before assuming internal failure, try cleaning.', es: 'Os botões podem emperrar por suor, chuva ou poeira. Antes de assumir falha interna, tente limpar.' },
    steps: [
      { en: 'Clean buttons with dry cloth. Use compressed air if available. Do NOT use liquid cleaners', es: 'Limpe os botões com pano seco. Use ar comprimido se tiver. NÃO use limpadores líquidos' },
      { en: 'Press the sticky button 20–30 times firmly to "unstick" it', es: 'Pressione o botão emperrado 20–30 vezes com firmeza para "soltá-lo"' },
      { en: 'Check E-Tube connector: press firmly with TL-EW02 tool (or gentle thumb pressure) — vibration can partially disconnect it', es: 'Verifique o conector E-Tube: pressione firmemente com a ferramenta TL-EW02 (ou pressão suave do polegar) — a vibração pode desconectá-lo parcialmente' },
      { en: 'If problem persists after cleaning — internal PCB failure. Requires replacement', es: 'Se o problema persistir após limpar — falha interna de PCB. Requer substituição' }
    ],
    official: true,
    progress: 100
  },

  r_di2_index: {
    type: 'solved',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Indexing adjustment — on-bike without app', es: 'Ajuste de indexação — na bike sem app' },
    desc: { en: 'Official Di2 micro-adjustment procedure. Shift to the 5th largest sprocket first.', es: 'Procedimento oficial de micro-ajuste Di2. Primeiro troque para o 5º pinhão maior.' },
    steps: [
      { en: 'Shift chain to the 5th largest sprocket', es: 'Troque a corrente para o 5º pinhão maior' },
      { en: 'Press and hold RD button until YELLOW LED lights solid — you are now in adjustment mode', es: 'Segure o botão do câmbio traseiro até o LED AMARELO acender fixo — você está em modo ajuste' },
      { en: 'Use right shifter: one button moves derailleur 0.2mm inward, other moves 0.2mm outward', es: 'Use o comando direito: um botão move o câmbio 0.2mm para dentro, o outro 0.2mm para fora' },
      { en: 'Adjust inward until you hear chain rub on 4th sprocket, then back out 4 clicks to center', es: 'Ajuste para dentro até ouvir roçar no 4º pinhão, depois 4 cliques para fora para centralizar' },
      { en: 'Press RD button again until YELLOW LED turns off — adjustment saved', es: 'Pressione o botão do câmbio traseiro novamente até o LED AMARELO apagar — ajuste salvo' },
      { en: 'Test all gears. Repeat if needed', es: 'Teste todos os pinhões. Repita se necessário' }
    ],
    official: true,
    progress: 100
  },

  r_di2_brick: {
    type: 'workshop',
    step: { en: 'RESULT / DI2', es: 'RESULTADO / DI2' },
    title: { en: 'Firmware brick — no home fix possible', es: 'Brick de firmware — não há solução caseira' },
    desc: { en: 'A failed Bluetooth firmware update corrupts the EPROM memory. Recovery requires a wired connection to a PC using the SM-PCE02 tool — Shimano dealer equipment only.', es: 'Uma atualização de firmware falha por Bluetooth corrompe a memória EPROM. A recuperação requer conexão por cabo a um PC com a ferramenta SM-PCE02 — equipamento exclusivo de dealers Shimano.' },
    steps: [],
    official: true,
    prevention: { en: 'Prevention: NEVER update Di2 firmware via Bluetooth. Always use a wired connection with SM-PCE02 when available.', es: 'Prevenção: NUNCA atualize firmware Di2 por Bluetooth. Use sempre conexão por cabo com SM-PCE02 quando disponível.' },
    progress: 100
  },

  // ─── AXS RESULTS ──────────────────────────────────────────────────────
  r_axs_battery_check: {
    type: 'workshop',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Battery or pogo pin issue — check before going to service', es: 'Problema de bateria ou pogo pin — verifique antes de ir à assistência' },
    desc: { en: 'After a full hard reset with no response, the issue is either a dead battery, a broken pogo pin, or an internal component failure.', es: 'Após um hard reset completo sem resposta, o problema é bateria morta, pogo pin quebrado ou falha interna de componente.' },
    steps: [
      { en: 'Try a different known-good AXS battery if available', es: 'Teste com outra bateria AXS que funcione, se tiver' },
      { en: 'Inspect the pogo pin (small spring-loaded pin on the derailleur): if collapsed or broken, it cannot be repaired at home', es: 'Inspecione o pogo pin (pequeno pino com mola no câmbio): se estiver afundado ou quebrado, não dá para reparar em casa' },
      { en: 'If battery swap doesn\'t help — warranty claim or professional service required', es: 'Se trocar a bateria não ajudar — acionamento de garantia ou assistência profissional necessária' }
    ],
    official: true,
    progress: 100
  },

  r_axs_pair: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Re-pair AXS components — official procedure without app', es: 'Re-parear componentes AXS — procedimento oficial sem app' },
    desc: { en: 'The rear derailleur is always the master. Start pairing from there. Turn off WiFi and other Bluetooth devices nearby to reduce interference.', es: 'O câmbio traseiro é sempre o mestre. Comece o pareamento por ele. Desligue o WiFi e outros dispositivos Bluetooth próximos para reduzir interferências.' },
    steps: [
      { en: 'Start pairing session: Hold AXS button on rear derailleur until GREEN LED blinks slowly. Release. (Session expires in 30 sec)', es: 'Inicie a sessão de pareamento: Segure o botão AXS no câmbio traseiro até o LED VERDE piscar devagar. Solte. (A sessão expira em 30 seg)' },
      { en: 'For 2x systems: Hold AXS button on front derailleur until GREEN LED blinks fast. Release', es: 'Para sistemas 2x: Segure o botão AXS no câmbio dianteiro até o LED VERDE piscar rápido. Solte' },
      { en: 'Pair right shifter: Hold AXS button inside right lever until GREEN LED blinks fast. Release', es: 'Pareie o comando direito: Segure o botão AXS dentro da manete direita até o LED VERDE piscar rápido. Solte' },
      { en: 'Pair left shifter: Repeat step 3 with left lever', es: 'Pareie o comando esquerdo: Repita o passo 3 com a manete esquerda' },
      { en: 'Close session: Press and release AXS button on rear derailleur once. LED stops blinking', es: 'Encerre a sessão: Pressione e solte o botão AXS do câmbio traseiro uma vez. O LED para de piscar' },
      { en: 'Test: press a shifter — RD LED should blink when receiving command', es: 'Teste: pressione um comando — o LED do câmbio traseiro deve piscar ao receber o comando' }
    ],
    official: true,
    progress: 100
  },

  r_axs_shifter: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Dead AXS shifter — CR2032 battery', es: 'Comando AXS morto — bateria CR2032' },
    desc: { en: 'AXS shifters run on a CR2032 coin cell battery. This is the most common cause of a dead lever.', es: 'Os comandos AXS funcionam com uma pilha botão CR2032. É a causa mais frequente de uma manete morta.' },
    steps: [
      { en: 'Open the shifter battery cover with a coin (turn counterclockwise)', es: 'Abra a tampa da pilha do comando com uma moeda (gire no sentido anti-horário)' },
      { en: 'Replace CR2032 (available at pharmacies and electronics stores, ~$1–2)', es: 'Substitua a CR2032 (disponível em farmácias e lojas de eletrônicos, ~R$5)' },
      { en: 'If new battery also fails: use a small precision flathead screwdriver to VERY gently lift the contact tabs ~1mm upward to restore spring tension', es: 'Se a pilha nova também falhar: use uma chave de fenda de precisão para levantar MUITO suavemente as abas de contato ~1mm e restaurar a tensão' },
      { en: 'Re-pair the shifter following the pairing procedure', es: 'Pareie novamente o comando seguindo o procedimento de pareamento' },
      { en: 'WARNING: If you over-bend and break the contact tabs — the shifter needs replacement', es: 'AVISO: Se dobrar demais e quebrar as abas de contato — o comando precisa de substituição' }
    ],
    official: true,
    progress: 100
  },

  r_axs_drain: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'AXS battery drain — transport accelerometer issue', es: 'Drenagem AXS — problema do acelerômetro no transporte' },
    desc: { en: 'AXS derailleurs have internal accelerometers. Car vibration triggers them and "wakes" the motors continuously, draining batteries on transport.', es: 'Os câmbios AXS têm acelerômetros internos. As vibrações do carro os ativam e "acordam" os motores continuamente, drenando baterias no transporte.' },
    steps: [
      { en: 'Transport fix: ALWAYS remove AXS batteries before loading the bike on a car rack or vehicle. Replace the red protective caps on terminals', es: 'Solução para transporte: SEMPRE retire as baterias AXS antes de colocar a bike no rack ou veículo. Coloque as tampas vermelhas protetoras nos terminais' },
      { en: 'False low reading fix: Charge for 1 hour → remove battery 30 sec → reinstall → update firmware in AXS app', es: 'Solução para leitura falsa: Carregue 1 hora → retire a bateria 30 seg → reinstale → atualize o firmware no app AXS' },
      { en: 'If battery won\'t hold charge even in static storage — battery is degraded, needs replacement', es: 'Se a bateria não retém carga mesmo guardada parada — bateria degradada, precisa de substituição' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_axs_chain_drop: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Chain drop to large chainring — Force/Rival 1st gen known issue', es: 'Queda de corrente na coroa grande — problema conhecido Force/Rival 1ª geração' },
    desc: { en: 'This is a documented design tolerance issue in early Force and Rival eTap AXS. The red adjustment wedge and High limit are the fix.', es: 'É um problema documentado de tolerâncias de projeto no Force e Rival eTap AXS das primeiras gerações. A cunha vermelha e o limite High são a solução.' },
    steps: [
      { en: 'Install the SRAM red adjustment wedge (included in box or available from SRAM dealer) — this is mandatory for 1st gen Force/Rival', es: 'Instale a cunha vermelha de ajuste SRAM (incluída na caixa ou disponível no dealer SRAM) — obrigatória para Force/Rival 1ª geração' },
      { en: 'Adjust High-Limit (H) screw: maximum 0.5mm chain clearance from the chainring', es: 'Ajuste o parafuso High-Limit (H): no máximo 0.5mm de folga entre corrente e coroa' },
      { en: 'Check chainring inner bolt rotation: align the position mark with the crank spider — incorrect rotation from factory causes this', es: 'Verifique a rotação do parafuso interno da coroa: alinhe a marca de posição com a aranha da pedivela — a rotação incorreta de fábrica causa isso' },
      { en: 'If using original SRAM chain: replace with KMC chain — many users report this resolves the issue completely', es: 'Se usa corrente original SRAM: substitua por corrente KMC — muitos usuários relatam que isso resolve completamente' },
      { en: 'If chain drop continues after all adjustments — derailleur cage may be twisted from a previous chain jam. Needs inspection', es: 'Se a corrente continuar caindo após todos os ajustes — a gaiola do câmbio pode estar torta por um travamento anterior. Precisa de inspeção' }
    ],
    official: false,
    community: true,
    progress: 100
  },

  r_axs_index: {
    type: 'solved',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'AXS micro-adjustment — on-bike without app', es: 'Micro-ajuste AXS — na bike sem app' },
    desc: { en: 'First clean the chain and cassette with a dry cloth. Dirty drivetrain mimics indexing problems.', es: 'Primeiro limpe a corrente e o cassete com um pano seco. A transmissão suja imita problemas de indexação.' },
    steps: [
      { en: 'Clean chain and cassette with dry cloth (remove gross dirt first)', es: 'Limpe a corrente e o cassete com pano seco (remova a sujeira grossa primeiro)' },
      { en: 'On-bike micro-adjust: Press AXS button on RD until LED blinks → use shifter buttons to move derailleur +/- in small increments', es: 'Micro-ajuste na bike: Pressione o botão AXS no câmbio traseiro até o LED piscar → use os botões do comando para mover o câmbio +/- em pequenos incrementos' },
      { en: 'Adjust B-screw for 5–7mm gap between guide pulley and largest sprocket (use a finger as gauge)', es: 'Ajuste o parafuso B para 5–7mm de folga entre a polia-guia e o pinhão maior (use um dedo como medida)' },
      { en: 'If skipping persists after adjustment: check derailleur hanger — if bent, indexing cannot be corrected without replacing it', es: 'Se o pulo persistir após o ajuste: verifique o gancho do câmbio — se estiver torto, a indexação não pode ser corrigida sem substituí-lo' }
    ],
    official: true,
    progress: 100
  },

  r_axs_orbit: {
    type: 'workshop',
    step: { en: 'RESULT / AXS', es: 'RESULTADO / AXS' },
    title: { en: 'Orbit fluid leak — warranty claim required', es: 'Vazamento do sistema Orbit — acionamento de garantia necessário' },
    desc: { en: 'The Orbit fluid damper in SRAM Red and Force AXS is a sealed system — it cannot be serviced or refilled at home. A leak means the internal seals have failed.', es: 'O amortecedor de fluido Orbit no SRAM Red e Force AXS é um sistema selado — não dá para revisar nem reabastecer em casa. Um vazamento significa que os retentores internos falharam.' },
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
    solved: { cls:'green', label: LANG==='es' ? '✓ SOLUÇÃO ENCONTRADA' : '✓ SOLUTION FOUND' },
    limit:  { cls:'orange', label: LANG==='es' ? '⚠ LIMITE CASEIRO' : '⚠ HOME FIX LIMIT' },
    workshop: { cls:'red', label: LANG==='es' ? '✕ REQUER OFICINA' : '✕ PROFESSIONAL SERVICE REQUIRED' },
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
    prev.innerHTML = '<strong>' + (LANG==='es' ? 'PREVENÇÃO: ' : 'PREVENTION: ') + '</strong>' + (node.prevention[LANG] || node.prevention.en);
    card.appendChild(prev);
  }

  if (node.warranty) {
    const w = document.createElement('div');
    w.className = 'result-note';
    w.innerHTML = '<strong>' + (LANG==='es' ? 'GARANTIA: ' : 'WARRANTY: ') + '</strong>' + (LANG==='es' ? 'Procure seu dealer SRAM autorizado. Forneça o número de série do componente e evidência fotográfica do vazamento.' : 'Contact your authorized SRAM dealer. Provide the component serial number and photographic evidence of the leak.');
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
