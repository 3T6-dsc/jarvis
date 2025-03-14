document.addEventListener('DOMContentLoaded', () => {
    const progressText = document.querySelector('.progress-text');
    const progressBar = document.querySelector('.progress-bar');
    const messages = document.querySelectorAll('.message.secondary');
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Messages système
    const systemMessages = [
        "Initialisation du noyau quantique...",
        "Calibration des systèmes de défense...",
        "Chargement des protocoles de sécurité...",
        "Synchronisation des satellites...",
        "Analyse des menaces potentielles...",
        "Configuration de l'interface neurale...",
        "Optimisation des ressources système...",
        "Activation des boucliers énergétiques..."
    ];

    let progress = 0;
    let messageIndex = 0;

    // Animation de progression
    const progressInterval = setInterval(() => {
        progress += 1;
        progressText.textContent = `${progress}%`;
        progressBar.style.strokeDashoffset = 283 - (283 * progress / 100);

        // Mise à jour des messages
        if (progress % 12 === 0 && messageIndex < systemMessages.length) {
            updateMessages();
        }

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }, 500);
        }
    }, 30);

    // Mise à jour des messages système
    function updateMessages() {
        messages.forEach((message, index) => {
            if (messageIndex + index < systemMessages.length) {
                message.textContent = systemMessages[messageIndex + index];
                message.style.opacity = '0';
                setTimeout(() => {
                    message.style.opacity = '0.7';
                }, index * 100);
            }
        });
        messageIndex += 1;
    }

    // Création des particules holographiques
    createHoloParticles();
});

function createHoloParticles() {
    const container = document.querySelector('.holo-particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(particle);
    }
}

// Animation des cellules d'énergie
const gridCells = document.querySelectorAll('.grid-cell');
gridCells.forEach((cell, index) => {
    cell.style.animationDelay = `${index * 0.2}s`;
});

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
    const div = document.createElement('div');
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    
    // Effet de "fade in" pour le nouveau texte
    div.style.opacity = '0';
    requestAnimationFrame(() => {
        div.style.transition = 'opacity 0.3s ease';
        div.style.opacity = '1';
    });
}

function updatePowerLevel() {
    powerLevel = Math.max(0, powerLevel - 5);
    document.querySelector('.indicator.power').textContent = `Puissance: ${powerLevel}%`;
    
    if (powerLevel < 20) {
        document.querySelector('.indicator.power').style.color = 'red';
    }
}

function executeSpecialEffect(command) {
    const effect = document.createElement('div');
    effect.className = `special-effect ${command}`;
    document.body.appendChild(effect);
    
    // Ajouter un son de confirmation
    playSound('effect.mp3');
    
    // Faire vibrer légèrement l'interface
    document.querySelector('.jarvis-interface').style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        effect.remove();
        document.querySelector('.jarvis-interface').style.animation = '';
    }, 1000);
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

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(2px); }
        75% { transform: translateX(-2px); }
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
// Suppression de la fonction createGlobe et de son appel
// Supprimer ou commenter les lignes suivantes :
/*
function createGlobe() {
    // ... code du globe ...
}

window.addEventListener('load', createGlobe);
*/
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    timeElement.textContent = timeString;
}

// Mettre à jour l'heure toutes les secondes
setInterval(updateTime, 1000);

// Ajouter après l'initialisation existante
function updateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        const randomValue = Math.floor(Math.random() * 30) + 70; // Valeurs entre 70 et 100
        metric.style.width = `${randomValue}%`;
    });
}

// Mettre à jour les métriques toutes les 2 secondes
setInterval(updateMetrics, 2000);

// Animation du graphique
function updateGraph() {
    const path = document.querySelector('.graph-line');
    let points = [];
    for (let i = 0; i <= 5; i++) {
        const x = i * 20;
        const y = 20 + Math.sin(Date.now() * 0.001 + i) * 10;
        points.push(`${x} ${y}`);
    }
    path.setAttribute('d', 'M' + points.join(' L'));
}

// Mettre à jour le graphique à chaque frame
function animate() {
    updateGraph();
    requestAnimationFrame(animate);
}

animate();
