import { User, Sale } from '../types';

/**
 * Generates and downloads a CSV file optimized for Microsoft Excel.
 */
export function exportToExcel(user: User, sales: Sale[]) {
  const userSales = sales.filter(s => s.userId === user.id);
  
  let csvContent = '\uFEFF'; // UTF-8 BOM to prevent encoding issues in Excel
  
  // Section 1: Member Info
  csvContent += 'STATISTICHE MEMBRO - GYM MANAGER\n';
  csvContent += `Nome;${user.name}\n`;
  csvContent += `Email;${user.email}\n`;
  csvContent += `Livello;${user.level} (XP: ${user.xp}/${user.nextLevelXp})\n`;
  csvContent += `Stato Abbonamento;${user.membershipStatus} (Scadenza: ${user.membershipExpiry})\n`;
  csvContent += `Totale Ingressi;${user.totalCheckIns}\n`;
  csvContent += `Spesa Totale;€ ${user.totalSpent}\n\n`;
  
  // Section 2: Skill Levels
  csvContent += 'LIVELLI ABILITÀ (GAMIFICATION)\n';
  csvContent += 'Abilità;Livello;Esperienza Attuale\n';
  user.skills.forEach(s => {
    csvContent += `${s.name};${s.level};${s.exp}/${s.maxExp}\n`;
  });
  csvContent += '\n';

  // Section 3: Personal Records
  csvContent += 'RECORD PERSONALI (PR)\n';
  csvContent += 'Esercizio;Record\n';
  csvContent += 'Back Squat;140 kg\n';
  csvContent += 'Deadlift;180 kg\n';
  csvContent += 'Clean & Jerk;95 kg\n';
  csvContent += 'Snatch;75 kg\n';
  csvContent += 'Murph Time;41m 20s\n\n';

  // Section 4: Sales & Payments History
  csvContent += 'CRONOLOGIA PAGAMENTI\n';
  csvContent += 'ID Transazione;Articolo;Importo;Data;Stato\n';
  userSales.forEach(s => {
    csvContent += `${s.id};${s.item};€ ${s.amount};${s.date};${s.status}\n`;
  });
  csvContent += '\n';

  // Section 5: Check-in Dates
  csvContent += 'REGISTRO ACCESSI (INGRESSI)\n';
  csvContent += 'Numero;Data Accesso\n';
  user.checkInDates.forEach((d, idx) => {
    csvContent += `${user.checkInDates.length - idx};${d}\n`;
  });

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Dati_Gym_${user.name.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers a custom browser print preview with a highly styled PDF dossier template.
 */
export function printUserPDF(user: User, sales: Sale[]) {
  const userSales = sales.filter(s => s.userId === user.id);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Per favore abilita i pop-up nel browser per visualizzare il PDF esportabile.");
    return;
  }

  const skillsHtml = user.skills.map(s => `
    <div class="skill-row">
      <span class="skill-name">${s.name}</span>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${(s.level / 10) * 100}%"></div>
      </div>
      <span class="skill-val">Livello ${s.level}</span>
    </div>
  `).join('');

  const salesHtml = userSales.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.item}</td>
      <td><strong>€ ${s.amount.toFixed(2)}</strong></td>
      <td><span class="badge ${s.status === 'Completato' ? 'active' : 'pending'}">${s.status}</span></td>
    </tr>
  `).join('');

  const checkinsHtml = user.checkInDates.map((d, idx) => `
    <div class="checkin-badge">${d}</div>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Report Atletico - ${user.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 40px;
            background: #ffffff;
            line-height: 1.5;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
          }
          .title-area h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: -0.025em;
          }
          .title-area p {
            margin: 4px 0 0 0;
            color: #6b7280;
            font-size: 14px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
          }
          .card h2 {
            margin-top: 0;
            font-size: 16px;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .skill-row {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          .skill-name {
            width: 110px;
            font-weight: 500;
            font-size: 14px;
          }
          .progress-container {
            flex-grow: 1;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            margin: 0 15px;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            background: #10b981;
            border-radius: 4px;
          }
          .skill-val {
            width: 80px;
            text-align: right;
            font-size: 13px;
            color: #4b5563;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 12px;
            border-radius: 9999px;
            font-weight: 500;
          }
          .badge.active { background: #d1fae5; color: #065f46; }
          .badge.pending { background: #fef3c7; color: #92400e; }
          .checkin-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }
          .checkin-badge {
            background: #eff6ff;
            color: #1e40af;
            border: 1px solid #bfdbfe;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 13px;
          }
          .stats-flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .stat-box {
            text-align: center;
            flex: 1;
          }
          .stat-box .val {
            font-size: 22px;
            font-weight: 700;
            color: #10b981;
          }
          .stat-box .label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
          }
          .pr-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .pr-list li {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e5e7eb;
            font-size: 14px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>Gym Manager: Report Atletico</h1>
            <p>Dossier ufficiale di rendimento e statistiche personali</p>
          </div>
          <div class="logo">GYM SYSTEM</div>
        </div>

        <div class="meta-grid">
          <div class="card">
            <h2>Dati Anagrafici & Abbonamento</h2>
            <p><strong>Membro:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Telefono:</strong> ${user.phone}</p>
            <p><strong>Tipo Abbonamento:</strong> ${user.membershipType}</p>
            <p><strong>Scadenza:</strong> ${user.membershipExpiry} <span class="badge active">${user.membershipStatus}</span></p>
          </div>
          <div class="card">
            <h2>Rendimento Gamification</h2>
            <div class="stats-flex" style="margin-bottom: 25px;">
              <div class="stat-box">
                <div class="val">Lvl ${user.level}</div>
                <div class="label">Grado Attuale</div>
              </div>
              <div class="stat-box">
                <div class="val">${user.totalCheckIns}</div>
                <div class="label">Ingressi Totali</div>
              </div>
              <div class="stat-box">
                <div class="val">€ ${user.totalSpent}</div>
                <div class="label">Spesa Totale</div>
              </div>
            </div>
            <div><strong>Esperienza:</strong> ${user.xp} / ${user.nextLevelXp} XP per il prossimo livello</div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="card">
            <h2>Profilo Abilità</h2>
            ${skillsHtml}
          </div>
          <div class="card">
            <h2>Record Personali (PR)</h2>
            <ul class="pr-list">
              <li><span>Back Squat</span><strong>140 kg</strong></li>
              <li><span>Deadlift</span><strong>180 kg</strong></li>
              <li><span>Clean & Jerk</span><strong>95 kg</strong></li>
              <li><span>Snatch</span><strong>75 kg</strong></li>
              <li><span>Tempo Murph</span><strong>41m 20s</strong></li>
            </ul>
          </div>
        </div>

        <div class="card" style="margin-bottom: 30px;">
          <h2>Cronologia Pagamenti & Abbonamenti</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Articolo</th>
                <th>Importo</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              ${salesHtml}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h2>Registro Presenze Recenti (${user.totalCheckIns} Ingressi)</h2>
          <div class="checkin-grid">
            ${checkinsHtml}
          </div>
        </div>

        <div class="footer">
          Documento generato il ${new Date().toLocaleString('it-IT')} - Gym Manager & Booking System. Tutti i dati sono protetti in sicurezza.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Generates and downloads a CSV of all sales transactions optimized for Microsoft Excel.
 */
export function exportSalesToExcel(sales: Sale[]) {
  let csvContent = '\uFEFF'; // UTF-8 BOM to prevent encoding issues in Excel
  
  csvContent += 'REGISTRO CONTABILITA E VENDITE - GYM MANAGER\n';
  csvContent += `Generato il;${new Date().toLocaleString('it-IT')}\n\n`;
  
  csvContent += 'ID Transazione;Cliente;Articolo/Abbonamento;Data;Tipo;Importo;Stato\n';
  sales.forEach(s => {
    csvContent += `${s.id};${s.userName};${s.item};${s.date};${s.type};${s.amount.toFixed(2).replace('.', ',')};${s.status}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Registro_Contabilita_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a CSV of all users with full detailed profiles optimized for Microsoft Excel.
 */
export function exportUsersToExcel(users: User[]) {
  let csvContent = '\uFEFF'; // UTF-8 BOM
  
  csvContent += 'ANAGRAFICA ATLETI - GYM MANAGER\n';
  csvContent += `Generato il;${new Date().toLocaleString('it-IT')}\n\n`;
  
  csvContent += 'ID Utente;Cognome;Nome;Codice Fiscale;Email;Telefono;Indirizzo;Data Iscrizione;Certificato Medico;Scadenza Certificato;Abbonamento;Stato Abbonamento;Scadenza Abbonamento;Ingressi Rimanenti;Ingressi Totali;Spesa Totale (€);Livello;XP;Ultimo Accesso\n';
  
  users.forEach(u => {
    csvContent += `${u.id};${u.surname || ''};${u.name || ''};${u.fiscalCode || ''};${u.email || ''};${u.phone || ''};${u.address || ''};${u.registrationDate || ''};${u.medicalCertificate ? 'Sì' : 'No'};${u.medicalCertificateExpiry || ''};${u.membershipType || ''};${u.membershipStatus || ''};${u.membershipExpiry || ''};${u.remainingEntries !== undefined ? u.remainingEntries : ''};${u.totalCheckIns || 0};${(u.totalSpent || 0).toFixed(2).replace('.', ',')};${u.level || 1};${u.xp || 0};${u.lastActive || ''}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Anagrafica_Utenti_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
