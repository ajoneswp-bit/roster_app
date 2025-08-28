// Loads and parses useful_roster.csv, then renders the roster by week

// Utility to fetch and parse CSV
function fetchCSV(url) {
    return fetch(url)
        .then(response => response.text())
        .then(text => parseCSV(text));
}

// Simple CSV parser (assumes no quoted commas)
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        // Properly parse CSV line with quoted fields
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i]?.replace(/^"|"$/g, '').trim());
        return obj;
    });
}

// Group players by section and position
function groupRoster(players) {
    const sections = { Offense: {}, Defense: {}, 'Special Teams': {} };
    players.forEach(player => {
        const sec = player.team_side;
        const pos = player.position;
        if (!sections[sec]) return; // skip unknown sides
        if (!sections[sec][pos]) sections[sec][pos] = [];
        sections[sec][pos].push(player);
    });
    return sections;
}

// Render week selector
function renderWeekSelector(weeks) {
    const select = document.getElementById('week-select');
    select.innerHTML = '';
    weeks.forEach(week => {
        const opt = document.createElement('option');
        opt.value = week;
        opt.textContent = `Week ${week}`;
        select.appendChild(opt);
    });
}

// Render roster
function renderRoster(sections) {
    const container = document.getElementById('roster-container');
    container.innerHTML = '';
    Object.entries(sections).forEach(([section, positions]) => {
        const secDiv = document.createElement('div');
        secDiv.className = 'section';
        const secTitle = document.createElement('div');
        secTitle.className = 'section-title';
        secTitle.textContent = section;
        secDiv.appendChild(secTitle);
        Object.entries(positions).forEach(([pos, players]) => {
            const posDiv = document.createElement('div');
            posDiv.className = 'position';
            const posTitle = document.createElement('div');
            posTitle.className = 'position-title';
            posTitle.textContent = pos;
            posDiv.appendChild(posTitle);
            const playersDiv = document.createElement('div');
            playersDiv.className = 'players';
            players.forEach(player => {
                const card = document.createElement('div');
                card.className = 'player-card';
                const img = document.createElement('img');
                img.className = 'player-headshot';
                img.src = player.headshot_url || 'https://static.www.nfl.com/image/private/t_headshot/f_auto/league/api-player-headshot-placeholder.png';
                img.alt = player.player_name;
                card.appendChild(img);
                const name = document.createElement('div');
                name.className = 'player-name';
                name.textContent = player.player_name;
                card.appendChild(name);
                const info = document.createElement('div');
                info.className = 'player-info';
                info.textContent = `${player.position} | #${player.jersey_number}`;
                card.appendChild(info);
                playersDiv.appendChild(card);
            });
            posDiv.appendChild(playersDiv);
            secDiv.appendChild(posDiv);
        });
        container.appendChild(secDiv);
    });
}

// Main logic
fetchCSV('useful_roster.csv').then(data => {
    // Find all weeks
    const weeks = [...new Set(data.map(p => p.week))].sort((a,b) => a-b);
    renderWeekSelector(weeks);
    function updateRoster() {
        const week = document.getElementById('week-select').value;
        const weekPlayers = data.filter(p => p.week === week);
        const grouped = groupRoster(weekPlayers);
        renderRoster(grouped);
    }
    document.getElementById('week-select').addEventListener('change', updateRoster);
    document.getElementById('week-select').value = weeks[0];
    updateRoster();
});
