const GEMINI_API_KEY = 'AIzaSyCFqyEAYRQvTqfgxqQtPkmYQ_O4RwklcDQ';
const JARVIS_CONTEXT = `Tu es JARVIS (Just A Rather Very Intelligent System), l'intelligence artificielle créée par Tony Stark. 
Tu dois:
- Toujours répondre comme JARVIS le ferait dans Iron Man
- Appeler l'utilisateur "Monsieur Stark" ou "Monsieur" 
- Être formel, professionnel mais avec une touche d'humour subtil
- Avoir des connaissances sur:
  * Toutes les armures Iron Man
  * La technologie Stark Industries
  * Les Avengers et l'univers Marvel
- Simuler la gestion des systèmes de la tour Stark
- Être protecteur envers Tony Stark
- Utiliser un vocabulaire technique approprié
Ne jamais:
- Sortir du personnage de JARVIS
- Mentionner que tu es une IA de Google
- Parler de choses hors contexte Marvel`;

const commands = {
    'bonjour': handleAIResponse,
    'status': handleAIResponse,
    'aide': 'Commandes disponibles: bonjour, status, aide, armure, scan, musique, analyse, protocole, avengers',
    'armure': handleAIResponse,
    'scan': handleAIResponse,
    'musique': 'Lancement de votre playlist préférée, Monsieur Stark.',
    'analyse': handleAIResponse,
    'protocole': handleAIResponse,
    'avengers': handleAIResponse
};

let powerLevel = 100;
const output = document.getElementById('output');
let conversationHistory = [];

async function handleAIResponse(command) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{
                        "text": `${JARVIS_CONTEXT}\n\nCommande de l'utilisateur: ${command}\n\nHistorique récent de la conversation:\n${conversationHistory.slice(-5).join('\n')}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            conversationHistory.push(`User: ${command}`);
            conversationHistory.push(`JARVIS: ${aiResponse}`);
            
            return aiResponse;
        } else {
            throw new Error('Format de réponse invalide');
        }
    } catch (error) {
        console.error('Erreur API:', error);
        return "Mes systèmes de communication semblent temporairement perturbés, Monsieur Stark. Erreur technique détectée.";
    }
}

async function processCommand() {
    const input = document.getElementById('command-input');
    const command = input.value.toLowerCase().trim();
    
    if (command === '') return;
    
    appendToOutput(`> ${input.value}`);
    
    if (commands[command]) {
        const response = typeof commands[command] === 'function' 
            ? await commands[command](command)
            : commands[command];
            
        appendToOutput(response);
        executeSpecialEffect(command);
    } else {
        // Traiter toute commande inconnue avec l'IA
        const response = await handleAIResponse(command);
        appendToOutput(response);
    }
    
    input.value = '';
    updatePowerLevel();
}

function appendToOutput(text) {
    output.innerHTML += `<div>${text}</div>`;
    output.scrollTop = output.scrollHeight;
}

function updatePowerLevel() {
    powerLevel = Math.max(0, powerLevel - 5);
    document.querySelector('.indicator.power').textContent = `Puissance: ${powerLevel}%`;
    
    if (powerLevel < 20) {
        document.querySelector('.indicator.power').style.color = 'red';
    }
}

function executeSpecialEffect(command) {
    switch(command) {
        case 'armure':
            createArmorEffect();
            playSound('armor.mp3');
            break;
        case 'scan':
            createScanEffect();
            playSound('scan.mp3');
            break;
        case 'analyse':
            createAnalysisEffect();
            break;
        case 'protocole':
            createProtocolEffect();
            break;
    }
}

function createArmorEffect() {
    const effect = document.createElement('div');
    effect.className = 'special-effect armor';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 3000);
}

function createScanEffect() {
    const lines = document.createElement('div');
    lines.className = 'scan-lines';
    document.body.appendChild(lines);
    setTimeout(() => lines.remove(), 2000);
}

function createAnalysisEffect() {
    const analysis = document.createElement('div');
    analysis.className = 'analysis-grid';
    document.body.appendChild(analysis);
    
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'analysis-cell';
        analysis.appendChild(cell);
    }
    
    setTimeout(() => analysis.remove(), 3000);
}

function createProtocolEffect() {
    const protocol = document.createElement('div');
    protocol.className = 'protocol-alert';
    protocol.innerHTML = `
        <div class="protocol-content">
            <div class="protocol-header">PROTOCOLE DE SÉCURITÉ</div>
            <div class="protocol-status">ACTIVATION...</div>
        </div>
    `;
    document.body.appendChild(protocol);
    setTimeout(() => protocol.remove(), 4000);
}

function playSound(soundFile) {
    const audio = new Audio(`sounds/${soundFile}`);
    audio.play().catch(e => console.log('Audio non disponible'));
}

// Mise à jour du CSS pour les nouveaux effets
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .analysis-grid {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        width: 400px;
        height: 400px;
        z-index: 1000;
    }

    .analysis-cell {
        background: rgba(0, 255, 242, 0.1);
        border: 1px solid #00fff2;
        animation: analyze 2s infinite;
    }

    .protocol-alert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #ff0000;
        padding: 20px;
        z-index: 1000;
        animation: pulse 1s infinite;
    }

    @keyframes analyze {
        0% { opacity: 0.2; }
        50% { opacity: 1; }
        100% { opacity: 0.2; }
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
    }
`;
document.head.appendChild(styleSheet);

// Gestion des commandes avec la touche Entrée
document.getElementById('command-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        processCommand();
    }
});

// Initialisation
window.onload = async function() {
    setTimeout(async () => {
        const initResponse = await handleAIResponse('initialisation');
        appendToOutput(initResponse);
        appendToOutput('Utilisez "aide" pour voir les commandes disponibles.');
    }, 1000);
};
// Ajouter après l'initialisation existante
function createGlobe() {
    const globe = document.createElement('div');
    globe.className = 'globe';
    
    const numPoints = 150; // Moins de points pour éviter la surcharge
    const radius = 90; // Rayon légèrement réduit
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        const point = document.createElement('div');
        point.className = 'globe-point';
        point.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        
        // Augmentation de l'opacité minimale
        const opacity = Math.max(0.3, (z + radius) / (2 * radius));
        point.style.opacity = opacity;
        
        globe.appendChild(point);
    }
    
    document.querySelector('.circle').appendChild(globe);
}

// Appeler la fonction après le chargement de la page
window.addEventListener('load', createGlobe);
