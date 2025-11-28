let players = [];

function loadData() {
    const saved = localStorage.getItem('gameTrackerData');
    if (saved) {
        players = JSON.parse(saved);
        renderPlayers();
        renderNotes();
    }
}

function saveData() {
    localStorage.setItem('gameTrackerData', JSON.stringify(players));
    showSaveIndicator();
}

function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 1500);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'notes') renderNotes();
}

function addPlayer() {
    const playerNumber = players.length + 1;
    const newPlayer = {
        id: Date.now(),
        name: `Player ${playerNumber}`,
        money: 0,
        money2: 0,
        hp: 0,
        mana: 0,
        note: ''
    };
    players.push(newPlayer);
    saveData();
    renderPlayers();
}

function deletePlayer(id) {
    players = players.filter(p => p.id !== id);
    saveData();
    renderPlayers();
    renderNotes();
}

function updateCounter(id, counter, change) {
    const player = players.find(p => p.id === id);
    if (player) {
        player[counter] = Math.max(0, player[counter] + change);
        saveData();
        renderPlayers();
    }
}

function updateNote(id, value) {
    const player = players.find(p => p.id === id);
    if (player) {
        player.note = value;
        saveData();
    }
}

function updatePlayerName(id, value) {
    const player = players.find(p => p.id === id);
    if (player) {
        player.name = value.trim() || `Игрок ${players.indexOf(player) + 1}`;
        saveData();
        renderNotes();
    }
}

function renderPlayers() {
    const container = document.getElementById('players-container');
    container.innerHTML = players.map(player => `
        <div class="player-card">
            <div class="player-header">
                <input 
                    type="text" 
                    class="player-name" 
                    value="${player.name}" 
                    oninput="updatePlayerName(${player.id}, this.value)"
                    placeholder="Player name"
                />
                <button class="delete-btn" onclick="deletePlayer(${player.id})">Delete</button>
            </div>
            <div class="counters">
                <div class="counter">
                    <div class="counter-label yellow">Money</div>
                    <div class="counter-controls">
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'money', -1)">−</button>
                        <span class="counter-value">${player.money}</span>
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'money', 1)">+</button>
                    </div>
                    <div class="quick-buttons">
                        <button class="quick-btn negative" onclick="updateCounter(${player.id}, 'money', -100)">-100</button>
                        <button class="quick-btn negative" onclick="updateCounter(${player.id}, 'money', -5)">-5</button>
                        <button class="quick-btn" onclick="updateCounter(${player.id}, 'money', 5)">+5</button>
                        <button class="quick-btn" onclick="updateCounter(${player.id}, 'money', 100)">+100</button>
                    </div>
                </div>
                <div class="counter">
                    <div class="counter-label green">Crystals</div>
                    <div class="counter-controls">
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'money2', -1)">−</button>
                        <span class="counter-value">${player.money2}</span>
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'money2', 1)">+</button>
                    </div>
                    <div class="quick-buttons">
                        <button class="quick-btn negative" onclick="updateCounter(${player.id}, 'money2', -100)">-100</button>
                        <button class="quick-btn negative" onclick="updateCounter(${player.id}, 'money2', -5)">-5</button>
                        <button class="quick-btn" onclick="updateCounter(${player.id}, 'money2', 5)">+5</button>
                        <button class="quick-btn" onclick="updateCounter(${player.id}, 'money2', 100)">+100</button>
                    </div>
                </div>
                <div class="counter">
                    <div class="counter-label red">HP</div>
                    <div class="counter-controls">
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'hp', -1)">−</button>
                        <span class="counter-value">${player.hp}</span>
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'hp', 1)">+</button>
                    </div>
                </div>
                <div class="counter">
                    <div class="counter-label blue">Mana</div>
                    <div class="counter-controls">
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'mana', -1)">−</button>
                        <span class="counter-value">${player.mana}</span>
                        <button class="counter-btn" onclick="updateCounter(${player.id}, 'mana', 1)">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNotes() {
    const container = document.getElementById('notes-container');
    if (players.length === 0) {
        container.innerHTML = '<p style="color: #ffffff; text-align: center; margin-top: 50px; font-size: 20px;">No players. Add players in the "Counters" tab</p>';
        return;
    }
    container.innerHTML = players.map(player => `
        <div class="player-card">
            <div class="note-header">
                <span style="font-size: 24px; font-weight: bold;">${player.name}</span>
            </div>
            <div class="notes-section">
                <textarea 
                    class="note-input" 
                    placeholder="Enter the notes for this player..."
                    oninput="updateNote(${player.id}, this.value)"
                >${player.note}</textarea>
            </div>
        </div>
    `).join('');
}

// Инициализация — САМОЕ ГЛАВНОЕ ИСПРАВЛЕНИЕ
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Принудительно отрисовываем активную вкладку при загрузке
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'counters') {
        renderPlayers();
    } else if (activeTab && activeTab.id === 'notes') {
        renderNotes();
    }

    // Если игроков нет — добавляем одного
    if (players.length === 0) {
        addPlayer();
        renderPlayers(); // важно!
    }
});